import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import speech_recognition as sr
import pyttsx3
import wikipedia
import datetime
import webbrowser

class VoiceAssistantConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        
        if action == 'voice_command':
            command = text_data_json.get('command')
            response = await self.process_voice_command(command)
            
            await self.send(text_data=json.dumps({
                'type': 'voice_response',
                'response': response
            }))
    
    async def process_voice_command(self, command):
        # Process voice command asynchronously
        command = command.lower()
        
        if "time" in command:
            current_time = datetime.datetime.now().strftime("%I:%M %p")
            return f"The current time is {current_time}"
        
        elif "date" in command:
            current_date = datetime.datetime.now().strftime("%B %d, %Y")
            return f"Today is {current_date}"
        
        elif "wikipedia" in command or "search" in command:
            search_query = command.replace("wikipedia", "").replace("search", "").strip()
            if search_query:
                try:
                    summary = wikipedia.summary(search_query, sentences=2)
                    return summary
                except:
                    return "Sorry, I couldn't find information about that topic."
            else:
                return "Please specify what you'd like to search for."
        
        elif "hello" in command or "hi" in command:
            return "Hello! How can I help you today?"
        
        else:
            return "I'm not sure how to help with that. Try asking about time or search queries."
