// função para decodificar um JWT
export function decodeJWT(token) {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1];
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Função para pegar o user_id direto do token
export function getUserIdFromToken(token) {
  const payload = decodeJWT(token);
  return payload && payload.user_id ? payload.user_id : null;
}