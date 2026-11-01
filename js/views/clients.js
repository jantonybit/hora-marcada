/* ==========================================================================
   View — Clientes
   ========================================================================== */
window.Views = window.Views || {};

window.Views.clients = (() => {
  const st = () => App.ui.clients;

  function render() {
    const s = Store.settings();
    const canMoney = Store.canSeeMoney();
    const clients = Store.db.clients.slice();
    const month = new Date().getMonth();
    const newThisMonth = clients.filter(c => c.createdAt && new Date(c.createdAt).getMonth() === month).length;

    const sorted = clients.sort((a, b) => {
      if (st().sort === 'recent') {
        const la = Store.clientSummary(a.id).lastVisit || '';
        const lb = Store.clientSummary(b.id).lastVisit || '';
        return lb.localeCompare(la);
      }
      if (canMoney && st().sort === 'spent') return Store.clientSummary(b.id).spent - Store.clientSummary(a.id).spent;
      if (st().sort === 'newest') return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      return a.name.localeCompare(b.name, 'pt-BR');
    });

    const cards = sorted.map(c => {
      const sum = Store.clientSummary(c.id);
      const search = U.normalize([c.name, c.phone, c.email, (c.tags || []).join(' ')].join(' '));
      return `<div class="client-card" data-client-card data-client="${c.id}" data-search="${U.esc(search)}">
        <div class="cc-top">
          ${UI.avatar(c.name, null)}
          <div style="min-width:0;flex:1">
            <div class="cc-name">${U.esc(c.name)}</div>
            <div class="cc-meta">${U.esc(c.phone || c.email || 'Sem contato')}</div>
          </div>
          ${sum.next ? `<span class="badge badge-accent" title="Próximo agendamento">${U.fmtDate(sum.next.date)}</span>` : ''}
        </div>
        ${(c.tags || []).length ? `<div class="chips">${c.tags.slice(0, 3).map(t => `<span class="chip chip-static" style="height:23px;font-size:10.5px">${U.esc(t)}</span>`).join('')}</div>` : ''}
        <div class="cc-foot">
          <span>${sum.visits ? `Último: ${U.fmtDate(sum.lastVisit)}` : 'Sem atendimentos'}</span>
          ${canMoney ? `<span><b>${Store.money(sum.spent)}</b></span>` : `<span>${sum.visits} ${sum.visits === 1 ? 'visita' : 'visitas'}</span>`}
        </div>
      </div>`;
    }).join('');

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <div class="row" style="gap:8px">
            <h2 style="font-size:17px">${U.esc(s.labels.clients)}</h2>
            <span class="badge badge-neutral" id="clientsCount">${clients.length}</span>
            ${newThisMonth ? `<span class="badge badge-confirmado">+${newThisMonth} este mês</span>` : ''}
          </div>
          <p class="small muted" style="margin-top:2px">Cadastro, contato e histórico de atendimentos.</p>
        </div>
        <div class="spacer"></div>
        <div class="row wrap" style="gap:8px">
          <div class="search-wrap" style="width:220px;display:block">
            <span class="search-icon">${Icon('search', 16)}</span>
            <input class="search-input" id="clientSearch" placeholder="Buscar ${U.esc(s.labels.client.toLowerCase())}..." autocomplete="off">
          </div>
          <select class="select input-sm" id="clientSort" style="width:auto">
            <option value="name" ${st().sort === 'name' ? 'selected' : ''}>Nome (A–Z)</option>
            <option value="recent" ${st().sort === 'recent' ? 'selected' : ''}>Último atendimento</option>
            ${canMoney ? `<option value="spent" ${st().sort === 'spent' ? 'selected' : ''}>Maior gasto</option>` : ''}
            <option value="newest" ${st().sort === 'newest' ? 'selected' : ''}>Cadastro recente</option>
          </select>
          <button class="btn btn-primary" data-action="new-client">${Icon('plus', 16)} Novo</button>
        </div>
      </div>

      ${clients.length ? `
        <div class="client-grid" id="clientsGrid">${cards}</div>
        <div class="card hidden" id="clientsNoResult">${UI.empty({ icon: 'search', title: 'Nenhum resultado', text: 'Tente outro nome, telefone ou tag.' })}</div>
      ` : `<div class="card">${UI.empty({
      icon: 'users',
      title: `Nenhum ${s.labels.client.toLowerCase()} cadastrado`,
      text: `Cadastre seus ${s.labels.clients.toLowerCase()} para agilizar os agendamentos e manter o histórico.`,
      action: `<button class="btn btn-primary" data-action="new-client">${Icon('plus', 16)} Cadastrar ${U.esc(s.labels.client.toLowerCase())}</button>`
    })}</div>`}
    </div>`;
  }

  function mount(el) {
    const search = el.querySelector('#clientSearch');
    const grid = el.querySelector('#clientsGrid');
    const noResult = el.querySelector('#clientsNoResult');
    const count = el.querySelector('#clientsCount');

    if (search && grid) {
      search.addEventListener('input', U.debounce(() => {
        const q = U.normalize(search.value).trim();
        let shown = 0;
        grid.querySelectorAll('[data-client-card]').forEach(card => {
          const ok = !q || q.split(/\s+/).every(term => card.dataset.search.includes(term));
          card.classList.toggle('hidden', !ok);
          if (ok) shown++;
        });
        if (count) count.textContent = shown;
        if (noResult) noResult.classList.toggle('hidden', shown > 0);
      }, 120));
    }

    const sort = el.querySelector('#clientSort');
    if (sort) sort.addEventListener('change', () => { st().sort = sort.value; App.refresh(); });

    el.querySelectorAll('[data-client-card]').forEach(card => {
      card.addEventListener('click', () => Modals.clientDetails(card.dataset.client));
    });
  }

  return { render, mount };
})();
