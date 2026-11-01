/* ==========================================================================
   View — Visão geral (dashboard)
   ========================================================================== */
window.Views = window.Views || {};

window.Views.dashboard = (() => {

  const statCard = (icon, tone, label, value, foot) => `
    <div class="stat">
      <div class="stat-top">
        <div class="stat-icon ${tone}">${Icon(icon, 17)}</div>
        <span class="stat-label">${label}</span>
      </div>
      <div class="stat-value">${value}</div>
      <div class="stat-foot">${foot}</div>
    </div>`;

  function render() {
    const s = Store.settings();
    const today = U.todayISO();
    const canMoney = Store.canSeeMoney();
    const todayAppts = Store.appointmentsOn(today, { includeCancelled: true });
    const activeToday = todayAppts.filter(a => a.status !== 'cancelado');
    const confirmed = activeToday.filter(a => a.status === 'confirmado').length;
    const toConfirm = activeToday.filter(a => a.status === 'agendado').length;
    const occ = Store.occupancy(today);
    const monthStart = U.iso(U.startOfMonth(today));
    const monthEnd = U.iso(U.endOfMonth(today));
    const stats = Store.stats(monthStart, monthEnd);
    const next = Store.nextAppointment();
    const nextClient = next ? Store.getClient(next.clientId) : null;
    const nextService = next ? Store.getService(next.serviceId) : null;
    const nextPro = next ? Store.getPro(next.professionalId) : null;
    const owner = Store.db.professionals[0];
    const firstName = owner ? owner.name.replace(/^(dra?\.?|sr\.?a?\.?)\s+/i, '').split(' ')[0] : s.businessName;

    const days = Array.from({ length: 7 }, (_, i) => U.addDays(today, i));
    const dayCounts = days.map(d => Store.appointmentsOn(U.iso(d), { includeCancelled: false }).filter(a => a.status !== 'faltou').length);
    const maxCount = Math.max(1, ...dayCounts);

    const birthdays = Store.birthdaysThisMonth().slice(0, 4);
    const pendingFrom = U.iso(U.addDays(today, -180));
    const pendingList = Store.filterAppointments({ from: pendingFrom, to: today })
      .filter(a => a.status === 'concluido' && !a.paid)
      .sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
    const pendingTotal = U.sum(pendingList, a => Store.servicePrice(a));
    const checkins = Store.checkedInToday().length;
    const waiting = Store.waitingToday().length;
    const waitlist = Store.waitlistEntries();
    const checkedIn = a => Store.isCheckedIn(a);

    const timeline = activeToday.length
      ? activeToday.map(a => {
        const c = Store.getClient(a.clientId);
        const svc = Store.getService(a.serviceId);
        const p = Store.getPro(a.professionalId);
        const color = svc ? svc.color : (p ? p.color : s.accent);
        const canCheck = a.date === today && !['concluido', 'cancelado', 'faltou'].includes(a.status);
        return `<div class="tl-item" data-appt="${a.id}">
          <div class="tl-time"><strong>${a.start}</strong><span>${a.duration}min</span></div>
          <div class="tl-bar" style="background:${color}"></div>
          <div class="tl-main">
            <div class="name">${U.esc(c ? c.name : 'Cliente removido')}</div>
            <div class="meta">${U.esc(svc ? svc.name : '—')} · ${U.esc(p ? p.name : '—')}</div>
          </div>
          <div class="tl-actions">
            ${canCheck ? (checkedIn(a)
          ? `<span class="checkin-pill" title="Check-in realizado">${Icon('userCheck', 12)} Chegou</span>`
          : `<button class="btn btn-sm btn-soft" data-checkin-appt="${a.id}" title="Registrar chegada">${Icon('userCheck', 13)} Check-in</button>`) : ''}
            ${UI.statusBadge(a.status)}
          </div>
        </div>`;
      }).join('')
      : `<div class="tl-empty">
          <div class="empty-ico">${Icon('calendar', 20)}</div>
          <div>Nenhum atendimento hoje.</div>
          <button class="btn btn-sm btn-soft" data-action="new-appt" style="margin-top:10px">${Icon('plus', 14)} Agendar agora</button>
        </div>`;

    return `
    <div class="page">
      <div class="hero">
        <div class="hero-grid">
          <div style="min-width:0;flex:1">
            <div class="row" style="gap:7px;opacity:.92;font-size:11px;font-weight:750;letter-spacing:.1em;text-transform:uppercase">
              ${Icon('sparkles', 14)} ${U.fmtDateFull(new Date())}
            </div>
            <h2 style="margin-top:8px">Olá, ${U.esc(firstName)}! 👋</h2>
            <p>${activeToday.length
        ? `${activeToday.length} ${activeToday.length === 1 ? 'atendimento' : 'atendimentos'} hoje · ${confirmed} confirmado(s)${toConfirm ? ` · ${toConfirm} a confirmar` : ''}`
        : 'Seu dia está livre. Aproveite para organizar os próximos atendimentos.'}</p>
            <div class="hero-actions">
              <button class="btn hero-solid" data-action="new-appt">${Icon('plus', 16)} ${U.esc(s.labels.newAppt)}</button>
              <button class="btn" data-action="go" data-route="agenda">${Icon('calendar', 16)} Ver agenda</button>
            </div>
          </div>
          <div class="hero-next">
            <div class="hn-label">Próximo atendimento</div>
            ${next ? `
              <div class="hn-name">${U.esc(nextClient ? nextClient.name : 'Cliente')}</div>
              <div class="hn-meta">${U.relDay(next.date)} às ${next.start} · ${U.esc(nextService ? nextService.name : '')}</div>
              <div class="hn-meta" style="opacity:.75">${U.esc(nextPro ? nextPro.name : '')}</div>
            ` : `
              <div class="hn-name">Agenda livre</div>
              <div class="hn-meta">Nenhum atendimento futuro marcado.</div>
            `}
          </div>
        </div>
      </div>

      <div class="stat-grid">
        ${statCard('calendar', 'blue', 'Atendimentos hoje', activeToday.length, `<b>${confirmed}</b> confirmados · <b>${toConfirm}</b> a confirmar`)}
        ${statCard('chart', '', 'Ocupação de hoje', occ.pct + '%', `<b>${(occ.booked / 60).toFixed(1)}h</b> de ${(occ.available / 60).toFixed(1)}h disponíveis`)}
        ${canMoney
        ? statCard('wallet', 'green', 'Faturamento do mês', Store.money(stats.paidTotal), `A receber <b>${Store.money(stats.pendingTotal)}</b>`)
        : statCard('userCheck', 'green', 'Check-ins de hoje', checkins, `<b>${waiting}</b> aguardando chegada`)}
        ${canMoney
        ? statCard('trend', 'amber', 'Ticket médio', Store.money(stats.ticket), `<b>${stats.done.length}</b> atendimentos concluídos`)
        : statCard('list', 'amber', 'Lista de espera', waitlist.length, 'clientes aguardando encaixe')}
      </div>

      <div class="split">
        <div class="card">
          <div class="card-head">
            <h3>Agenda de hoje</h3>
            <span class="badge badge-neutral">${activeToday.length}</span>
            <div class="spacer"></div>
            <button class="btn btn-sm btn-ghost" data-action="go" data-route="agenda">Ver completa ${Icon('arrowRight', 14)}</button>
          </div>
          <div class="card-body" style="padding-top:4px;padding-bottom:4px">
            <div class="timeline">${timeline}</div>
          </div>
        </div>

        <div class="stack">
          <div class="card">
            <div class="card-head">
              <h3>Próximos 7 dias</h3>
              <div class="spacer"></div>
              <span class="tiny muted">${U.sum(dayCounts)} agendamentos</span>
            </div>
            <div class="card-body" style="padding-top:8px">
              <div class="bars">
                ${days.map((d, i) => {
          const h = Math.max(3, Math.round(dayCounts[i] / maxCount * 86));
          const isT = i === 0;
          return `<div class="bar-col" title="${U.fmtDateLong(d)}: ${dayCounts[i]}">
                    <span class="bar-val">${dayCounts[i] || ''}</span>
                    <div class="bar ${isT ? 'today' : ''}" style="height:${h}px"></div>
                    <span class="bar-lbl">${isT ? 'Hoje' : U.weekdayShort[d.getDay()]}</span>
                  </div>`;
        }).join('')}
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>Aniversariantes do mês</h3>
              <div class="spacer"></div>
              <span class="badge badge-accent">${Icon('gift', 12)} ${birthdays.length}</span>
            </div>
            <div class="card-body" style="padding-top:6px;padding-bottom:6px">
              ${birthdays.length ? `<div class="list">
                ${birthdays.map(c => `<div class="list-item" data-client="${c.id}" style="cursor:pointer">
                  <div class="tl-time" style="width:38px"><strong style="font-size:12px">${U.toDate(c.birthdate).getDate()}</strong><span>${U.monthShort[U.toDate(c.birthdate).getMonth()]}</span></div>
                  <div class="li-main"><strong>${U.esc(c.name)}</strong><span>${U.esc(c.phone || 'Sem telefone')}</span></div>
                  <div class="li-end">${Icon('gift', 16)}</div>
                </div>`).join('')}
              </div>` : `<div class="tl-empty" style="padding:16px">Nenhum aniversariante este mês.</div>`}
            </div>
          </div>

          ${canMoney ? `<div class="card">
            <div class="card-head">
              <h3>Pagamentos pendentes</h3>
              <div class="spacer"></div>
              <span class="strong" style="font-size:13px;color:${pendingTotal ? 'var(--amber)' : 'inherit'}">${Store.money(pendingTotal)}</span>
            </div>
            <div class="card-body" style="padding-top:6px;padding-bottom:6px">
              ${pendingList.length ? `<div class="list">
                ${pendingList.slice(0, 3).map(a => {
          const c = Store.getClient(a.clientId);
          return `<div class="list-item" data-appt="${a.id}" style="cursor:pointer">
                    <div class="li-main"><strong>${U.esc(c ? c.name : 'Cliente')}</strong><span>${U.fmtDate(a.date)} · ${U.esc(Store.serviceLabel(Store.getService(a.serviceId)))}</span></div>
                    <div class="li-end strong">${Store.money(Store.servicePrice(a))}</div>
                  </div>`;
        }).join('')}
              </div>
              <div style="padding-top:8px"><button class="btn btn-sm btn-soft btn-block" data-action="go" data-route="finance">Ver financeiro</button></div>`
        : `<div class="tl-empty" style="padding:14px">Tudo em dia! 🎉</div>`}
            </div>
          </div>` : `<div class="card">
            <div class="card-head">
              <h3>Lista de espera</h3>
              <div class="spacer"></div>
              <span class="badge ${waitlist.length ? 'badge-amber' : 'badge-neutral'}">${waitlist.length}</span>
            </div>
            <div class="card-body" style="padding-top:6px;padding-bottom:6px">
              ${waitlist.length ? `<div class="list">
                ${waitlist.slice(0, 3).map(w => {
          const wc = Store.getClient(w.clientId);
          const per = w.period === 'manha' ? 'manhã' : w.period === 'tarde' ? 'tarde' : 'qualquer horário';
          return `<div class="list-item waitlist-mini">
                    <div class="li-main"><strong>${U.esc(wc ? wc.name : 'Cliente')}${w.priority === 'alta' ? ` <span class="mini-flag">prioridade</span>` : ''}</strong><span>${U.esc(Store.serviceLabel(Store.getService(w.serviceId)))} · ${U.esc(per)}</span></div>
                    <div class="li-end">${Icon('phone', 13)}</div>
                  </div>`;
        }).join('')}
              </div>
              <div style="padding-top:8px"><button class="btn btn-sm btn-soft btn-block" data-action="go" data-route="waitlist">Ver lista de espera</button></div>`
        : `<div class="tl-empty" style="padding:14px">Nenhum cliente aguardando encaixe.</div>`}
            </div>
          </div>`}
        </div>
      </div>
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-checkin-appt]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        Modals.checkIn(btn.dataset.checkinAppt);
      });
    });
    el.querySelectorAll('[data-appt]').forEach(node => {
      node.addEventListener('click', e => {
        if (e.target.closest('[data-action], [data-checkin-appt]')) return;
        Modals.appointmentDetails(node.dataset.appt);
      });
    });
    el.querySelectorAll('[data-client]').forEach(node => {
      node.addEventListener('click', () => Modals.clientDetails(node.dataset.client));
    });
  }

  return { render, mount };
})();
