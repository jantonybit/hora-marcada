/* ==========================================================================
   UI — modais empilháveis, toasts e componentes visuais
   ========================================================================== */
const UI = (() => {
  const root = () => document.getElementById('modal-root');
  const toastRoot = () => document.getElementById('toast-root');
  const stack = [];
  let seq = 0;

  function open(opts = {}) {
    const {
      title = '', subtitle = '', body = '', footer = '', size = '',
      onMount = null, onClose = null, closeOnBackdrop = true, id = null
    } = opts;

    const nid = id || 'modal_' + (++seq);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.dataset.modalId = nid;
    overlay.innerHTML = `
      <div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${U.esc(title)}">
        <div class="modal-head">
          <div class="mh-text">
            <h3>${title}</h3>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
          </div>
          <button class="icon-btn plain modal-close" data-ui-close aria-label="Fechar">${Icon('x', 18)}</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
      </div>`;

    root().appendChild(overlay);
    const entry = { id: nid, overlay, onClose };
    stack.push(entry);
    document.body.classList.add('modal-open');

    overlay.addEventListener('mousedown', e => {
      if (e.target === overlay && closeOnBackdrop) close(nid);
    });
    overlay.querySelectorAll('[data-ui-close]').forEach(b => b.addEventListener('click', () => close(nid)));

    setTimeout(() => {
      const f = overlay.querySelector('.modal-body input:not([type="hidden"]), .modal-body select, .modal-body textarea, .modal-foot button');
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) { } }
    }, 40);

    if (onMount) onMount(overlay, nid);

    return { id: nid, overlay, close: () => close(nid) };
  }

  function close(id) {
    const idx = stack.findIndex(m => m.id === id);
    if (idx < 0) return;
    const [entry] = stack.splice(idx, 1);
    entry.overlay.style.animation = 'fade-in .12s ease reverse';
    const modal = entry.overlay.querySelector('.modal');
    if (modal) modal.style.animation = 'pop-in .12s ease reverse';
    setTimeout(() => entry.overlay.remove(), 100);
    if (!stack.length) document.body.classList.remove('modal-open');
    if (entry.onClose) { try { entry.onClose(); } catch (e) { console.error(e); } }
  }

  function closeAll() {
    [...stack].forEach(m => close(m.id));
  }

  function confirm(opts = {}) {
    const {
      title = 'Confirmar', message = '', confirmText = 'Confirmar',
      cancelText = 'Cancelar', danger = false, icon = 'alert'
    } = opts;
    return new Promise(resolve => {
      let settled = false;
      const done = v => { if (!settled) { settled = true; resolve(v); } };
      const m = open({
        title,
        size: 'modal-sm',
        body: `<div class="row" style="align-items:flex-start;gap:12px">
          <div class="stat-icon ${danger ? '' : 'blue'}" style="width:38px;height:38px;flex:none;${danger ? 'background:color-mix(in srgb, var(--red) 12%, transparent);color:var(--red)' : ''}">${Icon(icon, 19)}</div>
          <div style="padding-top:2px"><p style="font-size:13.5px;color:var(--text-2);line-height:1.5">${message}</p></div>
        </div>`,
        footer: `<div class="spacer"></div>
          <button class="btn" data-cancel>${U.esc(cancelText)}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-ok>${U.esc(confirmText)}</button>`,
        onClose: () => done(false)
      });
      m.overlay.querySelector('[data-cancel]').addEventListener('click', () => { done(false); close(m.id); });
      m.overlay.querySelector('[data-ok]').addEventListener('click', () => { done(true); close(m.id); });
    });
  }

  function toast(message, type = 'info', ms = 3200) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    const ic = type === 'success' ? 'checkCircle' : type === 'error' ? 'alert' : type === 'warn' ? 'alert' : 'bell';
    el.innerHTML = `${Icon(ic, 17)}<span>${U.esc(message)}</span>`;
    toastRoot().appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 220);
    }, ms);
  }

  function statusBadge(status) {
    const s = Store.STATUS[status] || Store.STATUS.agendado;
    return `<span class="badge badge-${status}"><i class="dot"></i>${s.label}</span>`;
  }

  function avatar(name, color, cls = '') {
    const bg = color
      ? `background:${color};`
      : '';
    return `<div class="avatar ${cls}" style="${bg}" title="${U.esc(name || '')}">${U.esc(U.initials(name))}</div>`;
  }

  function empty({ icon = 'calendar', title = 'Nada por aqui', text = '', action = '' } = {}) {
    return `<div class="empty">
      <div class="empty-icon">${Icon(icon, 26)}</div>
      <h3>${U.esc(title)}</h3>
      ${text ? `<p>${text}</p>` : ''}
      ${action}
    </div>`;
  }

  function options(items, selected, placeholder) {
    const ph = placeholder != null ? `<option value="">${U.esc(placeholder)}</option>` : '';
    return ph + items.map(it => {
      const value = typeof it === 'object' ? it.value : it;
      const label = typeof it === 'object' ? it.label : it;
      return `<option value="${U.esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${U.esc(label)}</option>`;
    }).join('');
  }

  function money(v) { return Store.money(v); }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && stack.length) {
      close(stack[stack.length - 1].id);
    }
  });

  return { open, close, closeAll, confirm, toast, statusBadge, avatar, empty, options, money };
})();
