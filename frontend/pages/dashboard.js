import { clientService, ticketService } from '../js/api.js';
import {
  escapeHtml,
  formatDate,
  normalizeText,
  pluralize,
  priorityLabel,
  statusLabel,
} from '../js/utils.js';
import { showToast } from '../components/toast.js';

const emptyRows = (columns, message) => `
  <tr>
    <td colspan="${columns}" class="empty-state">${message}</td>
  </tr>
`;

const ticketRow = (ticket) => `
  <tr>
    <td>
      <strong>${escapeHtml(ticket.clienteNome)}</strong>
      <span>${escapeHtml(ticket.clienteTelefone)}</span>
    </td>
    <td>${escapeHtml(ticket.equipamento || '-')}</td>
    <td><span class="badge status-${ticket.status}">${statusLabel(ticket.status)}</span></td>
    <td><span class="badge priority-${ticket.prioridade}">${priorityLabel(ticket.prioridade)}</span></td>
    <td>${formatDate(ticket.criadoEm)}</td>
  </tr>
`;

const renderDashboardData = (tickets, clients) => {
  const openTickets = tickets.filter((ticket) => ticket.status !== 'concluido' && ticket.status !== 'cancelado');
  const urgentTickets = tickets.filter((ticket) => ticket.prioridade === 'urgente');
  const finishedTickets = tickets.filter((ticket) => ticket.status === 'concluido');
  const latestTickets = tickets.slice(0, 8);

  document.querySelector('[data-dashboard-stats]').innerHTML = `
    <article class="stat-card accent-teal">
      <span>Chamados abertos</span>
      <strong>${openTickets.length}</strong>
      <small>${pluralize(openTickets.length, 'pendente operacional', 'pendentes operacionais')}</small>
    </article>
    <article class="stat-card accent-amber">
      <span>Urgentes</span>
      <strong>${urgentTickets.length}</strong>
      <small>${pluralize(urgentTickets.length, 'prioridade critica', 'prioridades criticas')}</small>
    </article>
    <article class="stat-card accent-blue">
      <span>Clientes</span>
      <strong>${clients.length}</strong>
      <small>${pluralize(clients.length, 'cadastro ativo', 'cadastros ativos')}</small>
    </article>
    <article class="stat-card accent-green">
      <span>Concluidos</span>
      <strong>${finishedTickets.length}</strong>
      <small>historico recente</small>
    </article>
  `;

  document.querySelector('[data-dashboard-table]').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Equipamento</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          ${latestTickets.length ? latestTickets.map(ticketRow).join('') : emptyRows(5, 'Nenhum chamado cadastrado.')}
        </tbody>
      </table>
    </div>
  `;

  const searchInput = document.querySelector('[data-dashboard-search]');
  searchInput.addEventListener('input', () => {
    const term = normalizeText(searchInput.value);
    const filtered = tickets.filter((ticket) =>
      normalizeText(
        `${ticket.clienteNome} ${ticket.clienteTelefone} ${ticket.equipamento} ${ticket.descricao} ${ticket.status}`
      ).includes(term)
    );

    document.querySelector('[data-dashboard-table] tbody').innerHTML = filtered.length
      ? filtered.slice(0, 8).map(ticketRow).join('')
      : emptyRows(5, 'Nenhum chamado encontrado.');
  });
};

export const dashboardPage = {
  route: 'dashboard',
  title: 'Dashboard',
  subtitle: 'Visao geral dos chamados, prioridades e clientes.',
  actions: `
    <a class="button button-secondary" href="#/clientes">Clientes</a>
    <a class="button button-primary" href="#/chamados">Novo chamado</a>
  `,
  content: `
    <section class="grid stats-grid" data-dashboard-stats>
      <article class="stat-card skeleton"></article>
      <article class="stat-card skeleton"></article>
      <article class="stat-card skeleton"></article>
      <article class="stat-card skeleton"></article>
    </section>
    <section class="section-panel">
      <div class="section-heading">
        <div>
          <h2>Chamados recentes</h2>
          <span>Ultimas movimentacoes registradas pela API</span>
        </div>
        <div class="search-field">
          <input type="search" placeholder="Buscar chamados" data-dashboard-search />
        </div>
      </div>
      <div data-dashboard-table>
        <div class="table-loading">
          <span></span><span></span><span></span>
        </div>
      </div>
    </section>
  `,
  mount: async () => {
    try {
      const [tickets, clients] = await Promise.all([ticketService.list(), clientService.list()]);
      renderDashboardData(tickets, clients);
    } catch (error) {
      showToast(error.message, 'error');
    }
  },
};
