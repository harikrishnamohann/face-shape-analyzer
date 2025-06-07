```markdown
# Face Shape Classifier – API with ML + fallback

Detects face shape from uploaded image. Uses trained ML model if available, else rule-based logic. Feedback support + auto retraining every 6 hours.

---

## Stuff inside

```

├── app.py                  # Main Flask backend
├── facem.py                # Face shape logic
├── train\_model.py          # Retrain model using feedback
├── feedback.csv            # Gets created when feedback is given
├── shape\_predictor\_68\_face\_landmarks.dat  # Required by dlib
├── face\_shape\_model.pkl    # Gets created after training
├── requirements.txt        # All dependencies

````

---

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
````

> If dlib gives you issues, make sure you have CMake and build tools installed.

---

### 2. Put this in the root

* `shape_predictor_68_face_landmarks.dat` (download from dlib’s GitHub or official source)
* `feedback.csv` (gets auto created)
* `face_shape_model.pkl` (optional, gets generated after feedback + retrain)

---

## How to run

```bash
python app.py
```

App runs at `http://localhost:5000`. Scheduler runs in background to retrain every 6 hours.

---

## API Endpoints

### `POST /detect`

Send an image file → returns face shape and metrics.

**Form-Data**

* `image`: your image file

**Response:**

```json
{
  "face_shape": "Oval",
  "jaw_width": ...,
  "face_height": ...,
  ...
}
```

---

### `POST /feedback`

Send your correction.

**JSON**

```json
{
  "features": [0.92, 1.38, 1.05],
  "correct_label": "Square"
}
```

---

### `POST /admin/retrain`

Force retraining. Optional, happens automatically every 6 hrs.

---

### `GET /admin/status`

Returns last retrain time and feedback count.

---

## Retraining

Runs every 6 hours using `schedule`. Model gets reloaded live without restarting the app.

---

## Notes

* If no model, fallback to rule-based classification.
* Needs clear frontal face, else it’ll skip.
* All feedback is logged to `feedback.csv`.
* Minimum 3 features + 1 label needed to train.

---

## TL;DR

1. Install deps
2. Run `python app.py`
3. Hit `/detect` and `/feedback`
4. It learns and improves

```