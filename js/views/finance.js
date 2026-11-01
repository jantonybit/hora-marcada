/* ==========================================================================
   View — Financeiro
   ========================================================================== */
window.Views = window.Views || {};

window.Views.finance = (() => {
  const st = () => App.ui.finance;

  function currentRange() {
    const state = st();
    const today = new Date();
    if (state.period === 'month') return { from: U.iso(U.startOfMonth(today)), to: U.iso(U.endOfMonth(today)) };
    if (state.period === 'last') {
      const m = U.addMonths(today, -1);
      return { from: U.iso(U.startOfMonth(m)), to: U.iso(U.endOfMonth(m)) };
    }
    if (state.period === '30d') return { from: U.iso(U.addDays(today, -29)), to: U.iso(today) };
    if (state.period === 'year') return { from: `${today.getFullYear()}-01-01`, to: `${today.getFullYear()}-12-31` };
    return {
      from: state.from || U.iso(U.addDays(today, -30)),
      to: state.to || U.iso(today)
    };
  }

  function chartPoints(series) {
    if (series.length <= 45) {
      return series.map(p => ({ label: U.fmtDate(p.date).slice(0, 5), total: p.total }));
    }
    const map = {};
    series.forEach(p => {
      const key = p.date.slice(0, 7);
      map[key] = (map[key] || 0) + p.total;
    });
    return Object.keys(map).sort().map(k => {
      const [y, m] = k.split('-').map(Number);
      return { label: `${U.monthShort[m - 1]}/${String(y).slice(2)}`, total: map[k] };
    });
  }

  function render() {
    if (!Store.canSeeMoney()) {
      return `<div class="page"><div class="card">${UI.empty({
        icon: 'lock',
        title: 'Financeiro protegido',
        text: 'Os valores financeiros estão ocultos no modo recepção. Desbloqueie com o PIN do gestor para acessar.',
        action: `<button class="btn btn-primary" data-access-toggle>${Icon('unlock', 16)} Desbloquear como gestor</button>`
      })}</div></div>`;
    }
    const s = Store.settings();
    const state = st();
    const { from, to } = currentRange();
    const stats = Store.stats(from, to, state.pro);
    const base = Store.filterAppointments({ from, to, proId: state.pro }).filter(a => a.status !== 'cancelado');

    const counts = {
      concluido: base.filter(a => a.status === 'concluido').length,
      pending: base.filter(a => a.status === 'concluido' && !a.paid).length,
      scheduled: base.filter(a => a.status === 'agendado' || a.status === 'confirmado').length,
      all: base.length
    };

    let list = base.slice();
    if (state.tab === 'concluido') list = list.filter(a => a.status === 'concluido');
    else if (state.tab === 'pending') list = list.filter(a => a.status === 'concluido' && !a.paid);
    else if (state.tab === 'scheduled') list = list.filter(a => a.status === 'agendado' || a.status === 'confirmado');
    list.sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));

    const points = chartPoints(Store.revenueSeries(from, to));
    const max = Math.max(1, ...points.map(p => p.total));
    const listTotal = U.sum(list, a => Store.servicePrice(a));
    const labelEvery = Math.max(1, Math.ceil(points.length / 14));

    const tabs = [
      { id: 'concluido', label: 'Concluídos', count: counts.concluido },
      { id: 'pending', label: 'A receber', count: counts.pending },
      { id: 'scheduled', label: 'Agendados', count: counts.scheduled },
      { id: 'all', label: 'Todos', count: counts.all }
    ];

    const rows = list.map(a => {
      const c = Store.getClient(a.clientId);
      const svc = Store.getService(a.serviceId);
      const p = Store.getPro(a.professionalId);
      const price = Store.servicePrice(a);
      const isDone = a.status === 'concluido';
      const action = isDone
        ? (a.paid
          ? `<span class="badge badge-confirmado"><i class="dot"></i>${U.esc(a.paymentMethod || 'Pago')}</span>`
          : `<button class="btn btn-sm btn-soft" data-receive="${a.id}">Receber</button>`)
        : (a.status === 'agendado' || a.status === 'confirmado'
          ? `<button class="btn btn-sm btn-soft" data-conclude="${a.id}">Concluir</button>`
          : UI.statusBadge(a.status));

      return `<tr data-appt="${a.id}" style="cursor:pointer">
        <td class="nowrap"><strong>${U.fmtDate(a.date)}</strong><div class="tiny muted">${a.start}</div></td>
        <td>
          <div class="strong" style="font-size:12.5px">${U.esc(c ? c.name : 'Cliente removido')}</div>
          <div class="tiny muted">${U.esc(c && c.phone ? c.phone : '')}</div>
        </td>
        <td>${U.esc(svc ? svc.name : '—')}</td>
        <td class="muted">${U.esc(p ? p.name : '—')}</td>
        <td>${UI.statusBadge(a.status)}</td>
        <td class="num strong">${Store.money(price)}</td>
        <td class="actions">${action}</td>
      </tr>`;
    }).join('');

    return `<div class="page">
      <div class="row wrap between" style="gap:10px">
        <div>
          <h2 style="font-size:17px">Financeiro</h2>
          <p class="small muted" style="margin-top:2px">${U.fmtDate(from)} a ${U.fmtDate(to)} · ${list.length} registro(s) na lista</p>
        </div>
        <div class="spacer"></div>
        <div class="row wrap" style="gap:8px">
          <select class="select input-sm" id="finPeriod" style="width:auto">
            <option value="month" ${state.period === 'month' ? 'selected' : ''}>Este mês</option>
            <option value="last" ${state.period === 'last' ? 'selected' : ''}>Mês anterior</option>
            <option value="30d" ${state.period === '30d' ? 'selected' : ''}>Últimos 30 dias</option>
            <option value="year" ${state.period === 'year' ? 'selected' : ''}>Este ano</option>
            <option value="custom" ${state.period === 'custom' ? 'selected' : ''}>Personalizado</option>
          </select>
          <select class="select input-sm" id="finPro" style="width:auto">
            <option value="all" ${state.pro === 'all' ? 'selected' : ''}>Todos os profissionais</option>
            ${Store.activePros().map(p => `<option value="${p.id}" ${state.pro === p.id ? 'selected' : ''}>${U.esc(p.name)}</option>`).join('')}
          </select>
          <button class="btn btn-sm" id="finExport">${Icon('download', 15)} CSV</button>
        </div>
      </div>

      ${state.period === 'custom' ? `<div class="card card-pad row wrap" style="gap:10px;padding:12px 16px">
        <div class="field" style="max-width:180px"><label>De</label><input type="date" class="input input-sm" id="finFrom" value="${from}"></div>
        <div class="field" style="max-width:180px"><label>Até</label><input type="date" class="input input-sm" id="finTo" value="${to}"></div>
      </div>` : ''}

      <div class="stat-grid">
        <div class="stat">
          <div class="stat-top"><div class="stat-icon green">${Icon('money', 17)}</div><span class="stat-label">Recebido</span></div>
          <div class="stat-value">${Store.money(stats.paidTotal)}</div>
          <div class="stat-foot"><b>${stats.paid.length}</b> pagamento(s)</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-icon amber">${Icon('clock', 17)}</div><span class="stat-label">A receber</span></div>
          <div class="stat-value">${Store.money(stats.pendingTotal)}</div>
          <div class="stat-foot"><b>${stats.pending.length}</b> atendimento(s) concluído(s)</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-icon blue">${Icon('calendar', 17)}</div><span class="stat-label">Previsto (agendado)</span></div>
          <div class="stat-value">${Store.money(stats.scheduledTotal)}</div>
          <div class="stat-foot"><b>${stats.upcoming.length}</b> agendamento(s)</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-icon pink">${Icon('trend', 17)}</div><span class="stat-label">Ticket médio</span></div>
          <div class="stat-value">${Store.money(stats.ticket)}</div>
          <div class="stat-foot"><b>${stats.done.length}</b> atendimentos concluídos</div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>Recebimentos</h3>
          <span class="sub">${points.length > 45 ? 'por mês' : 'por dia'}</span>
          <div class="spacer"></div>
          <span class="strong" style="font-size:13px">${Store.money(stats.paidTotal)}</span>
        </div>
        <div class="card-body" style="padding-top:4px">
          ${points.some(p => p.total > 0) ? `<div class="finance-chart">
            ${points.map((p, i) => `<div class="fc-col" title="${p.label}: ${Store.money(p.total)}">
              <div class="fc-bar" style="height:${Math.max(2, Math.round(p.total / max * 100))}%"></div>
              <span class="fc-lbl">${i % labelEvery === 0 ? p.label : ''}</span>
            </div>`).join('')}
          </div>` : `<div class="tl-empty" style="padding:20px">Nenhum recebimento registrado no período.</div>`}
        </div>
      </div>

      <div class="card">
        <div class="card-head" style="padding-bottom:0;border-bottom:0;flex-wrap:wrap;gap:8px">
          <div class="tabs" style="border-bottom:0">
            ${tabs.map(t => `<button class="tab ${state.tab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label} <span class="tiny muted">${t.count}</span></button>`).join('')}
          </div>
          <div class="spacer"></div>
          <span class="small muted">Total na lista: <strong style="color:var(--text)">${Store.money(listTotal)}</strong></span>
        </div>
        <div class="table-wrap" style="border-top:1px solid var(--border)">
          ${list.length ? `<table class="table">
            <thead><tr>
              <th>Data</th><th>Cliente</th><th>${U.esc(s.labels.service)}</th><th>${U.esc(s.labels.pro)}</th><th>Status</th><th class="num">Valor</th><th class="actions">Pagamento</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>` : `<div class="empty" style="padding:38px">
            <div class="empty-icon">${Icon('wallet', 24)}</div>
            <h3>Nenhum registro</h3>
            <p>Não há atendimentos nesta seleção. Conclua atendimentos para gerar receita.</p>
          </div>`}
        </div>
      </div>
    </div>`;
  }

  function mount(el) {
    const state = st();

    const period = el.querySelector('#finPeriod');
    if (period) period.addEventListener('change', () => {
      state.period = period.value;
      if (state.period !== 'custom') { state.from = ''; state.to = ''; }
      App.refresh();
    });

    const pro = el.querySelector('#finPro');
    if (pro) pro.addEventListener('change', () => { state.pro = pro.value; App.refresh(); });

    const from = el.querySelector('#finFrom');
    const to = el.querySelector('#finTo');
    if (from) from.addEventListener('change', () => { state.from = from.value; App.refresh(); });
    if (to) to.addEventListener('change', () => { state.to = to.value; App.refresh(); });

    el.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      state.tab = b.dataset.tab;
      App.refresh();
    }));

    el.querySelectorAll('[data-receive]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      Modals.finish(b.dataset.receive);
    }));
    el.querySelectorAll('[data-conclude]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      Modals.finish(b.dataset.conclude);
    }));

    el.querySelectorAll('tr[data-appt]').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('button')) return;
        Modals.appointmentDetails(row.dataset.appt);
      });
    });

    const exportBtn = el.querySelector('#finExport');
    if (exportBtn) exportBtn.addEventListener('click', () => {
      const { from: f, to: t } = currentRange();
      let list = Store.filterAppointments({ from: f, to: t, proId: state.pro }).filter(a => a.status !== 'cancelado');
      if (state.tab === 'concluido') list = list.filter(a => a.status === 'concluido');
      else if (state.tab === 'pending') list = list.filter(a => a.status === 'concluido' && !a.paid);
      else if (state.tab === 'scheduled') list = list.filter(a => a.status === 'agendado' || a.status === 'confirmado');
      list.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
      const rows = list.map(a => {
        const c = Store.getClient(a.clientId);
        const svc = Store.getService(a.serviceId);
        const p = Store.getPro(a.professionalId);
        return [
          U.fmtDate(a.date), a.start, c ? c.name : '', svc ? svc.name : '', p ? p.name : '',
          Store.servicePrice(a).toFixed(2).replace('.', ','),
          Store.STATUS[a.status].label, a.paid ? 'Sim' : 'Não', a.paymentMethod || ''
        ];
      });
      const content = U.csv(['Data', 'Hora', 'Cliente', 'Serviço', 'Profissional', 'Valor', 'Status', 'Pago', 'Forma de pagamento'], rows);
      U.download(`hora-marcada-financeiro-${f}-a-${t}.csv`, content, 'text/csv;charset=utf-8', true);
      UI.toast('CSV exportado.', 'success');
    });
  }

  return { render, mount };
})();
