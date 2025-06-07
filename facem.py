import cv2
import dlib
import numpy as np
import os
import joblib
detector=dlib.get_frontal_face_detector()
model_path = os.path.join(os.path.dirname(__file__), 'shape_predictor_68_face_landmarks.dat')
predictor = dlib.shape_predictor(model_path)
#Loading ML model
model_file=os.path.join(os.path.dirname(__file__), 'face_shape_model.pkl')
if os.path.exists(model_file):
    clf=joblib.load(model_file)
else:
    clf=None #rule based fallback


def shape_to_np(shape):#dlib to numpy
    return np.array([(shape.part(i).x,shape.part(i).y) for i in range(68)])

def midpoint(p1,p2):#midpoint
    return((p1[0]+p2[0])/2,(p1[1]+p2[1])/2)

def euclidean_dist(p1,p2):#euclidean distance
    return np.linalg.norm(np.array(p1)-np.array(p2))

def detect_face_shape(image_path):#detect face here
    image=cv2.imread(image_path)
    if image is None:
        return{"error":"image not good gng"}
    gray=cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)#to gray

    faces=detector(gray)#detect faces here
    if len(faces)==0:
        return{"error":"No face detected"}
    shape=predictor(gray,faces[0])#landmarks for first face
    landmarks=shape_to_np(shape)

    features, raw_data =extract_features(landmarks)
    if clf:
        pred=clf.predict([features])[0]
        face_shape=pred
    else:
        face_shape=rule_based_classify(*features)

    raw_data["face_shape"]=face_shape
    return raw_data

#calculating width and height
def extract_features(landmarks):
    jaw_left=landmarks[0]
    jaw_right=landmarks[16]
    cheek_left=landmarks[1]
    cheek_right=landmarks[15]
    chin=landmarks[8]
    #forehead midpoint between inner eyebrows
    left_eyebrow_inner=landmarks[21]
    right_eyebrow_inner=landmarks[22]
    forehead_midpoint=midpoint(left_eyebrow_inner,right_eyebrow_inner)
    #forehead width approx outer eyebrows
    forehead_left=landmarks[17]
    forehead_right=landmarks[26]
    #calculate distances
    jaw_width=euclidean_dist(jaw_left,jaw_right)
    cheekbone_width=euclidean_dist(cheek_left,cheek_right)
    forehead_width=euclidean_dist(forehead_left,forehead_right)
    face_height=euclidean_dist(forehead_midpoint,chin)
    #calculate ratio to help classify face shape
    jaw_cheek_ratio=jaw_width/cheekbone_width if cheekbone_width else 0
    face_cheek_ratio=face_height/cheekbone_width if cheekbone_width else 0
    forehead_cheek_ratio=forehead_width/cheekbone_width if cheekbone_width else 0
    #tolerance
    return [jaw_cheek_ratio,face_cheek_ratio,forehead_cheek_ratio],{
        "jaw_width": jaw_width,
        "cheekbone_width": cheekbone_width,
        "forehead_width": forehead_width,
        "face_height": face_height,
        "jaw_cheek_ratio": jaw_cheek_ratio,
        "face_cheek_ratio": face_cheek_ratio,
        "forehead_cheek_ratio": forehead_cheek_ratio,

    }
def rule_based_classify(jaw_cheek_ratio, face_cheek_ratio, forehead_cheek_ratio):
    tolerance = 0.1

    def approx_equal(a,b):
        return abs(a-b)/max(a,b) < tolerance

    if forehead_cheek_ratio>1+tolerance and jaw_cheek_ratio<1-tolerance:
        return "Heart"
    elif face_cheek_ratio>1.3 and approx_equal(jaw_cheek_ratio,1) and approx_equal(forehead_cheek_ratio,1):
        return "Rectangular"
    elif face_cheek_ratio>1.2 and forehead_cheek_ratio>jaw_cheek_ratio:
        return "Oval"
    elif approx_equal(face_cheek_ratio,1) and approx_equal(forehead_cheek_ratio,jaw_cheek_ratio):
        return "Round"
    elif approx_equal(jaw_cheek_ratio,1) and approx_equal(forehead_cheek_ratio,1) and approx_equal(face_cheek_ratio,1):
        return "Square"
    else:
        return "Unknown"
