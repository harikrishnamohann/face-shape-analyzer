import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_and_save_model(csv_path='feedback.csv',model_path='face_shape_model.pkl'):
    if not os.path.exists(csv_path): #no feedback yet
        print("No data found to train")
        return
    
    df=pd.read_csv(csv_path,header=None) #load data
    df.dropna(inplace=True) #clean it

    if df.empty or df.shape[1]<5: #not enough cols or rows
        print("Not enough bro")
        return
    x=df.iloc[:,:3] #only 3 features
    y=df.iloc[:,-1] #last column = label

    model=RandomForestClassifier(n_estimators=100,random_state=42) #just using RF
    model.fit(x,y) #train it

    joblib.dump(model,model_path) #save it to disk
    print("Model retrained and saved") #success msg
