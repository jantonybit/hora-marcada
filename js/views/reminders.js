/* ==========================================================================
   View — Lembretes e confirmações
   ========================================================================== */
window.Views = window.Views || {};

window.Views.reminders = (() => {
  const st = () => App.ui.reminders;

  function render() {
    const s = Store.settings();
    const state = st();
    const today = U.todayISO();
    const end = state.tab === 'today' ? today : state.tab === '7d' ? U.iso(U.addDays(today, 7)) : U.iso(U.addDays(today, 365));

    const all = Store.filterAppointments({ from: today, to: end })
      .filter(a => a.status === 'agendado' || a.status === 'confirmado')
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

    const countToday = Store.filterAppointments({ from: today, to: today })
      .filter(a => a.status === 'agendado' || a.status === 'confirmado').length;
    const count7 = Store.filterAppointments({ from: today, to: U.iso(U.addDays(today, 7)) })
      .filter(a => a.status === 'agendado' || a.status === 'confirmado').length;

    const birthdays = Store.birthdaysThisMonth();
    const previewAppt = all[0] || null;
    const previewMsg = previewAppt ? Store.reminderMessage(previewAppt) : (s.reminderTemplate || '');
    const owner = Store.db.professionals[0];
    const pending = all.filter(a => a.status === 'agendado').length;

    const cards = all.map(a => {
      const c = Store.getClient(a.clientId);
      const svc = Store.getService(a.serviceId);
      const p = Store.getPro(a.professionalId);
      const msg = Store.reminderMessage(a);
      const phone = c ? c.phone : '';
      return `<div class="reminder-card" data-appt="${a.id}" style="cursor:pointer">
        <div class="tl-time" style="width:54px">
          <strong style="font-size:13px">${a.start}</strong>
          <span>${U.relDay(a.date)}</span>
        </div>
        ${UI.avatar(c ? c.name : '?', p ? p.color : null, 'avatar-sm')}
        <div class="rm-main">
          <div class="rm-name">${U.esc(c ? c.name : 'Cliente removido')}</div>
          <div class="rm-meta">${U.esc(svc ? svc.name : '—')} · ${U.esc(p ? p.name : '—')} · ${U.fmtDate(a.date)}</div>
        </div>
        <div class="rm-date">
          ${UI.statusBadge(a.status)}
        </div>
        <div class="row" style="gap:5px">
          <button class="btn btn-sm btn-ghost" data-copy-msg="${a.id}" title="Copiar mensagem">${Icon('copy', 14)}</button>
          ${phone ? `<a class="btn btn-sm btn-success" href="${U.waLink(phone, msg)}" target="_blank" rel="noopener" data-wa-link title="Enviar no WhatsApp">${Icon('whatsapp', 14)}</a>` : ''}
          ${a.status === 'agendado' ? `<button class="btn btn-sm btn-soft" data-confirm-appt="${a.id}">Confirmar</button>` : ''}
        </div>
      </div>`;
    }).join('');

    const tabs = [
      { id: 'today', label: 'Hoje', count: countToday },
      { id: '7d', label: 'Próximos 7 dias', count: count7 },
      { id: 'all', label: 'Todos os futuros', count: all.length }
    ];

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <h2 style="font-size:17px">Lembretes</h2>
          <p class="small muted" style="margin-top:2px">Confirme horários e reduza faltas com mensagens prontas.</p>
        </div>
        <div class="spacer"></div>
        <span class="badge badge-faltou">${Icon('bell', 12)} ${pending} aguardando confirmação</span>
      </div>

      <div class="card card-pad" style="background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 9%,var(--surface)),var(--surface))">
        <div class="row" style="gap:12px;align-items:flex-start">
          <div class="stat-icon" style="width:40px;height:40px">${Icon('whatsapp', 20)}</div>
          <div style="flex:1;min-width:0">
            <div class="row between wrap" style="gap:8px">
              <strong style="font-size:13.5px">Mensagem padrão de lembrete</strong>
              <button class="btn btn-sm btn-ghost" data-edit-template>${Icon('edit', 14)} Editar modelo</button>
            </div>
            <p class="small" style="color:var(--text-2);margin-top:4px;background:var(--surface);border:1px dashed var(--border-strong);border-radius:10px;padding:9px 11px;white-space:pre-wrap">${U.esc(previewMsg)}</p>
            <p class="tiny muted" style="margin-top:6px">Variáveis: {cliente} {servico} {profissional} {data} {hora} {valor} {negocio}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head" style="padding-bottom:0;border-bottom:0">
          <div class="tabs" style="border-bottom:0">
            ${tabs.map(t => `<button class="tab ${state.tab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label} <span class="tiny muted">${t.count}</span></button>`).join('')}
          </div>
          <div class="spacer"></div>
          <span class="tiny muted">${all.length} para lembrar</span>
        </div>
        <div class="card-body" style="padding-top:8px">
          ${all.length ? `<div class="stack sm">${cards}</div>` : `<div class="empty" style="padding:34px">
            <div class="empty-icon">${Icon('bell', 24)}</div>
            <h3>Nenhum lembrete pendente</h3>
            <p>Não há agendamentos aguardando confirmação neste período.</p>
          </div>`}
        </div>
      </div>

      ${birthdays.length ? `<div class="card">
        <div class="card-head">
          <h3>Aniversariantes do mês</h3>
          <div class="spacer"></div>
          <span class="badge badge-accent">${Icon('gift', 12)} ${birthdays.length}</span>
        </div>
        <div class="card-body" style="padding-top:6px;padding-bottom:6px">
          <div class="list">
            ${birthdays.map(c => {
      const msg = `Feliz aniversário, ${c.name}! 🎉 Desejamos um dia especial. — ${s.businessName}`;
      return `<div class="list-item">
                ${UI.avatar(c.name, null, 'avatar-sm')}
                <div class="li-main"><strong>${U.esc(c.name)}</strong><span>${U.fmtDate(c.birthdate)} · ${U.esc(c.phone || 'Sem telefone')}</span></div>
                <div class="row" style="gap:5px">
                  <button class="btn btn-sm btn-ghost" data-copy-bday="${U.esc(msg)}">${Icon('copy', 14)}</button>
                  ${c.phone ? `<a class="btn btn-sm btn-success" href="${U.waLink(c.phone, msg)}" target="_blank" rel="noopener">${Icon('whatsapp', 14)}</a>` : ''}
                </div>
              </div>`;
    }).join('')}
          </div>
        </div>
      </div>` : ''}
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      st().tab = b.dataset.tab;
      App.refresh();
    }));

    el.querySelectorAll('[data-appt]').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        Modals.appointmentDetails(card.dataset.appt);
      });
    });

    el.querySelectorAll('[data-confirm-appt]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      Store.setStatus(b.dataset.confirmAppt, 'confirmado');
      App.refresh();
      UI.toast('Agendamento confirmado.', 'success');
    }));

    el.querySelectorAll('[data-copy-msg]').forEach(b => b.addEventListener('click', async e => {
      e.stopPropagation();
      const a = Store.getAppt(b.dataset.copyMsg);
      if (!a) return;
      const ok = await U.copy(Store.reminderMessage(a));
      UI.toast(ok ? 'Mensagem copiada.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
    }));

    el.querySelectorAll('[data-wa-link]').forEach(a => a.addEventListener('click', e => e.stopPropagation()));

    el.querySelectorAll('[data-copy-bday]').forEach(b => b.addEventListener('click', async () => {
      const ok = await U.copy(b.dataset.copyBday);
      UI.toast(ok ? 'Mensagem copiada.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
    }));

    const editTpl = el.querySelector('[data-edit-template]');
    if (editTpl) editTpl.addEventListener('click', () => {
      App.ui.settings.tab = 'texts';
      App.go('settings');
    });
  }

  return { render, mount };
})();
