// Busca conversas
export async function getConversationsAPI(token) {
  const response = await fetch('/api/conversations', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar conversas');
  }
  return response.json();
}

// Busca mensagens
export async function getMessagesAPI(conversationId, token) {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar mensagens');
  }
  return response.json();
}

// Envia mensagem
export async function sendMessageAPI(conversationId, content, token, file = null) {
  let response;
  if (file) {
    // Se houver arquivo, usa FormData
    const formData = new FormData();
    formData.append('content', content);
    formData.append('conversation', conversationId);
    formData.append('image', file);
    response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  } else {
    response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, conversation: conversationId }),
    });
  }
  if (!response.ok) {
    throw new Error('Erro ao enviar mensagem');
  }
  return response.json();
}

// Busca todos os usuários
export async function getAllUsersAPI(token) {
  const response = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar usuários');
  }
  return response.json();
} 