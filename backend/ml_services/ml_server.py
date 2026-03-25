# ml_server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import cv2
import numpy as np
import base64
from ultralytics import YOLO
import mediapipe as mp

app = FastAPI()

# 1. Load Models
model = YOLO('yolov8n.pt') 
mp_face_mesh = mp.solutions.face_mesh
# refine_landmarks=True is CRITICAL for Iris tracking
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True, 
    min_detection_confidence=0.5
)

# --- NEW: Session-based Frame Counter Dictionary ---
# This safely keeps track of consecutive frames for specific sessions
session_look_away_counters = {}

class FramePayload(BaseModel):
    image: str
    timestamp: int
    sessionId: int

def decode_image(base64_string):
    encoded_data = base64_string.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

@app.post("/analyze")
async def analyze_frame(payload: FramePayload):
    try:
        # Initialize the counter for this specific session if it's new
        if payload.sessionId not in session_look_away_counters:
            session_look_away_counters[payload.sessionId] = 0

        frame = decode_image(payload.image)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # --- 2. YOLO Detection (Objects/People) ---
        results = model(frame, verbose=False)[0]
        person_count = 0
        phone_detected = False
        for box in results.boxes:
            label = model.names[int(box.cls[0])]
            if label == "person": person_count += 1
            if label == "cell phone": phone_detected = True

        # --- 3. MediaPipe Eye Tracking (Full 4-Way Tracking) ---
        face_results = face_mesh.process(rgb_frame)
        math_looking_away = False # Renamed this to represent the raw math calculation
        
        if face_results.multi_face_landmarks:
            mesh_coords = face_results.multi_face_landmarks[0].landmark
            
            # ------------------------------------------------
            # HORIZONTAL (LEFT / RIGHT)
            # ------------------------------------------------
            # Left Eye (X)
            l_corner1_x = mesh_coords[33].x
            l_corner2_x = mesh_coords[133].x
            left_iris_x = mesh_coords[468].x
            l_eye_width = abs(l_corner1_x - l_corner2_x)
            l_eye_leftmost = min(l_corner1_x, l_corner2_x)
            left_x_ratio = (left_iris_x - l_eye_leftmost) / (l_eye_width + 1e-6)
            
            # Right Eye (X)
            r_corner1_x = mesh_coords[362].x
            r_corner2_x = mesh_coords[263].x
            right_iris_x = mesh_coords[473].x
            r_eye_width = abs(r_corner1_x - r_corner2_x)
            r_eye_leftmost = min(r_corner1_x, r_corner2_x)
            right_x_ratio = (right_iris_x - r_eye_leftmost) / (r_eye_width + 1e-6)

            # ------------------------------------------------
            # VERTICAL (UP / DOWN)
            # ------------------------------------------------
            # Left Eye Lids (Y) - 159 is Top, 145 is Bottom
            l_top_y = mesh_coords[159].y
            l_bottom_y = mesh_coords[145].y
            left_iris_y = mesh_coords[468].y
            l_eye_height = abs(l_top_y - l_bottom_y)
            l_eye_topmost = min(l_top_y, l_bottom_y) # min is top because Y goes down
            left_y_ratio = (left_iris_y - l_eye_topmost) / (l_eye_height + 1e-6)

            # Right Eye Lids (Y) - 386 is Top, 374 is Bottom
            r_top_y = mesh_coords[386].y
            r_bottom_y = mesh_coords[374].y
            right_iris_y = mesh_coords[473].y
            r_eye_height = abs(r_top_y - r_bottom_y)
            r_eye_topmost = min(r_top_y, r_bottom_y)
            right_y_ratio = (right_iris_y - r_eye_topmost) / (r_eye_height + 1e-6)

            # --- DEBUG PRINT ---
            print(f"👁️ X(L/R): {left_x_ratio:.2f}/{right_x_ratio:.2f} | Y(L/R): {left_y_ratio:.2f}/{right_y_ratio:.2f}")

            if (left_x_ratio < 0.25 or left_x_ratio > 0.75) or \
               (right_x_ratio < 0.25 or right_x_ratio > 0.75) or \
               (left_y_ratio < 0.20 or left_y_ratio > 0.80) or \
               (right_y_ratio < 0.20 or right_y_ratio > 0.80):
                math_looking_away = True
            else:
                math_looking_away = False 
        else:
            # Trigger if no eyes are detected
            math_looking_away = True

        # --- NEW: APPLY THE FRAME BUFFER LOGIC ---
        if math_looking_away:
            session_look_away_counters[payload.sessionId] += 1
        else:
            session_look_away_counters[payload.sessionId] = 0 # Reset if they look back at the screen!

        # Only officially trigger the warning if they've looked away for 15+ consecutive frames
        is_looking_away_confirmed = session_look_away_counters[payload.sessionId] > 15

        # --- 4. Final Logic & Warnings ---
        warning = None
        if phone_detected:
            warning = "Mobile phone detected!"
        elif person_count > 1:
            warning = "Multiple people detected!"
        elif is_looking_away_confirmed and person_count > 0:
            warning = "Please look at the screen."
        elif person_count == 0:
            warning = "Face not detected!"

        return {
            "faceDetected": person_count > 0,
            "singlePerson": person_count == 1,
            "isLookingAway": is_looking_away_confirmed,
            "objectsDetected": [model.names[int(b.cls[0])] for b in results.boxes],
            "warning": warning
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"warning": "AI System Error"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)