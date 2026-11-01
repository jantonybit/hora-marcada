/* ==========================================================================
   App — shell, navegação, busca global, tema e roteamento
   ========================================================================== */
const App = (() => {
  const ROUTES = [
    { section: 'Principal' },
    { id: 'dashboard', label: 'Visão geral', icon: 'dashboard' },
    { id: 'agenda', label: 'Agenda', icon: 'calendar' },
    { id: 'waitlist', label: 'Lista de espera', icon: 'list' },
    { section: 'Gestão' },
    { id: 'clients', label: 'Clientes', icon: 'users', labelKey: 'clients' },
    { id: 'services', label: 'Serviços', icon: 'scissors', labelKey: 'services' },
    { id: 'team', label: 'Equipe', icon: 'team', labelKey: 'team' },
    { id: 'finance', label: 'Financeiro', icon: 'wallet', managerOnly: true },
    { id: 'reminders', label: 'Lembretes', icon: 'bell' },
    { section: 'Sistema' },
    { id: 'settings', label: 'Configurações', icon: 'settings' }
  ];

  const META = {
    dashboard: { title: 'Visão geral', sub: 'Resumo do dia, ocupação e próximos atendimentos.' },
    agenda: { title: 'Agenda', sub: 'Visualize e organize os horários por dia, semana ou mês.' },
    waitlist: { title: 'Lista de espera', sub: 'Encaixes, prioridades e clientes aguardando um horário.' },
    clients: { title: 'Clientes', sub: 'Cadastro, contato e histórico de atendimentos.' },
    services: { title: 'Serviços', sub: 'Duração, preço e organização dos serviços.' },
    team: { title: 'Equipe', sub: 'Profissionais, horários de trabalho e bloqueios.' },
    finance: { title: 'Financeiro', sub: 'Recebimentos, valores a receber e previsão.' },
    reminders: { title: 'Lembretes', sub: 'Confirmações e mensagens para reduzir faltas.' },
    settings: { title: 'Configurações', sub: 'Identidade, agenda, acessos e backup.' }
  };

  const TIPS = {
    dashboard: ['Dica rápida', 'Clique em um atendimento para confirmar, concluir ou remarcar.'],
    agenda: ['Agenda inteligente', 'Clique em um espaço vazio da coluna para agendar naquele horário.'],
    waitlist: ['Encaixe fácil', 'Ao surgir um horário, chame o próximo da lista e confirme em segundos.'],
    clients: ['Fidelize', 'Use as tags para marcar clientes VIP, recorrentes ou novos.'],
    services: ['Evite atrasos', 'O intervalo após o atendimento reserva tempo de organização entre clientes.'],
    team: ['Equipe', 'Bloqueios removem apenas um período, sem mudar o horário padrão.'],
    finance: ['Controle', 'Só atendimentos concluídos e pagos entram como recebido.'],
    reminders: ['Menos faltas', 'Envie o lembrete um dia antes e confirme o horário.'],
    settings: ['Seu jeito', 'Ajuste nomes, cores e textos para combinar com o seu negócio.']
  };

  const today = U.todayISO();

  const ui = {
    agenda: { view: 'day', date: today, pro: 'all', status: 'all' },
    clients: { sort: 'name' },
    services: {},
    team: {},
    finance: { period: 'month', pro: 'all', tab: 'all', from: '', to: '' },
    reminders: { tab: '7d' },
    settings: { tab: 'identity' }
  };

  let searchIndex = [];

  /* ---------------- tema / identidade ---------------- */
  function resolvedTheme() {
    const t = Store.settings().theme;
    if (t === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return t === 'dark' ? 'dark' : 'light';
  }

  function applyChrome() {
    if (!Store.db) return;
    const s = Store.settings();
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme();
    root.style.setProperty('--accent', s.accent);
    root.style.setProperty('--accent-2', s.accent2);
    document.title = `${s.businessName} — Hora Marcada`;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', s.accent);
  }

  /* ---------------- idioma ---------------- */
  const currentLang = () => (Store.db && Store.settings().language === 'en' ? 'en' : 'pt');

  function applyLanguage() {
    const lang = currentLang();
    // Normaliza textos padrão (lembrete, formas de pagamento, rótulos) mesmo
    // quando o idioma já vem salvo — sem tocar em textos personalizados.
    I18n.localizeDefaults(null, lang);
    I18n.setLanguage(lang, { silent: true });
  }

  function setLanguage(next) {
    if (!Store.db) return;
    const lang = next === 'en' ? 'en' : 'pt';
    const prev = currentLang();
    I18n.localizeDefaults(prev, lang);
    Store.settings().language = lang;
    Store.save();
    I18n.setLanguage(lang);
    applyChrome();
    refresh();
    I18n.start();
  }

  function toggleTheme() {
    const s = Store.settings();
    s.theme = resolvedTheme() === 'dark' ? 'light' : 'dark';
    Store.save();
    applyChrome();
    refresh();
  }

  /* ---------------- rotas ---------------- */
  function currentRoute() {
    const raw = String(location.hash || '').replace(/^#\/?/, '').split('?')[0].trim();
    if (Store.db && raw === 'finance' && !Store.canSeeMoney()) return 'dashboard';
    return Views[raw] ? raw : 'dashboard';
  }

  function go(route) {
    if (!Views[route]) route = 'dashboard';
    const target = '#/' + route;
    if (location.hash !== target) location.hash = target;
    else refresh();
  }

  /* ---------------- shell ---------------- */
  function navBadge(id) {
    if (!Store.db) return '';
    if (id === 'agenda') {
      const n = Store.appointmentsOn(U.todayISO(), { includeCancelled: false }).filter(a => a.status !== 'faltou').length;
      return n ? `<span class="nav-badge">${n}</span>` : '';
    }
    if (id === 'waitlist') {
      const n = Store.waitlistCount();
      return n ? `<span class="nav-badge nav-badge-amber">${n}</span>` : '';
    }
    if (id === 'reminders') {
      const n = Store.filterAppointments({ from: U.todayISO() }).filter(a => a.status === 'agendado').length;
      return n ? `<span class="nav-badge">${n}</span>` : '';
    }
    return '';
  }

  function navHTML(active) {
    const labels = Store.labels();
    return ROUTES.map(r => {
      if (r.section) return `<div class="nav-section">${r.section}</div>`;
      if (r.managerOnly && !Store.canSeeMoney()) return '';
      const label = r.labelKey ? (labels[r.labelKey] || r.label) : r.label;
      return `<button class="nav-item ${active === r.id ? 'active' : ''}" data-route="${r.id}">
        <span class="nav-icon">${Icon(r.icon, 18)}</span>
        <span>${U.esc(label)}</span>
        ${navBadge(r.id)}
      </button>`;
    }).join('');
  }

  function sidebarHTML(active) {
    const s = Store.settings();
    const seg = Seed.segment(s.segment);
    const owner = Store.db.professionals[0];
    const tip = TIPS[active] || TIPS.dashboard;

    return `<aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-mark">${U.esc(s.emoji)}</div>
        <div class="brand-text">
          <strong>${U.esc(s.businessName)}</strong>
          <span>${seg.emoji} ${U.esc(seg.name)}</span>
        </div>
        <div class="spacer"></div>
        <button class="icon-btn plain sidebar-close mobile-only" data-close-sidebar aria-label="Fechar menu">${Icon('x', 18)}</button>
      </div>

      <nav class="nav">${navHTML(active)}</nav>

      <div class="sidebar-foot">
        <div class="tip-card">
          <strong>${Icon('sparkles', 13)} ${U.esc(tip[0])}</strong>
          ${U.esc(tip[1])}
        </div>
        <div class="sidebar-user">
          ${UI.avatar(owner ? owner.name : s.businessName, owner ? owner.color : s.accent)}
          <div class="su-meta">
            <strong>${U.esc(owner ? owner.name : s.businessName)}</strong>
            <span>${U.esc(owner && owner.role ? owner.role : seg.labels.pro)}</span>
          </div>
          <div class="spacer"></div>
          <button class="icon-btn sm plain" data-route="settings" title="Configurações">${Icon('settings', 16)}</button>
        </div>
      </div>
    </aside>`;
  }

  function topbarHTML() {
    const s = Store.settings();
    const seg = Seed.segment(s.segment);
    const dark = resolvedTheme() === 'dark';
    const manager = Store.canSeeMoney();
    const install = Install.getState();
    const showInstall = !install.standalone && !install.installedBefore;
    return `<header class="topbar">
      <button class="icon-btn plain mobile-only" data-open-sidebar aria-label="Abrir menu">${Icon('menu', 20)}</button>
      <div class="page-head">
        <h1>${U.esc(s.businessName)}</h1>
        <p>${seg.emoji} ${U.esc(I18n.t(seg.name))} · Hora Marcada</p>
      </div>
      <div class="top-actions">
        <div class="search-wrap">
          <span class="search-icon">${Icon('search', 16)}</span>
          <input class="search-input" id="globalSearch" type="search" placeholder="Buscar cliente, serviço..." autocomplete="off" aria-label="Busca global">
          <div class="search-results" id="searchResults"></div>
        </div>
        <button class="role-chip ${manager ? 'manager' : 'reception'}" data-access-toggle title="${manager ? 'Gestor — clique para bloquear os valores' : 'Modo recepção — valores protegidos'}">
          ${Icon(manager ? 'unlock' : 'lock', 14)}<span>${manager ? 'Gestor' : 'Recepção'}</span>
        </button>
        ${showInstall ? `<button class="btn btn-soft install-cta" data-install-app title="Instalar aplicativo">
          ${Icon('download', 16)}<span>Instalar app</span>
        </button>` : ''}
        <button class="icon-btn" data-theme-toggle title="${dark ? 'Tema claro' : 'Tema escuro'}" aria-label="Alternar tema">
          ${Icon(dark ? 'sun' : 'moon', 18)}
        </button>
        <button class="btn btn-primary" data-action="new-appt" title="Atalho: Alt+N">
          ${Icon('plus', 16)}<span>${U.esc(s.labels.newAppt)}</span>
        </button>
      </div>
    </header>`;
  }

  /* ---------------- busca global ---------------- */
  function buildSearchResults(query) {
    const q = U.normalize(query).trim();
    if (!q || !Store.db) return [];
    const labels = Store.labels();
    const groups = [];

    const clients = Store.db.clients
      .filter(c => U.matches(q, c.name, c.phone, c.email, (c.tags || []).join(' ')))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .slice(0, 5);
    if (clients.length) {
      groups.push({
        title: labels.clients,
        items: clients.map(c => ({
          type: 'client', id: c.id, icon: 'user',
          title: c.name, sub: c.phone || c.email || 'Sem contato'
        }))
      });
    }

    const appts = Store.db.appointments
      .filter(a => {
        const c = Store.getClient(a.clientId);
        const svc = Store.getService(a.serviceId);
        return U.matches(q, c && c.name, svc && svc.name, a.date, a.notes);
      })
      .sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start))
      .slice(0, 5);
    if (appts.length) {
      groups.push({
        title: labels.appts,
        items: appts.map(a => {
          const c = Store.getClient(a.clientId);
          return {
            type: 'appt', id: a.id, icon: 'calendar',
            title: (c ? c.name : 'Cliente removido') + ' · ' + a.start,
            sub: `${U.fmtDate(a.date)} · ${Store.STATUS[a.status].label}`
          };
        })
      });
    }

    const services = Store.db.services
      .filter(s => U.matches(q, s.name, s.category, s.description))
      .slice(0, 4);
    if (services.length) {
      groups.push({
        title: labels.services,
        items: services.map(s => ({
          type: 'service', id: s.id, icon: 'scissors',
          title: s.name, sub: `${s.duration} min · ${Store.money(s.price)}`
        }))
      });
    }

    return groups;
  }

  function renderSearchResults(groups) {
    const box = document.getElementById('searchResults');
    if (!box) return;
    searchIndex = [];
    if (!groups.length) {
      box.innerHTML = `<div class="sr-empty">Nenhum resultado encontrado.</div>`;
      box.classList.add('open');
      return;
    }
    box.innerHTML = groups.map(g => `
      <div class="sr-group">${U.esc(g.title)}</div>
      ${g.items.map(it => {
      const idx = searchIndex.push(it) - 1;
      return `<button class="sr-item" data-sr="${idx}">
          <span class="stat-icon" style="width:28px;height:28px;border-radius:8px">${Icon(it.icon, 14)}</span>
          <span style="min-width:0"><strong style="font-size:12.5px;font-weight:650;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${U.esc(it.title)}</strong><small>${U.esc(it.sub)}</small></span>
        </button>`;
    }).join('')}
    `).join('');
    box.classList.add('open');
    box.querySelectorAll('[data-sr]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = searchIndex[Number(btn.dataset.sr)];
        box.classList.remove('open');
        const input = document.getElementById('globalSearch');
        if (input) input.value = '';
        if (!item) return;
        if (item.type === 'client') Modals.clientDetails(item.id);
        else if (item.type === 'appt') Modals.appointmentDetails(item.id);
        else if (item.type === 'service') Modals.service(item.id);
      });
    });
  }

  function bindSearch() {
    const input = document.getElementById('globalSearch');
    const box = document.getElementById('searchResults');
    if (!input || !box) return;
    const run = U.debounce(() => {
      const q = input.value.trim();
      if (!q) { box.classList.remove('open'); searchIndex = []; return; }
      renderSearchResults(buildSearchResults(q));
    }, 130);

    input.addEventListener('input', run);
    input.addEventListener('focus', () => { if (input.value.trim()) run(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
      if (e.key === 'Enter') {
        const first = box.querySelector('[data-sr]');
        if (first) first.click();
      }
    });
  }

  /* ---------------- render ---------------- */
  function render(opts = {}) {
    if (!Store.db) return;
    const scrollY = opts.keepScroll ? window.scrollY : 0;
    const route = currentRoute();
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `<div class="shell">
      ${sidebarHTML(route)}
      <div class="scrim" data-close-sidebar></div>
      <div class="main">
        ${topbarHTML()}
        <main class="view" id="view"></main>
      </div>
    </div>`;

    const viewEl = document.getElementById('view');
    const view = Views[route] || Views.dashboard;
    try {
      viewEl.innerHTML = view.render();
      if (view.mount) view.mount(viewEl);
    } catch (err) {
      console.error(err);
      viewEl.innerHTML = `<div class="card">${UI.empty({
        icon: 'alert',
        title: 'Não foi possível abrir esta tela',
        text: U.esc(err && err.message ? err.message : 'Erro inesperado.'),
        action: `<button class="btn btn-primary" data-route="dashboard">Voltar à visão geral</button>`
      })}</div>`;
    }

    document.body.classList.remove('sidebar-open');
    bindSearch();
    I18n.apply(app);
    I18n.start();
    if (opts.keepScroll) window.scrollTo(0, scrollY);
  }

  function refresh() {
    if (!Store.db) return;
    render({ keepScroll: true });
  }

  /* ---------------- ações globais ---------------- */
  function bindGlobalActions() {
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) {
        const box = document.getElementById('searchResults');
        if (box) box.classList.remove('open');
      }

      const routeBtn = e.target.closest('[data-route]');
      if (routeBtn && !e.target.closest('.modal')) {
        go(routeBtn.dataset.route);
        return;
      }

      if (e.target.closest('[data-open-sidebar]')) {
        document.body.classList.add('sidebar-open');
        return;
      }
      if (e.target.closest('[data-close-sidebar]')) {
        document.body.classList.remove('sidebar-open');
        return;
      }
      if (e.target.closest('[data-theme-toggle]')) {
        toggleTheme();
        return;
      }
      if (e.target.closest('[data-access-toggle]')) {
        if (Store.canSeeMoney()) {
          Modals.lockAccess();
        } else {
          Modals.unlockAccess();
        }
        return;
      }
      if (e.target.closest('[data-install-app]')) {
        Install.requestInstall();
        return;
      }

      const action = e.target.closest('[data-action]');
      if (!action) return;
      const type = action.dataset.action;
      if (type === 'new-appt') Modals.appointment();
      else if (type === 'new-client') Modals.client();
      else if (type === 'new-service') Modals.service();
      else if (type === 'new-pro') Modals.professional();
      else if (type === 'new-block') Modals.block();
      else if (type === 'new-waitlist') Modals.waitlist();
      else if (type === 'print') window.print();
      else if (type === 'go') go(action.dataset.route);
    });

    document.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('globalSearch');
        if (input) input.focus();
        return;
      }
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (Store.db) Modals.appointment();
        return;
      }
      if (e.key === 'Escape') {
        document.body.classList.remove('sidebar-open');
        const box = document.getElementById('searchResults');
        if (box) box.classList.remove('open');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) document.body.classList.remove('sidebar-open');
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        if (Store.db && Store.settings().theme === 'system') {
          applyChrome();
          refresh();
        }
      };
      if (mq.addEventListener) mq.addEventListener('change', handler);
    }
  }

  /* ---------------- ciclo de vida ---------------- */
  function afterOnboarding() {
    ui.agenda.date = U.todayISO();
    ui.agenda.view = 'day';
    ui.agenda.pro = 'all';
    ui.agenda.status = 'all';
    ui.finance.tab = 'all';
    ui.finance.period = 'month';
    applyLanguage();
    applyChrome();
    if (location.hash !== '#/dashboard') {
      history.replaceState(null, '', '#/dashboard');
    }
    render();
    Install.maybeWelcome();
  }

  function registerSW() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker não registrado:', err && err.message);
    });
  }

  function init() {
    bindGlobalActions();
    Install.init();
    Install.onChange(() => {
      if (!Store.db || document.body.classList.contains('modal-open')) return;
      refresh();
    });

    const hasData = Store.init();
    applyLanguage();
    if (!hasData || !Store.db || !Store.db.settings.onboarded) {
      const app = document.getElementById('app');
      if (app) app.innerHTML = '';
      Onboarding.show();
      return;
    }

    applyChrome();
    if (!location.hash) history.replaceState(null, '', '#/dashboard');
    render();
    registerSW();
    Install.maybeWelcome();

    window.addEventListener('hashchange', () => {
      if (!Store.db) return;
      if (location.hash === '#/finance' && !Store.canSeeMoney()) {
        history.replaceState(null, '', '#/dashboard');
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    ui, go, render, refresh, applyChrome, afterOnboarding, init,
    setLanguage, applyLanguage, currentLang,
    get route() { return currentRoute(); }
  };
})();
