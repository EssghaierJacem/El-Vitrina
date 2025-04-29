from google.cloud import vision_v1

try:
    client = vision_v1.ImageAnnotatorClient()
    print("Google Cloud Vision library imported successfully.")
    # You can add more code here to start using the client
except ImportError as e:
    print(f"Error importing google-cloud-vision: {e}")
except Exception as e:
    print(f"An error occurred: {e}")