import os
import pickle
import cv2
from PIL import Image
import numpy as np

def create_directories():
    """Create necessary directories if they don't exist"""
    from config.config import DATA_DIR, KNOWN_FACES_DIR, UNKNOWN_FACES_DIR, MODELS_DIR
    
    directories = [DATA_DIR, KNOWN_FACES_DIR, UNKNOWN_FACES_DIR, MODELS_DIR]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

def load_encodings(encodings_file):
    """Load face encodings from pickle file"""
    try:
        with open(encodings_file, 'rb') as f:
            data = pickle.load(f)
        return data['encodings'], data['names']
    except FileNotFoundError:
        print(f"Encodings file {encodings_file} not found. Please train the model first.")
        return [], []

def save_encodings(encodings, names, encodings_file):
    """Save face encodings to pickle file"""
    data = {'encodings': encodings, 'names': names}
    with open(encodings_file, 'wb') as f:
        pickle.dump(data, f)

def resize_image(image, max_width=800):
    """Resize image while maintaining aspect ratio"""
    height, width = image.shape[:2]
    if width > max_width:
        ratio = max_width / width
        new_width = max_width
        new_height = int(height * ratio)
        image = cv2.resize(image, (new_width, new_height))
    return image
