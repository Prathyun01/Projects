import os

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
KNOWN_FACES_DIR = os.path.join(DATA_DIR, 'known_faces')
UNKNOWN_FACES_DIR = os.path.join(DATA_DIR, 'unknown_faces')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Model settings
ENCODINGS_FILE = os.path.join(MODELS_DIR, 'encodings.pkl')
TOLERANCE = 0.6
MODEL = 'hog'  # or 'cnn' for better accuracy but slower

# Camera settings
CAMERA_INDEX = 0
FRAME_RESIZE = 0.25  # Resize frame for faster processing
