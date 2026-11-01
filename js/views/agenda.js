/* ==========================================================================
   View — Agenda (dia, semana e mês)
   ========================================================================== */
window.Views = window.Views || {};

window.Views.agenda = (() => {
  const PPM = 1.15; // pixels por minuto

  const st = () => App.ui.agenda;

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function filteredPros() {
    const state = st();
    let pros = Store.activePros();
    if (state.pro && state.pro !== 'all') {
      const one = Store.getPro(state.pro);
      if (one) pros = [one];
      else state.pro = 'all';
    }
    return pros;
  }

  function visibleAppointments(dateISO) {
    const state = st();
    return Store.appointmentsOn(dateISO, { proId: state.pro, status: state.status });
  }

  function computeRange(pros, dates) {
    let start = 24 * 60, end = 0;
    dates.forEach(d => {
      const dow = d.getDay();
      pros.forEach(p => {
        const wh = p.hours[dow];
        if (wh && wh.active) {
          start = Math.min(start, U.timeToMin(wh.open));
          end = Math.max(end, U.timeToMin(wh.close));
        }
      });
    });
    if (start >= end) { start = 8 * 60; end = 20 * 60; }
    start = Math.floor(start / 60) * 60;
    end = Math.ceil(end / 60) * 60;
    if (end - start < 6 * 60) end = Math.min(24 * 60, start + 6 * 60);
    return { start, end };
  }

  function nextOpenDay(fromISO) {
    for (let i = 1; i <= 60; i++) {
      const d = U.addDays(fromISO, i);
      if (Store.activePros().some(p => { const wh = p.hours[d.getDay()]; return wh && wh.active; })) return U.iso(d);
    }
    return null;
  }

  function apptColor(a) {
    const svc = Store.getService(a.serviceId);
    const p = Store.getPro(a.professionalId);
    return (svc && svc.color) || (p && p.color) || Store.settings().accent;
  }

  function apptBlock(a, range, opts = {}) {
    const c = Store.getClient(a.clientId);
    const svc = Store.getService(a.serviceId);
    const p = Store.getPro(a.professionalId);
    const startMin = U.timeToMin(a.start);
    const top = Math.max(0, (startMin - range.start) * PPM);
    const h = Math.max(24, Number(a.duration) * PPM);
    const compact = h < 38;
    const color = apptColor(a);
    const statusColor = (Store.STATUS[a.status] || {}).color || color;
    const lane = opts.lane != null ? opts.lane : 0;
    const lanes = opts.lanes || 1;
    const widthPct = 100 / lanes;
    const laneStyle = lanes > 1
      ? `left:calc(${lane * widthPct}% + 3px);width:calc(${widthPct}% - 6px);right:auto;`
      : '';

    return `<div class="appt ${compact ? 'compact' : ''} status-${a.status} ${Store.isCheckedIn(a) ? 'is-checked-in' : ''}"
      style="top:${top}px;height:${h}px;--appt-color:${color};${laneStyle}"
      data-appt="${a.id}"
      title="${U.esc((c ? c.name : 'Cliente') + ' · ' + (svc ? svc.name : '') + ' · ' + a.start + '–' + U.minToTime(startMin + a.duration) + ' · ' + (p ? p.name : ''))}">
      <div class="a-time"><span class="a-status-dot" style="background:${statusColor}"></span>${a.start}${h >= 54 ? '–' + U.minToTime(startMin + a.duration) : ''}${Store.isCheckedIn(a) ? ` <span class="a-checkin" title="Check-in realizado">${Icon('userCheck', 11)}</span>` : ''}</div>
      <div class="a-name">${U.esc(c ? c.name : 'Cliente removido')}</div>
      ${h >= 40 ? `<div class="a-svc">${U.esc(svc ? svc.name : '')}</div>` : ''}
    </div>`;
  }

  function blockBlock(b, range) {
    if (b.allDay) {
      return `<div class="block-appt" style="top:2px;height:${(range.end - range.start) * PPM - 4}px">${Icon('lock', 12)} ${U.esc(b.reason || 'Bloqueado')}</div>`;
    }
    const s = U.timeToMin(b.start);
    const e = U.timeToMin(b.end);
    return `<div class="block-appt" style="top:${(s - range.start) * PPM}px;height:${Math.max(18, (e - s) * PPM)}px">${U.esc(b.reason || 'Bloqueado')}</div>`;
  }

  function nowLine(range, dateISO) {
    if (dateISO !== U.todayISO()) return '';
    const n = U.nowMin();
    if (n < range.start || n > range.end) return '';
    return `<div class="now-line" style="top:${(n - range.start) * PPM}px"></div>`;
  }

  function layoutLanes(list) {
    const lanesEnd = [];
    const placed = [];
    list.slice().sort((a, b) => a.start.localeCompare(b.start)).forEach(a => {
      const s = U.timeToMin(a.start);
      const e = s + Number(a.duration);
      let lane = lanesEnd.findIndex(end => end <= s);
      if (lane < 0) { lane = lanesEnd.length; lanesEnd.push(e); }
      else lanesEnd[lane] = e;
      placed.push({ a, lane });
    });
    return { placed, lanes: Math.max(1, lanesEnd.length) };
  }

  /* ---------------- toolbar ---------------- */
  function toolbar() {
    const state = st();
    const date = U.toDate(state.date);
    let label = '';
    if (state.view === 'day') label = capitalize(U.fmtDateLong(date)) + ', ' + date.getFullYear();
    else if (state.view === 'week') {
      const start = U.startOfWeek(date);
      const end = U.addDays(start, 6);
      label = `${U.fmtDate(start)} – ${U.fmtDate(end)} de ${end.getFullYear()}`;
    } else {
      label = capitalize(U.fmtMonthYear(date));
    }

    return `<div class="agenda-toolbar">
      <div class="date-nav">
        <button class="icon-btn sm" data-nav="-1" title="Anterior">${Icon('chevronLeft', 16)}</button>
        <button class="btn btn-sm" data-today>Hoje</button>
        <button class="icon-btn sm" data-nav="1" title="Próximo">${Icon('chevronRight', 16)}</button>
        <div class="agenda-date" style="margin-left:6px">${U.esc(label)}</div>
      </div>
      <div class="seg">
        <button class="${state.view === 'day' ? 'active' : ''}" data-view="day">Dia</button>
        <button class="${state.view === 'week' ? 'active' : ''}" data-view="week">Semana</button>
        <button class="${state.view === 'month' ? 'active' : ''}" data-view="month">Mês</button>
      </div>
      <div class="spacer"></div>
      <select class="select input-sm" id="filterPro" style="width:auto;min-width:150px" title="Filtrar por profissional">
        <option value="all" ${state.pro === 'all' ? 'selected' : ''}>Todos os profissionais</option>
        ${Store.activePros().map(p => `<option value="${p.id}" ${state.pro === p.id ? 'selected' : ''}>${U.esc(p.name)}</option>`).join('')}
      </select>
      <select class="select input-sm" id="filterStatus" style="width:auto;min-width:130px" title="Filtrar por status">
        <option value="all" ${state.status === 'all' ? 'selected' : ''}>Todos os status</option>
        ${Store.STATUS_ORDER.map(s => `<option value="${s}" ${state.status === s ? 'selected' : ''}>${Store.STATUS[s].label}</option>`).join('')}
      </select>
      <button class="btn btn-sm" data-action="print" title="Imprimir agenda do dia">${Icon('printer', 15)} Imprimir</button>
    </div>`;
  }

  /* ---------------- dia ---------------- */
  function renderDay() {
    const state = st();
    const date = U.toDate(state.date);
    const dow = date.getDay();
    const pros = filteredPros();
    const working = pros.filter(p => { const wh = p.hours[dow]; return wh && wh.active; });

    if (!Store.activePros().length) {
      return `<div class="card">${UI.empty({
        icon: 'team',
        title: 'Nenhum profissional cadastrado',
        text: 'Cadastre a equipe para começar a montar a agenda.',
        action: `<button class="btn btn-primary" data-action="go" data-route="team">${Icon('plus', 16)} Cadastrar profissional</button>`
      })}</div>`;
    }

    if (!working.length) {
      const next = nextOpenDay(state.date);
      return `<div class="card">${UI.empty({
        icon: 'calendar',
        title: 'Nenhum atendimento neste dia',
        text: 'Nenhum profissional tem horário de trabalho configurado para esta data.',
        action: next ? `<button class="btn btn-primary" data-next-open="${next}">Ver ${U.relDay(next)} (${U.fmtDate(next)})</button>` : ''
      })}</div>`;
    }

    const range = computeRange(working, [date]);
    const H = (range.end - range.start) * PPM;
    const cols = working.length;

    const hourLines = [];
    for (let t = range.start; t <= range.end; t += 60) {
      hourLines.push(`<div class="hour-line" style="top:${(t - range.start) * PPM}px"></div>`);
      if (t + 30 <= range.end) hourLines.push(`<div class="half-line" style="top:${(t + 30 - range.start) * PPM}px"></div>`);
    }

    const gutter = [];
    for (let t = range.start; t <= range.end; t += 60) {
      gutter.push(`<div class="time-lbl" style="top:${(t - range.start) * PPM}px">${U.minToTime(t)}</div>`);
    }

    const heads = working.map(p => {
      const wh = p.hours[dow];
      return `<div class="cal-col-head ${U.isToday(state.date) ? 'is-today' : ''}">
        <div class="cch-name"><span class="dot" style="background:${p.color}"></span>${U.esc(p.name)}</div>
        <div class="cch-sub">${U.esc(p.role || '')} · ${wh.open}–${wh.close}</div>
      </div>`;
    }).join('');

    const columns = working.map(p => {
      const wh = p.hours[dow];
      const appts = visibleAppointments(state.date).filter(a => a.professionalId === p.id);
      const blocks = Store.blocksOn(state.date, p.id);
      return `<div class="cal-col ${U.isToday(state.date) ? 'is-today' : ''}" data-date="${state.date}" data-pro="${p.id}" style="height:${H}px">
        ${hourLines.join('')}
        ${blocks.map(b => blockBlock(b, range)).join('')}
        ${appts.map(a => apptBlock(a, range)).join('')}
        ${nowLine(range, state.date)}
        <div style="position:absolute;left:6px;bottom:5px;font-size:9.5px;color:var(--muted);opacity:.55;pointer-events:none">clique para agendar</div>
      </div>`;
    }).join('');

    const total = visibleAppointments(state.date).length;
    const occ = Store.occupancy(state.date, state.pro);

    return `<div class="agenda-card card">
      <div class="row wrap" style="padding:11px 16px;border-bottom:1px solid var(--border);gap:12px">
        <span class="small"><strong>${total}</strong> ${U.esc(Store.labels().appts.toLowerCase())}</span>
        <span class="small muted">Ocupação: <strong style="color:var(--text)">${occ.pct}%</strong></span>
        <div class="spacer"></div>
        <div class="legend" style="padding:0">
          ${Store.STATUS_ORDER.map(s => `<span><i style="background:${Store.STATUS[s].color}"></i>${Store.STATUS[s].label}</span>`).join('')}
        </div>
      </div>
      <div class="agenda-scroll">
        <div style="min-width:max-content">
          <div class="cal-head" style="display:grid;grid-template-columns:62px var(--cal-cols);--cal-cols:repeat(${cols},minmax(172px,1fr))">
            <div class="cal-gutter-head"></div>
            ${heads}
          </div>
          <div style="display:grid;grid-template-columns:62px var(--cal-cols);--cal-cols:repeat(${cols},minmax(172px,1fr))">
            <div class="cal-gutter" style="height:${H}px;position:sticky;left:0">${gutter.join('')}</div>
            ${columns}
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- semana ---------------- */
  function renderWeek() {
    const state = st();
    const start = U.startOfWeek(U.toDate(state.date));
    const days = Array.from({ length: 7 }, (_, i) => U.addDays(start, i));
    const pros = filteredPros();
    const range = computeRange(pros, days);
    const H = (range.end - range.start) * PPM;

    const gutter = [];
    for (let t = range.start; t <= range.end; t += 60) {
      gutter.push(`<div class="time-lbl" style="top:${(t - range.start) * PPM}px">${U.minToTime(t)}</div>`);
    }

    const heads = days.map(d => {
      const iso = U.iso(d);
      const count = visibleAppointments(iso).filter(a => a.status !== 'cancelado').length;
      return `<div class="cal-col-head ${U.isToday(iso) ? 'is-today' : ''}">
        <div class="cch-name">${U.weekdayShort[d.getDay()]} <span style="font-weight:500;color:var(--muted)">${U.fmtDate(d)}</span></div>
        <div class="cch-sub">${count ? count + ' atend.' : 'livre'}</div>
      </div>`;
    }).join('');

    const columns = days.map(d => {
      const iso = U.iso(d);
      const appts = visibleAppointments(iso);
      const { placed, lanes } = layoutLanes(appts);
      const lines = [];
      for (let t = range.start; t <= range.end; t += 60) {
        lines.push(`<div class="hour-line" style="top:${(t - range.start) * PPM}px"></div>`);
      }
      return `<div class="cal-col ${U.isToday(iso) ? 'is-today' : ''}" data-date="${iso}" data-pro="${state.pro !== 'all' ? state.pro : ''}" style="height:${H}px">
        ${lines.join('')}
        ${placed.map(x => apptBlock(x.a, range, { lane: x.lane, lanes })).join('')}
        ${nowLine(range, iso)}
      </div>`;
    }).join('');

    return `<div class="agenda-card card">
      <div class="agenda-scroll">
        <div style="min-width:max-content">
          <div class="cal-head" style="display:grid;grid-template-columns:62px var(--cal-cols);--cal-cols:repeat(7,minmax(138px,1fr))">
            <div class="cal-gutter-head"></div>
            ${heads}
          </div>
          <div style="display:grid;grid-template-columns:62px var(--cal-cols);--cal-cols:repeat(7,minmax(138px,1fr))">
            <div class="cal-gutter" style="height:${H}px;position:sticky;left:0">${gutter.join('')}</div>
            ${columns}
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- mês ---------------- */
  function renderMonth() {
    const state = st();
    const base = U.toDate(state.date);
    const first = U.startOfMonth(base);
    const start = U.startOfWeek(first);
    const cells = Array.from({ length: 42 }, (_, i) => U.addDays(start, i));

    const heads = U.weekdayShort.map(w => `<div class="month-dow">${w}</div>`).join('');

    const cellsHtml = cells.map(d => {
      const iso = U.iso(d);
      const appts = visibleAppointments(iso);
      const isOther = d.getMonth() !== base.getMonth();
      const isToday = U.isToday(iso);
      const shown = appts.slice(0, 3);
      return `<div class="month-cell ${isOther ? 'other' : ''} ${isToday ? 'today' : ''}" data-day="${iso}">
        <div class="mc-top">
          <span class="mc-day">${d.getDate()}</span>
          ${appts.length ? `<span class="mc-count">${appts.length}</span>` : ''}
        </div>
        ${shown.map(a => {
        const c = Store.getClient(a.clientId);
        const color = apptColor(a);
        return `<div class="mc-item" style="--c:${color}" data-appt="${a.id}" title="${U.esc((c ? c.name : '') + ' · ' + a.start)}">
            <i></i><span style="overflow:hidden;text-overflow:ellipsis">${a.start} ${U.esc(c ? c.name.split(' ')[0] : '')}</span>
          </div>`;
      }).join('')}
        ${appts.length > 3 ? `<div class="mc-more">+${appts.length - 3} mais</div>` : ''}
      </div>`;
    }).join('');

    return `<div class="card" style="padding:10px">
      <div class="month-grid">
        ${heads}
        ${cellsHtml}
      </div>
    </div>`;
  }

  function render() {
    return `<div class="page">
      ${toolbar()}
      ${st().view === 'day' ? renderDay() : st().view === 'week' ? renderWeek() : renderMonth()}
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => {
      const dir = Number(b.dataset.nav);
      const state = st();
      const d = U.toDate(state.date);
      if (state.view === 'day') state.date = U.iso(U.addDays(d, dir));
      else if (state.view === 'week') state.date = U.iso(U.addDays(d, dir * 7));
      else state.date = U.iso(U.addMonths(d, dir));
      App.refresh();
    }));

    el.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
      st().view = b.dataset.view;
      App.refresh();
    }));

    el.querySelectorAll('[data-today]').forEach(b => b.addEventListener('click', () => {
      st().date = U.todayISO();
      App.refresh();
    }));

    el.querySelectorAll('[data-next-open]').forEach(b => b.addEventListener('click', () => {
      st().date = b.dataset.nextOpen;
      st().view = 'day';
      App.refresh();
    }));

    const fp = el.querySelector('#filterPro');
    if (fp) fp.addEventListener('change', () => { st().pro = fp.value; App.refresh(); });
    const fs = el.querySelector('#filterStatus');
    if (fs) fs.addEventListener('change', () => { st().status = fs.value; App.refresh(); });

    el.querySelectorAll('[data-appt]').forEach(node => {
      node.addEventListener('click', e => {
        e.stopPropagation();
        Modals.appointmentDetails(node.dataset.appt);
      });
    });

    el.querySelectorAll('.month-cell[data-day]').forEach(cell => {
      cell.addEventListener('click', e => {
        if (e.target.closest('[data-appt]')) return;
        st().date = cell.dataset.day;
        st().view = 'day';
        App.refresh();
      });
    });

    el.querySelectorAll('.cal-col[data-date]').forEach(col => {
      col.addEventListener('click', e => {
        if (e.target.closest('.appt') || e.target.closest('.block-appt')) return;
        const rect = col.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const state = st();
        const date = col.dataset.date;
        const pros = filteredPros();
        const dow = U.toDate(date).getDay();
        const working = pros.filter(p => { const wh = p.hours[dow]; return wh && wh.active; });
        if (!working.length) return;
        const range = computeRange(working, [U.toDate(date)]);
        let minutes = range.start + Math.round((y / PPM) / 15) * 15;
        minutes = U.clamp(minutes, range.start, range.end - 15);
        Modals.appointment({
          date,
          start: U.minToTime(minutes),
          proId: col.dataset.pro || (state.pro !== 'all' ? state.pro : undefined)
        });
      });
    });
  }

  return { render, mount };
})();
