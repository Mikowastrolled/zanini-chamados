import { clientService } from '../js/api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { escapeHtml, formatDate, normalizeText } from '../js/utils.js';

let clients = [];
let filteredClients = [];

const clientForm = (client = {}) => {
  const form = document.createElement('form');
  form.className = 'entity-form';
  form.innerHTML = `
    <div class="form-grid">
      <div class="field">
        <label for="client-nome">Nome</label>
        <input id="client-nome" name="nome" value="${escapeHtml(client.nome || '')}" required />
      </div>
      <div class="field">
        <label for="client-telefone">Telefone</label>
        <input id="client-telefone" name="telefone" value="${escapeHtml(client.telefone || '')}" required />
      </div>
      <div class="field">
        <label for="client-email">Email</label>
        <input id="client-email" name="email" type="email" value="${escapeHtml(client.email || '')}" />
      </div>
      <div class="field">
        <label for="client-cidade">Cidade</label>
        <input id="client-cidade" name="cidade" value="${escapeHtml(client.cidade || '')}" />
      </div>
      <div class="field field-wide">
        <label for="client-endereco">Endereco</label>
        <input id="client-endereco" name="endereco" value="${escapeHtml(client.endereco || '')}" />
      </div>
      <div class="field field-wide">
        <label for="client-observacoes">Observacoes</label>
        <textarea id="client-observacoes" name="observacoes" rows="4">${escapeHtml(
          client.observacoes || ''
        )}</textarea>
      </div>
    </div>
  `;
  return form;
};

const getClientPayload = (form) => {
  const formData = new FormData(form);
  return {
    nome: formData.get('nome'),
    telefone: formData.get('telefone'),
    email: formData.get('email'),
    endereco: formData.get('endereco'),
    cidade: formData.get('cidade'),
    observacoes: formData.get('observacoes'),
  };
};

const clientRow = (client) => `
  <tr>
    <td>
      <strong>${escapeHtml(client.nome)}</strong>
      <span>${escapeHtml(client.email || 'Sem email')}</span>
    </td>
    <td>${escapeHtml(client.telefone)}</td>
    <td>${escapeHtml(client.cidade || '-')}</td>
    <td>${formatDate(client.created_at)}</td>
    <td class="table-actions">
      <button class="icon-button" type="button" data-edit-client="${client.id}" aria-label="Editar cliente">Editar</button>
      <button class="icon-button danger" type="button" data-delete-client="${client.id}" aria-label="Excluir cliente">Excluir</button>
    </td>
  </tr>
`;

const renderTable = () => {
  document.querySelector('[data-client-count]').textContent = `${filteredClients.length} clientes`;
  document.querySelector('[data-client-table]').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>Criado em</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredClients.length
              ? filteredClients.map(clientRow).join('')
              : '<tr><td colspan="5" class="empty-state">Nenhum cliente encontrado.</td></tr>'
          }
        </tbody>
      </table>
    </div>
  `;
};

const applyFilters = () => {
  const term = normalizeText(document.querySelector('[data-client-search]').value);
  filteredClients = clients.filter((client) =>
    normalizeText(`${client.nome} ${client.telefone} ${client.email} ${client.cidade}`).includes(term)
  );
  renderTable();
};

const loadClients = async () => {
  document.querySelector('[data-client-table]').innerHTML = `
    <div class="table-loading">
      <span></span><span></span><span></span>
    </div>
  `;
  clients = await clientService.list();
  filteredClients = [...clients];
  renderTable();
};

const openClientModal = (client = null) => {
  const form = clientForm(client || {});
  const modal = openModal({
    title: client ? 'Editar cliente' : 'Novo cliente',
    body: form,
    actions: [
      { label: 'Cancelar', className: 'button button-secondary', onClick: ({ close }) => close() },
      {
        label: client ? 'Salvar alteracoes' : 'Criar cliente',
        className: 'button button-primary',
        onClick: async ({ close }) => {
          if (!form.reportValidity()) {
            return;
          }

          try {
            if (client) {
              await clientService.update(client.id, getClientPayload(form));
              showToast('Cliente atualizado.', 'success');
            } else {
              await clientService.create(getClientPayload(form));
              showToast('Cliente criado.', 'success');
            }

            close();
            await loadClients();
          } catch (error) {
            showToast(error.message, 'error');
          }
        },
      },
    ],
  });

  modal.element.querySelector('input')?.focus();
};

const confirmDelete = (client) => {
  openModal({
    title: 'Excluir cliente',
    body: `<p>Confirma a exclusao de <strong>${escapeHtml(client.nome)}</strong>?</p>`,
    actions: [
      { label: 'Cancelar', className: 'button button-secondary', onClick: ({ close }) => close() },
      {
        label: 'Excluir',
        className: 'button button-danger',
        onClick: async ({ close }) => {
          try {
            await clientService.remove(client.id);
            close();
            showToast('Cliente excluido.', 'success');
            await loadClients();
          } catch (error) {
            showToast(error.message, 'error');
          }
        },
      },
    ],
  });
};

export const clientesPage = {
  route: 'clientes',
  title: 'Clientes',
  subtitle: 'Cadastro completo de clientes da Zanini.',
  actions: '<button class="button button-primary" type="button" data-new-client>Novo cliente</button>',
  content: `
    <section class="section-panel">
      <div class="section-heading">
        <div>
          <h2>Base de clientes</h2>
          <span data-client-count>Carregando clientes</span>
        </div>
        <div class="search-field">
          <input type="search" placeholder="Buscar por nome, telefone, email ou cidade" data-client-search />
        </div>
      </div>
      <div data-client-table>
        <div class="table-loading">
          <span></span><span></span><span></span>
        </div>
      </div>
    </section>
  `,
  mount: async () => {
    document.querySelector('[data-new-client]').addEventListener('click', () => openClientModal());
    document.querySelector('[data-client-search]').addEventListener('input', applyFilters);
    document.querySelector('[data-client-table]').addEventListener('click', (event) => {
      const editId = event.target.dataset.editClient;
      const deleteId = event.target.dataset.deleteClient;

      if (editId) {
        openClientModal(clients.find((client) => String(client.id) === editId));
      }

      if (deleteId) {
        confirmDelete(clients.find((client) => String(client.id) === deleteId));
      }
    });

    try {
      await loadClients();
    } catch (error) {
      showToast(error.message, 'error');
    }
  },
};
