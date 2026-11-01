/* ==========================================================================
   Modais — agendamento, clientes, serviços, equipe, bloqueios e financeiro
   ========================================================================== */
const Modals = (() => {

  const statusOptions = (selected) => Store.STATUS_ORDER
    .map(s => `<option value="${s}" ${s === selected ? 'selected' : ''}>${Store.STATUS[s].label}</option>`).join('');

  const proOptions = (selected) => Store.activePros()
    .map(p => `<option value="${p.id}" ${p.id === selected ? 'selected' : ''}>${U.esc(p.name)}${p.role ? ' · ' + U.esc(p.role) : ''}</option>`).join('');

  const clientOptions = (selected) => Store.db.clients
    .slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .map(c => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${U.esc(c.name)}${c.phone ? ' · ' + U.esc(c.phone) : ''}</option>`).join('');

  const serviceOptions = (pro, selected) => Store.servicesForPro(pro)
    .map(s => `<option value="${s.id}" ${s.id === selected ? 'selected' : ''}>${U.esc(s.name)} · ${s.duration} min · ${Store.money(s.price)}</option>`).join('');

  /* ======================================================================
     AGENDAMENTO — criar / editar
     ====================================================================== */
  function appointment(opts = {}) {
    if (!Store.db) return;

    if (!Store.activeServices().length) {
      UI.toast('Cadastre pelo menos um serviço antes de agendar.', 'warn');
      App.go('services');
      return;
    }
    if (!Store.activePros().length) {
      UI.toast('Cadastre pelo menos um profissional antes de agendar.', 'warn');
      App.go('team');
      return;
    }
    if (!Store.db.clients.length) {
      UI.toast('Vamos cadastrar o primeiro cliente.', 'info');
      client(null, { onSaved: () => appointment(opts) });
      return;
    }

    const editing = opts.id ? Store.getAppt(opts.id) : null;
    const settings = Store.settings();
    const canMoney = Store.canSeeMoney();
    const defaultPro = opts.proId || (editing && editing.professionalId) || (Store.activePros()[0] || {}).id;
    const pro = Store.getPro(defaultPro);
    const services = Store.servicesForPro(pro);
    const defaultSvc = opts.serviceId || (editing && editing.serviceId) || (services[0] || {}).id;
    const svc = Store.getService(defaultSvc);
    const date = opts.date || (editing && editing.date) || U.todayISO();
    const start = opts.start || (editing && editing.start) || '';
    const duration = editing ? editing.duration : (svc ? svc.duration : 30);
    const price = editing ? editing.price : (svc ? svc.price : 0);
    const clientId = opts.clientId || (editing && editing.clientId) || '';

    const body = `
      <form id="apptForm" class="stack" novalidate>
        <div class="form-grid">
          <div class="field span-2">
            <label>${U.esc(settings.labels.client)} <span class="req">*</span></label>
            <div class="row" style="gap:8px">
              <select name="clientId" class="select" required>
                ${clientOptions(clientId)}
              </select>
              <button type="button" class="btn btn-soft btn-sm" id="btnNewClient" title="Cadastrar ${U.esc(settings.labels.client.toLowerCase())}">${Icon('userPlus', 15)} Novo</button>
            </div>
          </div>

          <div class="field">
            <label>${U.esc(settings.labels.service)} <span class="req">*</span></label>
            <select name="serviceId" class="select" required>${serviceOptions(pro, defaultSvc)}</select>
          </div>

          <div class="field">
            <label>${U.esc(settings.labels.pro)} <span class="req">*</span></label>
            <select name="professionalId" class="select" required>${proOptions(defaultPro)}</select>
          </div>

          <div class="field">
            <label>Data <span class="req">*</span></label>
            <input type="date" name="date" class="input" value="${date}" required>
          </div>

          <div class="field">
            <label>Horário <span class="req">*</span></label>
            <input type="time" name="start" class="input" value="${start}" step="${settings.slotMinutes * 60}" required>
          </div>

          <div class="field">
            <label>Duração (min)</label>
            <input type="number" name="duration" class="input" min="5" step="5" value="${duration}" required>
          </div>

          <div class="field">
            <label>Valor (${U.esc(settings.currency)})</label>
            ${canMoney
        ? `<input type="number" name="price" class="input" min="0" step="0.01" value="${price}">`
        : `<div class="input" style="display:flex;align-items:center;gap:8px;color:var(--muted);background:var(--surface-2)">${Icon('lock', 15)} Definido pelo gestor</div>`}
          </div>

          <div class="field">
            <label>Status</label>
            <select name="status" class="select">${statusOptions(editing ? editing.status : 'agendado')}</select>
          </div>

          <div class="field span-2">
            <label>Observações</label>
            <textarea name="notes" class="textarea" placeholder="Preferências, informações importantes, encaixe...">${U.esc(editing ? editing.notes : '')}</textarea>
          </div>

          <div class="span-2" id="slotArea"></div>

          <div class="span-2">
            <label class="check"><input type="checkbox" name="allowOverlap" ${editing && editing.status === 'concluido' ? '' : ''}> Permitir encaixe (ignorar conflito de horário)</label>
          </div>

          ${editing ? '' : `
          <div class="span-2" style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px 14px">
            <label class="check"><input type="checkbox" name="repeat" id="repeatChk"> ${Icon('repeat', 15)} Repetir semanalmente</label>
            <div class="row hidden" id="repeatOpts" style="margin-top:10px;gap:8px">
              <span class="small muted">Repetir por</span>
              <input type="number" name="weeks" class="input input-sm" style="width:82px" value="4" min="2" max="52">
              <span class="small muted">semanas</span>
            </div>
          </div>`}
        </div>
        <div id="apptError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar agendamento' : (settings.labels.newAppt || 'Novo agendamento'),
      subtitle: editing ? 'Altere os dados e salve para atualizar.' : 'Preencha os dados do atendimento.',
      size: 'modal-lg',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="apptForm">${Icon('check', 16)} ${editing ? 'Salvar alterações' : 'Agendar'}</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#apptForm');
        const el = n => f.elements[n];
        const area = overlay.querySelector('#slotArea');
        const err = overlay.querySelector('#apptError');

        const refreshServices = () => {
          const p = Store.getPro(el('professionalId').value);
          const list = Store.servicesForPro(p);
          const current = el('serviceId').value;
          el('serviceId').innerHTML = list.map(s =>
            `<option value="${s.id}" ${s.id === current ? 'selected' : ''}>${U.esc(s.name)} · ${s.duration} min · ${Store.money(s.price)}</option>`
          ).join('');
          if (!list.some(s => s.id === current) && list[0]) {
            el('serviceId').value = list[0].id;
            applyService(false);
          }
        };

        const applyService = (overwrite = true) => {
          const s = Store.getService(el('serviceId').value);
          if (!s) return;
          if (overwrite) {
            el('duration').value = s.duration;
            if (canMoney) el('price').value = s.price;
          }
          refreshSlots();
        };

        const refreshSlots = () => {
          const proId = el('professionalId').value;
          const d = el('date').value;
          const dur = Number(el('duration').value) || 30;
          const allow = el('allowOverlap').checked;
          const av = Store.availability(proId, d, dur, {
            ignoreId: editing ? editing.id : '',
            allowOverlap: allow,
            includePast: !!editing
          });
          const p = Store.getPro(proId);
          const wh = Store.hoursFor(p, d);

          if (!av.open) {
            area.innerHTML = `<div class="alert warn">${Icon('alert', 16)}<div>${U.esc(av.reason)}</div></div>`;
            return;
          }
          if (!av.slots.length) {
            area.innerHTML = `<div class="alert warn">${Icon('alert', 16)}<div>${U.esc(av.reason)} ${allow ? '' : 'Você pode marcar como encaixe abaixo.'}</div></div>`;
            return;
          }
          const shown = av.slots.slice(0, 28);
          area.innerHTML = `
            <div class="row between" style="margin-bottom:6px">
              <span class="label">Horários livres${p ? ' · ' + U.esc(p.name) : ''}</span>
              <span class="tiny muted">${wh ? wh.open + '–' + wh.close : ''}${wh && wh.breakStart ? ' · pausa ' + wh.breakStart + '–' + wh.breakEnd : ''}</span>
            </div>
            <div class="chips">
              ${shown.map(s => `<button type="button" class="chip ${s === el('start').value ? 'active' : ''}" data-slot="${s}">${s}</button>`).join('')}
              ${av.slots.length > shown.length ? `<span class="chip chip-static">+${av.slots.length - shown.length} horários</span>` : ''}
            </div>`;
          area.querySelectorAll('[data-slot]').forEach(b => b.addEventListener('click', () => {
            el('start').value = b.dataset.slot;
            area.querySelectorAll('[data-slot]').forEach(x => x.classList.toggle('active', x === b));
          }));
        };

        el('serviceId').addEventListener('change', () => applyService(true));
        el('professionalId').addEventListener('change', () => { refreshServices(); refreshSlots(); });
        el('date').addEventListener('change', refreshSlots);
        el('duration').addEventListener('input', U.debounce(refreshSlots, 260));
        el('allowOverlap').addEventListener('change', refreshSlots);

        const repeatChk = overlay.querySelector('#repeatChk');
        if (repeatChk) {
          repeatChk.addEventListener('change', () => {
            overlay.querySelector('#repeatOpts').classList.toggle('hidden', !repeatChk.checked);
          });
        }

        overlay.querySelector('#btnNewClient').addEventListener('click', () => {
          client(null, {
            onSaved: (newClient) => {
              const sel = el('clientId');
              const opt = document.createElement('option');
              opt.value = newClient.id;
              opt.textContent = newClient.name + (newClient.phone ? ' · ' + newClient.phone : '');
              sel.appendChild(opt);
              sel.value = newClient.id;
            }
          });
        });

        refreshServices();
        refreshSlots();

        if (!el('start').value) {
          const av = Store.availability(el('professionalId').value, el('date').value, Number(el('duration').value) || 30, { includePast: false });
          if (av.slots.length) el('start').value = av.slots[0];
        }

        f.addEventListener('submit', ev => {
          ev.preventDefault();
          err.textContent = '';
          const data = {
            clientId: el('clientId').value,
            serviceId: el('serviceId').value,
            professionalId: el('professionalId').value,
            date: el('date').value,
            start: el('start').value,
            duration: Number(el('duration').value),
            buffer: (Store.getService(el('serviceId').value) || {}).buffer || 0,
            status: el('status').value,
            notes: el('notes').value.trim(),
            allowOverlap: el('allowOverlap').checked
          };
          if (canMoney) data.price = Number(el('price').value) || 0;

          if (editing) {
            const res = Store.updateAppointment(editing.id, data);
            if (!res.ok) { err.textContent = res.message; return; }
            UI.close(mid);
            App.refresh();
            UI.toast('Agendamento atualizado.', 'success');
            return;
          }

          const res = Store.createAppointment(data);
          if (!res.ok) { err.textContent = res.message; return; }

          if (opts.waitlistId) Store.markWaitlistScheduled(opts.waitlistId, res.appointment.id);

          let created = 1, skipped = 0;
          if (repeatChk && repeatChk.checked) {
            const weeks = U.clamp(Number(el('weeks').value) || 2, 2, 52);
            for (let w = 1; w < weeks; w++) {
              const d = U.iso(U.addDays(U.parseISO(data.date), w * 7));
              const r = Store.createAppointment({ ...data, date: d });
              if (r.ok) created++; else skipped++;
            }
          }
          UI.close(mid);
          App.refresh();
          if (created > 1) {
            UI.toast(`${created} agendamentos criados${skipped ? ` · ${skipped} conflito(s) ignorado(s)` : ''}.`, skipped ? 'warn' : 'success');
          } else {
            UI.toast('Agendamento criado.', 'success');
          }
        });
      }
    });
  }

  /* ======================================================================
     DETALHES DO AGENDAMENTO
     ====================================================================== */
  function appointmentDetails(id) {
    const a = Store.getAppt(id);
    if (!a) return;
    const c = Store.getClient(a.clientId);
    const s = Store.getService(a.serviceId);
    const p = Store.getPro(a.professionalId);
    const settings = Store.settings();
    const price = Store.servicePrice(a);
    const canMoney = Store.canSeeMoney();
    const isDone = a.status === 'concluido';
    const checked = Store.isCheckedIn(a);
    const checkedTime = checked
      ? new Date(a.checkedInAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '';
    const isToday = a.date === U.todayISO();

    const payBadge = canMoney && isDone
      ? (a.paid
        ? `<span class="badge badge-confirmado"><i class="dot"></i>Pago${a.paymentMethod ? ' · ' + U.esc(a.paymentMethod) : ''}</span>`
        : `<span class="badge badge-faltou"><i class="dot"></i>A receber</span>`)
      : '';

    const body = `
      <div class="row" style="gap:13px;margin-bottom:16px">
        ${UI.avatar(c ? c.name : '?', p ? p.color : null, 'avatar-lg')}
        <div style="min-width:0;flex:1">
          <h3 style="font-size:17px">${U.esc(c ? c.name : 'Cliente removido')}</h3>
          <div class="row wrap" style="gap:6px;margin-top:5px">
            ${UI.statusBadge(a.status)}
            ${payBadge}
            ${checked ? `<span class="badge badge-confirmado"><i class="dot"></i>Check-in ${U.esc(checkedTime)}</span>` : ''}
            ${c && c.phone ? `<span class="small muted">${U.esc(c.phone)}</span>` : ''}
          </div>
        </div>
        <div style="text-align:right">
          ${canMoney
        ? `<div class="strong" style="font-size:18px">${Store.money(price)}</div>`
        : `<div class="tiny muted row" style="gap:4px;justify-content:flex-end">${Icon('lock', 12)} protegido</div>`}
          <div class="tiny muted">${a.duration} min</div>
        </div>
      </div>

      <div class="list" style="border-top:1px solid var(--border)">
        <div class="list-item">
          <div class="stat-icon blue">${Icon('calendar', 17)}</div>
          <div class="li-main"><span>Data e horário</span><strong>${U.esc(U.fmtDateLong(a.date))} · ${a.start}–${U.minToTime(U.timeToMin(a.start) + a.duration)}</strong></div>
        </div>
        <div class="list-item">
          <div class="stat-icon">${Icon('scissors', 17)}</div>
          <div class="li-main"><span>${U.esc(settings.labels.service)}</span><strong>${U.esc(s ? s.name : 'Serviço removido')}</strong></div>
        </div>
        <div class="list-item">
          <div class="stat-icon green">${Icon('user', 17)}</div>
          <div class="li-main"><span>${U.esc(settings.labels.pro)}</span><strong>${U.esc(p ? p.name : 'Profissional removido')}${p && p.role ? ' · ' + U.esc(p.role) : ''}</strong></div>
        </div>
        ${a.notes ? `<div class="list-item">
          <div class="stat-icon amber">${Icon('alert', 17)}</div>
          <div class="li-main"><span>Observações</span><strong style="white-space:normal;font-weight:500;font-size:12.5px">${U.esc(a.notes)}</strong></div>
        </div>` : ''}
      </div>

      ${!isDone && isToday ? `<div class="row" style="margin-top:14px;gap:8px">
        ${checked
        ? `<button type="button" class="btn btn-sm" data-undo-checkin>${Icon('repeat', 14)} Desfazer check-in</button>`
        : `<button type="button" class="btn btn-sm btn-success" data-checkin>${Icon('userCheck', 14)} Fazer check-in</button>`}
        <span class="tiny muted">${checked ? 'Cliente já chegou.' : 'Registre a chegada do cliente ao chegar.'}</span>
      </div>` : ''}

      <div style="margin-top:16px">
        <div class="label" style="margin-bottom:7px">Alterar status</div>
        <div class="chips">
          ${Store.STATUS_ORDER.map(st => `<button type="button" class="chip ${a.status === st ? 'active' : ''}" data-setstatus="${st}">${Store.STATUS[st].label}</button>`).join('')}
        </div>
      </div>`;

    let mainLabel = 'Reabrir';
    if (a.status === 'agendado') mainLabel = 'Confirmar';
    else if (a.status === 'confirmado') mainLabel = 'Concluir atendimento';
    else if (isDone && a.paid) mainLabel = 'Enviar lembrete';
    else if (isDone && canMoney) mainLabel = 'Registrar pagamento';

    const showMain = !isDone || canMoney || a.paid;

    const m = UI.open({
      title: 'Detalhes do agendamento',
      size: 'modal-lg',
      body,
      footer: `
        <button class="btn btn-ghost btn-danger" data-del>${Icon('trash', 15)} Excluir</button>
        <div class="spacer"></div>
        ${c && c.phone ? `<button class="btn" data-wa>${Icon('whatsapp', 15)} WhatsApp</button>` : ''}
        <button class="btn" data-edit>${Icon('edit', 15)} Editar</button>
        ${showMain ? `<button class="btn btn-primary" data-main>${mainLabel}</button>` : ''}`,
      onMount: (overlay, mid) => {
        const reopen = () => { UI.close(mid); setTimeout(() => appointmentDetails(id), 90); };

        const chk = overlay.querySelector('[data-checkin]');
        if (chk) chk.addEventListener('click', () => {
          checkIn(id);
          reopen();
        });
        const undo = overlay.querySelector('[data-undo-checkin]');
        if (undo) undo.addEventListener('click', () => {
          undoCheckIn(id);
          reopen();
        });

        overlay.querySelectorAll('[data-setstatus]').forEach(b => b.addEventListener('click', async () => {
          const st = b.dataset.setstatus;
          if (st === a.status) return;
          if (st === 'concluido') {
            UI.close(mid);
            setTimeout(() => canMoney ? finish(id) : quickFinish(id), 90);
            return;
          }
          if (st === 'cancelado') {
            const ok = await UI.confirm({
              title: 'Cancelar agendamento',
              message: 'O horário será liberado na agenda. Deseja continuar?',
              confirmText: 'Cancelar agendamento',
              danger: true
            });
            if (!ok) return;
          }
          Store.setStatus(id, st);
          App.refresh();
          UI.toast('Status atualizado.', 'success');
          reopen();
        }));

        overlay.querySelector('[data-edit]').addEventListener('click', () => {
          UI.close(mid);
          setTimeout(() => appointment({ id }), 90);
        });

        overlay.querySelector('[data-wa]').addEventListener('click', () => reminder(id));

        overlay.querySelector('[data-del]').addEventListener('click', async () => {
          const ok = await UI.confirm({
            title: 'Excluir agendamento',
            message: 'Essa ação remove o agendamento permanentemente. Deseja continuar?',
            confirmText: 'Excluir',
            danger: true
          });
          if (!ok) return;
          Store.deleteAppointment(id);
          UI.close(mid);
          App.refresh();
          UI.toast('Agendamento excluído.', 'success');
        });

        const main = overlay.querySelector('[data-main]');
        if (main) main.addEventListener('click', () => {
          if (a.status === 'agendado') {
            Store.setStatus(id, 'confirmado');
            App.refresh();
            UI.toast('Agendamento confirmado.', 'success');
            reopen();
          } else if (a.status === 'confirmado' || (isDone && !a.paid)) {
            UI.close(mid);
            setTimeout(() => canMoney ? finish(id) : quickFinish(id), 90);
          } else if (isDone && a.paid) {
            reminder(id);
          } else {
            Store.setStatus(id, 'agendado');
            App.refresh();
            UI.toast('Agendamento reaberto.', 'success');
            reopen();
          }
        });
      }
    });
  }

  /* ======================================================================
     CONCLUIR / PAGAMENTO
     ====================================================================== */
  function finish(id) {
    const a = Store.getAppt(id);
    if (!a) return;
    if (!Store.canSeeMoney()) return quickFinish(id);
    const settings = Store.settings();
    const price = Store.servicePrice(a);

    const body = `
      <form id="finishForm" class="stack">
        <div class="alert info">${Icon('checkCircle', 17)}<div>Confirme o valor recebido para registrar no financeiro.</div></div>
        <div class="form-grid">
          <div class="field">
            <label>Valor (${U.esc(settings.currency)})</label>
            <input type="number" name="price" class="input" min="0" step="0.01" value="${price}">
          </div>
          <div class="field">
            <label>Forma de pagamento</label>
            <select name="method" class="select">
              ${settings.paymentMethods.map(pm => `<option value="${U.esc(pm)}">${U.esc(pm)}</option>`).join('')}
            </select>
          </div>
          <div class="field span-2">
            <label class="check"><input type="checkbox" name="paid" checked> Pagamento recebido agora</label>
            <span class="hint">Se desmarcar, o valor ficará como "a receber" no financeiro.</span>
          </div>
          <div class="field span-2">
            <label>Observações do atendimento</label>
            <textarea name="notes" class="textarea" placeholder="Evolução, produtos usados, retorno...">${U.esc(a.notes || '')}</textarea>
          </div>
        </div>
      </form>`;

    const m = UI.open({
      title: 'Concluir atendimento',
      subtitle: `${Store.clientLabel(Store.getClient(a.clientId))} · ${U.fmtDate(a.date)} às ${a.start}`,
      size: 'modal-sm',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="finishForm">${Icon('check', 16)} Concluir</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#finishForm');
        f.addEventListener('submit', e => {
          e.preventDefault();
          Store.setStatus(id, 'concluido', {
            price: Number(f.elements['price'].value) || 0,
            paid: f.elements['paid'].checked,
            paymentMethod: f.elements['method'].value,
            notes: f.elements['notes'].value.trim()
          });
          UI.close(mid);
          App.refresh();
          UI.toast('Atendimento concluído e registrado.', 'success');
        });
      }
    });
  }

  /* Conclusão rápida — usada pela recepção. Não exibe nem altera valores. */
  function quickFinish(id) {
    const a = Store.getAppt(id);
    if (!a) return;
    const body = `
      <form id="quickFinishForm" class="stack">
        <div class="alert info">${Icon('lock', 17)}<div>O atendimento será marcado como <strong>concluído</strong>. O pagamento e o valor ficam sob responsabilidade do gestor.</div></div>
        <div class="field">
          <label>Observações do atendimento</label>
          <textarea name="notes" class="textarea" placeholder="Informações para a equipe...">${U.esc(a.notes || '')}</textarea>
        </div>
      </form>`;
    const m = UI.open({
      title: 'Concluir atendimento',
      subtitle: `${Store.clientLabel(Store.getClient(a.clientId))} · ${U.fmtDate(a.date)} às ${a.start}`,
      size: 'modal-sm',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="quickFinishForm">${Icon('check', 16)} Concluir</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#quickFinishForm');
        f.addEventListener('submit', e => {
          e.preventDefault();
          Store.setStatus(id, 'concluido', { notes: f.elements['notes'].value.trim() });
          UI.close(mid);
          App.refresh();
          UI.toast('Atendimento concluído.', 'success');
        });
      }
    });
  }

  /* Check-in rápido (recepção) */
  function checkIn(id) {
    if (Store.checkIn(id)) {
      App.refresh();
      UI.toast('Check-in realizado.', 'success');
    } else {
      UI.toast('Não é possível fazer check-in neste atendimento.', 'warn');
    }
  }

  function undoCheckIn(id) {
    if (Store.undoCheckIn(id)) {
      App.refresh();
      UI.toast('Check-in desfeito.', 'success');
    }
  }

  /* ======================================================================
     ACESSO DO GESTOR (modo recepção)
     ====================================================================== */
  function unlockAccess() {
    if (!Store.db) return;
    if (Store.canSeeMoney()) { UI.toast('O acesso do gestor já está liberado.', 'info'); return; }
    const hasPin = Store.hasAdminPin();

    const body = `
      <form id="unlockForm" class="stack">
        <div class="alert info">${Icon('shield', 17)}<div>O modo recepção oculta valores financeiros. Informe o PIN do gestor para liberar o acesso nesta sessão.</div></div>
        ${hasPin
        ? `<div class="field">
            <label>PIN do gestor <span class="req">*</span></label>
            <input type="password" name="pin" class="input" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="••••" required>
            <span class="hint">O PIN não é armazenado nesta sessão. Ao recarregar, os valores voltam a ficar protegidos.</span>
          </div>`
        : `<div class="alert warn">${Icon('alert', 16)}<div>Nenhum PIN foi definido ainda. Você pode liberar o acesso e criar um PIN em <strong>Configurações → Acesso</strong>.</div></div>`}
        <div id="unlockError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: 'Acesso do gestor',
      subtitle: 'Valores financeiros protegidos',
      size: 'modal-sm',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="unlockForm">${Icon('unlock', 16)} Liberar acesso</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#unlockForm');
        const err = overlay.querySelector('#unlockError');
        f.addEventListener('submit', e => {
          e.preventDefault();
          err.textContent = '';
          const res = Store.unlock(hasPin ? f.elements['pin'].value : '');
          if (!res.ok) { err.textContent = res.message; return; }
          UI.close(mid);
          App.refresh();
          UI.toast('Acesso do gestor liberado nesta sessão.', 'success');
          if (res.firstTime) UI.toast('Defina um PIN em Configurações → Acesso.', 'info', 4500);
        });
      }
    });
  }

  function lockAccess() {
    if (!Store.settings().receptionMode) {
      UI.toast('O modo recepção está desativado. Ative em Configurações → Acesso.', 'warn', 4200);
      return;
    }
    UI.confirm({
      title: 'Proteger valores',
      message: 'O acesso do gestor será bloqueado e os valores financeiros ficarão ocultos novamente. Deseja continuar?',
      confirmText: 'Bloquear acesso'
    }).then(ok => {
      if (!ok) return;
      Store.lock();
      if (App.route === 'finance') App.go('dashboard');
      else App.refresh();
      UI.toast('Valores financeiros protegidos.', 'success');
    });
  }

  /* ======================================================================
     LISTA DE ESPERA
     ====================================================================== */
  function waitlist(id = null) {
    const editing = id ? Store.getWaitlist(id) : null;
    if (id && !editing) return;
    const settings = Store.settings();

    if (!Store.activeServices().length) {
      UI.toast('Cadastre pelo menos um serviço antes de usar a lista de espera.', 'warn');
      App.go('services');
      return;
    }
    if (!Store.db.clients.length) {
      UI.toast('Cadastre um cliente primeiro.', 'info');
      client(null, { onSaved: () => waitlist(id) });
      return;
    }

    const body = `
      <form id="waitlistForm" class="stack">
        <div class="form-grid">
          <div class="field span-2">
            <label>${U.esc(settings.labels.client)} <span class="req">*</span></label>
            <div class="row" style="gap:8px">
              <select name="clientId" class="select" required>${clientOptions(editing ? editing.clientId : '')}</select>
              <button type="button" class="btn btn-soft btn-sm" id="wlNewClient" title="Cadastrar ${U.esc(settings.labels.client.toLowerCase())}">${Icon('userPlus', 15)} Novo</button>
            </div>
          </div>
          <div class="field">
            <label>${U.esc(settings.labels.service)} <span class="req">*</span></label>
            <select name="serviceId" class="select" required>
              ${Store.activeServices().map(sv => `<option value="${sv.id}" ${editing && editing.serviceId === sv.id ? 'selected' : ''}>${U.esc(sv.name)} · ${sv.duration} min</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>${U.esc(settings.labels.pro)}</label>
            <select name="professionalId" class="select">
              <option value="">Qualquer profissional</option>
              ${proOptions(editing ? editing.professionalId : '')}
            </select>
          </div>
          <div class="field">
            <label>Data desejada</label>
            <input type="date" name="date" class="input" value="${editing ? editing.date : ''}">
            <span class="hint">Deixe em branco para qualquer dia.</span>
          </div>
          <div class="field">
            <label>Período preferido</label>
            <select name="period" class="select">
              <option value="qualquer" ${!editing || editing.period === 'qualquer' ? 'selected' : ''}>Qualquer horário</option>
              <option value="manha" ${editing && editing.period === 'manha' ? 'selected' : ''}>Manhã</option>
              <option value="tarde" ${editing && editing.period === 'tarde' ? 'selected' : ''}>Tarde</option>
            </select>
          </div>
          <div class="field span-2">
            <label>Prioridade</label>
            <div class="chips">
              <label class="check"><input type="radio" name="priority" value="normal" ${!editing || editing.priority !== 'alta' ? 'checked' : ''}> Normal</label>
              <label class="check"><input type="radio" name="priority" value="alta" ${editing && editing.priority === 'alta' ? 'checked' : ''}> Alta — encaixar assim que possível</label>
            </div>
          </div>
          <div class="field span-2">
            <label>Observações</label>
            <textarea name="notes" class="textarea" placeholder="Horários possíveis, telefone alternativo, preferências...">${U.esc(editing ? editing.notes : '')}</textarea>
          </div>
        </div>
        <div id="waitlistError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar lista de espera' : 'Adicionar à lista de espera',
      subtitle: 'Registre quem quer um horário e encaixe quando vagar.',
      size: 'modal-lg',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="waitlistForm">${Icon('check', 16)} ${editing ? 'Salvar' : 'Adicionar'}</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#waitlistForm');
        const err = overlay.querySelector('#waitlistError');
        overlay.querySelector('#wlNewClient').addEventListener('click', () => {
          client(null, {
            onSaved: newClient => {
              const sel = f.elements['clientId'];
              const opt = document.createElement('option');
              opt.value = newClient.id;
              opt.textContent = newClient.name + (newClient.phone ? ' · ' + newClient.phone : '');
              sel.appendChild(opt);
              sel.value = newClient.id;
            }
          });
        });
        f.addEventListener('submit', e => {
          e.preventDefault();
          err.textContent = '';
          const data = {
            clientId: f.elements['clientId'].value,
            serviceId: f.elements['serviceId'].value,
            professionalId: f.elements['professionalId'].value,
            date: f.elements['date'].value,
            period: f.elements['period'].value,
            priority: f.elements['priority'].value,
            notes: f.elements['notes'].value.trim()
          };
          const res = editing ? Store.updateWaitlist(editing.id, data) : Store.addWaitlist(data);
          if (!res.ok) { err.textContent = res.message; return; }
          UI.close(mid);
          App.refresh();
          UI.toast(editing ? 'Lista de espera atualizada.' : 'Cliente adicionado à lista de espera.', 'success');
        });
      }
    });
  }

  function scheduleFromWaitlist(id) {
    const entry = Store.getWaitlist(id);
    if (!entry) return;
    const svc = Store.getService(entry.serviceId);
    if (!svc) { UI.toast('O serviço desta entrada não existe mais.', 'warn'); return; }
    const next = Store.nextAvailable(entry.serviceId, entry.professionalId, {
      period: entry.period,
      from: entry.date || U.todayISO(),
      days: 60
    });
    if (!next) {
      UI.toast('Nenhum horário livre nos próximos 60 dias. Ajuste os filtros ou bloqueios.', 'warn', 5000);
      return;
    }
    UI.toast(`Sugestão: ${U.fmtDate(next.date)} às ${next.start} com ${next.professional.name}.`, 'info', 3800);
    appointment({
      clientId: entry.clientId,
      serviceId: entry.serviceId,
      proId: next.professionalId,
      date: next.date,
      start: next.start,
      waitlistId: entry.id
    });
  }

  /* ======================================================================
     LEMBRETE / WHATSAPP
     ====================================================================== */
  function reminder(id) {
    const a = Store.getAppt(id);
    if (!a) return;
    const c = Store.getClient(a.clientId);
    const msg = Store.reminderMessage(a);
    const phone = c ? c.phone : '';

    const body = `
      <form id="remForm" class="stack">
        ${!phone ? `<div class="alert warn">${Icon('alert', 16)}<div>Este cliente não tem telefone cadastrado. Copie a mensagem e envie pelo canal que preferir.</div></div>` : ''}
        <div class="field">
          <label>Mensagem</label>
          <textarea name="message" class="textarea" rows="7">${U.esc(msg)}</textarea>
          <span class="hint">Você pode editar antes de enviar. Placeholders disponíveis nas configurações.</span>
        </div>
        <div class="row wrap">
          <button type="button" class="btn btn-sm" id="btnCopy">${Icon('copy', 15)} Copiar mensagem</button>
          ${phone ? `<a class="btn btn-sm btn-success" id="btnWa" href="${U.waLink(phone, msg)}" target="_blank" rel="noopener">${Icon('whatsapp', 15)} Abrir WhatsApp</a>` : ''}
        </div>
      </form>`;

    UI.open({
      title: 'Enviar lembrete',
      subtitle: c ? `${c.name} · ${U.fmtDate(a.date)} às ${a.start}` : '',
      body,
      footer: `<div class="spacer"></div><button class="btn btn-primary" data-ui-close>Fechar</button>`,
      onMount: (overlay) => {
        const ta = overlay.querySelector('textarea');
        const wa = overlay.querySelector('#btnWa');
        if (wa) {
          wa.addEventListener('click', e => {
            e.preventDefault();
            window.open(U.waLink(phone, ta.value), '_blank', 'noopener');
          });
        }
        overlay.querySelector('#btnCopy').addEventListener('click', async () => {
          const ok = await U.copy(ta.value);
          UI.toast(ok ? 'Mensagem copiada.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
        });
      }
    });
  }

  /* ======================================================================
     CLIENTE — criar / editar
     ====================================================================== */
  function client(id = null, opts = {}) {
    const editing = id ? Store.getClient(id) : null;
    const settings = Store.settings();
    const customFields = settings.customFields || [];
    const custom = (editing && editing.custom) || {};

    const body = `
      <form id="clientForm" class="stack" novalidate>
        <div class="form-grid">
          <div class="field span-2">
            <label>Nome completo <span class="req">*</span></label>
            <input type="text" name="name" class="input" value="${U.esc(editing ? editing.name : '')}" placeholder="Ex.: Maria Oliveira" required autocomplete="off">
          </div>
          <div class="field">
            <label>Telefone / WhatsApp</label>
            <input type="tel" name="phone" class="input" value="${U.esc(editing ? editing.phone : '')}" placeholder="(11) 99999-9999">
          </div>
          <div class="field">
            <label>E-mail</label>
            <input type="email" name="email" class="input" value="${U.esc(editing ? editing.email : '')}" placeholder="cliente@email.com">
          </div>
          <div class="field">
            <label>Data de nascimento</label>
            <input type="date" name="birthdate" class="input" value="${editing ? editing.birthdate : ''}">
          </div>
          <div class="field">
            <label>Tags</label>
            <input type="text" name="tags" class="input" value="${U.esc(editing ? (editing.tags || []).join(', ') : '')}" placeholder="VIP, Recorrente, Novo...">
          </div>
          ${customFields.map(cf => `
            <div class="field">
              <label>${U.esc(cf.label)}</label>
              <input type="${cf.type === 'number' ? 'number' : cf.type === 'date' ? 'date' : 'text'}" name="custom_${cf.id}" class="input" value="${U.esc(custom[cf.id] || '')}">
            </div>`).join('')}
          <div class="field span-2">
            <label>Observações</label>
            <textarea name="notes" class="textarea" placeholder="Alergias, preferências, histórico...">${U.esc(editing ? editing.notes : '')}</textarea>
          </div>
        </div>
        <div id="clientError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar cliente' : 'Novo cliente',
      subtitle: editing ? 'Atualize os dados cadastrais.' : 'Cadastre para agilizar os próximos agendamentos.',
      size: 'modal-lg',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="clientForm">${Icon('check', 16)} ${editing ? 'Salvar' : 'Cadastrar'}</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#clientForm');
        const err = overlay.querySelector('#clientError');

        f.addEventListener('submit', e => {
          e.preventDefault();
          const name = f.elements['name'].value.trim();
          if (!name) { err.textContent = 'Informe o nome do cliente.'; f.elements['name'].focus(); return; }

          const data = {
            name,
            phone: f.elements['phone'].value.trim(),
            email: f.elements['email'].value.trim(),
            birthdate: f.elements['birthdate'].value,
            notes: f.elements['notes'].value.trim(),
            tags: f.elements['tags'].value.split(',').map(t => t.trim()).filter(Boolean)
          };

          const customValues = {};
          customFields.forEach(cf => {
            const inp = f.elements['custom_' + cf.id];
            if (inp) customValues[cf.id] = inp.value.trim();
          });

          if (editing) {
            Object.assign(editing, data, { custom: customValues });
            Store.save();
            UI.close(mid);
            if (opts.onSaved) opts.onSaved(editing);
            App.refresh();
            UI.toast('Cliente atualizado.', 'success');
          } else {
            const newClient = {
              id: U.uid('cli'),
              ...data,
              custom: customValues,
              createdAt: new Date().toISOString()
            };
            Store.db.clients.push(newClient);
            Store.save();
            UI.close(mid);
            if (opts.onSaved) opts.onSaved(newClient);
            App.refresh();
            UI.toast('Cliente cadastrado.', 'success');
          }
        });
      }
    });
  }

  /* ======================================================================
     CLIENTE — detalhes e histórico
     ====================================================================== */
  function clientDetails(id) {
    const c = Store.getClient(id);
    if (!c) return;
    const s = Store.clientSummary(id);
    const appts = Store.clientAppointments(id).slice(0, 12);
    const settings = Store.settings();
    const canMoney = Store.canSeeMoney();

    const body = `
      <div class="row" style="gap:13px;margin-bottom:16px">
        ${UI.avatar(c.name, null, 'avatar-lg')}
        <div style="min-width:0;flex:1">
          <h3 style="font-size:17px">${U.esc(c.name)}</h3>
          <div class="small muted" style="margin-top:2px">${U.esc(c.phone || 'Sem telefone')}${c.email ? ' · ' + U.esc(c.email) : ''}</div>
          ${(c.tags || []).length ? `<div class="chips" style="margin-top:6px">${c.tags.map(t => `<span class="chip chip-static">${U.esc(t)}</span>`).join('')}</div>` : ''}
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns:repeat(${canMoney ? 3 : 2},minmax(0,1fr));gap:9px;margin-bottom:16px">
        <div class="stat" style="padding:11px 12px;gap:3px">
          <span class="stat-label">Atendimentos</span>
          <span class="stat-value" style="font-size:19px">${s.visits}</span>
        </div>
        ${canMoney ? `
        <div class="stat" style="padding:11px 12px;gap:3px">
          <span class="stat-label">Total pago</span>
          <span class="stat-value" style="font-size:19px">${Store.money(s.spent)}</span>
        </div>
        <div class="stat" style="padding:11px 12px;gap:3px">
          <span class="stat-label">A receber</span>
          <span class="stat-value" style="font-size:19px;color:${s.pending ? 'var(--amber)' : 'inherit'}">${Store.money(s.pending)}</span>
        </div>` : `
        <div class="stat" style="padding:11px 12px;gap:3px">
          <span class="stat-label">Próximo</span>
          <span class="stat-value" style="font-size:15px">${s.next ? U.fmtDate(s.next.date) : '—'}</span>
        </div>`}
      </div>

      <div class="row wrap" style="gap:7px;margin-bottom:16px">
        ${c.phone ? `<a class="btn btn-sm" href="tel:${U.esc(U.normPhone(c.phone))}">${Icon('phone', 14)} Ligar</a>` : ''}
        ${c.phone ? `<a class="btn btn-sm btn-success" href="${U.waLink(c.phone, 'Olá, ' + c.name + '!')}" target="_blank" rel="noopener">${Icon('whatsapp', 14)} WhatsApp</a>` : ''}
        ${c.email ? `<a class="btn btn-sm" href="mailto:${U.esc(c.email)}">${Icon('mail', 14)} E-mail</a>` : ''}
        <button class="btn btn-sm btn-soft" data-new-appt>${Icon('plus', 14)} Agendar</button>
      </div>

      ${s.next ? `<div class="alert info" style="margin-bottom:16px">
        ${Icon('calendar', 17)}
        <div style="flex:1"><strong>Próximo:</strong> ${U.esc(U.fmtDateLong(s.next.date))} às ${s.next.start} · ${U.esc(Store.serviceLabel(Store.getService(s.next.serviceId)))}</div>
        <button class="btn btn-sm btn-ghost" data-open-next="${s.next.id}">Ver</button>
      </div>` : ''}

      ${c.notes ? `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:16px">
        <div class="label" style="margin-bottom:4px">Observações</div>
        <p class="small" style="color:var(--text-2);white-space:pre-wrap">${U.esc(c.notes)}</p>
      </div>` : ''}

      <div class="section-head" style="margin-bottom:8px">
        <h2 style="font-size:13.5px">Histórico</h2>
        <div class="spacer"></div>
        <span class="tiny muted">${s.total} registro(s)</span>
      </div>
      <div class="list">
        ${appts.length ? appts.map(a => {
      const svc = Store.getService(a.serviceId);
      const p = Store.getPro(a.professionalId);
      return `<div class="list-item" style="cursor:pointer" data-appt="${a.id}">
            <div class="tl-time" style="width:46px"><strong style="font-size:12px">${U.fmtDate(a.date)}</strong><span>${a.start}</span></div>
            <div class="li-main"><strong>${U.esc(svc ? svc.name : 'Serviço removido')}</strong><span>${U.esc(p ? p.name : '—')}${canMoney ? ' · ' + Store.money(Store.servicePrice(a)) : ''}</span></div>
            <div class="li-end">${UI.statusBadge(a.status)}</div>
          </div>`;
    }).join('') : `<div class="tl-empty">Nenhum atendimento registrado ainda.</div>`}
      </div>`;

    const m = UI.open({
      title: 'Ficha do cliente',
      size: 'modal-lg',
      body,
      footer: `<button class="btn btn-ghost btn-danger" data-del>${Icon('trash', 15)} Excluir</button>
        <div class="spacer"></div>
        <button class="btn" data-edit>${Icon('edit', 15)} Editar</button>
        <button class="btn btn-primary" data-new>${Icon('plus', 15)} Novo agendamento</button>`,
      onMount: (overlay, mid) => {
        overlay.querySelector('[data-edit]').addEventListener('click', () => {
          UI.close(mid);
          setTimeout(() => client(id), 90);
        });
        overlay.querySelector('[data-new]').addEventListener('click', () => {
          UI.close(mid);
          setTimeout(() => appointment({ clientId: id }), 90);
        });
        const newApptBtn = overlay.querySelector('[data-new-appt]');
        if (newApptBtn) newApptBtn.addEventListener('click', () => {
          UI.close(mid);
          setTimeout(() => appointment({ clientId: id }), 90);
        });
        const nextBtn = overlay.querySelector('[data-open-next]');
        if (nextBtn) nextBtn.addEventListener('click', () => appointmentDetails(nextBtn.dataset.openNext));
        overlay.querySelectorAll('[data-appt]').forEach(row => {
          row.addEventListener('click', () => appointmentDetails(row.dataset.appt));
        });
        overlay.querySelector('[data-del]').addEventListener('click', async () => {
          const ok = await UI.confirm({
            title: 'Excluir cliente',
            message: 'O cadastro será removido. O histórico de agendamentos é mantido, mas ficará sem vínculo com o cliente. Deseja continuar?',
            confirmText: 'Excluir cliente',
            danger: true
          });
          if (!ok) return;
          const idx = Store.db.clients.findIndex(x => x.id === id);
          if (idx >= 0) Store.db.clients.splice(idx, 1);
          Store.save();
          UI.close(mid);
          App.refresh();
          UI.toast('Cliente excluído.', 'success');
        });
      }
    });
  }

  /* ======================================================================
     SERVIÇO
     ====================================================================== */
  function service(id = null) {
    const editing = id ? Store.getService(id) : null;
    const settings = Store.settings();
    const canMoney = Store.canSeeMoney();

    const body = `
      <form id="serviceForm" class="stack" novalidate>
        <div class="form-grid">
          <div class="field span-2">
            <label>Nome do serviço <span class="req">*</span></label>
            <input type="text" name="name" class="input" value="${U.esc(editing ? editing.name : '')}" placeholder="Ex.: Corte masculino" required>
          </div>
          <div class="field">
            <label>Categoria</label>
            <input type="text" name="category" class="input" value="${U.esc(editing ? editing.category : '')}" placeholder="Cabelo, Consulta, Estética...">
          </div>
          <div class="field">
            <label>Cor</label>
            <input type="color" name="color" class="color-input" value="${editing ? editing.color : settings.accent}">
          </div>
          <div class="field">
            <label>Duração (min) <span class="req">*</span></label>
            <input type="number" name="duration" class="input" min="5" step="5" value="${editing ? editing.duration : 30}" required>
          </div>
          <div class="field">
            <label>Preço (${U.esc(settings.currency)})</label>
            ${canMoney
        ? `<input type="number" name="price" class="input" min="0" step="0.01" value="${editing ? editing.price : 0}">`
        : `<div class="input" style="display:flex;align-items:center;gap:8px;color:var(--muted);background:var(--surface-2)">${Icon('lock', 15)} Definido pelo gestor</div>`}
          </div>
          <div class="field">
            <label>Intervalo após o atendimento (min)</label>
            <input type="number" name="buffer" class="input" min="0" step="5" value="${editing ? editing.buffer : 0}">
            <span class="hint">Tempo de limpeza/organização entre clientes.</span>
          </div>
          <div class="field">
            <label>Situação</label>
            <label class="check" style="height:40px"><input type="checkbox" name="active" ${!editing || editing.active !== false ? 'checked' : ''}> Serviço ativo</label>
          </div>
          <div class="field span-2">
            <label>Descrição</label>
            <textarea name="description" class="textarea" placeholder="Detalhes do que está incluso...">${U.esc(editing ? editing.description : '')}</textarea>
          </div>
        </div>
        <div id="serviceError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar serviço' : 'Novo serviço',
      subtitle: 'Defina duração e valor para agilizar os agendamentos.',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="serviceForm">${Icon('check', 16)} ${editing ? 'Salvar' : 'Cadastrar'}</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#serviceForm');
        const err = overlay.querySelector('#serviceError');
        f.addEventListener('submit', e => {
          e.preventDefault();
          const name = f.elements['name'].value.trim();
          if (!name) { err.textContent = 'Informe o nome do serviço.'; return; }
          const data = {
            name,
            category: f.elements['category'].value.trim(),
            color: f.elements['color'].value,
            duration: U.clamp(Number(f.elements['duration'].value) || 30, 5, 600),
            buffer: Math.max(0, Number(f.elements['buffer'].value) || 0),
            active: f.elements['active'].checked,
            description: f.elements['description'].value.trim()
          };
          if (canMoney) data.price = Number(f.elements['price'].value) || 0;
          else if (!editing) data.price = 0;
          if (editing) {
            Object.assign(editing, data);
          } else {
            Store.db.services.push({ id: U.uid('svc'), ...data, createdAt: new Date().toISOString() });
          }
          Store.save();
          UI.close(mid);
          App.refresh();
          UI.toast(editing ? 'Serviço atualizado.' : 'Serviço cadastrado.', 'success');
        });
      }
    });
  }

  /* ======================================================================
     PROFISSIONAL
     ====================================================================== */
  function professional(id = null) {
    const editing = id ? Store.getPro(id) : null;
    const settings = Store.settings();
    const baseHours = editing ? editing.hours : (Store.db.professionals[0] || {}).hours;
    const hours = baseHours && baseHours.length === 7
      ? JSON.parse(JSON.stringify(baseHours))
      : Array.from({ length: 7 }, (_, d) => ({
        active: [1, 2, 3, 4, 5].includes(d),
        open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00'
      }));
    const restrict = editing ? (editing.services || []).length > 0 : false;

    const hoursRows = hours.map((h, d) => `
      <div class="week-hours-row ${h.active ? '' : 'disabled'}" data-day="${d}">
        <span class="wd">${U.weekdayShort[d]}</span>
        <label class="switch"><input type="checkbox" data-hactive ${h.active ? 'checked' : ''}><span class="sl"></span></label>
        <div class="times">
          <input type="time" class="input" data-hopen value="${h.open || '09:00'}">
          <span class="sep">às</span>
          <input type="time" class="input" data-hclose value="${h.close || '18:00'}">
          <span class="sep" style="margin-left:4px">pausa</span>
          <input type="time" class="input" data-hbs value="${h.breakStart || ''}">
          <span class="sep">–</span>
          <input type="time" class="input" data-hbe value="${h.breakEnd || ''}">
        </div>
      </div>`).join('');

    const servicesList = Store.db.services.map(s => `
      <label class="check" style="padding:4px 0">
        <input type="checkbox" data-svc value="${s.id}" ${restrict && (editing.services || []).includes(s.id) ? 'checked' : ''} ${!restrict ? 'checked' : ''}>
        <span style="flex:1">${U.esc(s.name)}</span>
        <span class="tiny muted">${s.duration} min</span>
      </label>`).join('');

    const body = `
      <form id="proForm" class="stack" novalidate>
        <div class="form-grid">
          <div class="field">
            <label>Nome <span class="req">*</span></label>
            <input type="text" name="name" class="input" value="${U.esc(editing ? editing.name : '')}" placeholder="Nome do profissional" required>
          </div>

          <div class="field">
            <label>Cargo / especialidade</label>
            <input type="text" name="role" class="input" value="${U.esc(editing ? editing.role : settings.labels.pro)}" placeholder="Ex.: Barbeiro, Dentista...">
          </div>
          <div class="field">
            <label>Cor na agenda</label>
            <input type="color" name="color" class="color-input" value="${editing ? editing.color : settings.accent}">
          </div>
          <div class="field">
            <label>Situação</label>
            <label class="check" style="height:40px"><input type="checkbox" name="active" ${!editing || editing.active !== false ? 'checked' : ''}> Ativo na agenda</label>
          </div>
          <div class="field">
            <label>Telefone</label>
            <input type="tel" name="phone" class="input" value="${U.esc(editing ? editing.phone : '')}" placeholder="(11) 99999-9999">
          </div>
          <div class="field">
            <label>E-mail</label>
            <input type="email" name="email" class="input" value="${U.esc(editing ? editing.email : '')}" placeholder="profissional@email.com">
          </div>
        </div>

        <div class="divider"></div>

        <div class="row between">
          <div>
            <div class="label">Horário de trabalho</div>
            <span class="hint">Defina os dias e horários de atendimento.</span>
          </div>
        </div>
        <div style="border:1px solid var(--border);border-radius:12px;padding:4px 12px">
          ${hoursRows}
        </div>

        <div class="divider"></div>

        <div class="row between">
          <div>
            <div class="label">Serviços que realiza</div>
            <span class="hint">Desmarque para limitar os serviços deste profissional.</span>
          </div>
          <label class="check"><input type="checkbox" id="allServices" ${!restrict ? 'checked' : ''}> Todos</label>
        </div>
        <div id="servicesBox" style="border:1px solid var(--border);border-radius:12px;padding:8px 12px;max-height:170px;overflow:auto;${!restrict ? 'opacity:.5;pointer-events:none' : ''}">
          ${servicesList || '<span class="hint">Nenhum serviço cadastrado.</span>'}
        </div>

        <div id="proError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar profissional' : 'Novo profissional',
      subtitle: 'Horários, serviços e identificação na agenda.',
      size: 'modal-lg',
      body,
      footer: `<button class="btn" data-ui-close>Cancelar</button><div class="spacer"></div><button class="btn btn-primary" type="submit" form="proForm">${Icon('check', 16)} ${editing ? 'Salvar' : 'Cadastrar'}</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#proForm');
        const err = overlay.querySelector('#proError');

        overlay.querySelectorAll('[data-day]').forEach(row => {
          const chk = row.querySelector('[data-hactive]');
          chk.addEventListener('change', () => row.classList.toggle('disabled', !chk.checked));
        });

        const all = overlay.querySelector('#allServices');
        const box = overlay.querySelector('#servicesBox');
        all.addEventListener('change', () => {
          box.style.opacity = all.checked ? '.5' : '1';
          box.style.pointerEvents = all.checked ? 'none' : 'auto';
        });

        f.addEventListener('submit', e => {
          e.preventDefault();
          const name = f.elements['name'].value.trim();
          if (!name) { err.textContent = 'Informe o nome do profissional.'; return; }

          const newHours = [];
          let invalid = false;
          overlay.querySelectorAll('[data-day]').forEach(row => {
            const active = row.querySelector('[data-hactive]').checked;
            const open = row.querySelector('[data-hopen]').value || '09:00';
            const close = row.querySelector('[data-hclose]').value || '18:00';
            const bs = row.querySelector('[data-hbs]').value;
            const be = row.querySelector('[data-hbe]').value;
            if (active && U.timeToMin(close) <= U.timeToMin(open)) invalid = true;
            if (active && bs && be && U.timeToMin(be) <= U.timeToMin(bs)) invalid = true;
            newHours.push({ active, open, close, breakStart: bs, breakEnd: be });
          });
          if (invalid) { err.textContent = 'Verifique os horários: o fechamento deve ser depois da abertura e a pausa deve ter início antes do fim.'; return; }

          const services = all.checked ? [] : [...overlay.querySelectorAll('[data-svc]:checked')].map(i => i.value);
          const data = {
            name,
            role: f.elements['role'].value.trim(),
            color: f.elements['color'].value,
            phone: f.elements['phone'].value.trim(),
            email: f.elements['email'].value.trim(),
            active: f.elements['active'].checked,
            hours: newHours,
            services
          };

          if (editing) {
            Object.assign(editing, data);
          } else {
            Store.db.professionals.push({ id: U.uid('pro'), ...data, createdAt: new Date().toISOString() });
          }
          Store.save();
          UI.close(mid);
          App.refresh();
          UI.toast(editing ? 'Profissional atualizado.' : 'Profissional cadastrado.', 'success');
        });
      }
    });
  }

  /* ======================================================================
     BLOQUEIO DE AGENDA
     ====================================================================== */
  function block(id = null) {
    const editing = id ? Store.db.blocks.find(b => b.id === id) : null;
    const today = U.todayISO();

    const body = `
      <form id="blockForm" class="stack" novalidate>
        <div class="form-grid">
          <div class="field span-2">
            <label>Profissional</label>
            <select name="professionalId" class="select">
              <option value="all" ${!editing || editing.professionalId === 'all' ? 'selected' : ''}>Todos os profissionais</option>
              ${Store.activePros().map(p => `<option value="${p.id}" ${editing && editing.professionalId === p.id ? 'selected' : ''}>${U.esc(p.name)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Data <span class="req">*</span></label>
            <input type="date" name="date" class="input" value="${editing ? editing.date : today}" required>
          </div>
          <div class="field">
            <label>Motivo</label>
            <input type="text" name="reason" class="input" value="${U.esc(editing ? editing.reason : '')}" placeholder="Almoço, compromisso, feriado...">
          </div>
          <div class="field span-2">
            <label class="check"><input type="checkbox" name="allDay" ${editing && editing.allDay ? 'checked' : ''}> Dia inteiro</label>
          </div>
          <div class="field">
            <label>Início</label>
            <input type="time" name="start" class="input" value="${editing && !editing.allDay ? editing.start : '12:00'}">
          </div>
          <div class="field">
            <label>Fim</label>
            <input type="time" name="end" class="input" value="${editing && !editing.allDay ? editing.end : '13:00'}">
          </div>
        </div>
        <div id="blockError" class="error-text"></div>
      </form>`;

    const m = UI.open({
      title: editing ? 'Editar bloqueio' : 'Bloquear horário',
      subtitle: 'Impeça agendamentos em um período específico.',
      body,
      footer: `${editing ? `<button class="btn btn-ghost btn-danger" data-del>${Icon('trash', 15)} Excluir</button>` : ''}<div class="spacer"></div><button class="btn" data-ui-close>Cancelar</button><button class="btn btn-primary" type="submit" form="blockForm">${Icon('check', 16)} Salvar</button>`,
      onMount: (overlay, mid) => {
        const f = overlay.querySelector('#blockForm');
        const err = overlay.querySelector('#blockError');
        const allDay = f.elements['allDay'];
        const sync = () => {
          f.elements['start'].disabled = allDay.checked;
          f.elements['end'].disabled = allDay.checked;
        };
        allDay.addEventListener('change', sync);
        sync();

        const del = overlay.querySelector('[data-del]');
        if (del) del.addEventListener('click', async () => {
          const ok = await UI.confirm({ title: 'Excluir bloqueio', message: 'O período voltará a ficar disponível.', confirmText: 'Excluir', danger: true });
          if (!ok) return;
          const i = Store.db.blocks.findIndex(b => b.id === editing.id);
          if (i >= 0) Store.db.blocks.splice(i, 1);
          Store.save();
          UI.close(mid);
          App.refresh();
          UI.toast('Bloqueio removido.', 'success');
        });

        f.addEventListener('submit', e => {
          e.preventDefault();
          const data = {
            professionalId: f.elements['professionalId'].value,
            date: f.elements['date'].value,
            allDay: allDay.checked,
            start: f.elements['start'].value,
            end: f.elements['end'].value,
            reason: f.elements['reason'].value.trim()
          };
          if (!data.date) { err.textContent = 'Informe a data.'; return; }
          if (!data.allDay && (!data.start || !data.end || U.timeToMin(data.end) <= U.timeToMin(data.start))) {
            err.textContent = 'Informe um intervalo válido (fim depois do início).';
            return;
          }
          if (editing) Object.assign(editing, data);
          else Store.db.blocks.push({ id: U.uid('blk'), ...data });
          Store.save();
          UI.close(mid);
          App.refresh();
          UI.toast('Bloqueio salvo.', 'success');
        });
      }
    });
  }

  return {
    appointment, appointmentDetails, finish, quickFinish, checkIn, undoCheckIn,
    unlockAccess, lockAccess, reminder,
    client, clientDetails, service, professional, block,
    waitlist, scheduleFromWaitlist
  };
})();
