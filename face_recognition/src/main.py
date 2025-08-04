import cv2
import datetime
from src.face_recognizer import FaceRecognizer
from src.utils import create_directories
from config.config import CAMERA_INDEX, FRAME_RESIZE

class FaceRecognitionApp:
    def __init__(self):
        create_directories()
        self.recognizer = FaceRecognizer()
    
    def train(self):
        """Train the face recognition model"""
        self.recognizer.train_model()
        
    def recognize_from_camera(self):
        """Real-time face recognition from camera with status message"""
        self.recognizer.load_model()
        
        if len(self.recognizer.known_encodings) == 0:
            print("No trained model found. Please train the model first.")
            return
        
        video_capture = cv2.VideoCapture(CAMERA_INDEX)
        if not video_capture.isOpened():
            print("Error: Could not open camera.")
            return

        print("Starting face recognition. Press 'q' to quit.")

        while True:
            ret, frame = video_capture.read()
            if not ret:
                print("Error: Could not read frame.")
                break

            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (0, 0), fx=FRAME_RESIZE, fy=FRAME_RESIZE)

            # Recognize faces
            results = self.recognizer.recognize_faces(small_frame)

            any_recognized = False
            for name, confidence, (top, right, bottom, left) in results:
                # Scale face locations back up to original frame
                top = int(top / FRAME_RESIZE)
                right = int(right / FRAME_RESIZE)
                bottom = int(bottom / FRAME_RESIZE)
                left = int(left / FRAME_RESIZE)

                # Set color based on recognition status
                if name != "Unknown":
                    any_recognized = True
                    color = (0, 255, 0)  # Green for recognized
                    label = f"{name} ({confidence:.2f})"
                else:
                    color = (0, 0, 255)  # Red for unknown
                    label = "Unknown"

                # Draw rectangle around the face
                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                # Draw label background
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
                cv2.putText(
                    frame, label, (left + 6, bottom - 6),
                    cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1
                )

            # Display recognition status at the top of the frame
            if any_recognized:
                status = "Face Recognized"
                status_color = (0, 255, 0)
            else:
                status = "No Face Recognized"
                status_color = (0, 0, 255)
            cv2.putText(
                frame, status, (50, 50),
                cv2.FONT_HERSHEY_DUPLEX, 1, status_color, 2
            )

            cv2.imshow('Face Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()
    
    def recognize_from_image(self, image_path):
        """Recognize faces in a single image file with status message"""
        self.recognizer.load_model()
        
        if len(self.recognizer.known_encodings) == 0:
            print("No trained model found. Please train the model first.")
            return

        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not load image from {image_path}")
            return

        # Calculate resize ratio for scaling face locations
        original_height, original_width = image.shape[:2]
        small_image = cv2.resize(image, (0, 0), fx=FRAME_RESIZE, fy=FRAME_RESIZE)
        results = self.recognizer.recognize_faces(small_image)

        any_recognized = False
        for name, confidence, (top, right, bottom, left) in results:
            # Scale face locations back up to original image
            top = int(top / FRAME_RESIZE * original_height)
            right = int(right / FRAME_RESIZE * original_width)
            bottom = int(bottom / FRAME_RESIZE * original_height)
            left = int(left / FRAME_RESIZE * original_width)

            # Set color based on recognition status
            if name != "Unknown":
                any_recognized = True
                color = (0, 255, 0)
                label = f"{name} ({confidence:.2f})"
            else:
                color = (0, 0, 255)
                label = "Unknown"

            cv2.rectangle(image, (left, top), (right, bottom), color, 2)
            cv2.rectangle(image, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
            cv2.putText(
                image, label, (left + 6, bottom - 6),
                cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1
            )

        # Display recognition status at the top of the image
        if any_recognized:
            status = "Face Recognized"
            status_color = (0, 255, 0)
        else:
            status = "No Face Recognized"
            status_color = (0, 0, 255)
        cv2.putText(
            image, status, (50, 50),
            cv2.FONT_HERSHEY_DUPLEX, 1, status_color, 2
        )

        cv2.imshow('Face Recognition Result', image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

        # Print results to console
        print(f"Found {len(results)} face(s):")
        for name, confidence, _ in results:
            print(f"  - {name} (confidence: {confidence:.2f})")
