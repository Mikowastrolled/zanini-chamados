export const openModal = ({ title, body, actions = [], size = 'medium' }) => {
  const overlay = document.createElement('div');
  overlay.className = `modal-overlay modal-${size}`;
  overlay.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="icon-button modal-close" type="button" aria-label="Fechar">×</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-actions"></div>
    </div>
  `;

  const close = () => {
    overlay.classList.add('modal-leave');
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(() => overlay.remove(), 180);
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape' && document.body.contains(overlay)) {
      close();
    }
  };

  const modalBody = overlay.querySelector('.modal-body');

  if (typeof body === 'string') {
    modalBody.innerHTML = body;
  } else {
    modalBody.appendChild(body);
  }

  const modalActions = overlay.querySelector('.modal-actions');
  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = action.className || 'button button-secondary';
    button.textContent = action.label;
    button.addEventListener('click', () => action.onClick?.({ close }));
    modalActions.appendChild(button);
  });

  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  document.addEventListener('keydown', handleKeydown);

  document.body.appendChild(overlay);
  return { close, element: overlay };
};
