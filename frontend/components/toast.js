const icons = {
  success: 'OK',
  error: '!',
  info: 'i',
};

export const showToast = (message, type = 'info') => {
  const root = document.querySelector('#toast-root');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button class="toast-close" type="button" aria-label="Fechar">×</button>
  `;

  const removeToast = () => {
    toast.classList.add('toast-leave');
    setTimeout(() => toast.remove(), 180);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  root.appendChild(toast);
  setTimeout(removeToast, 4200);
};
