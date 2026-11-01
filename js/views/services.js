/* ==========================================================================
   View — Serviços
   ========================================================================== */
window.Views = window.Views || {};

window.Views.services = (() => {
  const st = () => App.ui.services;

  function render() {
    const s = Store.settings();
    const canMoney = Store.canSeeMoney();
    const services = Store.db.services.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const categories = [...new Set(services.map(x => x.category).filter(Boolean))];
    const activeCount = services.filter(x => x.active !== false).length;
    const avgPrice = services.length ? U.sum(services, x => Number(x.price) || 0) / services.length : 0;

    const cards = services.map(svc => {
      const search = U.normalize([svc.name, svc.category, svc.description].join(' '));
      return `<div class="pro-card" data-service-card data-service="${svc.id}" data-cat="${U.esc(svc.category || '')}" data-search="${U.esc(search)}" style="cursor:pointer;${svc.active === false ? 'opacity:.6' : ''}">
        <div class="pc-top">
          <div class="stat-icon" style="background:color-mix(in srgb, ${svc.color} 16%, transparent);color:${svc.color}">${Icon('scissors', 17)}</div>
          <div style="min-width:0;flex:1">
            <div class="pc-name">${U.esc(svc.name)}</div>
            <div class="pc-role">${U.esc(svc.category || 'Sem categoria')}</div>
          </div>
          ${svc.active === false ? '<span class="badge badge-neutral">Inativo</span>' : ''}
        </div>
        <div class="row between" style="font-size:12px">
          <span class="muted">Duração</span>
          <strong>${svc.duration} min</strong>
        </div>
        ${canMoney ? `<div class="row between" style="font-size:12px">
          <span class="muted">Valor</span>
          <strong>${Store.money(svc.price)}</strong>
        </div>` : ''}
        ${svc.buffer ? `<div class="row between" style="font-size:12px"><span class="muted">Intervalo</span><strong>+${svc.buffer} min</strong></div>` : ''}
        ${svc.description ? `<p class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${U.esc(svc.description)}</p>` : ''}
      </div>`;
    }).join('');

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <div class="row" style="gap:8px">
            <h2 style="font-size:17px">${U.esc(s.labels.services)}</h2>
            <span class="badge badge-neutral" id="servicesCount">${services.length}</span>
            <span class="badge badge-confirmado">${activeCount} ativos</span>
          </div>
          <p class="small muted" style="margin-top:2px">Duração e cor na agenda.${canMoney ? ` Ticket médio: <strong>${Store.money(avgPrice)}</strong>` : ''}</p>
        </div>
        <div class="spacer"></div>
        <div class="row wrap" style="gap:8px">
          <div class="search-wrap" style="width:200px;display:block">
            <span class="search-icon">${Icon('search', 16)}</span>
            <input class="search-input" id="serviceSearch" placeholder="Buscar serviço..." autocomplete="off">
          </div>
          ${categories.length ? `<select class="select input-sm" id="serviceCat" style="width:auto">
            <option value="all">Todas as categorias</option>
            ${categories.map(c => `<option value="${U.esc(c)}">${U.esc(c)}</option>`).join('')}
          </select>` : ''}
          <button class="btn btn-primary" data-action="new-service">${Icon('plus', 16)} Novo</button>
        </div>
      </div>

      ${services.length ? `
        <div class="pro-grid" id="servicesGrid">${cards}</div>
        <div class="card hidden" id="servicesNoResult">${UI.empty({ icon: 'search', title: 'Nenhum resultado', text: 'Tente outro nome ou categoria.' })}</div>
      ` : `<div class="card">${UI.empty({
      icon: 'scissors',
      title: `Nenhum ${s.labels.service.toLowerCase()} cadastrado`,
      text: 'Cadastre os serviços com duração e valor para agilizar os agendamentos.',
      action: `<button class="btn btn-primary" data-action="new-service">${Icon('plus', 16)} Cadastrar ${U.esc(s.labels.service.toLowerCase())}</button>`
    })}</div>`}
    </div>`;
  }

  function mount(el) {
    const search = el.querySelector('#serviceSearch');
    const cat = el.querySelector('#serviceCat');
    const grid = el.querySelector('#servicesGrid');
    const noResult = el.querySelector('#servicesNoResult');
    const count = el.querySelector('#servicesCount');

    const filter = () => {
      if (!grid) return;
      const q = U.normalize(search ? search.value : '').trim();
      const c = cat ? cat.value : 'all';
      let shown = 0;
      grid.querySelectorAll('[data-service-card]').forEach(card => {
        const okQ = !q || q.split(/\s+/).every(t => card.dataset.search.includes(t));
        const okC = c === 'all' || card.dataset.cat === c;
        const ok = okQ && okC;
        card.classList.toggle('hidden', !ok);
        if (ok) shown++;
      });
      if (count) count.textContent = shown;
      if (noResult) noResult.classList.toggle('hidden', shown > 0);
    };

    if (search) search.addEventListener('input', U.debounce(filter, 120));
    if (cat) cat.addEventListener('change', filter);

    el.querySelectorAll('[data-service-card]').forEach(card => {
      card.addEventListener('click', () => Modals.service(card.dataset.service));
    });
  }

  return { render, mount };
})();
