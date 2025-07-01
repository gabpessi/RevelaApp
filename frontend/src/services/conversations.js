import {getConversationsAPI } from './messages';
import { getUserIdFromToken } from '../utils/jwt';

export async function fetchConversationsData() {
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
        try {
            userId = getUserIdFromToken(token);
        } catch (e) {
            console.error('Error getting user ID from token:', e);
            userId = null;
        }
    }
    
    let conversationsData = [];
    if (token) {
        try {
            conversationsData = await getConversationsAPI(token);
        } catch (error) {
            throw error;
        }
    }

    // formato esperado pela tabela
    let tableData = [];
    if (token) {
        tableData = conversationsData.map(conv => {
            const otherUser = conv.user1.id === userId ? conv.user2 : conv.user1;
            return {
                id: conv.id,
                userId: otherUser.id,
                name: otherUser.username,
                profilePicture: otherUser.profile && otherUser.profile.imagem ? otherUser.profile.imagem : '',
                lastMessage: conv.last_message ? conv.last_message.content : '',
                timestamp: conv.last_message ? conv.last_message.timestamp : conv.created_at,
            };
        });
    } else {
        tableData = conversationsData;
    }
    
    return tableData;
} 