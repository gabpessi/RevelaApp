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
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }

  // quando a resposta não tem conteudo (delete de um post)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

 // Configuração para imagens (Cloudinary)
 export const IMAGE_CONFIG = {
  baseURL: 'https://res.cloudinary.com/dpetkbxpu/',
}

//criar url completa da imagem
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // se já é uma URL completa retorna como ta
  if (imagePath.startsWith('http')) return imagePath;
  
  // constrói a URL completa usando Cloudinary
  return `${IMAGE_CONFIG.baseURL}${imagePath}`;
};