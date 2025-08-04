import os
import face_recognition
from src.face_detector import FaceDetector
from src.utils import save_encodings, load_encodings
from config.config import KNOWN_FACES_DIR, ENCODINGS_FILE, TOLERANCE, MODEL

class FaceRecognizer:
    def __init__(self):
        self.detector = FaceDetector(model=MODEL)
        self.known_encodings = []
        self.known_names = []
        self.tolerance = TOLERANCE
    
    def train_model(self):
        """Train the model using images in known_faces directory"""
        print("Training face recognition model...")
        
        encodings = []
        names = []
        
        # Walk through each person's directory
        for person_name in os.listdir(KNOWN_FACES_DIR):
            person_dir = os.path.join(KNOWN_FACES_DIR, person_name)
            
            if not os.path.isdir(person_dir):
                continue
            
            print(f"Processing images for {person_name}...")
            
            # Process each image for this person
            for image_name in os.listdir(person_dir):
                if image_name.lower().endswith(('.jpg', '.jpeg', '.png')):
                    image_path = os.path.join(person_dir, image_name)
                    
                    try:
                        # Get face encodings
                        face_locations, face_encodings = self.detector.detect_faces_from_file(image_path)
                        
                        # Add encodings for each face found
                        for encoding in face_encodings:
                            encodings.append(encoding)
                            names.append(person_name)
                        
                        print(f"  Processed {image_name}: {len(face_encodings)} face(s) found")
                        
                    except Exception as e:
                        print(f"  Error processing {image_name}: {str(e)}")
        
        # Save encodings
        save_encodings(encodings, names, ENCODINGS_FILE)
        
        # Load into memory
        self.known_encodings = encodings
        self.known_names = names
        
        print(f"Training complete! Processed {len(encodings)} face encodings for {len(set(names))} people.")
    
    def load_model(self):
        """Load trained model from file"""
        self.known_encodings, self.known_names = load_encodings(ENCODINGS_FILE)
        print(f"Loaded {len(self.known_encodings)} face encodings")
    
    def recognize_faces(self, image):
        """
        Recognize faces in an image
        Returns: list of (name, confidence, location) tuples
        """
        face_locations, face_encodings = self.detector.detect_faces(image)
        
        results = []
        
        for face_encoding, face_location in zip(face_encodings, face_locations):
            # Compare with known faces
            matches = face_recognition.compare_faces(
                self.known_encodings, face_encoding, tolerance=self.tolerance
            )
            
            # Calculate face distances
            face_distances = face_recognition.face_distance(
                self.known_encodings, face_encoding
            )
            
            name = "Unknown"
            confidence = 0
            
            if len(face_distances) > 0:
                best_match_index = face_distances.argmin()
                
                if matches[best_match_index]:
                    name = self.known_names[best_match_index]
                    confidence = 1 - face_distances[best_match_index]
            
            results.append((name, confidence, face_location))
        
        return results
