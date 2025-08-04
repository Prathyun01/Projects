# 🧠 Face Recognition System: AI-Powered Identity Detection

A modular Python-based face recognition system capable of detecting and recognizing faces from images. It supports known and unknown face classification using pretrained models.

## 🚀 Features

- **Real-Time Face Recognition** using image encoding.
- **Face Detection and Comparison** via dlib or face_recognition libraries.
- **Organized Data Structure** for known/unknown faces.
- **Serialization of Encodings** for performance.
- **Configurable Pipeline** with a clear modular setup.
- **Easy to Extend** with new data and models.

## 🛠️ Tech Stack

- **Language**: Python
- **Libraries**: face_recognition, OpenCV, NumPy
- **Data Format**: `.pkl` for face encodings
- **Optional Enhancements**: Flask, Streamlit for UI

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Prathyun01/face_recognition_project.git
   cd face_recognition_project
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Prepare your data:
   - Add labeled images to `data/known_faces/{person_name}`
   - Place test images in `data/unknown_faces/`

5. Run the application:
   ```bash
   python run.py
   ```

## 📁 Project Structure (Highlights)

- `config/` – Config files and constants
- `src/` – Core logic: detection and recognition
- `models/encodings.pkl` – Serialized face encodings
- `data/` – Known and unknown face images
- `run.py` – Script to run recognition process
- `requirements.txt` – Python dependencies

## 🧪 Future Enhancements

- Integrate a live webcam feed
- Add REST API or web UI
- Face registration interface
- Logging and reports for recognition history
- 
© 2025 Your Name. All rights reserved.
