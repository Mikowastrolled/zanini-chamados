import { authService } from '../js/api.js';
import { setSession } from '../js/storage.js';
import { showToast } from '../components/toast.js';

const loginTemplate = () => `
  <main class="auth-page">
    <section class="auth-art">
      <a class="brand auth-brand" href="#/login" aria-label="Zanini Ar Condicionado">
        <img src="./assets/zanini-mark.svg" alt="" />
        <span>
          <strong>Zanini</strong>
          <small>Ar Condicionado</small>
        </span>
      </a>
      <div class="auth-copy">
        <span class="eyebrow">Zanini Ar Condicionado</span>
        <h1>Controle tecnico para climatizacao eficiente.</h1>
        <p>Gerencie clientes, chamados tecnicos, instalacoes e manutencoes em um painel unico para a Zanini Ar Condicionado.</p>
      </div>
      <div class="auth-metrics">
        <div><strong>Ar frio</strong><span>conforto termico</span></div>
        <div><strong>Equipe</strong><span>assistencia tecnica</span></div>
        <div><strong>API</strong><span>localhost:3000</span></div>
      </div>
    </section>
    <section class="auth-card" aria-label="Acesso administrativo">
      <div class="auth-tabs" role="tablist">
        <button class="auth-tab is-active" type="button" data-auth-mode="login">Entrar</button>
        <button class="auth-tab" type="button" data-auth-mode="register">Criar admin</button>
      </div>
      <form class="auth-form" data-auth-form>
        <div class="field" data-register-only hidden>
          <label for="nome">Nome</label>
          <input id="nome" name="nome" type="text" autocomplete="name" placeholder="Admin Zanini" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" placeholder="admin@zanini.com.br" required />
        </div>
        <div class="field">
          <label for="senha">Senha</label>
          <input id="senha" name="senha" type="password" autocomplete="current-password" placeholder="Sua senha" required />
        </div>
        <button class="button button-primary full-width" type="submit" data-submit-button>Entrar no painel</button>
      </form>
    </section>
  </main>
`;

export const renderLoginPage = () => {
  document.querySelector('#app').innerHTML = loginTemplate();

  let mode = 'login';
  const form = document.querySelector('[data-auth-form]');
  const submitButton = document.querySelector('[data-submit-button]');
  const registerOnlyFields = document.querySelectorAll('[data-register-only]');

  const setMode = (nextMode) => {
    mode = nextMode;
    document.querySelectorAll('[data-auth-mode]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.authMode === mode);
    });
    registerOnlyFields.forEach((field) => {
      field.hidden = mode !== 'register';
    });
    submitButton.textContent = mode === 'login' ? 'Entrar no painel' : 'Criar administrador';
  };

  document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.authMode));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      email: formData.get('email'),
      senha: formData.get('senha'),
    };

    if (mode === 'register') {
      payload.nome = formData.get('nome');
    }

    submitButton.disabled = true;
    submitButton.classList.add('is-loading');

    try {
      const authData =
        mode === 'login' ? await authService.login(payload) : await authService.register(payload);

      setSession(authData);
      showToast(mode === 'login' ? 'Login realizado com sucesso.' : 'Administrador criado.', 'success');
      window.location.hash = '#/dashboard';
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('is-loading');
    }
  });
};
