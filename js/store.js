/* ==========================================================================
   Store — persistência local, regras de agenda, estatísticas e backup
   ========================================================================== */
const Store = (() => {
  const KEY = 'horamarcada.db.v1';
  const STATUS = {
    agendado: { label: 'Agendado', color: '#2563eb' },
    confirmado: { label: 'Confirmado', color: '#0f9f6e' },
    concluido: { label: 'Concluído', color: '#7c3aed' },
    faltou: { label: 'Faltou', color: '#d97706' },
    cancelado: { label: 'Cancelado', color: '#8a93a8' }
  };
  const STATUS_ORDER = ['agendado', 'confirmado', 'concluido', 'faltou', 'cancelado'];

  let db = null;
  let adminUnlocked = false;

  const defaultSettings = () => ({
    onboarded: false,
    businessName: 'Meu negócio',
    segment: 'outro',
    emoji: '📅',
    accent: '#7c3aed',
    accent2: '#a855f7',
    themePreset: 'roxo',
    theme: 'light',
    language: 'pt',
    currency: 'BRL',
    slotMinutes: 30,
    labels: {
      client: 'Cliente', clients: 'Clientes', service: 'Serviço', services: 'Serviços',
      pro: 'Profissional', pros: 'Profissionais', appt: 'Agendamento', appts: 'Agendamentos',
      newAppt: 'Novo agendamento', team: 'Equipe', business: 'Meu negócio'
    },
    reminderTemplate: 'Olá, {cliente}! 😊 Seu horário de {servico} está marcado para {data} às {hora} com {profissional}. Se precisar remarcar, é só me avisar. — {negocio}',
    customFields: [],
    paymentMethods: [...Seed.PAYMENT_METHODS],
    receptionMode: true,
    adminPin: ''
  });

  function init() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { db = null; return false; }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') { db = null; return false; }
      db = normalizeDB(parsed);
      return true;
    } catch (e) {
      console.error('Falha ao carregar dados:', e);
      db = null;
      return false;
    }
  }

  function normalizeDB(raw) {
    const d = raw || {};
    d.version = d.version || 1;
    d.settings = { ...defaultSettings(), ...(d.settings || {}) };
    d.settings.labels = { ...defaultSettings().labels, ...(d.settings.labels || {}) };
    d.settings.customFields = Array.isArray(d.settings.customFields) ? d.settings.customFields : [];
    d.settings.paymentMethods = Array.isArray(d.settings.paymentMethods) && d.settings.paymentMethods.length
      ? d.settings.paymentMethods : [...Seed.PAYMENT_METHODS];
    d.settings.receptionMode = d.settings.receptionMode !== false;
    d.settings.adminPin = /^\d{4,8}$/.test(String(d.settings.adminPin || '')) ? String(d.settings.adminPin) : '';
    d.settings.language = d.settings.language === 'en' ? 'en' : 'pt';
    d.settings.themePreset = d.settings.themePreset || 'roxo';
    d.professionals = Array.isArray(d.professionals) ? d.professionals : [];
    d.services = Array.isArray(d.services) ? d.services : [];
    d.clients = Array.isArray(d.clients) ? d.clients : [];
    d.appointments = Array.isArray(d.appointments) ? d.appointments : [];
    d.blocks = Array.isArray(d.blocks) ? d.blocks : [];
    d.waitlist = Array.isArray(d.waitlist) ? d.waitlist.map(w => ({
      id: w.id || U.uid('wl'),
      clientId: w.clientId || '',
      serviceId: w.serviceId || '',
      professionalId: w.professionalId || '',
      date: w.date || '',
      period: ['manha', 'tarde'].includes(w.period) ? w.period : 'qualquer',
      priority: w.priority === 'alta' ? 'alta' : 'normal',
      notes: w.notes || '',
      status: ['aguardando', 'agendado', 'removido'].includes(w.status) ? w.status : 'aguardando',
      appointmentId: w.appointmentId || '',
      createdAt: w.createdAt || new Date().toISOString()
    })) : [];
    d.professionals.forEach(p => {
      if (!Array.isArray(p.services)) p.services = [];
      if (!Array.isArray(p.hours) || p.hours.length !== 7) {
        p.hours = Array.from({ length: 7 }, () => ({ active: false, open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00' }));
      }
    });
    d.clients.forEach(c => { if (!c.custom || typeof c.custom !== 'object') c.custom = {}; });
    return d;
  }

  function save() {
    if (!db) return false;
    try {
      db.updatedAt = new Date().toISOString();
      localStorage.setItem(KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error('Falha ao salvar:', e);
      if (typeof UI !== 'undefined') UI.toast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.', 'error');
      return false;
    }
  }

  function replace(nextDB) {
    db = normalizeDB(nextDB);
    return save();
  }

  function reset() {
    localStorage.removeItem(KEY);
    db = null;
  }

  /* ---------- getters ---------- */
  const settings = () => db.settings;
  const labels = () => db.settings.labels;
  const currency = () => db.settings.currency || 'BRL';

  /* ---------- acesso / privacidade ---------- */
  // O operador (recepção) nunca vê valores financeiros. O gestor desbloqueia
  // a sessão com PIN; o desbloqueio não é persistido e expira ao fechar o app.
  const isManager = () => !!db && (!db.settings.receptionMode || adminUnlocked);
  const canSeeMoney = () => isManager();

  function unlock(pin) {
    if (!db) return { ok: false, message: 'Base de dados não carregada.' };
    const expected = String(db.settings.adminPin || '');
    if (!expected) { adminUnlocked = true; return { ok: true, firstTime: true }; }
    if (String(pin || '') !== expected) return { ok: false, message: 'PIN incorreto. Tente novamente.' };
    adminUnlocked = true;
    return { ok: true };
  }

  function lock() {
    adminUnlocked = false;
  }

  function setAdminPin(pin) {
    const clean = String(pin || '').replace(/\D/g, '');
    if (clean && (clean.length < 4 || clean.length > 8)) {
      return { ok: false, message: 'O PIN deve ter de 4 a 8 números.' };
    }
    db.settings.adminPin = clean;
    adminUnlocked = false;
    save();
    return { ok: true };
  }

  function setReceptionMode(on) {
    db.settings.receptionMode = !!on;
    if (on) adminUnlocked = false;
    save();
    return true;
  }

  const money = v => canSeeMoney() ? U.money(v, currency()) : '•••';
  const getPro = id => db.professionals.find(p => p.id === id) || null;
  const getService = id => db.services.find(s => s.id === id) || null;
  const getClient = id => db.clients.find(c => c.id === id) || null;
  const getAppt = id => db.appointments.find(a => a.id === id) || null;

  const activePros = () => db.professionals.filter(p => p.active !== false);
  const activeServices = () => db.services.filter(s => s.active !== false);

  function servicesForPro(pro) {
    if (!pro) return activeServices();
    if (!pro.services || !pro.services.length) return activeServices();
    return activeServices().filter(s => pro.services.includes(s.id));
  }

  const proLabel = pro => pro ? pro.name : 'Profissional removido';
  const serviceLabel = svc => svc ? svc.name : 'Serviço removido';
  const clientLabel = cli => cli ? cli.name : 'Cliente removido';

  function servicePrice(appt) {
    const svc = getService(appt.serviceId);
    return appt.price != null ? Number(appt.price) : (svc ? Number(svc.price) : 0);
  }

  /* ---------- agenda ---------- */
  function hoursFor(pro, dateISO) {
    if (!pro) return null;
    const d = U.toDate(dateISO);
    return pro.hours[d.getDay()] || null;
  }

  function blocksOn(dateISO, proId) {
    return db.blocks.filter(b => b.date === dateISO && (b.professionalId === 'all' || b.professionalId === proId));
  }

  function blockCovers(block, startMin, endMin) {
    if (block.allDay) return true;
    const bs = U.timeToMin(block.start || '00:00');
    const be = U.timeToMin(block.end || '23:59');
    return U.overlap(startMin, endMin, bs, be);
  }

  function appointmentsOn(dateISO, opts = {}) {
    return db.appointments.filter(a => {
      if (a.date !== dateISO) return false;
      if (opts.proId && opts.proId !== 'all' && a.professionalId !== opts.proId) return false;
      if (opts.status && opts.status !== 'all' && a.status !== opts.status) return false;
      if (!opts.includeCancelled && a.status === 'cancelado') return false;
      if (opts.clientId && a.clientId !== opts.clientId) return false;
      return true;
    }).sort((a, b) => a.start.localeCompare(b.start));
  }

  function conflict(info) {
    const { professionalId, date, start, duration, buffer = 0, ignoreId = '', allowOverlap = false } = info;
    const pro = getPro(professionalId);
    if (!pro) return { type: 'professional', message: 'Profissional não encontrado.' };

    const wh = hoursFor(pro, date);
    if (!wh || !wh.active) return { type: 'hours', message: `${pro.name} não atende neste dia.` };

    const s = U.timeToMin(start);
    const e = s + Number(duration || 0) + Number(buffer || 0);
    const open = U.timeToMin(wh.open);
    const close = U.timeToMin(wh.close);

    if (s < open || e > close) {
      return { type: 'hours', message: `Fora do horário de atendimento (${wh.open}–${wh.close}).` };
    }
    if (wh.breakStart && wh.breakEnd) {
      const bs = U.timeToMin(wh.breakStart);
      const be = U.timeToMin(wh.breakEnd);
      if (U.overlap(s, e, bs, be)) return { type: 'break', message: `Conflito com a pausa (${wh.breakStart}–${wh.breakEnd}).` };
    }
    for (const b of blocksOn(date, professionalId)) {
      if (blockCovers(b, s, e)) {
        return { type: 'block', message: `Horário bloqueado${b.reason ? ': ' + b.reason : '.'}`, block: b };
      }
    }
    if (!allowOverlap) {
      const others = db.appointments.filter(a =>
        a.id !== ignoreId &&
        a.professionalId === professionalId &&
        a.date === date &&
        a.status !== 'cancelado'
      );
      for (const a of others) {
        const as = U.timeToMin(a.start);
        const ae = as + Number(a.duration || 0) + Number(a.buffer || 0);
        if (U.overlap(s, e, as, ae)) {
          const cli = getClient(a.clientId);
          return { type: 'appointment', message: `Já existe ${labels().appt.toLowerCase()} às ${a.start}${cli ? ' para ' + cli.name : ''}.`, appointment: a };
        }
      }
    }
    return null;
  }

  function availability(proId, dateISO, duration, opts = {}) {
    const pro = getPro(proId);
    const wh = hoursFor(pro, dateISO);
    const step = Number(settings().slotMinutes) || 30;
    const ignoreId = opts.ignoreId || '';
    const allowOverlap = !!opts.allowOverlap;

    if (!pro || !wh || !wh.active) {
      return { open: false, slots: [], reason: pro ? `${pro.name} não atende neste dia.` : 'Profissional não encontrado.' };
    }

    const open = U.timeToMin(wh.open);
    const close = U.timeToMin(wh.close);
    const dur = Math.max(5, Number(duration) || 30);
    const isToday = dateISO === U.todayISO();
    const nowM = U.nowMin();
    const slots = [];

    for (let t = open; t + dur <= close; t += step) {
      if (isToday && !opts.includePast && t < nowM) continue;
      if (wh.breakStart && wh.breakEnd) {
        const bs = U.timeToMin(wh.breakStart);
        const be = U.timeToMin(wh.breakEnd);
        if (U.overlap(t, t + dur, bs, be)) continue;
      }
      if (blocksOn(dateISO, proId).some(b => blockCovers(b, t, t + dur))) continue;
      if (!allowOverlap) {
        const busy = db.appointments.some(a => {
          if (a.id === ignoreId || a.professionalId !== proId || a.date !== dateISO || a.status === 'cancelado') return false;
          const as = U.timeToMin(a.start);
          const ae = as + Number(a.duration || 0) + Number(a.buffer || 0);
          return U.overlap(t, t + dur, as, ae);
        });
        if (busy) continue;
      }
      slots.push(U.minToTime(t));
    }

    return { open: true, slots, reason: slots.length ? '' : 'Nenhum horário livre neste dia.' };
  }

  function createAppointment(data) {
    const result = validateAppointment(data);
    if (!result.ok) return result;
    const appt = {
      id: U.uid('apt'),
      clientId: data.clientId,
      professionalId: data.professionalId,
      serviceId: data.serviceId,
      date: data.date,
      start: data.start,
      duration: Number(data.duration),
      buffer: Number(data.buffer || 0),
      price: data.price != null ? Number(data.price) : Number((getService(data.serviceId) || {}).price || 0),
      status: data.status || 'agendado',
      paid: !!data.paid,
      paymentMethod: data.paid ? (data.paymentMethod || '') : '',
      paidAt: data.paid ? new Date().toISOString() : '',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };
    db.appointments.push(appt);
    save();
    return { ok: true, appointment: appt };
  }

  function validateAppointment(data) {
    if (!data.clientId) return { ok: false, message: 'Selecione um cliente.' };
    if (!data.serviceId) return { ok: false, message: 'Selecione um serviço.' };
    if (!data.professionalId) return { ok: false, message: 'Selecione um profissional.' };
    if (!data.date) return { ok: false, message: 'Informe a data.' };
    if (!data.start) return { ok: false, message: 'Informe o horário.' };
    if (!Number(data.duration)) return { ok: false, message: 'Informe a duração.' };
    if (data.ignoreId) {
      const existing = getAppt(data.ignoreId);
      if (existing && existing.date !== data.date) {
        // ok — mudança de data
      }
    }
    const c = conflict({
      professionalId: data.professionalId,
      date: data.date,
      start: data.start,
      duration: data.duration,
      buffer: data.buffer,
      ignoreId: data.ignoreId,
      allowOverlap: !!data.allowOverlap
    });
    if (c) return { ok: false, message: c.message, conflict: c };
    return { ok: true };
  }

  function updateAppointment(id, data) {
    const appt = getAppt(id);
    if (!appt) return { ok: false, message: 'Agendamento não encontrado.' };
    const result = validateAppointment({ ...data, ignoreId: id });
    if (!result.ok) return result;
    Object.assign(appt, {
      clientId: data.clientId,
      professionalId: data.professionalId,
      serviceId: data.serviceId,
      date: data.date,
      start: data.start,
      duration: Number(data.duration),
      buffer: Number(data.buffer || 0),
      price: data.price != null ? Number(data.price) : appt.price,
      status: data.status || appt.status,
      notes: data.notes || ''
    });
    if (data.paid !== undefined) {
      appt.paid = !!data.paid;
      appt.paymentMethod = data.paid ? (data.paymentMethod || '') : '';
      appt.paidAt = data.paid ? (appt.paidAt || new Date().toISOString()) : '';
    }
    save();
    return { ok: true, appointment: appt };
  }

  function setStatus(id, status, extra = {}) {
    const appt = getAppt(id);
    if (!appt) return false;
    appt.status = status;
    if (status === 'concluido') {
      if (extra.paid != null) appt.paid = !!extra.paid;
      if (extra.paymentMethod != null) appt.paymentMethod = extra.paymentMethod;
      if (extra.price != null) appt.price = Number(extra.price);
      appt.paidAt = appt.paid ? (appt.paidAt || new Date().toISOString()) : '';
    }
    if (status === 'cancelado') {
      appt.paid = false;
      appt.paymentMethod = '';
    }
    if (extra.notes != null) appt.notes = extra.notes;
    save();
    return true;
  }

  function setPaid(id, paid, method) {
    const appt = getAppt(id);
    if (!appt) return false;
    appt.paid = !!paid;
    appt.paymentMethod = paid ? (method || appt.paymentMethod || '') : '';
    appt.paidAt = paid ? (appt.paidAt || new Date().toISOString()) : '';
    save();
    return true;
  }

  function deleteAppointment(id) {
    const i = db.appointments.findIndex(a => a.id === id);
    if (i < 0) return false;
    db.appointments.splice(i, 1);
    save();
    return true;
  }

  function clientAppointments(clientId) {
    return db.appointments.filter(a => a.clientId === clientId).sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
  }

  function clientSummary(clientId) {
    const all = clientAppointments(clientId);
    const done = all.filter(a => a.status === 'concluido');
    const paid = done.filter(a => a.paid);
    const upcoming = all.filter(a => a.status !== 'cancelado' && a.status !== 'faltou' && a.status !== 'concluido' && a.date >= U.todayISO())
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    return {
      visits: done.length,
      spent: U.sum(paid, a => servicePrice(a)),
      pending: U.sum(done.filter(a => !a.paid), a => servicePrice(a)),
      lastVisit: done.length ? done[0].date : '',
      next: upcoming[0] || null,
      cancelled: all.filter(a => a.status === 'cancelado').length,
      total: all.length
    };
  }

  /* ---------- check-in (recepção) ---------- */
  const isCheckedIn = appt => !!(appt && appt.checkedInAt);

  function checkIn(id) {
    const appt = getAppt(id);
    if (!appt || appt.status === 'cancelado' || appt.status === 'faltou' || appt.status === 'concluido') return false;
    appt.checkedInAt = new Date().toISOString();
    if (appt.status === 'agendado') appt.status = 'confirmado';
    save();
    return true;
  }

  function undoCheckIn(id) {
    const appt = getAppt(id);
    if (!appt) return false;
    delete appt.checkedInAt;
    save();
    return true;
  }

  const checkedInToday = () => appointmentsOn(U.todayISO(), { includeCancelled: true })
    .filter(a => a.checkedInAt && a.status !== 'cancelado');

  const waitingToday = () => appointmentsOn(U.todayISO(), { includeCancelled: true })
    .filter(a => a.status !== 'cancelado' && a.status !== 'faltou' && a.status !== 'concluido' && !a.checkedInAt);

  /* ---------- lista de espera ---------- */
  const waitlistEntries = () => db.waitlist
    .filter(w => w.status === 'aguardando')
    .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'alta' ? -1 : 1) || String(a.createdAt).localeCompare(String(b.createdAt)));

  const waitlistCount = () => waitlistEntries().length;
  const getWaitlist = id => db.waitlist.find(w => w.id === id) || null;

  function addWaitlist(data) {
    if (!data.clientId) return { ok: false, message: 'Selecione o cliente.' };
    if (!data.serviceId) return { ok: false, message: 'Selecione o serviço.' };
    const entry = {
      id: U.uid('wl'),
      clientId: data.clientId,
      serviceId: data.serviceId,
      professionalId: data.professionalId || '',
      date: data.date || '',
      period: data.period || 'qualquer',
      priority: data.priority === 'alta' ? 'alta' : 'normal',
      notes: data.notes || '',
      status: 'aguardando',
      appointmentId: '',
      createdAt: new Date().toISOString()
    };
    db.waitlist.push(entry);
    save();
    return { ok: true, entry };
  }

  function updateWaitlist(id, data) {
    const entry = getWaitlist(id);
    if (!entry) return { ok: false, message: 'Entrada não encontrada.' };
    Object.assign(entry, {
      clientId: data.clientId ?? entry.clientId,
      serviceId: data.serviceId ?? entry.serviceId,
      professionalId: data.professionalId ?? entry.professionalId,
      date: data.date ?? entry.date,
      period: data.period ?? entry.period,
      priority: data.priority === 'alta' ? 'alta' : (data.priority === 'normal' ? 'normal' : entry.priority),
      notes: data.notes ?? entry.notes
    });
    save();
    return { ok: true, entry };
  }

  function removeWaitlist(id) {
    const i = db.waitlist.findIndex(w => w.id === id);
    if (i < 0) return false;
    db.waitlist.splice(i, 1);
    save();
    return true;
  }

  function markWaitlistScheduled(id, appointmentId) {
    const entry = getWaitlist(id);
    if (!entry) return false;
    entry.status = 'agendado';
    entry.appointmentId = appointmentId || '';
    save();
    return true;
  }

  // Próximo horário livre para um serviço/profissional, considerando a
  // preferência de período da lista de espera.
  function nextAvailable(serviceId, professionalId, opts = {}) {
    const svc = getService(serviceId);
    if (!svc) return null;
    const pros = professionalId && professionalId !== 'all' && professionalId !== 'qualquer'
      ? [getPro(professionalId)].filter(Boolean)
      : activePros();
    if (!pros.length) return null;

    const days = Math.max(1, Number(opts.days) || 30);
    const from = opts.from || U.todayISO();
    const period = opts.period || 'qualquer';
    let best = null;

    for (let i = 0; i < days; i++) {
      const date = U.iso(U.addDays(from, i));
      for (const pro of pros) {
        const av = availability(pro.id, date, svc.duration);
        if (!av.open || !av.slots.length) continue;
        const slot = av.slots.find(t => {
          if (period === 'qualquer') return true;
          const min = U.timeToMin(t);
          return period === 'manha' ? min < 12 * 60 : min >= 12 * 60;
        });
        if (!slot) continue;
        const candidate = { date, start: slot, professionalId: pro.id, professional: pro, service: svc };
        if (!best || (candidate.date + candidate.start).localeCompare(best.date + best.start) < 0) best = candidate;
      }
      if (best) break;
    }
    return best;
  }

  /* ---------- consultas / estatísticas ---------- */
  function filterAppointments(filters = {}) {
    const { from, to, proId, status, clientId, q } = filters;
    return db.appointments.filter(a => {
      if (from && a.date < from) return false;
      if (to && a.date > to) return false;
      if (proId && proId !== 'all' && a.professionalId !== proId) return false;
      if (status && status !== 'all' && a.status !== status) return false;
      if (clientId && a.clientId !== clientId) return false;
      if (q) {
        const c = getClient(a.clientId);
        const s = getService(a.serviceId);
        if (!U.matches(q, c && c.name, s && s.name, a.notes, a.date)) return false;
      }
      return true;
    }).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  }

  function stats(from, to, proId) {
    const list = filterAppointments({ from, to, proId });
    const valid = list.filter(a => a.status !== 'cancelado');
    const done = list.filter(a => a.status === 'concluido');
    const paid = done.filter(a => a.paid);
    const pending = done.filter(a => !a.paid);
    const upcoming = list.filter(a => a.status === 'agendado' || a.status === 'confirmado');
    const noShow = list.filter(a => a.status === 'faltou');
    const paidTotal = U.sum(paid, a => servicePrice(a));
    const pendingTotal = U.sum(pending, a => servicePrice(a));
    const doneTotal = U.sum(done, a => servicePrice(a));
    const scheduledTotal = U.sum(upcoming, a => servicePrice(a));
    const byStatus = {};
    STATUS_ORDER.forEach(s => { byStatus[s] = list.filter(a => a.status === s).length; });
    return {
      list, valid, done, paid, pending, upcoming, noShow,
      count: valid.length,
      paidTotal, pendingTotal, doneTotal, scheduledTotal,
      expected: paidTotal + pendingTotal + scheduledTotal,
      ticket: done.length ? doneTotal / done.length : 0,
      byStatus,
      cancelled: list.filter(a => a.status === 'cancelado').length,
      noShowCount: noShow.length
    };
  }

  function occupancy(dateISO, proId) {
    const dow = U.toDate(dateISO).getDay();
    const pros = proId && proId !== 'all' ? [getPro(proId)].filter(Boolean) : activePros();
    let available = 0;
    pros.forEach(p => {
      const wh = p.hours[dow];
      if (!wh || !wh.active) return;
      let mins = U.timeToMin(wh.close) - U.timeToMin(wh.open);
      if (wh.breakStart && wh.breakEnd) mins -= (U.timeToMin(wh.breakEnd) - U.timeToMin(wh.breakStart));
      available += Math.max(0, mins);
    });
    const booked = appointmentsOn(dateISO, { proId, includeCancelled: false })
      .filter(a => a.status !== 'faltou')
      .reduce((acc, a) => acc + Number(a.duration || 0), 0);
    return { available, booked, pct: available ? Math.min(100, Math.round(booked / available * 100)) : 0 };
  }

  function revenueSeries(fromISO, toISO) {
    const from = U.toDate(fromISO);
    const to = U.toDate(toISO);
    const days = [];
    const map = {};
    filterAppointments({ from: fromISO, to: toISO }).forEach(a => {
      if (a.status !== 'concluido' || !a.paid) return;
      map[a.date] = (map[a.date] || 0) + servicePrice(a);
    });
    for (let d = new Date(from); d <= to; d = U.addDays(d, 1)) {
      const key = U.iso(d);
      days.push({ date: key, total: map[key] || 0 });
    }
    return days;
  }

  function nextAppointment(proId) {
    const today = U.todayISO();
    const now = U.nowMin();
    const list = filterAppointments({ from: today, proId })
      .filter(a => (a.status === 'agendado' || a.status === 'confirmado'))
      .filter(a => a.date > today || (a.date === today && U.timeToMin(a.start) >= now))
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    return list[0] || null;
  }

  function upcoming(limit = 8, proId) {
    const today = U.todayISO();
    return filterAppointments({ from: today, proId })
      .filter(a => a.status !== 'cancelado' && a.status !== 'faltou' && a.status !== 'concluido')
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
      .slice(0, limit);
  }

  function birthdaysThisMonth() {
    const month = new Date().getMonth() + 1;
    return db.clients
      .filter(c => c.birthdate && U.toDate(c.birthdate).getMonth() + 1 === month)
      .sort((a, b) => U.toDate(a.birthdate).getDate() - U.toDate(b.birthdate).getDate());
  }

  function reminderMessage(appt) {
    const c = getClient(appt.clientId);
    const s = getService(appt.serviceId);
    const p = getPro(appt.professionalId);
    const tpl = settings().reminderTemplate || '';
    return tpl
      .replace(/\{cliente\}/g, c ? c.name : '')
      .replace(/\{servico\}/g, s ? s.name : '')
      .replace(/\{profissional\}/g, p ? p.name : '')
      .replace(/\{data\}/g, U.fmtDate(appt.date))
      .replace(/\{hora\}/g, appt.start)
      .replace(/\{negocio\}/g, settings().businessName)
      .replace(/\{valor\}/g, money(servicePrice(appt)));
  }

  /* ---------- backup ---------- */
  function backupJSON() {
    return JSON.stringify({ app: 'Hora Marcada', version: 1, exportedAt: new Date().toISOString(), data: db }, null, 2);
  }

  function restoreJSON(text) {
    try {
      const parsed = JSON.parse(text);
      const data = parsed && parsed.data ? parsed.data : parsed;
      if (!data || !Array.isArray(data.appointments) || !Array.isArray(data.clients)) {
        return { ok: false, message: 'Arquivo inválido: não parece ser um backup do Hora Marcada.' };
      }
      db = normalizeDB(data);
      save();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: 'Não foi possível ler o arquivo. Verifique se é um JSON válido.' };
    }
  }

  function demoDB(keepSettings = true) {
    const s = db ? db.settings : defaultSettings();
    const segId = s.segment || 'outro';
    const seg = Seed.segment(segId);
    const pro = db && db.professionals[0];
    const workdays = [];
    if (pro && Array.isArray(pro.hours)) pro.hours.forEach((h, i) => { if (h.active) workdays.push(i); });
    const built = Seed.build({
      segmentId: segId,
      businessName: s.businessName,
      ownerName: pro ? pro.name : 'Meu nome',
      emoji: s.emoji,
      theme: s.theme,
      currency: s.currency,
      slotMinutes: s.slotMinutes,
      workdays: workdays.length ? workdays : seg.workdays,
      hours: pro && pro.hours[0] ? { open: pro.hours[0].open, close: pro.hours[0].close, breakStart: pro.hours[0].breakStart, breakEnd: pro.hours[0].breakEnd } : seg.hours,
      demo: true
    });
    built.settings.receptionMode = s.receptionMode !== false;
    built.settings.adminPin = s.adminPin || '';
    built.settings.language = s.language || 'pt';
    built.settings.theme = s.theme || 'light';
    built.settings.themePreset = s.themePreset || 'roxo';
    return built;
  }

  return {
    KEY, STATUS, STATUS_ORDER,
    init, save, replace, reset, normalizeDB,
    get db() { return db; },
    set db(v) { db = v; },
    settings, labels, currency, money,
    isManager, canSeeMoney, unlock, lock, setAdminPin, setReceptionMode,
    hasAdminPin: () => !!db.settings.adminPin,
    getPro, getService, getClient, getAppt,
    activePros, activeServices, servicesForPro,
    proLabel, serviceLabel, clientLabel, servicePrice,
    hoursFor, blocksOn, blockCovers, appointmentsOn,
    conflict, availability, validateAppointment,
    createAppointment, updateAppointment, setStatus, setPaid, deleteAppointment,
    clientAppointments, clientSummary,
    isCheckedIn, checkIn, undoCheckIn, checkedInToday, waitingToday,
    waitlistEntries, waitlistCount, getWaitlist,
    addWaitlist, updateWaitlist, removeWaitlist, markWaitlistScheduled, nextAvailable,
    filterAppointments, stats, occupancy, revenueSeries, nextAppointment, upcoming, birthdaysThisMonth,
    reminderMessage, backupJSON, restoreJSON, demoDB
  };
})();
