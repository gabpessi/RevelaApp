//import { getUserIdFromToken } from '../utils/jwt';
//muda aqui na produção
const API_URL = "/api";

function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(endpoint, options = {}) {
  const headers = options.headers || {};
  if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }

  // quando a resposta não tem conteudo (delete de um post)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
 export const API_CONFIG = {
  baseURL: 'https://backend-796l.onrender.com'
}

//criar url completa da imagem
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // se já é uma URL completa retorna como ta
  if (imagePath.startsWith('http')) return imagePath;
  
  // constrói a URL completa
  return `${API_CONFIG.baseURL}${imagePath}`;
};

// Função específica para imagens de mensagens
export const getMessageImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // se já é uma URL completa retorna como ta
  if (imagePath.startsWith('http')) return imagePath;
  
  // constrói a URL completa para imagens do backend
  return `https://backend-796l.onrender.com/${imagePath}`;
}; 