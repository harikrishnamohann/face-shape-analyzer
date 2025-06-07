```markdown
# Face Shape Classifier – API with ML + fallback(Made with 💻 and ☕ by Lunarmist-byte)

Detects face shape from uploaded image. Uses trained ML model if available, else falls back to rule-based logic. Feedback support built-in. Auto retrains every 6 hours.

**Note:** This project is currently untested.

---

## Stuff inside

```
├── app.py                         # Main Flask backend
├── facem.py                       # Face shape logic (landmarks, ratios, prediction)
├── train_model.py                 # Retrains model using feedback.csv
├── feedback.csv                   # Created when feedback is given
├── shape_predictor_68_face_landmarks.dat  # Required by dlib
├── face_shape_model.pkl           # Created after first train
├── requirements.txt               # All deps here
```

---

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

> If `dlib` gives errors, install CMake + build tools first (especially on Windows/Linux).

---

### 2. Put this in the root

* `shape_predictor_68_face_landmarks.dat` → Get from dlib's GitHub or official repo
* `feedback.csv` → Will be created automatically when feedback is posted
* `face_shape_model.pkl` → Optional. Gets generated after training

---

## How to run

```bash
python app.py
```

Runs on `http://localhost:5000`. Background scheduler will auto-retrain every 6 hours.

---

## API Endpoints

### `POST /detect`

Send an image → returns predicted face shape + measurements.

**Form-Data:**

* `image`: image file (jpeg/png)

**Response:**

```json
{
  "face_shape": "Oval",
  "jaw_width": 130.2,
  "cheekbone_width": 140.5,
  "forehead_width": 125.0,
  "face_height": 180.0,
  "jaw_cheek_ratio": 0.92,
  "face_cheek_ratio": 1.28,
  "forehead_cheek_ratio": 0.89
}
```

---

### `POST /feedback`

Submit feedback (correct label for misclassified image).

**JSON:**

```json
{
  "features": [0.92, 1.38, 1.05],
  "correct_label": "Square"
}
```

---

### `POST /admin/retrain`

Optional. Forces immediate retraining from feedback. (Usually done automatically every 6 hrs.)

---

### `GET /admin/status`

Returns info like last retrain time and feedback count.

---

## Retraining Details

* Background job runs every 6 hours (uses `schedule`)
* After retrain, model is auto-reloaded (no need to restart server)
* Needs at least 4 columns in `feedback.csv` to work (3 features + label)

---

## Notes

* Falls back to rule-based logic if no model is available.
* Requires a visible frontal face. If no face, skips.
* Feedback is saved in `feedback.csv`
* Model is saved as `face_shape_model.pkl` after training

---

## TL;DR

1. Install deps
2. Run `python app.py`
3. Hit `/detect` with an image
4. Send `/feedback` if prediction is wrong
5. System improves itself, retrains every 6 hrs

---

Made with 💻 and ☕ by Lunarmist-byte
```
