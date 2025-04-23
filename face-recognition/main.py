from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from deepface import DeepFace
import os
import shutil
import uuid

app = FastAPI()

STORED_IMAGES_DIR = r"D:\4ARCTIC\El-Vitrina\elvitrina-backend\uploads\user-images"

@app.get("/")
def root():
    return {"message": "DeepFace FastAPI Server running"}

@app.post("/identify")
async def identify(uploaded_file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_id = str(uuid.uuid4())
    temp_image_path = f"{temp_id}_uploaded.jpg"

    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)

    try:
        matched_user = None
        min_distance = float("inf")
        threshold = 0.4

        for filename in os.listdir(STORED_IMAGES_DIR):
            stored_image_path = os.path.join(STORED_IMAGES_DIR, filename)
            if os.path.isfile(stored_image_path):
                try:
                    result = DeepFace.verify(temp_image_path, stored_image_path, enforce_detection=False)
                    distance = result["distance"]
                    verified = result["verified"]

                    if verified and distance < min_distance:
                        min_distance = distance
                        matched_user = filename
                except Exception as e:
                    continue

        if matched_user:
            return JSONResponse(content={"status": "match", "matched_with": matched_user, "distance": min_distance})
        else:
            return JSONResponse(content={"status": "no_match"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
