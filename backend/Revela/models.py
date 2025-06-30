from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField
class UserProfile(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
        imagem = CloudinaryField('user/profiles/%y/%m/%d', null=True, blank=True)
        sobre = models.CharField(max_length=150, null=True, blank=True)
        facebook = models.CharField(max_length=1000, null=True, blank=True)
        instagram = models.CharField(max_length=1000, null=True, blank=True)
        linkedin = models.CharField(max_length=1000, null=True, blank=True)
        amigos = models.ManyToManyField("self", symmetrical=True, blank=True)
        cpf = models.CharField(max_length=20, null=True, blank=True)
        telefone = models.CharField(max_length=20, null=True, blank=True)
        dataNascimento = models.DateField(null=True, blank=True)
        
#modelo básico de posts, atualizar depois
class Post(models.Model):
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        imagem = CloudinaryField('user/posts/images/%y/%m/%d', null=True, blank=True)
        text = models.CharField(max_length=150, null=True, blank=True)
        created_at = models.DateTimeField(default=timezone.now)


class Conversation(models.Model):
    user1 = models.ForeignKey(User, related_name='conversations_as_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='conversations_as_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')  # impede duplicação

    def clean(self):
        if self.user1 == self.user2:
            raise ValidationError("Não é possível iniciar conversa consigo mesmo.")

    def participants(self):
        return [self.user1, self.user2]

    def get_other_user(self, current_user):
        return self.user2 if self.user1 == current_user else self.user1

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    image = CloudinaryField('messages/images/%y/%m/%d', null=True, blank=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
