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

const countByTerms = (tickets, terms) =>
  tickets.filter((ticket) => {
    const searchableText = normalizeText(`${ticket.equipamento || ''} ${ticket.descricao || ''}`);
    return terms.some((term) => searchableText.includes(term));
  }).length;

const renderDashboardData = (tickets, clients) => {
  const openTickets = tickets.filter((ticket) => ticket.status !== 'concluido' && ticket.status !== 'cancelado');
  const installationTickets = countByTerms(tickets, ['instalacao', 'instalacoes', 'instalar']);
  const maintenanceTickets = countByTerms(tickets, ['manutencao', 'manutencoes', 'revisao']);
  const cleaningTickets = countByTerms(tickets, ['higienizacao', 'higienizacoes', 'higienizar', 'limpeza']);
  const latestTickets = tickets.slice(0, 8);

  document.querySelector('[data-dashboard-stats]').innerHTML = `
    <article class="stat-card accent-blue">
      <span>Instalacoes</span>
      <strong>${installationTickets}</strong>
      <small>${pluralize(installationTickets, 'servico identificado', 'servicos identificados')}</small>
    </article>
    <article class="stat-card accent-cyan">
      <span>Manutencoes</span>
      <strong>${maintenanceTickets}</strong>
      <small>${pluralize(maintenanceTickets, 'atendimento preventivo', 'atendimentos preventivos')}</small>
    </article>
    <article class="stat-card accent-frost">
      <span>Higienizacoes</span>
      <strong>${cleaningTickets}</strong>
      <small>${pluralize(cleaningTickets, 'servico de ar limpo', 'servicos de ar limpo')}</small>
    </article>
    <article class="stat-card accent-teal">
      <span>Chamados tecnicos</span>
      <strong>${openTickets.length}</strong>
      <small>${pluralize(openTickets.length, 'em acompanhamento', 'em acompanhamento')}</small>
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
  subtitle: 'Controle tecnico para climatizacao eficiente.',
  actions: `
    <a class="button button-secondary" href="#/clientes">Clientes</a>
    <a class="button button-primary" href="#/chamados">Abrir chamado tecnico</a>
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
          <h2>Chamados tecnicos recentes</h2>
          <span>Instalacoes, manutencoes e assistencias em andamento</span>
        </div>
        <div class="search-field">
          <input type="search" placeholder="Buscar cliente, equipamento ou servico" data-dashboard-search />
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
