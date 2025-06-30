import { useNavigate } from 'react-router-dom';
import Post from "../../components/Post/Post";
import MessagesTable from "../../components/MessagesTable/MessagesTable";
import styles from './Feed.module.css';
import { useEffect, useState } from 'react';
import { apiFetch } from "../../src/services/api";
import { useMessagingData } from '../../src/hooks/useMessagingData';

export default function Feed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    const { conversations, users, loading, createOrGetConversation } = useMessagingData();
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setPostsLoading(true);
            try {
                const postsData = await apiFetch("/posts");
                setPosts(postsData);
            } catch (error) {
                if (error.message === 'Não autorizado') {
                    setPostsError('Não autorizado. Você será redirecionado para a página de Login.');
                    return;
                }
                console.error("Erro ao buscar posts:", error);
                setPostsError("Erro ao carregar posts");
            } finally {
                setPostsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSelectConversation = (conversationId) => {
        setSelectedConversation(conversationId);
        navigate(`/messages?conversation=${conversationId}`);
    };

    // Criar conversa ao clicar em usuário
    async function handleSelectUser(user) {
        try {
            const conversation = await createOrGetConversation(user.id);
            setSelectedConversation(conversation.id);
            navigate(`/messages?conversation=${conversation.id}`);
        } catch (err) {
            alert('Erro ao iniciar conversa');
        }
    }

    // remover o post deletado do feed
    const handleDelete = (id) => {
        setPosts((posts) => posts.filter((post) => String(post.id) !== String(id)));
    };

    return (
        <div className={styles.content}>
            <MessagesTable 
                conversations={conversations}
                users={users}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
                onSelectUser={handleSelectUser}
                className={styles.hidden}
                isLoadingUsers={loading}
            />
            <div className={styles.feed}>
                {postsLoading && <p>Carregando posts...</p>}
                {postsError && <p>{postsError}</p>}
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            profilePic={post.user && post.user.profile && post.user.profile.imagem ? post.user.profile.imagem : ""} 
                            username={post.user && post.user.username ? post.user.username : ""}
                            postPic={post.imagem} 
                            postDescription={post.text} 
                            userId={post.user && post.user.id ? post.user.id : post.userId}
                            onDelete={handleDelete}
                            created_at={post.created_at}
                            Date={post.Date}
                            Time={post.Time}
                        />
                    ))
                ) : !postsLoading && <p>Nenhum post encontrado.</p>}                
            </div>
        </div>
    );
}

