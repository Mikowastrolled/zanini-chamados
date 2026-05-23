import { API_BASE_URL } from './config.js';
import { clearSession, getToken } from './storage.js';

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getErrorMessage = (payload, fallback) => {
  if (!payload) {
    return fallback;
  }

  if (payload.error?.message) {
    return payload.error.message;
  }

  if (payload.message) {
    return payload.message;
  }

  return fallback;
};

export const request = async (path, options = {}) => {
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();

  if (token && options.auth !== false) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body:
        options.body && !(options.body instanceof FormData)
          ? JSON.stringify(options.body)
          : options.body,
    });
  } catch {
    throw new Error('Nao foi possivel conectar ao backend em localhost:3000.');
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && options.auth !== false) {
      clearSession();
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const error = new Error(getErrorMessage(payload, 'Erro ao processar requisicao.'));
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
};

export const authService = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: credentials,
      auth: false,
    }),
  register: (admin) =>
    request('/auth/register', {
      method: 'POST',
      body: admin,
      auth: false,
    }),
};

export const clientService = {
  list: () => request('/clientes'),
  create: (client) =>
    request('/clientes', {
      method: 'POST',
      body: client,
    }),
  update: (id, client) =>
    request(`/clientes/${id}`, {
      method: 'PUT',
      body: client,
    }),
  remove: (id) =>
    request(`/clientes/${id}`, {
      method: 'DELETE',
    }),
};

export const ticketService = {
  list: () => request('/chamados'),
  create: (ticket) =>
    request('/chamados', {
      method: 'POST',
      body: ticket,
    }),
  updateStatus: (id, status) =>
    request(`/chamados/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
};
