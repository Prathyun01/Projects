from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    command = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Conversation at {self.timestamp}"
    
class VoiceSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    voice_speed = models.IntegerField(default=150)
    voice_volume = models.FloatField(default=0.9)
    language = models.CharField(max_length=10, default='en-US')
    
    def __str__(self):
        return f"Settings for {self.user.username}"
    