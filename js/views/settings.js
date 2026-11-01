/* ==========================================================================
   View — Configurações
   ========================================================================== */
window.Views = window.Views || {};

window.Views.settings = (() => {
  const st = () => App.ui.settings;

  const LABEL_FIELDS = [
    ['client', 'Cliente (singular)'],
    ['clients', 'Clientes (plural)'],
    ['service', 'Serviço (singular)'],
    ['services', 'Serviços (plural)'],
    ['pro', 'Profissional (singular)'],
    ['pros', 'Profissionais (plural)'],
    ['appt', 'Atendimento (singular)'],
    ['appts', 'Atendimentos (plural)'],
    ['newAppt', 'Botão de novo agendamento'],
    ['team', 'Nome da equipe'],
    ['business', 'Tipo de negócio']
  ];

  const tabs = [
    { id: 'identity', label: 'Identidade', icon: 'sparkles' },
    { id: 'agenda', label: 'Agenda', icon: 'calendar' },
    { id: 'texts', label: 'Textos', icon: 'edit' },
    { id: 'themes', label: 'Temas', icon: 'palette' },
    { id: 'language', label: 'Idioma', icon: 'globe' },
    { id: 'app', label: 'Aplicativo', icon: 'download' },
    { id: 'access', label: 'Acesso', icon: 'shield' },
    { id: 'data', label: 'Dados e backup', icon: 'download' }
  ];

  /* ---------------- identidade ---------------- */
  function identityTab(s) {
    return `<form id="identityForm" class="stack">
      <div class="form-grid">
        <div class="field span-2">
          <label>Nome do negócio</label>
          <input type="text" name="businessName" class="input" value="${U.esc(s.businessName)}" placeholder="Ex.: Studio Bella, Clínica Vida...">
          <span class="hint">Aparece no menu, nos lembretes e nos relatórios.</span>
        </div>
        <div class="field">
          <label>Emoji / ícone</label>
          <input type="text" name="emoji" class="input" value="${U.esc(s.emoji)}" maxlength="8" placeholder="💈">
        </div>
        <div class="field">
          <label>Segmento</label>
          <select name="segment" class="select">
            ${Seed.SEGMENTS.map(seg => `<option value="${seg.id}" ${s.segment === seg.id ? 'selected' : ''}>${seg.emoji} ${U.esc(seg.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Cor principal</label>
          <div class="row"><input type="color" name="accent" class="color-input" value="${s.accent}"><span class="hint">Usada em botões, destaques e gráficos.</span></div>
        </div>
        <div class="field">
          <label>Cor secundária</label>
          <div class="row"><input type="color" name="accent2" class="color-input" value="${s.accent2}"><span class="hint">Compõe o degradê da identidade.</span></div>
        </div>
        <div class="field">
          <label>Tema</label>
          <select name="theme" class="select">
            <option value="light" ${s.theme === 'light' ? 'selected' : ''}>Claro</option>
            <option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Escuro</option>
            <option value="system" ${s.theme === 'system' ? 'selected' : ''}>Seguir o sistema</option>
          </select>
        </div>
        <div class="field">
          <label>Moeda</label>
          <select name="currency" class="select">
            ${['BRL', 'USD', 'EUR', 'GBP'].map(c => `<option value="${c}" ${s.currency === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="alert info">${Icon('sparkles', 16)}<div>Trocar o segmento não altera seus dados. Use <strong>Aplicar identidade do segmento</strong> para atualizar cores e nomenclaturas automaticamente.</div></div>

      <div class="row wrap" style="gap:8px">
        <button type="button" class="btn" id="applySegment">${Icon('sparkles', 16)} Aplicar identidade do segmento</button>
        <div class="spacer"></div>
        <button type="submit" class="btn btn-primary">${Icon('check', 16)} Salvar identidade</button>
      </div>
    </form>`;
  }

  /* ---------------- agenda ---------------- */
  function agendaTab(s) {
    return `<form id="agendaSettingsForm" class="stack">
      <div class="form-grid">
        <div class="field">
          <label>Intervalo da agenda</label>
          <select name="slotMinutes" class="select">
            ${[10, 15, 20, 30, 45, 60].map(v => `<option value="${v}" ${Number(s.slotMinutes) === v ? 'selected' : ''}>${v} minutos</option>`).join('')}
          </select>
          <span class="hint">Granularidade dos horários sugeridos.</span>
        </div>
        <div class="field">
          <label>Formas de pagamento</label>
          <input type="text" name="paymentMethods" class="input" value="${U.esc((s.paymentMethods || []).join(', '))}">
          <span class="hint">Separe por vírgula.</span>
        </div>
      </div>

      <div class="divider"></div>

      <div>
        <div class="label">Campos personalizados do cliente</div>
        <p class="hint" style="margin:4px 0 10px">Adicione informações extras ao cadastro, como convênio, plano, número de prontuário etc.</p>
        ${(s.customFields || []).length ? `<div class="list" style="margin-bottom:10px">
          ${s.customFields.map(cf => `<div class="list-item">
            <div class="stat-icon">${Icon('edit', 15)}</div>
            <div class="li-main"><strong>${U.esc(cf.label)}</strong><span>${cf.type === 'number' ? 'Número' : cf.type === 'date' ? 'Data' : 'Texto'}</span></div>
            <button type="button" class="icon-btn sm plain danger" data-remove-field="${cf.id}" title="Remover campo">${Icon('trash', 15)}</button>
          </div>`).join('')}
        </div>` : `<p class="small muted" style="margin-bottom:10px">Nenhum campo extra cadastrado.</p>`}
        <div class="row wrap" style="gap:8px;align-items:flex-end">
          <div class="field" style="flex:1;min-width:180px">
            <label>Nome do campo</label>
            <input type="text" class="input input-sm" id="newFieldLabel" placeholder="Ex.: Convênio">
          </div>
          <div class="field" style="width:120px">
            <label>Tipo</label>
            <select class="select input-sm" id="newFieldType">
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="date">Data</option>
            </select>
          </div>
          <button type="button" class="btn btn-sm btn-soft" id="addField">${Icon('plus', 15)} Adicionar</button>
        </div>
      </div>

      <div class="divider"></div>
      <div class="row"><div class="spacer"></div><button type="submit" class="btn btn-primary">${Icon('check', 16)} Salvar preferências</button></div>
    </form>`;
  }

  /* ---------------- textos ---------------- */
  function textsTab(s) {
    return `<form id="textsForm" class="stack">
      <div>
        <div class="label">Nomenclaturas</div>
        <p class="hint" style="margin:4px 0 10px">Adapte o sistema ao seu segmento: paciente, cliente, aluno, consulta, sessão...</p>
        <div class="form-grid">
          ${LABEL_FIELDS.map(([key, label]) => `<div class="field">
            <label>${label}</label>
            <input type="text" name="label_${key}" class="input" value="${U.esc(s.labels[key] || '')}">
          </div>`).join('')}
        </div>
      </div>

      <div class="divider"></div>

      <div class="field">
        <label>Modelo de mensagem / lembrete</label>
        <textarea name="reminderTemplate" class="textarea" rows="5">${U.esc(s.reminderTemplate)}</textarea>
        <div class="chips" style="margin-top:4px">
          ${['{cliente}', '{servico}', '{profissional}', '{data}', '{hora}', '{valor}', '{negocio}'].map(v => `<span class="chip chip-static mono" style="font-size:10.5px">${v}</span>`).join('')}
        </div>
        <span class="hint">As variáveis são substituídas automaticamente ao enviar pelo WhatsApp.</span>
      </div>

      <div class="row wrap" style="gap:8px">
        <button type="button" class="btn" id="resetLabels">${Icon('repeat', 16)} Restaurar nomes do segmento</button>
        <div class="spacer"></div>
        <button type="submit" class="btn btn-primary">${Icon('check', 16)} Salvar textos</button>
      </div>
    </form>`;
  }

  /* ---------------- temas ---------------- */
  function themesTab(s) {
    const activeId = s.themePreset || 'roxo';
    const modes = [
      ['light', 'Claro', 'sun'],
      ['dark', 'Escuro', 'moon'],
      ['system', 'Seguir o sistema', 'settings']
    ];
    return `<div class="stack">
      <div>
        <div class="label">Temas prontos</div>
        <p class="hint" style="margin:4px 0 12px">Escolha um tema pronto ou ajuste as cores manualmente.</p>
        <div class="theme-grid">
          ${Themes.LIST.map(t => `<button type="button" class="theme-card ${activeId === t.id ? 'active' : ''}" data-theme-preset="${t.id}">
            <span class="theme-swatch" style="background:linear-gradient(135deg, ${t.accent}, ${t.accent2})">${t.icon}</span>
            <span class="theme-text">
              <strong>${U.esc(Themes.name(t))}</strong>
              <small>${U.esc(Themes.hint(t))}</small>
            </span>
            ${activeId === t.id ? `<span class="theme-check">${Icon('check', 13)}</span>` : ''}
          </button>`).join('')}
        </div>
      </div>

      <div class="divider"></div>

      <div>
        <div class="label">Tema claro ou escuro</div>
        <p class="hint" style="margin:4px 0 10px">A mudança é imediata.</p>
        <div class="choice-grid cols-3">
          ${modes.map(([id, label, icon]) => `<button type="button" class="choice-card ${s.theme === id ? 'active' : ''}" data-theme-mode="${id}">
            <span class="choice-ico">${Icon(icon, 18)}</span>
            <span class="choice-text"><strong>${label}</strong></span>
            ${s.theme === id ? `<span class="choice-check">${Icon('check', 13)}</span>` : ''}
          </button>`).join('')}
        </div>
      </div>

      <div class="divider"></div>

      <div>
        <div class="label">Cores personalizadas</div>
        <p class="hint" style="margin:4px 0 8px">As cores são aplicadas em botões, destaques, gráficos e na identidade do menu.</p>
        <div class="row wrap" style="gap:12px;align-items:flex-end">
          <div class="field">
            <label>Cor principal</label>
            <div class="row"><input type="color" id="themeAccent" class="color-input" value="${U.esc(s.accent)}"><span class="hint">Usada em botões, destaques e gráficos.</span></div>
          </div>
          <div class="field">
            <label>Cor secundária</label>
            <div class="row"><input type="color" id="themeAccent2" class="color-input" value="${U.esc(s.accent2)}"><span class="hint">Compõe o degradê da identidade.</span></div>
          </div>
          <button type="button" class="btn btn-primary" id="applyCustomColors">${Icon('palette', 16)} Aplicar cores personalizadas</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- idioma ---------------- */
  function languageTab(s) {
    const lang = s.language === 'en' ? 'en' : 'pt';
    return `<div class="stack">
      <div>
        <div class="label">Idioma do aplicativo</div>
        <p class="hint" style="margin:4px 0 12px">Escolha o idioma da interface. A mudança é aplicada imediatamente.</p>
        <div class="choice-grid cols-2">
          <button type="button" class="choice-card ${lang === 'pt' ? 'active' : ''}" data-set-lang="pt">
            <span class="choice-flag">🇧🇷</span>
            <span class="choice-text" data-i18n-skip><strong>Português</strong><small>Português (Brasil)</small></span>
            ${lang === 'pt' ? `<span class="choice-check">${Icon('check', 13)}</span>` : ''}
          </button>
          <button type="button" class="choice-card ${lang === 'en' ? 'active' : ''}" data-set-lang="en">
            <span class="choice-flag">🇺🇸</span>
            <span class="choice-text" data-i18n-skip><strong>English</strong><small>English (US)</small></span>
            ${lang === 'en' ? `<span class="choice-check">${Icon('check', 13)}</span>` : ''}
          </button>
        </div>
      </div>

      <div class="alert info">${Icon('globe', 16)}<div>Textos da interface, datas e números usam o idioma escolhido. Nomes de clientes, serviços e observações digitados por você não são traduzidos.</div></div>

      <div class="divider"></div>

      <div>
        <div class="row" style="gap:8px;margin-bottom:4px">
          <div class="stat-icon">${Icon('book', 16)}</div>
          <strong style="font-size:13px">Manual completo do usuário</strong>
        </div>
        <p class="small muted" style="margin-bottom:10px">Consulte o guia completo do Hora Marcada no idioma selecionado.</p>
        <div class="row wrap" style="gap:8px">
          <button type="button" class="btn" data-open-manual="pt">${Icon('book', 16)} Manual em português</button>
          <button type="button" class="btn" data-open-manual="en">${Icon('book', 16)} Manual em inglês</button>
          <button type="button" class="btn btn-soft" data-download-manual>${Icon('download', 16)} Baixar manual (.html)</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- aplicativo / instalação ---------------- */
  function appTab() {
    const st = Install.getState();
    const installedWindow = st.standalone;
    const installedBrowser = st.status === 'installed-browser';
    const installed = installedWindow || installedBrowser;
    const statusLabel = installed ? 'Instalado'
      : st.status === 'file' ? 'Requer servidor local'
        : st.canPrompt ? 'Pronto para instalar' : 'Não instalado';

    const title = installedWindow ? 'Aplicativo instalado'
      : installedBrowser ? 'Instalado neste dispositivo'
        : 'Aplicativo no navegador';

    const text = installedWindow
      ? 'Você está usando o Hora Marcada em janela própria, sem barra de endereços.'
      : installedBrowser
        ? 'O Hora Marcada está instalado. Abra pelo atalho do Menu Iniciar para usar a janela própria.'
        : 'Instale para abrir em janela própria, sem barra de endereços, e usar offline pelo atalho.';

    const address = st.file ? 'Arquivo local (file://)'
      : st.secure ? 'Servidor local (HTTP)' : 'HTTP sem segurança';

    return `<div class="stack">
      <div class="install-status ${installed ? 'is-installed' : ''}">
        <div class="install-app-icon">${Icon(installed ? 'checkCircle' : 'download', 23)}</div>
        <div class="install-status-text">
          <strong>${title}</strong>
          <p>${text}</p>
        </div>
        <span class="install-pill">${statusLabel}</span>
      </div>

      ${st.file ? `<div class="alert warn">${Icon('alert', 16)}<div>A instalação só funciona quando o app é servido por HTTP ou HTTPS. Feche esta aba e execute o <strong>servir.bat</strong>; ele abre o endereço correto.</div></div>` : ''}
      ${st.file ? `<div class="alert warn">${Icon('download', 16)}<div>Os dados do modo arquivo (file://) não aparecem no app instalado. Exporte um backup em Configurações → Dados antes de instalar e importe depois.</div></div>` : ''}
      ${!st.file && !st.secure ? `<div class="alert warn">${Icon('alert', 16)}<div>A instalação exige HTTPS ou localhost. Abra o app por um endereço seguro.</div></div>` : ''}

      ${installed ? `
        <div class="install-grid">
          <div class="install-tile">
            <span class="stat-icon green">${Icon('pin', 16)}</span>
            <strong>Atalho no Menu Iniciar</strong>
            <p>Use o atalho criado pelo Windows para abrir o app a qualquer momento.</p>
          </div>
          <div class="install-tile">
            <span class="stat-icon blue">${Icon('star', 16)}</span>
            <strong>Fixe na barra de tarefas</strong>
            <p>Clique com o botão direito no ícone do app e escolha Fixar na barra de tarefas.</p>
          </div>
          <div class="install-tile">
            <span class="stat-icon">${Icon('download', 16)}</span>
            <strong>Funciona offline</strong>
            <p>Os dados ficam neste dispositivo e o app abre mesmo sem internet.</p>
          </div>
        </div>
        <div class="row wrap" style="gap:8px">
          <button type="button" class="btn btn-sm btn-ghost" data-install-welcome>${Icon('sparkles', 14)} Rever boas-vindas</button>
          ${installedBrowser && st.canPrompt ? `<button type="button" class="btn btn-sm" data-install-app>${Icon('download', 14)} Instalar novamente</button>` : ''}
        </div>` : `
        <div class="row wrap" style="gap:8px">
          <button type="button" class="btn btn-primary" data-install-app>${Icon('download', 16)} Instalar aplicativo</button>
          <button type="button" class="btn" data-install-help>${Icon('book', 16)} Ver instruções</button>
        </div>
        <div class="install-help-note">${Icon('lock', 15)}<div>A instalação não envia dados para servidores. Tudo continua salvo neste dispositivo.</div></div>`}

      <div class="divider"></div>

      <div>
        <div class="label">Detalhes</div>
        <div class="install-details">
          <div class="row between small"><span class="muted">Modo de exibição</span><strong>${installedWindow ? 'Janela própria' : 'Navegador'}</strong></div>
          <div class="row between small"><span class="muted">Navegador</span><strong>${U.esc(st.browser)}</strong></div>
          <div class="row between small"><span class="muted">Endereço</span><strong>${address}</strong></div>
          <div class="row between small"><span class="muted">Funciona offline</span><strong>${installed ? 'Sim' : st.file ? 'Sim (sem cache PWA)' : 'Sim, após a primeira visita'}</strong></div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- acesso ---------------- */
  function lockedTab(title, text) {
    return `<div class="locked-panel">
      <div class="locked-ico">${Icon('shield', 26)}</div>
      <h3>${U.esc(title)}</h3>
      <p class="small muted">${U.esc(text)}</p>
      <button class="btn btn-primary" data-access-toggle>${Icon('unlock', 16)} Desbloquear como gestor</button>
    </div>`;
  }

  function accessTab(s) {
    const manager = Store.canSeeMoney();
    if (!manager) {
      return lockedTab('Acesso restrito', 'Esta área é exclusiva do gestor. Desbloqueie com o PIN para alterar o modo de recepção, o PIN ou os dados do sistema.');
    }
    const hasPin = Store.hasAdminPin();
    return `<div class="stack">
      <div class="access-status ${manager ? 'is-manager' : ''}">
        <div class="stat-icon ${manager ? 'green' : 'amber'}">${Icon(manager ? 'unlock' : 'lock', 18)}</div>
        <div style="min-width:0;flex:1">
          <strong>${manager ? 'Modo gestor ativo' : 'Modo recepção'}</strong>
          <p class="small muted" style="margin-top:2px">${manager ? 'Você pode ver valores financeiros e dados do sistema nesta sessão.' : 'Valores financeiros ficam ocultos para quem está no balcão.'}</p>
        </div>
        ${manager
        ? `<button type="button" class="btn btn-sm" id="lockNow">${Icon('lock', 15)} Bloquear agora</button>`
        : `<button type="button" class="btn btn-sm btn-primary" data-access-toggle>${Icon('unlock', 15)} Desbloquear</button>`}
      </div>

      <div class="divider"></div>

      <form id="accessForm" class="stack">
        <div>
          <div class="label">Modo recepção</div>
          <p class="hint" style="margin:4px 0 10px">Quando ativo, valores, relatórios financeiros e backups ficam protegidos por PIN. O desbloqueio vale apenas para esta sessão.</p>
          <label class="switch-row">
            <input type="checkbox" name="receptionMode" ${s.receptionMode ? 'checked' : ''}>
            <span class="switch-track"><span class="switch-thumb"></span></span>
            <span><strong>Proteger valores financeiros</strong><small>Recomendado para recepções e balcões compartilhados.</small></span>
          </label>
        </div>

        <div class="divider"></div>

        <div>
          <div class="label">PIN do gestor</div>
          <p class="hint" style="margin:4px 0 10px">${hasPin ? 'Um PIN já está definido. Informe um novo PIN para substituí-lo.' : 'Nenhum PIN definido. Defina de 4 a 8 números para proteger o acesso.'}</p>
          <div class="form-grid">
            <div class="field">
              <label>${hasPin ? 'Novo PIN' : 'Criar PIN'}</label>
              <input type="password" name="pin" class="input" inputmode="numeric" autocomplete="new-password" maxlength="8" placeholder="4 a 8 números">
            </div>
            <div class="field">
              <label>Confirmar PIN</label>
              <input type="password" name="pin2" class="input" inputmode="numeric" autocomplete="new-password" maxlength="8" placeholder="Repita o PIN">
            </div>
          </div>
          ${hasPin ? `<div class="row" style="margin-top:8px"><button type="button" class="btn btn-sm btn-ghost" id="clearPin">${Icon('trash', 14)} Remover PIN</button><span class="hint" style="margin-left:8px">Sem PIN, qualquer pessoa pode desbloquear.</span></div>` : ''}
        </div>

        <div class="row"><div class="spacer"></div><button type="submit" class="btn btn-primary">${Icon('check', 16)} Salvar acesso</button></div>
      </form>
    </div>`;
  }

  /* ---------------- dados ---------------- */
  function dataTab() {
    if (!Store.canSeeMoney()) {
      return lockedTab('Dados protegidos', 'Backups, planilhas e a zona de risco só ficam disponíveis para o gestor. Desbloqueie com o PIN para continuar.');
    }
    const db = Store.db;
    const size = (() => { try { return (new Blob([JSON.stringify(db)]).size / 1024).toFixed(1); } catch (e) { return '—'; } })();
    return `<div class="stack">
      <div class="stat-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">
        <div class="stat" style="padding:12px"><span class="stat-label">${U.esc(Store.labels().clients)}</span><span class="stat-value" style="font-size:20px">${db.clients.length}</span></div>
        <div class="stat" style="padding:12px"><span class="stat-label">${U.esc(Store.labels().appts)}</span><span class="stat-value" style="font-size:20px">${db.appointments.length}</span></div>
        <div class="stat" style="padding:12px"><span class="stat-label">${U.esc(Store.labels().services)}</span><span class="stat-value" style="font-size:20px">${db.services.length}</span></div>
        <div class="stat" style="padding:12px"><span class="stat-label">Armazenamento</span><span class="stat-value" style="font-size:20px">${size} KB</span></div>
      </div>

      <div class="alert info">${Icon('lock', 16)}<div>Seus dados ficam salvos apenas neste dispositivo/navegador. Faça backups regulares antes de limpar o navegador ou trocar de computador.</div></div>

      <div class="card" style="box-shadow:none">
        <div class="card-head"><h3>Backup completo</h3><div class="spacer"></div><span class="tiny muted">JSON</span></div>
        <div class="card-body row wrap" style="gap:8px">
          <button class="btn btn-primary" id="exportBackup">${Icon('download', 16)} Exportar backup</button>
          <button class="btn" id="importBackup">${Icon('upload', 16)} Importar backup</button>
          <input type="file" id="importFile" accept="application/json,.json" class="hidden">
        </div>
      </div>

      <div class="card" style="box-shadow:none">
        <div class="card-head"><h3>Planilhas</h3><div class="spacer"></div><span class="tiny muted">CSV (Excel)</span></div>
        <div class="card-body row wrap" style="gap:8px">
          <button class="btn" id="exportClients">${Icon('users', 16)} Exportar clientes</button>
          <button class="btn" id="exportAppts">${Icon('calendar', 16)} Exportar agendamentos</button>
        </div>
      </div>

      <div class="card" style="box-shadow:none;border-color:color-mix(in srgb,var(--amber) 35%,var(--border))">
        <div class="card-head"><h3>Dados de exemplo</h3><div class="spacer"></div></div>
        <div class="card-body">
          <p class="small muted" style="margin-bottom:10px">Substitui todos os dados atuais por uma demonstração completa com clientes e agendamentos fictícios.</p>
          <button class="btn" id="loadDemo">${Icon('sparkles', 16)} Carregar demonstração</button>
        </div>
      </div>

      <div class="card" style="box-shadow:none;border-color:color-mix(in srgb,var(--red) 35%,var(--border))">
        <div class="card-head"><h3 style="color:var(--red)">Zona de risco</h3></div>
        <div class="card-body">
          <p class="small muted" style="margin-bottom:10px">Apaga todos os dados e reinicia o Hora Marcada. Exporte um backup antes.</p>
          <button class="btn btn-danger" id="resetAll">${Icon('trash', 16)} Apagar tudo e recomeçar</button>
        </div>
      </div>
    </div>`;
  }

  function render() {
    const s = Store.settings();
    const tab = st().tab || 'identity';
    const body = tab === 'identity' ? identityTab(s)
      : tab === 'agenda' ? agendaTab(s)
        : tab === 'texts' ? textsTab(s)
          : tab === 'themes' ? themesTab(s)
            : tab === 'language' ? languageTab(s)
              : tab === 'app' ? appTab()
                : tab === 'access' ? accessTab(s)
                  : dataTab();
    const seg = Seed.segment(s.segment);

    return `<div class="page">
      <div>
        <h2 style="font-size:17px">Configurações</h2>
        <p class="small muted" style="margin-top:2px">Personalize o Hora Marcada para o seu jeito de atender.</p>
      </div>

      <div class="split wide-left">
        <div class="card">
          <div class="tabs" style="padding:0 14px">
            ${tabs.map(t => `<button class="tab ${tab === t.id ? 'active' : ''}" data-tab="${t.id}">${Icon(t.icon, 14)} ${t.label}</button>`).join('')}
          </div>
          <div class="card-body">${body}</div>
        </div>

        <div class="stack">
          <div class="card card-pad" style="text-align:center">
            <div class="brand-mark" style="margin:0 auto 10px;width:54px;height:54px;font-size:26px;border-radius:16px">${U.esc(s.emoji)}</div>
            <h3 style="font-size:15px">${U.esc(s.businessName)}</h3>
            <p class="small muted" style="margin-top:2px">${seg.emoji} ${U.esc(seg.name)}</p>
            <div class="divider" style="margin:12px 0"></div>
            <div class="row between small"><span class="muted">Versão</span><strong>1.0.0</strong></div>
            <div class="row between small" style="margin-top:6px"><span class="muted">Nome</span><strong>Hora Marcada</strong></div>
            <div class="row between small" style="margin-top:6px"><span class="muted">Instalação</span><strong>PWA instalável</strong></div>
          </div>

          <div class="card card-pad">
            <div class="row" style="gap:8px;margin-bottom:6px">
              <div class="stat-icon green">${Icon('lock', 16)}</div>
              <strong style="font-size:13px">Privacidade</strong>
            </div>
            <p class="small muted" style="line-height:1.55">Nenhum dado é enviado para servidores. Tudo fica no seu dispositivo, sob seu controle.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function mount(el) {
    el.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
      st().tab = b.dataset.tab;
      App.refresh();
    }));

    /* identidade */
    const idForm = el.querySelector('#identityForm');
    if (idForm) {
      idForm.addEventListener('submit', e => {
        e.preventDefault();
        const s = Store.settings();
        s.businessName = idForm.elements['businessName'].value.trim() || s.businessName;
        s.emoji = idForm.elements['emoji'].value.trim() || s.emoji;
        s.segment = idForm.elements['segment'].value;
        s.accent = idForm.elements['accent'].value;
        s.accent2 = idForm.elements['accent2'].value;
        s.theme = idForm.elements['theme'].value;
        s.currency = idForm.elements['currency'].value;
        Store.save();
        App.applyChrome();
        App.refresh();
        UI.toast('Identidade atualizada.', 'success');
      });

      const apply = el.querySelector('#applySegment');
      apply.addEventListener('click', async () => {
        const segId = idForm.elements['segment'].value;
        const seg = Seed.segment(segId);
        const ok = await UI.confirm({
          title: 'Aplicar identidade do segmento',
          message: `As cores e os nomes serão atualizados para <strong>${seg.emoji} ${U.esc(seg.name)}</strong>. Seus dados não serão alterados. Deseja continuar?`,
          confirmText: 'Aplicar'
        });
        if (!ok) return;
        Seed.applySegment(Store.db, segId);
        Store.save();
        App.applyChrome();
        App.refresh();
        UI.toast('Identidade do segmento aplicada.', 'success');
      });
    }

    /* agenda */
    const agForm = el.querySelector('#agendaSettingsForm');
    if (agForm) {
      agForm.addEventListener('submit', e => {
        e.preventDefault();
        const s = Store.settings();
        s.slotMinutes = Number(agForm.elements['slotMinutes'].value) || 30;
        s.paymentMethods = agForm.elements['paymentMethods'].value.split(',').map(x => x.trim()).filter(Boolean);
        if (!s.paymentMethods.length) s.paymentMethods = [...Seed.PAYMENT_METHODS];
        Store.save();
        UI.toast('Preferências de agenda salvas.', 'success');
      });

      el.querySelector('#addField').addEventListener('click', () => {
        const label = el.querySelector('#newFieldLabel').value.trim();
        const type = el.querySelector('#newFieldType').value;
        if (!label) { UI.toast('Informe o nome do campo.', 'warn'); return; }
        const s = Store.settings();
        s.customFields = s.customFields || [];
        s.customFields.push({ id: U.uid('cf'), label, type });
        Store.save();
        App.refresh();
        UI.toast('Campo personalizado adicionado.', 'success');
      });

      el.querySelectorAll('[data-remove-field]').forEach(b => b.addEventListener('click', async () => {
        const ok = await UI.confirm({
          title: 'Remover campo',
          message: 'Os valores já preenchidos nos cadastros deixarão de aparecer. Deseja remover?',
          confirmText: 'Remover',
          danger: true
        });
        if (!ok) return;
        const s = Store.settings();
        s.customFields = (s.customFields || []).filter(f => f.id !== b.dataset.removeField);
        Store.save();
        App.refresh();
        UI.toast('Campo removido.', 'success');
      }));
    }

    /* textos */
    const txForm = el.querySelector('#textsForm');
    if (txForm) {
      txForm.addEventListener('submit', e => {
        e.preventDefault();
        const s = Store.settings();
        LABEL_FIELDS.forEach(([key]) => {
          const v = txForm.elements['label_' + key].value.trim();
          if (v) s.labels[key] = v;
        });
        s.reminderTemplate = txForm.elements['reminderTemplate'].value.trim() || s.reminderTemplate;
        Store.save();
        App.applyChrome();
        App.refresh();
        UI.toast('Textos atualizados.', 'success');
      });

      el.querySelector('#resetLabels').addEventListener('click', async () => {
        const ok = await UI.confirm({
          title: 'Restaurar nomes',
          message: 'Os nomes personalizados serão substituídos pelos nomes padrão do segmento. Deseja continuar?',
          confirmText: 'Restaurar'
        });
        if (!ok) return;
        const seg = Seed.segment(Store.settings().segment);
        Store.settings().labels = { ...seg.labels };
        Store.save();
        App.applyChrome();
        App.refresh();
        UI.toast('Nomes restaurados.', 'success');
      });
    }

    /* temas */
    el.querySelectorAll('[data-theme-preset]').forEach(b => b.addEventListener('click', () => {
      if (!Themes.apply(b.dataset.themePreset)) return;
      App.applyChrome();
      App.refresh();
      UI.toast('Tema aplicado.', 'success');
    }));

    el.querySelectorAll('[data-theme-mode]').forEach(b => b.addEventListener('click', () => {
      Store.settings().theme = b.dataset.themeMode;
      Store.save();
      App.applyChrome();
      App.refresh();
      UI.toast('Tema aplicado.', 'success');
    }));

    const applyColors = el.querySelector('#applyCustomColors');
    if (applyColors) applyColors.addEventListener('click', () => {
      const s = Store.settings();
      s.accent = el.querySelector('#themeAccent').value;
      s.accent2 = el.querySelector('#themeAccent2').value;
      s.themePreset = 'custom';
      Store.save();
      App.applyChrome();
      App.refresh();
      UI.toast('Cores personalizadas aplicadas.', 'success');
    });

    /* idioma */
    el.querySelectorAll('[data-set-lang]').forEach(b => b.addEventListener('click', () => {
      const next = b.dataset.setLang === 'en' ? 'en' : 'pt';
      if (next === App.currentLang()) return;
      App.setLanguage(next);
      UI.toast(next === 'en' ? 'Idioma alterado para inglês.' : 'Idioma alterado para português.', 'success');
    }));

    el.querySelectorAll('[data-open-manual]').forEach(b => b.addEventListener('click', () => {
      Manual.open(b.dataset.openManual === 'en' ? 'en' : 'pt');
    }));

    const downloadManual = el.querySelector('[data-download-manual]');
    if (downloadManual) downloadManual.addEventListener('click', () => {
      Manual.download(App.currentLang());
    });

    /* aplicativo */
    const installHelp = el.querySelector('[data-install-help]');
    if (installHelp) installHelp.addEventListener('click', () => Install.openHelp());

    const installWelcome = el.querySelector('[data-install-welcome]');
    if (installWelcome) installWelcome.addEventListener('click', () => Install.showWelcome({ force: true }));

    /* acesso */
    const acForm = el.querySelector('#accessForm');
    if (acForm) {
      acForm.addEventListener('submit', e => {
        e.preventDefault();
        const reception = acForm.elements['receptionMode'].checked;
        const pin = String(acForm.elements['pin'].value || '').replace(/\D/g, '');
        const pin2 = String(acForm.elements['pin2'].value || '').replace(/\D/g, '');
        if (pin || pin2) {
          if (pin !== pin2) { UI.toast('Os PINs não conferem.', 'warn'); return; }
          const res = Store.setAdminPin(pin);
          if (!res.ok) { UI.toast(res.message, 'warn'); return; }
        }
        Store.setReceptionMode(reception);
        App.refresh();
        UI.toast('Configurações de acesso salvas.', 'success');
      });

      const clearPin = el.querySelector('#clearPin');
      if (clearPin) clearPin.addEventListener('click', async () => {
        const ok = await UI.confirm({
          title: 'Remover PIN',
          message: 'Sem PIN, o modo gestor pode ser desbloqueado por qualquer pessoa. Deseja remover?',
          confirmText: 'Remover',
          danger: true
        });
        if (!ok) return;
        Store.setAdminPin('');
        Store.setReceptionMode(Store.settings().receptionMode);
        App.refresh();
        UI.toast('PIN removido.', 'success');
      });
    }

    const lockNow = el.querySelector('#lockNow');
    if (lockNow) lockNow.addEventListener('click', () => {
      Store.lock();
      App.refresh();
      UI.toast('Sessão bloqueada. Valores financeiros ocultos.', 'info');
    });

    /* dados */
    const exportBackup = el.querySelector('#exportBackup');
    if (exportBackup) exportBackup.addEventListener('click', () => {
      U.download(`hora-marcada-backup-${U.todayISO()}.json`, Store.backupJSON(), 'application/json;charset=utf-8');
      UI.toast('Backup exportado.', 'success');
    });

    const importBtn = el.querySelector('#importBackup');
    const importFile = el.querySelector('#importFile');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', () => {
        const file = importFile.files && importFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          const ok = await UI.confirm({
            title: 'Importar backup',
            message: 'Todos os dados atuais serão substituídos pelos dados do arquivo. Deseja continuar?',
            confirmText: 'Importar',
            danger: true
          });
          if (!ok) { importFile.value = ''; return; }
          const res = Store.restoreJSON(String(reader.result));
          importFile.value = '';
          if (!res.ok) { UI.toast(res.message, 'error', 5000); return; }
          App.applyChrome();
          App.refresh();
          UI.toast('Backup importado com sucesso.', 'success');
        };
        reader.readAsText(file);
      });
    }

    const exportClients = el.querySelector('#exportClients');
    if (exportClients) exportClients.addEventListener('click', () => {
      const rows = Store.db.clients.map(c => {
        const sum = Store.clientSummary(c.id);
        return [c.name, c.phone || '', c.email || '', c.birthdate || '', (c.tags || []).join(', '), c.notes || '', sum.spent.toFixed(2).replace('.', ','), sum.visits];
      });
      U.download(`hora-marcada-clientes-${U.todayISO()}.csv`,
        U.csv(['Nome', 'Telefone', 'E-mail', 'Nascimento', 'Tags', 'Observações', 'Total pago', 'Atendimentos'], rows),
        'text/csv;charset=utf-8', true);
      UI.toast('Clientes exportados.', 'success');
    });

    const exportAppts = el.querySelector('#exportAppts');
    if (exportAppts) exportAppts.addEventListener('click', () => {
      const list = Store.filterAppointments({});
      const rows = list.map(a => {
        const c = Store.getClient(a.clientId);
        const svc = Store.getService(a.serviceId);
        const p = Store.getPro(a.professionalId);
        return [
          U.fmtDate(a.date), a.start, c ? c.name : '', svc ? svc.name : '', p ? p.name : '',
          Store.servicePrice(a).toFixed(2).replace('.', ','), Store.STATUS[a.status].label,
          a.paid ? 'Sim' : 'Não', a.paymentMethod || '', a.notes || ''
        ];
      });
      U.download(`hora-marcada-agendamentos-${U.todayISO()}.csv`,
        U.csv(['Data', 'Hora', 'Cliente', 'Serviço', 'Profissional', 'Valor', 'Status', 'Pago', 'Forma de pagamento', 'Observações'], rows),
        'text/csv;charset=utf-8', true);
      UI.toast('Agendamentos exportados.', 'success');
    });

    const demo = el.querySelector('#loadDemo');
    if (demo) demo.addEventListener('click', async () => {
      const ok = await UI.confirm({
        title: 'Carregar demonstração',
        message: 'Todos os dados atuais serão substituídos por dados fictícios de demonstração. Deseja continuar?',
        confirmText: 'Substituir',
        danger: true
      });
      if (!ok) return;
      Store.replace(Store.demoDB());
      App.applyChrome();
      App.refresh();
      UI.toast('Demonstração carregada.', 'success');
    });

    const reset = el.querySelector('#resetAll');
    if (reset) reset.addEventListener('click', async () => {
      const ok = await UI.confirm({
        title: 'Apagar todos os dados',
        message: 'Esta ação é irreversível. Todos os clientes, agendamentos, serviços e configurações serão apagados. Deseja continuar?',
        confirmText: 'Apagar tudo',
        danger: true
      });
      if (!ok) return;
      Store.reset();
      Onboarding.show();
    });
  }

  return { render, mount };
})();
