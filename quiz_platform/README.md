
# Quiz Platform: AI-Powered Quiz Learning and Study Assistant

An intelligent web-based quiz platform that supports AI-powered quiz generation, real-time explanations, and secure quiz management.

## 🚀 Features

- **Responsive UI** with HTML, CSS, and JavaScript (3D effects).
- **AI Quiz Generator** using OpenAI GPT, Google Gemini, and Perplexity AI.
- **AI StudyBot** for instant doubt solving and access to study materials.
- **Secure Authentication** with email verification.
- **Admin Dashboard** for quiz/document management.
- **Quiz Attempt Tracking** with detailed explanations.
- **Leaderboards, Retake Options**, and performance insights.
- **Asynchronous Tasks** powered by Celery + Redis.
- **Pagination, Logging, and Query Optimization** for performance.

## 🛠️ Tech Stack

- **Backend**: Python, Django
- **Frontend**: HTML, CSS, JavaScript
- **AI Services**: OpenAI API, Google Gemini, Perplexity AI
- **Task Queue**: Celery
- **Message Broker**: Redis
- **Database**: SQLite (local), PostgreSQL (optional)
- **Others**: Docker, Nginx

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Prathyun01/projects.git
   cd projects/quiz_project
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

5. Start Redis server and Celery worker (in separate terminals):
   ```bash
   redis-server
   celery -A quiz_project worker --loglevel=info
   ```

6. Access the app at: `http://127.0.0.1:8000`

## 🤖 AI Integration

To enable AI quiz generation, add your OpenAI / Gemini API keys to the `.env` file:
```
OPENAI_API_KEY=your-key-here
GEMINI_API_KEY=your-key-here
```

## 📁 Project Structure (Highlights)

- `quiz_app/` – Core quiz logic, views, models.
- `chatbot/` – StudyBot and AI integrations.
- `document_manager/` – Upload and parse study materials.
- `admin_quiz/` – Admin interface and controls.
- `accounts/` – Registration, login, and auth logic.
- `templates/` – HTML templates.
- `static/` – CSS/JS assets.

## 📸 Screenshots

*(Add UI images here from Google Drive or local paths)*

---

© 2025 Prathyun Reddy. All rights reserved.
