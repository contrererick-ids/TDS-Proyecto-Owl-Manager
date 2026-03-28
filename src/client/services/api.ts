const BASE_URL = '/api';

// Función base para las peticiones
const request = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // Si hay token, lo adjunta automáticamente en TODAS las peticiones
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };
    return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
};

// Métodos HTTP
export const api = {
    get: (endpoint: string) =>
        request(endpoint, { method: 'GET' }),

    post: (endpoint: string, body: unknown) =>
        request(endpoint, { method: 'POST', body: JSON.stringify(body) }),

    put: (endpoint: string, body: unknown) =>
        request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

    delete: (endpoint: string) =>
        request(endpoint, { method: 'DELETE' }),
};