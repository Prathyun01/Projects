#!/usr/bin/env python3
import sys
import argparse
from src.main import FaceRecognitionApp

def main():
    parser = argparse.ArgumentParser(description='Face Recognition System')
    parser.add_argument('command', choices=['train', 'camera', 'image'], 
                       help='Command to execute')
    parser.add_argument('--image-path', type=str, 
                       help='Path to image file (required for image command)')
    
    args = parser.parse_args()
    
    app = FaceRecognitionApp()
    
    if args.command == 'train':
        app.train()
    elif args.command == 'camera':
        app.recognize_from_camera()
    elif args.command == 'image':
        if not args.image_path:
            print("Error: --image-path is required for image command")
            sys.exit(1)
        app.recognize_from_image(args.image_path)

if __name__ == '__main__':
    main()
