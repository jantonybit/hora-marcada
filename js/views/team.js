/* ==========================================================================
   View — Equipe / profissionais / bloqueios
   ========================================================================== */
window.Views = window.Views || {};

window.Views.team = (() => {

  function render() {
    const s = Store.settings();
    const pros = Store.db.professionals.slice().sort((a, b) => (b.active !== false) - (a.active !== false) || a.name.localeCompare(b.name, 'pt-BR'));
    const today = U.todayISO();
    const blocks = Store.db.blocks.filter(b => b.date >= today).sort((a, b) => (a.date + (a.start || '')).localeCompare(b.date + (b.start || '')));

    const cards = pros.map(p => {
      const svcCount = (p.services || []).length;
      const hoursPills = p.hours.map((h, d) => `<span class="pro-hour-pill ${h.active ? '' : 'off'}" title="${U.weekdayLong[d]}">${U.weekdayShort[d]} ${h.active ? h.open + '–' + h.close : '—'}</span>`).join('');
      return `<div class="pro-card" data-pro-card data-pro="${p.id}" style="cursor:pointer;${p.active === false ? 'opacity:.6' : ''}">
        <div class="pc-top">
          ${UI.avatar(p.name, p.color)}
          <div style="min-width:0;flex:1">
            <div class="pc-name">${U.esc(p.name)}</div>
            <div class="pc-role">${U.esc(p.role || s.labels.pro)}</div>
          </div>
          ${p.active === false ? '<span class="badge badge-neutral">Inativo</span>' : '<span class="badge badge-confirmado"><i class="dot"></i>Ativo</span>'}
        </div>
        <div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${U.esc(p.phone || p.email || 'Sem contato cadastrado')}
        </div>
        <div class="row between" style="font-size:12px">
          <span class="muted">${U.esc(s.labels.services)}</span>
          <strong>${svcCount ? svcCount + ' selecionado(s)' : 'Todos'}</strong>
        </div>
        <div class="pro-hours">${hoursPills}</div>
        <div class="row" style="gap:6px;border-top:1px solid var(--border);padding-top:10px">
          <button class="btn btn-sm" data-edit-pro="${p.id}">${Icon('edit', 14)} Editar</button>
          <button class="btn btn-sm btn-soft" data-pro-agenda="${p.id}">${Icon('calendar', 14)} Agenda</button>
          <div class="spacer"></div>
          <button class="icon-btn sm plain danger" data-del-pro="${p.id}" title="Excluir profissional">${Icon('trash', 15)}</button>
        </div>
      </div>`;
    }).join('');

    const blockRows = blocks.map(b => {
      const p = b.professionalId === 'all' ? null : Store.getPro(b.professionalId);
      return `<div class="list-item">
        <div class="tl-time" style="width:56px">
          <strong style="font-size:12px">${U.fmtDate(b.date)}</strong>
          <span>${b.allDay ? 'dia' : b.start}</span>
        </div>
        <div class="li-main">
          <strong>${U.esc(b.reason || 'Horário bloqueado')}</strong>
          <span>${U.esc(p ? p.name : 'Todos os profissionais')} · ${b.allDay ? 'Dia inteiro' : b.start + '–' + b.end} · ${U.relDay(b.date)}</span>
        </div>
        <button class="icon-btn sm plain" data-edit-block="${b.id}" title="Editar bloqueio">${Icon('edit', 15)}</button>
      </div>`;
    }).join('');

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <div class="row" style="gap:8px">
            <h2 style="font-size:17px">${U.esc(s.labels.team)}</h2>
            <span class="badge badge-neutral">${pros.length}</span>
          </div>
          <p class="small muted" style="margin-top:2px">Profissionais, horários de trabalho e bloqueios.</p>
        </div>
        <div class="spacer"></div>
        <div class="row wrap" style="gap:8px">
          <button class="btn" data-action="new-block">${Icon('lock', 16)} Bloquear horário</button>
          <button class="btn btn-primary" data-action="new-pro">${Icon('plus', 16)} Novo profissional</button>
        </div>
      </div>

      ${pros.length ? `<div class="pro-grid">${cards}</div>` : `<div class="card">${UI.empty({
      icon: 'team',
      title: 'Nenhum profissional cadastrado',
      text: 'Cadastre quem atende para distribuir os horários na agenda.',
      action: `<button class="btn btn-primary" data-action="new-pro">${Icon('plus', 16)} Cadastrar profissional</button>`
    })}</div>`}

      <div class="split">
        <div class="card">
          <div class="card-head">
            <h3>Bloqueios futuros</h3>
            <div class="spacer"></div>
            <button class="btn btn-sm btn-soft" data-action="new-block">${Icon('plus', 14)} Adicionar</button>
          </div>
          <div class="card-body" style="padding-top:6px;padding-bottom:6px">
            ${blocks.length ? `<div class="list">${blockRows}</div>` : `<div class="tl-empty">Nenhum bloqueio futuro. Use para almoço, folgas, feriados ou compromissos.</div>`}
          </div>
        </div>

        <div class="card card-pad">
          <div class="row" style="gap:9px;margin-bottom:8px">
            <div class="stat-icon amber">${Icon('alert', 17)}</div>
            <h3 style="font-size:14px">Como funciona</h3>
          </div>
          <div class="stack sm small muted" style="line-height:1.55">
            <p><strong style="color:var(--text)">Horário de trabalho:</strong> define quando cada profissional aparece na agenda e quais horários ficam disponíveis.</p>
            <p><strong style="color:var(--text)">Bloqueios:</strong> removem um período específico da disponibilidade, sem alterar o horário padrão.</p>
            <p><strong style="color:var(--text)">Serviços:</strong> ao limitar, o profissional só recebe os serviços marcados.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-pro-card]').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        Modals.professional(card.dataset.pro);
      });
    });

    el.querySelectorAll('[data-edit-pro]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      Modals.professional(b.dataset.editPro);
    }));

    el.querySelectorAll('[data-pro-agenda]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      App.ui.agenda.date = U.todayISO();
      App.ui.agenda.view = 'day';
      App.ui.agenda.pro = b.dataset.proAgenda;
      App.go('agenda');
    }));

    el.querySelectorAll('[data-edit-block]').forEach(b => b.addEventListener('click', () => Modals.block(b.dataset.editBlock)));

    el.querySelectorAll('[data-del-pro]').forEach(b => b.addEventListener('click', async e => {
      e.stopPropagation();
      const id = b.dataset.delPro;
      const p = Store.getPro(id);
      if (!p) return;
      const future = Store.db.appointments.filter(a =>
        a.professionalId === id && a.date >= U.todayISO() && ['agendado', 'confirmado'].includes(a.status)
      );
      if (future.length) {
        UI.toast(`${p.name} tem ${future.length} agendamento(s) futuro(s). Cancele ou transfira antes de excluir.`, 'warn', 4500);
        return;
      }
      const ok = await UI.confirm({
        title: 'Excluir profissional',
        message: `Remover <strong>${U.esc(p.name)}</strong>? O histórico de atendimentos é mantido.`,
        confirmText: 'Excluir',
        danger: true
      });
      if (!ok) return;
      const i = Store.db.professionals.findIndex(x => x.id === id);
      if (i >= 0) Store.db.professionals.splice(i, 1);
      Store.save();
      App.refresh();
      UI.toast('Profissional excluído.', 'success');
    }));
  }

  return { render, mount };
})();
