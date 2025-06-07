# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .serializers import ChatSerializer
from .models import Chat
from meet.models import Meet


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.meet_id = self.scope["url_route"]["kwargs"]["meet_id"]
        self.room_group_name = f"chat_{self.meet_id}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(self.scope["user"].id)

        serialized_data = self.save_message(message)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat.message", 
                "data": serialized_data,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        data = event['data']

        print(data)
        # Send message to WebSocket
        self.send(text_data=json.dumps(data))

    def save_message(self, message):
        chat_obj = Chat.objects.create(
            meet=Meet.objects.get(pk=self.meet_id),
            content=message,
            sender=self.scope["user"],
        )

        serializer = ChatSerializer(chat_obj)
        return serializer.data