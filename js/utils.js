/* ==========================================================================
   Utilitários gerais — datas, moeda, texto, arquivos
   ========================================================================== */
const U = (() => {
  const pad = n => String(n).padStart(2, '0');
  const uid = (prefix = 'id') => prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const normalize = v => String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = s => {
    if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
    const parts = String(s || '').split('-').map(Number);
    return new Date(parts[0] || 1970, (parts[1] || 1) - 1, parts[2] || 1);
  };
  const toDate = v => (v instanceof Date ? new Date(v.getFullYear(), v.getMonth(), v.getDate()) : parseISO(v));
  const todayISO = () => iso(new Date());
  const addDays = (v, n) => { const d = toDate(v); d.setDate(d.getDate() + n); return d; };
  const addMonths = (v, n) => { const d = toDate(v); d.setDate(1); d.setMonth(d.getMonth() + n); return d; };
  const startOfWeek = (v, start = 0) => { const d = toDate(v); const diff = (d.getDay() - start + 7) % 7; d.setDate(d.getDate() - diff); return d; };
  const startOfMonth = v => { const d = toDate(v); d.setDate(1); return d; };
  const endOfMonth = v => { const d = toDate(v); d.setMonth(d.getMonth() + 1, 0); return d; };
  const diffDays = (a, b) => Math.round((toDate(a) - toDate(b)) / 86400000);
  const isSameDay = (a, b) => iso(toDate(a)) === iso(toDate(b));
  const isToday = v => iso(toDate(v)) === todayISO();

  const weekdayLong = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const weekdayShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekdayMini = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const monthLong = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const monthShort = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  // O idioma é definido em tempo de execução pelo módulo I18n.
  const locale = () => (typeof I18n !== 'undefined' ? I18n.locale() : 'pt-BR');

  const fmtDate = (v, opts = {}) => new Intl.DateTimeFormat(locale(), { day: '2-digit', month: '2-digit', ...opts }).format(toDate(v));
  const fmtDateLong = v => new Intl.DateTimeFormat(locale(), { weekday: 'long', day: '2-digit', month: 'long' }).format(toDate(v));
  const fmtDateFull = v => new Intl.DateTimeFormat(locale(), { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(toDate(v));
  const fmtMonthYear = v => new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(toDate(v));
  const fmtMonthShort = v => `${monthShort[toDate(v).getMonth()]}/${String(toDate(v).getFullYear()).slice(2)}`;
  const fmtTime = t => String(t || '--:--').slice(0, 5);

  const timeToMin = t => { const [h, m] = String(t || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const minToTime = m => `${pad(Math.floor(((m % 1440) + 1440) % 1440 / 60))}:${pad(((m % 60) + 60) % 60)}`;
  const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

  const relDay = v => {
    const d = diffDays(v, new Date());
    if (d === 0) return 'Hoje';
    if (d === 1) return 'Amanhã';
    if (d === -1) return 'Ontem';
    if (d > 1 && d < 7) return weekdayLong[toDate(v).getDay()];
    return fmtDate(v);
  };

  const initials = name => {
    const parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  };

  const money = (v, currency = 'BRL') => {
    try {
      return new Intl.NumberFormat(locale(), { style: 'currency', currency }).format(Number(v) || 0);
    } catch (e) {
      return 'R$ ' + (Number(v) || 0).toFixed(2);
    }
  };

  const number = v => new Intl.NumberFormat(locale()).format(Number(v) || 0);

  const normPhone = p => String(p || '').replace(/\D/g, '');
  const phoneDisplay = p => {
    const d = normPhone(p);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return p || '';
  };
  const waLink = (phone, text = '') => {
    let d = normPhone(phone);
    if (!d) return '';
    if (d.length <= 11 && !d.startsWith('55')) d = '55' + d;
    return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
  };

  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const sum = (arr, fn) => arr.reduce((acc, x) => acc + (fn ? fn(x) : x), 0);

  const debounce = (fn, wait = 220) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  const matches = (query, ...fields) => {
    const q = normalize(query).trim();
    if (!q) return true;
    const hay = normalize(fields.filter(Boolean).join(' '));
    return q.split(/\s+/).every(term => hay.includes(term));
  };

  const csvCell = v => {
    const s = String(v ?? '');
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = (headers, rows) => [headers, ...rows].map(r => r.map(csvCell).join(';')).join('\r\n');

  const download = (filename, content, mime = 'text/plain;charset=utf-8', bom = false) => {
    const blob = new Blob([bom ? '\ufeff' + content : content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const copy = async text => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (err) {
        return false;
      }
    }
  };

  const fileSafe = s => normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const overlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

  return {
    pad, uid, esc, normalize, iso, parseISO, toDate, todayISO, addDays, addMonths,
    startOfWeek, startOfMonth, endOfMonth, diffDays, isSameDay, isToday,
    weekdayLong, weekdayShort, weekdayMini, monthLong, monthShort,
    fmtDate, fmtDateLong, fmtDateFull, fmtMonthYear, fmtMonthShort, fmtTime,
    timeToMin, minToTime, nowMin, relDay, initials, money, number,
    normPhone, phoneDisplay, waLink, pct, clamp, sum, debounce, matches,
    csv, download, copy, fileSafe, overlap
  };
})();
