/* ==========================================================================
   Install — instalação PWA, modo de exibição e boas-vindas
   ========================================================================== */
const Install = (() => {
  const INSTALLED_KEY = 'horamarcada.install.installed.v1';
  const WELCOME_KEY = 'horamarcada.install.welcome.v1';

  const listeners = new Set();
  let deferredPrompt = null;
  let welcomeOpen = false;

  const media = mode => !!(window.matchMedia && window.matchMedia(`(display-mode: ${mode})`).matches);

  function isStandalone() {
    return media('standalone')
      || media('window-controls-overlay')
      || media('fullscreen')
      || media('minimal-ui')
      || navigator.standalone === true;
  }

  function isFile() {
    return location.protocol === 'file:';
  }

  function isSecure() {
    if (location.protocol === 'https:') return true;
    const host = location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]' || host.endsWith('.localhost');
  }

  function readFlag(key) {
    try { return localStorage.getItem(key) === '1'; } catch (e) { return false; }
  }

  function writeFlag(key) {
    try { localStorage.setItem(key, '1'); } catch (e) { /* armazenamento indisponível */ }
  }

  function browserName() {
    const ua = navigator.userAgent || '';
    if (/Edg\//.test(ua)) return 'Microsoft Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Chrome\//.test(ua)) return 'Google Chrome';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Safari\//.test(ua)) return 'Safari';
    return typeof I18n !== 'undefined' ? I18n.t('Navegador') : 'Navegador';
  }

  function platform() {
    const ua = navigator.userAgent || '';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Android/.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Mac/.test(ua)) return 'macOS';
    if (/Linux/.test(ua)) return 'Linux';
    return '';
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod/.test(navigator.userAgent || '');
  }

  function isFirefoxDesktop() {
    return /Firefox\//.test(navigator.userAgent || '') && !isMobile();
  }

  function canPrompt() {
    return !!deferredPrompt && !isStandalone();
  }

  function status() {
    if (isStandalone()) return 'installed';
    if (isFile()) return 'file';
    if (!isSecure()) return 'insecure';
    if (readFlag(INSTALLED_KEY)) return 'installed-browser';
    if (canPrompt()) return 'ready';
    return 'browser';
  }

  function getState() {
    return {
      status: status(),
      standalone: isStandalone(),
      canPrompt: canPrompt(),
      installedBefore: readFlag(INSTALLED_KEY),
      file: isFile(),
      secure: isSecure(),
      browser: browserName(),
      platform: platform(),
      mobile: isMobile()
    };
  }

  function emit() {
    const state = getState();
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function onChange(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /* ---------------- instalação ---------------- */
  async function requestInstall() {
    if (isStandalone()) {
      if (typeof UI !== 'undefined') UI.toast('Você já está usando o aplicativo instalado.', 'info');
      return { ok: false, reason: 'installed' };
    }

    if (!deferredPrompt) {
      openHelp();
      return { ok: false, reason: 'help' };
    }

    const promptEvent = deferredPrompt;
    deferredPrompt = null;

    try {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      emit();
      if (choice && choice.outcome === 'accepted') {
        return { ok: true, outcome: 'accepted' };
      }
      if (typeof UI !== 'undefined') UI.toast('Instalação cancelada.', 'info');
      return { ok: false, reason: 'dismissed' };
    } catch (e) {
      emit();
      if (typeof UI !== 'undefined') UI.toast('Não foi possível instalar. Use as instruções.', 'warn');
      return { ok: false, reason: 'error' };
    }
  }

  /* ---------------- instruções ---------------- */
  function helpHTML() {
    const st = getState();
    const steps = [];

    if (isFirefoxDesktop()) {
      steps.push(`
        <div class="install-help-step">
          <span class="install-step-num">!</span>
          <div>
            <strong>Use o Edge ou o Chrome</strong>
            <p>O Firefox no computador não instala PWAs. Abra este endereço no Microsoft Edge ou no Google Chrome.</p>
          </div>
        </div>`);
    } else if (st.mobile) {
      steps.push(`
        <div class="install-help-step">
          <span class="install-step-num">1</span>
          <div><strong>Abra o menu do navegador</strong><p>Toque no menu de três pontos ou no botão Compartilhar.</p></div>
        </div>
        <div class="install-help-step">
          <span class="install-step-num">2</span>
          <div><strong>Escolha adicionar à tela inicial</strong><p>Procure por Instalar aplicativo ou Adicionar à tela inicial.</p></div>
        </div>
        <div class="install-help-step">
          <span class="install-step-num">3</span>
          <div><strong>Confirme</strong><p>O atalho do Hora Marcada aparecerá na tela inicial do seu aparelho.</p></div>
        </div>`);
    } else {
      steps.push(`
        <div class="install-help-step">
          <span class="install-step-num">1</span>
          <div><strong>Use o Microsoft Edge ou o Google Chrome</strong><p>No computador, abra este endereço em um navegador compatível com instalação de PWAs.</p></div>
        </div>
        <div class="install-help-step">
          <span class="install-step-num">2</span>
          <div><strong>Abra o menu do navegador</strong><p>No Edge, escolha Aplicativos → Instalar este site como app. No Chrome, escolha Salvar e compartilhar → Instalar página como app.</p></div>
        </div>
        <div class="install-help-step">
          <span class="install-step-num">3</span>
          <div><strong>Confirme a instalação</strong><p>O Hora Marcada abrirá em janela própria e o atalho será criado no Menu Iniciar.</p></div>
        </div>`);
    }

    const warnings = [];
    if (st.file) {
      warnings.push(`<div class="alert warn">${Icon('alert', 16)}<div>Este app está aberto como arquivo local (file://). O navegador não permite instalar nesse modo. Feche esta aba e execute o <strong>servir.bat</strong>. Ele inicia o servidor local e abre o endereço correto para instalar.</div></div>`);
      warnings.push(`<div class="alert warn">${Icon('download', 16)}<div>Os dados do modo arquivo (file://) não aparecem no app instalado. Exporte um backup em Configurações → Dados antes de instalar e importe depois.</div></div>`);
    } else if (!st.secure) {
      warnings.push(`<div class="alert warn">${Icon('alert', 16)}<div>A instalação exige HTTPS ou localhost. Abra o app por um endereço seguro.</div></div>`);
    }

    const body = `<div class="install-help">
      ${warnings.join('')}
      ${steps.join('')}
      <div class="install-help-note">${Icon('book', 15)}<div>Depois de instalar, o Hora Marcada passa a abrir em janela própria, sem barra de endereços, e continua funcionando offline.</div></div>
    </div>`;

    UI.open({
      title: 'Como instalar o aplicativo',
      subtitle: `Navegador detectado: ${U.esc(st.browser)}`,
      size: 'modal-sm',
      body,
      footer: `<div class="spacer"></div>
        <button class="btn" data-install-settings>${Icon('settings', 15)} Configurações do app</button>
        <button class="btn btn-primary" data-ui-close>Entendi</button>`,
      onMount: (overlay, id) => {
        const settings = overlay.querySelector('[data-install-settings]');
        if (settings) settings.addEventListener('click', () => {
          UI.close(id);
          if (typeof App !== 'undefined') {
            App.ui.settings.tab = 'app';
            App.go('settings');
          }
        });
      }
    });
  }

  function openHelp() {
    if (typeof UI === 'undefined') return;
    helpHTML();
  }

  /* ---------------- boas-vindas ---------------- */
  function welcomeSeen() {
    return readFlag(WELCOME_KEY);
  }

  function showWelcome(opts = {}) {
    if (typeof UI === 'undefined' || welcomeOpen) return;
    if (!opts.force && (!isStandalone() || welcomeSeen())) return;

    welcomeOpen = true;
    const m = UI.open({
      title: 'Bem-vindo ao Hora Marcada',
      size: 'modal-sm',
      closeOnBackdrop: false,
      body: `<div class="welcome">
        <div class="welcome-hero">
          <div class="welcome-ico">${Icon('checkCircle', 30)}</div>
          <h4>Tudo pronto!</h4>
          <p>A instalação foi concluída. A partir de agora, o Hora Marcada abre em janela própria, sem barra de endereços.</p>
        </div>
        <div class="welcome-list">
          <div class="welcome-item">
            <span class="stat-icon green">${Icon('pin', 16)}</span>
            <div><strong>Atalho no Menu Iniciar</strong><p>Use o atalho criado pelo Windows para abrir o app a qualquer momento.</p></div>
          </div>
          <div class="welcome-item">
            <span class="stat-icon blue">${Icon('star', 16)}</span>
            <div><strong>Fixe na barra de tarefas</strong><p>Com o app aberto, clique com o botão direito no ícone da barra de tarefas e escolha Fixar na barra de tarefas.</p></div>
          </div>
          <div class="welcome-item">
            <span class="stat-icon">${Icon('download', 16)}</span>
            <div><strong>Funciona offline</strong><p>Seus dados ficam no dispositivo e o app continua abrindo sem internet.</p></div>
          </div>
        </div>
      </div>`,
      footer: `<div class="spacer"></div>
        <button class="btn" data-welcome-settings>${Icon('settings', 15)} Configurações do app</button>
        <button class="btn btn-primary" data-ui-close>Entendi</button>`,
      onMount: (overlay, id) => {
        const settings = overlay.querySelector('[data-welcome-settings]');
        if (settings) settings.addEventListener('click', () => {
          UI.close(id);
          if (typeof App !== 'undefined') {
            App.ui.settings.tab = 'app';
            App.go('settings');
          }
        });
      },
      onClose: () => {
        welcomeOpen = false;
        writeFlag(WELCOME_KEY);
      }
    });
    return m;
  }

  function maybeWelcome() {
    if (!isStandalone() || welcomeSeen()) return false;
    if (typeof Store === 'undefined' || !Store.db || !Store.db.settings.onboarded) return false;
    if (typeof UI === 'undefined' || !document.getElementById('modal-root')) return false;
    setTimeout(() => {
      if (isStandalone() && !welcomeSeen()) showWelcome();
    }, 650);
    return true;
  }

  /* ---------------- ciclo de vida ---------------- */
  function syncRoot() {
    document.documentElement.classList.toggle('is-standalone', isStandalone());
  }

  function init() {
    syncRoot();
    if (typeof window.matchMedia === 'function') {
      ['standalone', 'window-controls-overlay', 'minimal-ui', 'fullscreen'].forEach(mode => {
        const mq = window.matchMedia(`(display-mode: ${mode})`);
        if (!mq || !mq.addEventListener) return;
        mq.addEventListener('change', () => {
          syncRoot();
          emit();
        });
      });
    }
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    writeFlag(INSTALLED_KEY);
    syncRoot();
    if (typeof UI !== 'undefined') {
      UI.toast('Aplicativo instalado. Abra pelo atalho do Menu Iniciar.', 'success', 5000);
    }
    emit();
  });

  return {
    init, getState, requestInstall, openHelp, showWelcome, maybeWelcome, onChange,
    isStandalone, canPrompt, isFile, isSecure, browserName
  };
})();
