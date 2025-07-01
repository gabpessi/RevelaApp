from rest_framework import serializers

from django.contrib.auth.models import User
from .models import UserProfile, Post, Conversation, Message

from datetime import datetime
import re 
class UserSerializer(serializers.ModelSerializer):
    #campo adicional profile para retornar informações complementares do usuario
    profile = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile"]

    #campo adicional profile
    def get_profile(self, user):
        try:
            return UserProfileSerializer(user.profile).data
        except:
            return None
        
    #método update personalizado pra cobrir userprofile tambem
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        
        profile_data = validated_data.get('profile', {})
        profile = instance.profile

        if profile_data:
            profile.sobre = profile_data.get('sobre', profile.sobre)
            profile.facebook = profile_data.get('facebook', profile.facebook)
            profile.instagram = profile_data.get('instagram', profile.instagram)
            profile.linkedin = profile_data.get('linkedin', profile.linkedin)
            profile.cpf = profile_data.get('cpf', profile.linkedin)
            profile.dataNascimento = profile_data.get('dataNascimento', profile.linkedin)
            profile.telefone = profile_data.get('telefone', profile.linkedin)
            profile.save()

        return instance
    
class UserProfileSerializer(serializers.ModelSerializer):
    #campo adicional de amigos do usuario
    amigos = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['imagem', 'sobre', 'facebook', 'instagram', 'linkedin', 'amigos', 'dataNascimento', 'telefone',  'cpf']
    
    #retorna os amigos
    def get_amigos(Self, obj):
        return [
            {
                "id": amigo.user.id,
                "username": amigo.user.username,
                "imagem": amigo.imagem.url if amigo.imagem else None
            }
            for amigo in obj.amigos.all()
        ]
        
    
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Senhas devem ser iguais')
    
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Este email já está em uso.")
    
        if len(data['username']) < 2:
            raise serializers.ValidationError("Nome de usuário deve ter pelo menos 2 caracteres")

        if "@" not in  data['email'] or '.com' not in data['email']:
            raise serializers.ValidationError("Email inválido")
        
        if not data['cpf']:
            raise serializers.ValidationError('CPF deve ser preenchido')

        cpf_limpo = re.sub(r'\D', '', data['cpf'])
        data['cpf'] = cpf_limpo
        if not cpf_limpo.isdigit() or len(cpf_limpo) != 11:
            raise serializers.ValidationError('CPF com formato inválido')
            
        
        if UserProfile.objects.filter(cpf=data['cpf']).first():
            raise serializers.ValidationError('Este CPF já está em uso')
        
        telefone = re.sub(r'\D', '', data['telefone'])
        data['telefone'] = telefone
        if len(telefone) < 10:
            raise serializers.ValidationError("Telefone deve ter pelo menos 10 números")
        
        data_nascimento = data['dataNascimento']
        try:
            data_nasc = datetime.strptime(data_nascimento, "%Y-%m-%d").date()
            if data_nasc > datetime.today().date():
                raise serializers.ValidationError("Data de nascimento não pode ser no futuro.")
        except ValueError:
            raise serializers.ValidationError("Data de nascimento inválida")
        
        return data
        
        
            
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
        
        profile = UserProfile.objects.create(user=user, cpf=validated_data['cpf'], dataNascimento=validated_data['dataNascimento'], telefone=validated_data['telefone'])
        profile.save()
        return user
    
    class Meta:
        model = User
        fields = ["username", "email", "password", "password2", "cpf", "telefone", "dataNascimento"]   
         
class PostSerializer(serializers.ModelSerializer):
    #hiddenField, o campo não vai aparecer no json, mas vai ser preenchido com o usuario atual
    #default é o usuario atual logado
    #garante que o autor seja o usuario logado
    
    #Reni vou mudar isso aqui pq o serializer ele não é só pra posts de um usuario, então a gente precisa ter as informações de quem
    #postou na resposta também, incluindo o modelo de userprofile pra ter informações tipo imagem do user
    # user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    user = serializers.SerializerMethodField()
    #retorna info do user e do userprofile por padrão já
    def get_user(self, post):
        return UserSerializer(post.user).data

    class Meta:
        model = Post
        fields = ['id', 'imagem', 'text', 'created_at', 'user', ]
        #os dois campos abaixo não podem ser alterados pelo usuario
        read_only_fields = ['id', 'created_at']
        
        
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'timestamp', 'image']
        read_only_fields = ['sender', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user1', 'user2', 'created_at', 'last_message']

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(msg).data if msg else None
