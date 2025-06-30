import { useState } from 'react';
import styles from './MessagesTable.module.css';
import MessageCard from '../MessageCard/MessageCard';

export default function MessagesTable({ conversations = [], users = [], selectedConversation, onSelectConversation, onSelectUser, isMessagesPage = false, isLoadingUsers = false }) {
    const [busca, setBusca] = useState('');
    const loggedUserId = localStorage.getItem('userId');
    console.log('USERS:', users);
    // Busca usuários filtrados
    const filteredUsers = users
        .filter(user => String(user.id) !== String(loggedUserId))
        .filter(user => user.username.toLowerCase().includes(busca.toLowerCase()));

    // saber se já existe conversa com o user
    function getConversationWithUser(userId) {
        return conversations.find(conv =>
            (conv.user1 && conv.user1.id === userId) ||
            (conv.user2 && conv.user2.id === userId)
        );
    }

    return (
        <div className={`${styles.tabelaMensagens} ${isMessagesPage ? styles.messagesPage : ''}`}> 
            <h2>Mensagens</h2>
            <input
                type="text"
                placeholder="Pesquise por alguém..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />
            {isLoadingUsers ? (
                <p>Buscando usuários...</p>
            ) : filteredUsers.length === 0 ? (
                <p>Nenhum usuário encontrado</p>
            ) : (
                filteredUsers.map(user => {
                    const existingConv = getConversationWithUser(user.id);
                    return (
                        <MessageCard
                            key={user.id}
                            profilePic={user.profile?.imagem}
                            username={user.username}
                            ultimaMensagem={existingConv ? existingConv.lastMessage : ''}
                            isSelected={String(selectedConversation) === String(existingConv && existingConv.id)}
                            onClick={() => {
                                if (existingConv) {
                                    onSelectConversation(existingConv.id);
                                } else {
                                    onSelectUser(user);
                                }
                            }}
                            hasConversation={!!existingConv}
                        />
                    );
                })
            )}
        </div>
    );
}