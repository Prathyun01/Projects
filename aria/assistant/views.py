from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import speech_recognition as sr
import pyttsx3
import wikipedia
import datetime
import webbrowser
import os
import threading
import openai
from django.conf import settings

class VoiceAssistant:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        self.setup_tts()
        
    def setup_tts(self):
        voices = self.tts_engine.getProperty('voices')
        if voices:
            self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.9)
    
    def listen(self):
        try:
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source)
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            text = self.recognizer.recognize_google(audio)
            return text.lower()
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand that."
        except sr.RequestError:
            return "Sorry, there was an error with the speech recognition service."
        except Exception as e:
            return f"Error: {str(e)}"
    
    def speak(self, text):
        def speak_text():
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        
        thread = threading.Thread(target=speak_text)
        thread.daemon = True
        thread.start()
    
    def process_command(self, command):
        command = command.lower()
        
        if "time" in command:
            current_time = datetime.datetime.now().strftime("%I:%M %p")
            response = f"The current time is {current_time}"
            
        elif "date" in command:
            current_date = datetime.datetime.now().strftime("%B %d, %Y")
            response = f"Today is {current_date}"
            
        elif "wikipedia" in command or "search" in command:
            search_query = command.replace("wikipedia", "").replace("search", "").strip()
            if search_query:
                try:
                    summary = wikipedia.summary(search_query, sentences=2)
                    response = summary
                except wikipedia.exceptions.DisambiguationError as e:
                    response = f"Multiple results found. Please be more specific."
                except wikipedia.exceptions.PageError:
                    response = "Sorry, I couldn't find information about that topic."
                except Exception as e:
                    response = "Sorry, there was an error searching Wikipedia."
            else:
                response = "Please specify what you'd like to search for."
                
        elif "open" in command:
            if "youtube" in command:
                webbrowser.open("https://www.youtube.com")
                response = "Opening YouTube"
            elif "google" in command:
                webbrowser.open("https://www.google.com")
                response = "Opening Google"
            elif "facebook" in command:
                webbrowser.open("https://www.facebook.com")
                response = "Opening Facebook"
            elif "instagram" in command:
                webbrowser.open("https://www.instagram.com")
                response = "Opening Instagram"
            
            else:
                response = "Which website would you like me to open?"
                
        elif "hello" in command or "hi" in command:
            response = "Hello! How can I help you today?"
            
        elif "goodbye" in command or "bye" in command:
            response = "Goodbye! Have a great day!"
            
        elif "help" in command:
            response = "I can help you with: telling time, searching Wikipedia, opening websites, and answering questions."
            
        else:
            # Try OpenAI GPT if available
            try:
                if hasattr(settings, 'OPENAI_API_KEY'):
                    openai.api_key = settings.OPENAI_API_KEY
                    response_obj = openai.Completion.create(
                        engine="text-davinci-003",
                        prompt=f"Answer this question: {command}",
                        max_tokens=100,
                        temperature=0.7
                    )
                    response = response_obj.choices[0].text.strip()
                else:
                    response = "I'm not sure how to help with that. Try asking about time, weather, or search queries."
            except:
                response = "I'm not sure how to help with that. Try asking about time, Wikipedia searches, or opening websites."
        
        return response

# Global assistant instance
assistant = VoiceAssistant()

def index(request):
    return render(request, 'assistant/index.html')

@csrf_exempt
def process_voice(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')
            
            if action == 'listen':
                text = assistant.listen()
                return JsonResponse({'text': text, 'status': 'success'})
            
            elif action == 'process':
                command = data.get('command')
                response = assistant.process_command(command)
                assistant.speak(response)
                return JsonResponse({'response': response, 'status': 'success'})
            
            elif action == 'speak':
                text = data.get('text')
                assistant.speak(text)
                return JsonResponse({'status': 'success'})
                
        except Exception as e:
            return JsonResponse({'error': str(e), 'status': 'error'})
    
    return JsonResponse({'error': 'Invalid request', 'status': 'error'})
