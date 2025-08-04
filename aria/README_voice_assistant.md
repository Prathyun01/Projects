# 🎙️ Voice Assistant: Real-Time AI-Powered Web Assistant

A web-based voice assistant built using Django, supporting real-time audio interactions with intelligent processing.

## 🚀 Features

- **Real-Time Voice Interaction** using Django Channels.
- **Speech Input Recognition** via browser interface.
- **WebSocket Communication** for seamless bi-directional updates.
- **Modular Design** for easy integration and expansion.
- **Admin Interface** for managing assistant behavior.
- **Fully Responsive UI** with customizable templates.
- **Secure User Handling** (optional auth integration ready).

## 🛠️ Tech Stack

- **Backend**: Python, Django, Django Channels
- **Frontend**: HTML, CSS, JavaScript
- **Realtime Support**: WebSockets via Django Channels
- **Database**: SQLite (default), PostgreSQL (optional)
- **Other Tools**: ASGI, Redis (optional for scaling channels)

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Prathyun01/voice_assistant_project.git
   cd voice_assistant_project
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

4. Run migrations and start the development server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

5. Visit: `http://127.0.0.1:8000` in your browser.

## 🧠 How It Works

- The frontend captures microphone input and streams it via WebSocket.
- Django Channels handles the real-time communication.
- Backend processes input and returns responses in real-time.

## 📁 Project Structure (Highlights)

- `assistant/` – Core assistant logic, views, routing.
- `templates/` – HTML templates for frontend.
- `static/` – CSS/JavaScript assets.
- `voice_assistant/` – Django project settings and ASGI config.
- `requirements.txt` – Python dependencies list.
- `db.sqlite3` – Default development database.

## 🧪 Optional Enhancements

- Redis + Daphne for production-grade ASGI.
- Integration with OpenAI or other NLP APIs.
- Docker support for deployment.

## 📸 Screenshots

*(Add UI images here)*

---

© 2025 Your Name. All rights reserved.