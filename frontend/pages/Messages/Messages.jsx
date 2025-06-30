import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MessagesTable from "../../components/MessagesTable/MessagesTable"
import ChatWindow from "../../components/ChatWindow/ChatWindow"
import styles from "./Messages.module.css"
import { useMessagingData } from '../../src/hooks/useMessagingData';

export default function Messages() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const { conversations, users, loading, createOrGetConversation } = useMessagingData();
    const [error, setError] = useState(null);

    useEffect(() => {
        const conversationId = searchParams.get('conversation');
        if (conversationId) {
            setSelectedConversation(Number(conversationId));
        }
    }, [searchParams]);

    const handleBack = () => {
        setSelectedConversation(null);
    };

    // Cria conversa ao clicar em usuário
    async function handleSelectUser(user) {
        try {
            const conversation = await createOrGetConversation(user.id);
            setSelectedConversation(conversation.id);
        } catch (err) {
            setError('Erro ao iniciar conversa');
        }
    }

    return (
        <div className={styles.messagesContainer}>
            <div className={styles.messagesSidebar}>
                {loading && <p>Carregando conversas...</p>}
                {error && <p>{error}</p>}
                <MessagesTable
                    conversations={conversations}
                    users={users}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    onSelectUser={handleSelectUser}
                    isMessagesPage={!selectedConversation}
                    isLoadingUsers={loading}
                />
            </div>
            <div className={`${styles.messagesContent} ${selectedConversation ? styles.active : ''}`}>
                {selectedConversation ? (
                    <ChatWindow 
                        conversationId={selectedConversation}
                        conversationName={conversations.find(c => c.id === selectedConversation)?.name}
                        onBack={handleBack}
                    />
                ) : (
                    <div className={styles.noConversationSelected}>
                        Selecione uma conversa para começar
                    </div>
                )}
            </div>
        </div>
    )
}