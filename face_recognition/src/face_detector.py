import cv2
import face_recognition
from src.utils import resize_image

class FaceDetector:
    def __init__(self, model='hog'):
        """
        Initialize face detector
        model: 'hog' (faster, CPU) or 'cnn' (more accurate, GPU recommended)
        """
        self.model = model
    
    def detect_faces(self, image):
        """
        Detect faces in an image
        Returns: list of face locations and encodings
        """
        # Convert BGR to RGB for face_recognition library
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Find face locations
        face_locations = face_recognition.face_locations(rgb_image, model=self.model)
        
        # Generate face encodings
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        return face_locations, face_encodings
    
    def detect_faces_from_file(self, image_path):
        """Detect faces from image file"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")
        
        # Resize image for faster processing
        image = resize_image(image)
        
        return self.detect_faces(image)
