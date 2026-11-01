/* ==========================================================================
   Onboarding — primeira configuração do Hora Marcada
   ========================================================================== */
const Onboarding = (() => {
  let state = null;
  const root = () => document.getElementById('onboarding-root');

  function defaults() {
    return {
      step: 0,
      segment: 'outro',
      businessName: '',
      ownerName: '',
      emoji: '⭐',
      workdays: [1, 2, 3, 4, 5],
      open: '09:00',
      close: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      slotMinutes: 30,
      demo: true
    };
  }

  function show() {
    state = defaults();
    applySegmentDefaults(state.segment, false);
    render();
  }

  function applySegmentDefaults(id, rerender = true) {
    const seg = Seed.segment(id);
    state.segment = id;
    state.emoji = seg.emoji;
    state.workdays = [...seg.workdays];
    state.open = seg.hours.open;
    state.close = seg.hours.close;
    state.breakStart = seg.hours.breakStart;
    state.breakEnd = seg.hours.breakEnd;
    document.documentElement.style.setProperty('--accent', seg.accent);
    document.documentElement.style.setProperty('--accent-2', seg.accent2);
    if (rerender) render();
  }

  function stepOne() {
    const seg = Seed.segment(state.segment);
    return `<h2>Qual é o seu segmento?</h2>
      <p class="onb-sub">Escolha o mais próximo do seu trabalho. Você poderá personalizar nomes, cores e serviços depois.</p>
      <div class="onb-seg-grid">
        ${Seed.SEGMENTS.map(s => `<button type="button" class="onb-seg ${state.segment === s.id ? 'active' : ''}" data-seg="${s.id}">
          <span class="em">${s.emoji}</span>
          <span class="nm">${U.esc(s.name)}</span>
        </button>`).join('')}
      </div>
      <div class="onb-preview">
        ${Icon('sparkles', 18)}
        <div>Selecionado: <strong>${seg.emoji} ${U.esc(seg.name)}</strong> — os nomes padrão serão <strong>${U.esc(seg.labels.client.toLowerCase())}</strong>, <strong>${U.esc(seg.labels.service.toLowerCase())}</strong> e <strong>${U.esc(seg.labels.appt.toLowerCase())}</strong>.</div>
      </div>`;
  }

  function stepTwo() {
    return `<h2>Como o seu negócio aparece?</h2>
      <p class="onb-sub">Essas informações ficam no menu e nos lembretes enviados aos clientes.</p>
      <div class="form-grid" style="margin-top:18px">
        <div class="field span-2">
          <label>Nome do negócio</label>
          <input type="text" id="obBusiness" class="input" value="${U.esc(state.businessName)}" placeholder="${U.esc(Seed.segment(state.segment).labels.business)}" maxlength="60">
        </div>
        <div class="field">
          <label>Seu nome</label>
          <input type="text" id="obOwner" class="input" value="${U.esc(state.ownerName)}" placeholder="Como você quer ser chamado(a)" maxlength="60">
        </div>
        <div class="field">
          <label>Emoji / ícone</label>
          <input type="text" id="obEmoji" class="input" value="${U.esc(state.emoji)}" maxlength="8" placeholder="💈">
        </div>
      </div>
      <div class="onb-preview" style="margin-top:18px">
        <div class="brand-mark" id="obPreviewEmoji" style="width:42px;height:42px;font-size:21px;border-radius:12px">${U.esc(state.emoji)}</div>
        <div>
          <strong id="obPreviewName">${U.esc(state.businessName || Seed.segment(state.segment).labels.business)}</strong>
          <div class="tiny muted" id="obPreviewOwner">${U.esc(state.ownerName || 'Seu nome')}</div>
        </div>
      </div>`;
  }

  function stepThree() {
    const seg = Seed.segment(state.segment);
    return `<h2>Quando você atende?</h2>
      <p class="onb-sub">Defina o horário padrão. Cada profissional pode ter horários próprios depois.</p>
      <div class="form-grid" style="margin-top:16px">
        <div class="field span-2">
          <label>Dias de atendimento</label>
          <div class="onb-days" id="obDays">
            ${U.weekdayShort.map((w, i) => `<button type="button" class="onb-day ${state.workdays.includes(i) ? 'active' : ''}" data-day="${i}">${w}</button>`).join('')}
          </div>
        </div>
        <div class="field"><label>Abre às</label><input type="time" id="obOpen" class="input" value="${state.open}"></div>
        <div class="field"><label>Fecha às</label><input type="time" id="obClose" class="input" value="${state.close}"></div>
        <div class="field"><label>Pausa — início</label><input type="time" id="obBS" class="input" value="${state.breakStart}"></div>
        <div class="field"><label>Pausa — fim</label><input type="time" id="obBE" class="input" value="${state.breakEnd}"></div>
        <div class="field">
          <label>Intervalo dos horários</label>
          <select id="obSlot" class="select">
            ${[10, 15, 20, 30, 45, 60].map(v => `<option value="${v}" ${Number(state.slotMinutes) === v ? 'selected' : ''}>${v} minutos</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Começar com</label>
          <label class="check" style="height:40px"><input type="checkbox" id="obDemo" ${state.demo ? 'checked' : ''}> Dados de exemplo</label>
        </div>
      </div>
      <div class="onb-preview" id="obSummary" style="margin-top:16px">
        ${Icon('calendar', 18)}
        <div id="obSummaryText">${summaryText()}</div>
      </div>
      <p class="tiny muted" style="margin-top:10px">${Icon('lock', 12)} Seus dados ficam apenas neste dispositivo. O modo recepção já vem ativado para proteger valores financeiros — use o selo <strong>Recepção</strong> no topo para desbloquear.</p>`;
  }

  function summaryText() {
    const days = state.workdays.slice().sort().map(d => U.weekdayShort[d]).join(', ') || 'nenhum dia';
    const brk = state.breakStart && state.breakEnd ? ` · pausa ${state.breakStart}–${state.breakEnd}` : '';
    return `<strong>${U.esc(Seed.segment(state.segment).name)}</strong> · ${days} · ${state.open}–${state.close}${brk}${state.demo ? ' · com dados de exemplo' : ''}`;
  }

  function render() {
    const total = 3;
    const step = state.step;
    const body = step === 0 ? stepOne() : step === 1 ? stepTwo() : stepThree();
    const backHidden = step === 0 ? 'visibility:hidden' : '';

    root().innerHTML = `<div class="onb-overlay">
      <div class="onb-card">
        <div class="onb-top">
          <div class="onb-brand">
            <div class="brand-mark">${Icon('logo', 20)}</div>
            <div>
              <div style="font-size:15px;font-weight:750">Hora Marcada</div>
              <div class="tiny muted">Gerenciador de horários</div>
            </div>
            <div class="spacer" style="flex:1"></div>
            <span class="badge badge-accent">${step + 1} de ${total}</span>
          </div>
          <div class="onb-steps">
            ${Array.from({ length: total }, (_, i) => `<div class="onb-step-bar ${i < step ? 'done' : i === step ? 'active' : ''}"><i></i></div>`).join('')}
          </div>
        </div>
        <div class="onb-body">${body}</div>
        <div class="onb-foot">
          <button type="button" class="btn" id="obBack" style="${backHidden}">${Icon('arrowLeft', 15)} Voltar</button>
          <div class="spacer"></div>
          <span class="tiny muted" style="margin-right:4px">${step === total - 1 ? 'Tudo pronto para começar' : 'Leva menos de 1 minuto'}</span>
          <button type="button" class="btn btn-primary" id="obNext">
            ${step === total - 1 ? 'Criar minha agenda' : 'Continuar'}
            ${Icon(step === total - 1 ? 'check' : 'arrowRight', 16)}
          </button>
        </div>
      </div>
    </div>`;

    bind();
  }

  function bind() {
    const el = root();

    el.querySelectorAll('[data-seg]').forEach(b => b.addEventListener('click', () => applySegmentDefaults(b.dataset.seg, true)));

    const back = el.querySelector('#obBack');
    if (back) back.addEventListener('click', () => { if (state.step > 0) { state.step--; render(); } });

    const next = el.querySelector('#obNext');
    if (next) next.addEventListener('click', () => {
      if (state.step === 1) {
        state.businessName = el.querySelector('#obBusiness').value.trim();
        state.ownerName = el.querySelector('#obOwner').value.trim();
        state.emoji = el.querySelector('#obEmoji').value.trim() || Seed.segment(state.segment).emoji;
      }
      if (state.step < 2) {
        state.step++;
        render();
      } else {
        finish();
      }
    });

    if (state.step === 1) {
      const biz = el.querySelector('#obBusiness');
      const owner = el.querySelector('#obOwner');
      const emoji = el.querySelector('#obEmoji');
      const prevName = el.querySelector('#obPreviewName');
      const prevOwner = el.querySelector('#obPreviewOwner');
      const prevEmoji = el.querySelector('#obPreviewEmoji');
      biz.addEventListener('input', () => { prevName.textContent = biz.value.trim() || Seed.segment(state.segment).labels.business; });
      owner.addEventListener('input', () => { prevOwner.textContent = owner.value.trim() || 'Seu nome'; });
      emoji.addEventListener('input', () => { prevEmoji.textContent = emoji.value.trim() || Seed.segment(state.segment).emoji; });
      biz.addEventListener('keydown', e => { if (e.key === 'Enter') next.click(); });
      owner.addEventListener('keydown', e => { if (e.key === 'Enter') next.click(); });
    }

    if (state.step === 2) {
      el.querySelectorAll('[data-day]').forEach(b => b.addEventListener('click', () => {
        const d = Number(b.dataset.day);
        if (state.workdays.includes(d)) state.workdays = state.workdays.filter(x => x !== d);
        else state.workdays = [...state.workdays, d].sort();
        b.classList.toggle('active', state.workdays.includes(d));
        const sum = el.querySelector('#obSummaryText');
        if (sum) sum.innerHTML = summaryText();
      }));

      const open = el.querySelector('#obOpen');
      const close = el.querySelector('#obClose');
      const bs = el.querySelector('#obBS');
      const be = el.querySelector('#obBE');
      const slot = el.querySelector('#obSlot');
      const demo = el.querySelector('#obDemo');
      const sync = () => {
        state.open = open.value || '09:00';
        state.close = close.value || '18:00';
        state.breakStart = bs.value;
        state.breakEnd = be.value;
        state.slotMinutes = Number(slot.value) || 30;
        state.demo = demo.checked;
        const sum = el.querySelector('#obSummaryText');
        if (sum) sum.innerHTML = summaryText();
      };
      [open, close, bs, be, slot, demo].forEach(inp => {
        inp.addEventListener('change', sync);
        inp.addEventListener('input', sync);
      });
    }
  }

  function finish() {
    if (!state.workdays.length) {
      UI.toast('Escolha pelo menos um dia de atendimento.', 'warn');
      return;
    }
    if (U.timeToMin(state.close) <= U.timeToMin(state.open)) {
      UI.toast('O horário de fechamento deve ser depois da abertura.', 'warn');
      return;
    }
    if ((state.breakStart && !state.breakEnd) || (!state.breakStart && state.breakEnd)) {
      UI.toast('Preencha o início e o fim da pausa, ou deixe os dois vazios.', 'warn');
      return;
    }
    if (state.breakStart && state.breakEnd) {
      if (U.timeToMin(state.breakEnd) <= U.timeToMin(state.breakStart)) {
        UI.toast('A pausa deve terminar depois de começar.', 'warn');
        return;
      }
    }

    const seg = Seed.segment(state.segment);
    const db = Seed.build({
      segmentId: state.segment,
      businessName: state.businessName || seg.labels.business,
      ownerName: state.ownerName || 'Meu nome',
      emoji: state.emoji || seg.emoji,
      workdays: state.workdays,
      hours: {
        open: state.open,
        close: state.close,
        breakStart: state.breakStart,
        breakEnd: state.breakEnd
      },
      slotMinutes: state.slotMinutes,
      demo: state.demo,
      theme: 'light'
    });

    Store.replace(db);
    root().innerHTML = '';
    App.afterOnboarding();
  }

  return { show };
})();
