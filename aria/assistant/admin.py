
# assistant/admin.py
from django.contrib import admin
from .models import Conversation, VoiceSettings

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('user', 'command', 'response', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('command', 'response')
    readonly_fields = ('timestamp',)

@admin.register(VoiceSettings)
class VoiceSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'voice_speed', 'voice_volume', 'language')
    list_filter = ('language',)