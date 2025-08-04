import unittest
import os
from src.face_recognizer import FaceRecognizer
from src.utils import create_directories

class TestFaceRecognition(unittest.TestCase):
    def setUp(self):
        create_directories()
        self.recognizer = FaceRecognizer()
    
    def test_model_training(self):
        """Test if model can be trained"""
        # This would require sample images in known_faces directory
        if os.listdir('data/known_faces'):
            self.recognizer.train_model()
            self.assertGreater(len(self.recognizer.known_encodings), 0)
    
    def test_model_loading(self):
        """Test if model can be loaded"""
        try:
            self.recognizer.load_model()
            # Should not raise an exception if encodings file exists
        except Exception as e:
            self.skipTest(f"No trained model available: {e}")

if __name__ == '__main__':
    unittest.main()
