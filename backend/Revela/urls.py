from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsersView,UsuarioLogadoView, RegisterView, UserPostsView, FeedPostsView, PostDetailView, CreatePostView, ConversationListCreateView, ConversationDetailView,  MessageListCreateView



urlpatterns = [
    # path('api/usuario', UsuarioLogadoView.as_view(), name='a  pi_usuario')
    path("api/auth/register", RegisterView.as_view(), name="api_register_user"),
    path("api/user", UsuarioLogadoView.as_view(), name="api_user_data"),
    path("api/users/post", UserPostsView.as_view(), name="api_user_post"),
    path("api/users/", UsersView.as_view(), name="api_user_post"),
    
    path('api/posts', FeedPostsView.as_view(), name='feed-posts'),
    path('api/posts/<int:id>/', PostDetailView.as_view(), name='post-detail'),
    path('api/posts/', CreatePostView.as_view(), name='criar-post'),
    
    path('api/conversations', ConversationListCreateView.as_view()),
    path('api/conversations/<int:id>', ConversationDetailView.as_view()),
    path('api/conversations/<int:id>/messages', MessageListCreateView.as_view()),
]



from django.contrib.auth.models import User

