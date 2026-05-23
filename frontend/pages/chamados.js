import { clientService, ticketService } from '../js/api.js';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../js/config.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import {
  buildOptions,
  escapeHtml,
  formatDate,
  normalizeText,
  priorityLabel,
  statusLabel,
} from '../js/utils.js';

let tickets = [];
let clients = [];
let filteredTickets = [];

const ticketRow = (ticket) => `
  <tr>
    <td>
      <strong>${escapeHtml(ticket.clienteNome)}</strong>
      <span>${escapeHtml(ticket.clienteTelefone)}</span>
    </td>
    <td>
      <strong>${escapeHtml(ticket.equipamento || 'Equipamento nao informado')}</strong>
      <span>${escapeHtml(ticket.descricao)}</span>
    </td>
    <td>
      <select class="status-select" data-ticket-status="${ticket.id}" aria-label="Alterar status">
        ${buildOptions(STATUS_OPTIONS, ticket.status)}
      </select>
    </td>
    <td><span class="badge priority-${ticket.prioridade}">${priorityLabel(ticket.prioridade)}</span></td>
    <td>${escapeHtml(ticket.tecnicoResponsavel || '-')}</td>
    <td>${formatDate(ticket.criadoEm)}</td>
  </tr>
`;

const renderTable = () => {
  document.querySelector('[data-ticket-count]').textContent = `${filteredTickets.length} chamados`;
  document.querySelector('[data-ticket-table]').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Chamado</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Tecnico</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTickets.length
              ? filteredTickets.map(ticketRow).join('')
              : '<tr><td colspan="6" class="empty-state">Nenhum chamado encontrado.</td></tr>'
          }
        </tbody>
      </table>
    </div>
  `;
};

const applyFilters = () => {
  const term = normalizeText(document.querySelector('[data-ticket-search]').value);
  const status = document.querySelector('[data-ticket-status-filter]').value;
  const priority = document.querySelector('[data-ticket-priority-filter]').value;

  filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = normalizeText(
      `${ticket.clienteNome} ${ticket.clienteTelefone} ${ticket.equipamento} ${ticket.descricao} ${ticket.tecnicoResponsavel}`
    ).includes(term);
    const matchesStatus = !status || ticket.status === status;
    const matchesPriority = !priority || ticket.prioridade === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  renderTable();
};

const loadTickets = async () => {
  document.querySelector('[data-ticket-table]').innerHTML = `
    <div class="table-loading">
      <span></span><span></span><span></span>
    </div>
  `;
  [tickets, clients] = await Promise.all([ticketService.list(), clientService.list()]);
  filteredTickets = [...tickets];
  renderTable();
};

const ticketForm = () => {
  const form = document.createElement('form');
  form.className = 'entity-form';
  form.innerHTML = `
    <div class="form-grid">
      <div class="field field-wide">
        <label for="ticket-client">Cliente vinculado</label>
        <select id="ticket-client" name="clienteId">
          <option value="">Selecionar cliente cadastrado</option>
          ${clients
            .map(
              (client) =>
                `<option value="${client.id}">${escapeHtml(client.nome)} - ${escapeHtml(client.telefone)}</option>`
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label for="ticket-cliente-nome">Nome do cliente</label>
        <input id="ticket-cliente-nome" name="clienteNome" required />
      </div>
      <div class="field">
        <label for="ticket-cliente-telefone">Telefone</label>
        <input id="ticket-cliente-telefone" name="clienteTelefone" required />
      </div>
      <div class="field">
        <label for="ticket-cliente-email">Email</label>
        <input id="ticket-cliente-email" name="clienteEmail" type="email" />
      </div>
      <div class="field">
        <label for="ticket-equipamento">Equipamento</label>
        <input id="ticket-equipamento" name="equipamento" placeholder="Split 12000 BTUs" />
      </div>
      <div class="field">
        <label for="ticket-prioridade">Prioridade</label>
        <select id="ticket-prioridade" name="prioridade">${buildOptions(PRIORITY_OPTIONS, 'media')}</select>
      </div>
      <div class="field">
        <label for="ticket-status">Status</label>
        <select id="ticket-status" name="status">${buildOptions(STATUS_OPTIONS, 'aberto')}</select>
      </div>
      <div class="field field-wide">
        <label for="ticket-tecnico">Tecnico responsavel</label>
        <input id="ticket-tecnico" name="tecnicoResponsavel" />
      </div>
      <div class="field field-wide">
        <label for="ticket-descricao">Descricao</label>
        <textarea id="ticket-descricao" name="descricao" rows="4" required></textarea>
      </div>
    </div>
  `;

  form.querySelector('#ticket-client').addEventListener('change', (event) => {
    const client = clients.find((item) => String(item.id) === event.target.value);

    if (!client) {
      return;
    }

    form.querySelector('[name="clienteNome"]').value = client.nome || '';
    form.querySelector('[name="clienteTelefone"]').value = client.telefone || '';
    form.querySelector('[name="clienteEmail"]').value = client.email || '';
  });

  return form;
};

const getTicketPayload = (form) => {
  const formData = new FormData(form);
  return {
    clienteNome: formData.get('clienteNome'),
    clienteTelefone: formData.get('clienteTelefone'),
    clienteEmail: formData.get('clienteEmail'),
    equipamento: formData.get('equipamento'),
    descricao: formData.get('descricao'),
    prioridade: formData.get('prioridade'),
    status: formData.get('status'),
    tecnicoResponsavel: formData.get('tecnicoResponsavel'),
  };
};

const openTicketModal = () => {
  const form = ticketForm();
  const modal = openModal({
    title: 'Novo chamado',
    body: form,
    size: 'large',
    actions: [
      { label: 'Cancelar', className: 'button button-secondary', onClick: ({ close }) => close() },
      {
        label: 'Criar chamado',
        className: 'button button-primary',
        onClick: async ({ close }) => {
          if (!form.reportValidity()) {
            return;
          }

          try {
            await ticketService.create(getTicketPayload(form));
            close();
            showToast('Chamado criado.', 'success');
            await loadTickets();
            applyFilters();
          } catch (error) {
            showToast(error.message, 'error');
          }
        },
      },
    ],
  });

  modal.element.querySelector('select')?.focus();
};

const updateTicketStatus = async (ticketId, status) => {
  try {
    await ticketService.updateStatus(ticketId, status);
    showToast(`Status alterado para ${statusLabel(status)}.`, 'success');
    await loadTickets();
    applyFilters();
  } catch (error) {
    showToast(error.message, 'error');
  }
};

export const chamadosPage = {
  route: 'chamados',
  title: 'Chamados',
  subtitle: 'Acompanhe solicitacoes, prioridades e andamento tecnico.',
  actions: '<button class="button button-primary" type="button" data-new-ticket>Novo chamado</button>',
  content: `
    <section class="section-panel">
      <div class="section-heading with-filters">
        <div>
          <h2>Fila de chamados</h2>
          <span data-ticket-count>Carregando chamados</span>
        </div>
        <div class="filters-row">
          <div class="search-field">
            <input type="search" placeholder="Buscar chamado" data-ticket-search />
          </div>
          <select data-ticket-status-filter aria-label="Filtrar por status">
            <option value="">Todos status</option>
            ${buildOptions(STATUS_OPTIONS)}
          </select>
          <select data-ticket-priority-filter aria-label="Filtrar por prioridade">
            <option value="">Todas prioridades</option>
            ${buildOptions(PRIORITY_OPTIONS)}
          </select>
        </div>
      </div>
      <div data-ticket-table>
        <div class="table-loading">
          <span></span><span></span><span></span>
        </div>
      </div>
    </section>
  `,
  mount: async () => {
    document.querySelector('[data-new-ticket]').addEventListener('click', openTicketModal);
    document.querySelector('[data-ticket-search]').addEventListener('input', applyFilters);
    document.querySelector('[data-ticket-status-filter]').addEventListener('change', applyFilters);
    document.querySelector('[data-ticket-priority-filter]').addEventListener('change', applyFilters);
    document.querySelector('[data-ticket-table]').addEventListener('change', (event) => {
      const ticketId = event.target.dataset.ticketStatus;

      if (ticketId) {
        updateTicketStatus(ticketId, event.target.value);
      }
    });

    try {
      await loadTickets();
    } catch (error) {
      showToast(error.message, 'error');
    }
  },
};
