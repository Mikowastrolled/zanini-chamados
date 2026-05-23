import { bindShellEvents, renderShell } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { isAuthenticated } from './storage.js';
import { renderLoginPage } from '../pages/login.js';
import { dashboardPage } from '../pages/dashboard.js';
import { clientesPage } from '../pages/clientes.js';
import { chamadosPage } from '../pages/chamados.js';

const pages = {
  dashboard: dashboardPage,
  clientes: clientesPage,
  chamados: chamadosPage,
};

const getRoute = () => window.location.hash.replace('#/', '') || 'dashboard';

const setDocumentTitle = (title) => {
  document.title = `${title} | Zanini Ar Condicionado`;
};

const renderProtectedPage = async (route) => {
  const page = pages[route] || dashboardPage;
  setDocumentTitle(page.title);
  document.querySelector('#app').innerHTML = renderShell({
    activeRoute: page.route,
    title: page.title,
    subtitle: page.subtitle,
    actions: page.actions,
    content: page.content,
  });
  bindShellEvents();
  await page.mount?.();
};

const render = async () => {
  const route = getRoute();

  if (route === 'login') {
    if (isAuthenticated()) {
      window.location.hash = '#/dashboard';
      return;
    }

    setDocumentTitle('Login');
    renderLoginPage();
    return;
  }

  if (!isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  await renderProtectedPage(route);
};

window.addEventListener('hashchange', render);
window.addEventListener('auth:expired', () => {
  showToast('Sessao expirada. Faca login novamente.', 'error');
  window.location.hash = '#/login';
});

render();
