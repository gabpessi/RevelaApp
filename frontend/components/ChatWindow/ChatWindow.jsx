import { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import Message from '../Message/Message';
import { IoArrowBack, IoAttach, IoClose, IoSend } from 'react-icons/io5'
import {getMessagesAPI, sendMessageAPI } from '../../src/services/messages';
import { getUserIdFromToken } from '../../src/utils/jwt';
import { getImageUrl } from '../../src/services/api';

export default function ChatWindow({ conversationId, onBack, conversationName }) {  
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)
    const prevConversationId = useRef();

    useEffect(() => {
        let intervalId;
        async function fetchMessages() {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                let userId = null;
                if (token) {
                    try {
                        userId = getUserIdFromToken(token);
                    } catch (e) {
                        userId = null;
                    }
                }
                let data;
                if (token) {
                    data = await getMessagesAPI(conversationId, token);                
                }
                // Adiciona isSent e senderName
                const messagesWithIsSent = data.map(msg => ({
                    ...msg,
                    //compara o id do sender na mensagem com o userId do usuário logado
                    isSent: msg.sender && userId ? msg.sender.id === userId : false,
                    senderName: msg.sender ? msg.sender.username : undefined,
                }));
                setMessages(messagesWithIsSent);
            } catch (err) {
                setError('Erro ao carregar mensagens');
            } finally {
                setLoading(false);
            }
        }
        if (conversationId) {
            fetchMessages();
            intervalId = setInterval(fetchMessages, 2000); // a cada 2 segundos faz um fetch pra ver se chegou mensagem nova
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [conversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Só rola para o final se mudou a conversa
        if (prevConversationId.current !== conversationId && messages.length > 0) {
            scrollToBottom();
            prevConversationId.current = conversationId;
        }
    }, [conversationId, messages]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedFile) return;
        try {
            const token = localStorage.getItem('token');
            let userId = null;
            if (token) {
                try {
                    userId = getUserIdFromToken(token);
                } catch (e) {
                    userId = null;
                }
            }
            let sent;
            if (token) {
                sent = await sendMessageAPI(conversationId, newMessage, token, selectedFile);
            }
            // Adiciona isSent e senderName
            const sentWithIsSent = {
                ...sent,
                isSent: sent.sender && userId ? sent.sender.id === userId : true, 
                senderName: sent.sender ? sent.sender.username : undefined,
            };
            setMessages(prevMessages => [...prevMessages, sentWithIsSent]);
            setNewMessage('');
            setSelectedFile(null); // Limpa o arquivo após envio
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError('Erro ao enviar mensagem');
        }
    };

    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
                <button className={styles.backButton} onClick={onBack}>
                    <IoArrowBack size={24} />
                </button>
                <h3 className={styles.conversationName}>{conversationName}</h3>
            </div>
            <div className={styles.chatMessages}>
                {error && <p>{error}</p>}
                {messages.map((message) => (
                <Message
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    isSent={message.isSent}
                    senderName={message.senderName}
                    image={getImageUrl(message.image)}
                />
                ))}
                <div ref={messagesEndRef} />
            </div>
            {selectedFile && (
                <div className={styles.filePreview}>
                    <span>{selectedFile.name}</span>
                    <button onClick={handleRemoveFile} className={styles.removeFileButton}>
                        <IoClose size={20} />
                    </button>
                </div>
            )}
            <form className={styles.chatInput} onSubmit={handleSendMessage}>
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept="image/*,video/*,audio/*"
                />
                <button 
                    type="button"
                    className={styles.attachButton}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <IoAttach size={24} />
                </button>
                <div className={styles.inputContainer}>
                    <input 
                        type="text" 
                        placeholder="Digite sua mensagem..."
                        className={styles.messageInput}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className={styles.sendButton}
                        disabled={!newMessage.trim() && !selectedFile}
                    >
                        <IoSend size={15} />
                    </button>
                </div>
            </form>
        </div>
    );
}



