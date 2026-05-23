import { clearSession, getAdmin } from '../js/storage.js';

const navigation = [
  { route: 'dashboard', label: 'Dashboard', icon: 'D' },
  { route: 'clientes', label: 'Clientes', icon: 'C' },
  { route: 'chamados', label: 'Chamados', icon: 'T' },
];

export const renderShell = ({ activeRoute, title, subtitle, actions = '', content = '' }) => {
  const admin = getAdmin();
  const initials = (admin?.nome || admin?.email || 'ZA')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#/dashboard" aria-label="Zanini Chamados">
          <img src="./assets/zanini-mark.svg" alt="" />
          <span>
            <strong>Zanini</strong>
            <small>Chamados</small>
          </span>
        </a>
        <nav class="sidebar-nav" aria-label="Navegacao principal">
          ${navigation
            .map(
              (item) => `
                <a class="nav-link ${item.route === activeRoute ? 'is-active' : ''}" href="#/${
                item.route
              }">
                  <span>${item.icon}</span>
                  ${item.label}
                </a>
              `
            )
            .join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="admin-chip">
            <span>${initials}</span>
            <strong>${admin?.nome || 'Administrador'}</strong>
          </div>
          <button class="button button-ghost full-width" type="button" data-action="logout">Sair</button>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar">
          <div>
            <p class="page-kicker">Painel administrativo</p>
            <h1>${title}</h1>
            <span>${subtitle}</span>
          </div>
          <div class="topbar-actions">${actions}</div>
        </header>
        <div class="page-content">${content}</div>
      </main>
    </div>
  `;
};

export const bindShellEvents = () => {
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    clearSession();
    window.location.hash = '#/login';
  });
};
