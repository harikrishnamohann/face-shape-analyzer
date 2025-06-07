import os
import csv
import time
import schedule
import threading
from flask import Flask, request, jsonify
from facem import detect_face_shape
from train_model import train_and_save_model

app = Flask(__name__)

FEEDBACK_FILE = 'feedback.csv'

# detect face shape
@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': "gng upload some shit"}), 400
    image_file = request.files['image']
    filepath = os.path.join('uploads', image_file.filename)
    os.makedirs('uploads', exist_ok=True)
    image_file.save(filepath)
    result = detect_face_shape(filepath)
    os.remove(filepath)
    return jsonify(result)

# take feedback
@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    if not data or 'features' not in data or 'correct_label' not in data:
        return jsonify({"error": "Invalid broski"}), 400

    features = data['features']
    label = data['correct_label']

    with open(FEEDBACK_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(features + [label])

    return jsonify({"status": "Thanks for helping me get better :> "})

# retrain job
def retrain_job():
    train_and_save_model()

# scheduler every 6 hours
schedule.every(6).hours.do(retrain_job)

# background thread for scheduler
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)

threading.Thread(target=run_scheduler, daemon=True).start()

# admin endpoint to retrain manually
@app.route('/admin/retrain', methods=['POST'])
def manual_retrain():
    train_and_save_model()
    return jsonify({"status": "Retrained fresh af"})

# admin status check
@app.route('/admin/status', methods=['GET'])
def status():
    from datetime import datetime

    if os.path.exists('face_shape_model.pkl'):
        mod_time = datetime.fromtimestamp(os.path.getmtime('face_shape_model.pkl'))
    else:
        mod_time = "Model not found"

    feedback_count = 0
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE) as f:
            feedback_count = sum(1 for line in f)

    return jsonify({
        "model_last_updated": str(mod_time),
        "feedback_entries": feedback_count
    })

# run server
if __name__ == '__main__':
    app.run(debug=True)