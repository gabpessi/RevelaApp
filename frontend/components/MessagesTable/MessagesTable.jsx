import { useState } from 'react';
import styles from './MessagesTable.module.css';
import MessageCard from '../MessageCard/MessageCard';

export default function MessagesTable({ conversations = [], users = [], selectedConversation, onSelectConversation, onSelectUser, isMessagesPage = false, isLoadingUsers = false }) { 
    const [busca, setBusca] = useState('');

    console.log('MessagesTable received conversations:', conversations);
    console.log('MessagesTable conversations length:', conversations.length);

    const filteredConversations = conversations.filter(conversation => 
        conversation.name.toLowerCase().includes(busca.toLowerCase())
    );

    console.log('Filtered conversations:', filteredConversations);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(busca.toLowerCase())
    );

    console.log('Filtered users:', filteredUsers);

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
            ) : filteredConversations.length === 0 ? (
                <p>Nenhuma conversa encontrada</p>
            ) : (
                filteredConversations.map(conversation => (
                    <MessageCard 
                        key={conversation.id}
                        profilePicture={conversation.profilePicture}
                        username={conversation.name}
                        ultimaMensagem={conversation.lastMessage}
                        isSelected={selectedConversation === conversation.id}
                        onClick={() => onSelectConversation(conversation.id)}
                    />
                ))
            )}
            {isLoadingUsers ? (
                <p>Buscando usuários...</p>
            ) : filteredUsers.length === 0 ? (
                <p>Nenhum usuário encontrado</p>
            ) : (
                filteredUsers.map(user => {
                    // ... existing code ...
                })
            )}
        </div>
    )
}