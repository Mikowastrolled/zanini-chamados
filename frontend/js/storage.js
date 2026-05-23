const TOKEN_KEY = 'zanini_chamados_token';
const ADMIN_KEY = 'zanini_chamados_admin';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getAdmin = () => {
  const rawAdmin = localStorage.getItem(ADMIN_KEY);

  if (!rawAdmin) {
    return null;
  }

  try {
    return JSON.parse(rawAdmin);
  } catch {
    localStorage.removeItem(ADMIN_KEY);
    return null;
  }
};

export const setSession = ({ token, admin }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

export const isAuthenticated = () => Boolean(getToken());
