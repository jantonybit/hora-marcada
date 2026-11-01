/* ==========================================================================
   View — Lista de espera
   ========================================================================== */
window.Views = window.Views || {};

window.Views.waitlist = (() => {

  const periodLabel = p => p === 'manha' ? 'Manhã' : p === 'tarde' ? 'Tarde' : 'Qualquer horário';

  function entryCard(w) {
    const c = Store.getClient(w.clientId);
    const svc = Store.getService(w.serviceId);
    const pro = w.professionalId ? Store.getPro(w.professionalId) : null;
    const phone = c && c.phone ? c.phone : '';
    const when = w.date ? U.fmtDate(w.date) : 'Qualquer dia';
    const next = svc ? Store.nextAvailable(w.serviceId, w.professionalId, {
      period: w.period,
      from: w.date || U.todayISO(),
      days: 60
    }) : null;

    return `<div class="waitlist-card ${w.priority === 'alta' ? 'is-priority' : ''}" data-waitlist="${w.id}">
      <div class="wc-main">
        <div class="wc-top">
          ${UI.avatar(c ? c.name : 'Cliente', null)}
          <div style="min-width:0;flex:1">
            <div class="wc-name">${U.esc(c ? c.name : 'Cliente removido')}
              ${w.priority === 'alta' ? `<span class="badge badge-amber">${Icon('alert', 11)} Prioridade</span>` : ''}
            </div>
            <div class="wc-sub">${Icon('scissors', 12)} ${U.esc(svc ? svc.name : 'Serviço removido')}
              · ${Icon('clock', 12)} ${U.esc(periodLabel(w.period))}
              ${pro ? ` · ${U.esc(pro.name)}` : ''}
            </div>
            <div class="wc-sub">${Icon('calendar', 12)} ${U.esc(when)}${phone ? ` · ${Icon('phone', 12)} ${U.esc(phone)}` : ''}</div>
          </div>
          <div class="wc-side">
            ${c ? `<a class="icon-btn sm" href="${U.waLink(phone)}" target="_blank" rel="noopener" title="Abrir WhatsApp">${Icon('whatsapp', 16)}</a>` : ''}
            <button class="icon-btn sm" data-wl-edit="${w.id}" title="Editar entrada">${Icon('edit', 15)}</button>
            <button class="icon-btn sm plain danger" data-wl-remove="${w.id}" title="Remover da lista">${Icon('trash', 15)}</button>
          </div>
        </div>

        ${w.notes ? `<p class="wc-notes">${U.esc(w.notes)}</p>` : ''}

        <div class="wc-foot">
          ${next
        ? `<span class="wc-suggestion">${Icon('sparkles', 13)} Encaixe sugerido: <strong>${U.fmtDate(next.date)} às ${next.start}</strong> com ${U.esc(next.professional.name)}</span>`
        : `<span class="wc-suggestion muted">${Icon('calendar', 13)} Sem horário livre nos próximos 60 dias</span>`}
          <div class="spacer"></div>
          ${next ? `<button class="btn btn-sm btn-primary" data-wl-schedule="${w.id}">${Icon('calendarPlus', 14)} Agendar</button>` : ''}
        </div>
      </div>
    </div>`;
  }

  function render() {
    const entries = Store.waitlistEntries();
    const priority = entries.filter(w => w.priority === 'alta').length;

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <div class="row" style="gap:8px">
            <h2 style="font-size:17px">Lista de espera</h2>
            <span class="badge badge-neutral">${entries.length}</span>
            ${priority ? `<span class="badge badge-amber">${priority} com prioridade</span>` : ''}
          </div>
          <p class="small muted" style="margin-top:2px">Clientes que querem um horário. Encaixe quando vagar.</p>
        </div>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-action="new-waitlist">${Icon('plus', 16)} Adicionar à lista</button>
      </div>

      ${entries.length ? `<div class="waitlist-list">${entries.map(entryCard).join('')}</div>` : `<div class="card">${UI.empty({
      icon: 'list',
      title: 'Nenhum cliente na lista de espera',
      text: 'Registre quem procura um horário e avise ou encaixe assim que surgir uma vaga.',
      action: `<button class="btn btn-primary" data-action="new-waitlist">${Icon('plus', 16)} Adicionar cliente</button>`
    })}</div>`}
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-wl-edit]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        Modals.waitlist(b.dataset.wlEdit);
      });
    });

    el.querySelectorAll('[data-wl-remove]').forEach(b => {
      b.addEventListener('click', async e => {
        e.stopPropagation();
        const entry = Store.getWaitlist(b.dataset.wlRemove);
        const c = entry ? Store.getClient(entry.clientId) : null;
        const ok = await UI.confirm({
          title: 'Remover da lista de espera',
          message: `Remover <strong>${U.esc(c ? c.name : 'esta entrada')}</strong> da lista de espera?`,
          confirmText: 'Remover',
          danger: true
        });
        if (!ok) return;
        Store.removeWaitlist(b.dataset.wlRemove);
        App.refresh();
        UI.toast('Entrada removida da lista.', 'success');
      });
    });

    el.querySelectorAll('[data-wl-schedule]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        Modals.scheduleFromWaitlist(b.dataset.wlSchedule);
      });
    });
  }

  return { render, mount };
})();
