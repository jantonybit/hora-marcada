/* ==========================================================================
   Segmentos (identidades prontas) + dados de demonstração
   ========================================================================== */
const Seed = (() => {
  const PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#64748b'];
  const PAYMENT_METHODS = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Transferência', 'Boleto', 'Outro'];

  const SEGMENTS = [
    {
      id: 'medico', name: 'Consultório médico', emoji: '🩺', accent: '#0ea5e9', accent2: '#2563eb',
      labels: { client: 'Paciente', clients: 'Pacientes', service: 'Consulta', services: 'Consultas', pro: 'Médico', pros: 'Médicos', appt: 'Consulta', appts: 'Consultas', newAppt: 'Nova consulta', team: 'Equipe médica', business: 'Consultório' },
      hours: { open: '08:00', close: '18:00', breakStart: '12:00', breakEnd: '14:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Consulta inicial', duration: 30, price: 250, category: 'Consulta' },
        { name: 'Retorno', duration: 20, price: 150, category: 'Consulta' },
        { name: 'Avaliação completa', duration: 45, price: 320, category: 'Avaliação' },
        { name: 'Teleconsulta', duration: 30, price: 200, category: 'Consulta' },
        { name: 'Procedimento ambulatorial', duration: 60, price: 450, category: 'Procedimento' }
      ]
    },
    {
      id: 'dentista', name: 'Odontologia', emoji: '🦷', accent: '#06b6d4', accent2: '#0284c7',
      labels: { client: 'Paciente', clients: 'Pacientes', service: 'Procedimento', services: 'Procedimentos', pro: 'Dentista', pros: 'Dentistas', appt: 'Consulta', appts: 'Consultas', newAppt: 'Nova avaliação', team: 'Equipe odontológica', business: 'Clínica odontológica' },
      hours: { open: '08:00', close: '18:00', breakStart: '12:00', breakEnd: '13:30' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Avaliação', duration: 30, price: 150, category: 'Avaliação' },
        { name: 'Limpeza', duration: 45, price: 200, category: 'Prevenção' },
        { name: 'Restauração', duration: 60, price: 350, category: 'Dentística' },
        { name: 'Clareamento', duration: 90, price: 800, category: 'Estética' },
        { name: 'Tratamento de canal', duration: 120, price: 900, category: 'Endodontia' },
        { name: 'Extração', duration: 60, price: 400, category: 'Cirurgia' }
      ]
    },
    {
      id: 'psicologo', name: 'Psicologia', emoji: '🧠', accent: '#6366f1', accent2: '#8b5cf6',
      labels: { client: 'Paciente', clients: 'Pacientes', service: 'Sessão', services: 'Sessões', pro: 'Psicólogo', pros: 'Psicólogos', appt: 'Sessão', appts: 'Sessões', newAppt: 'Nova sessão', team: 'Equipe', business: 'Consultório' },
      hours: { open: '08:00', close: '19:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Sessão individual', duration: 50, price: 200, category: 'Terapia' },
        { name: 'Sessão de casal', duration: 80, price: 300, category: 'Terapia' },
        { name: 'Avaliação inicial', duration: 60, price: 250, category: 'Avaliação' },
        { name: 'Sessão online', duration: 50, price: 180, category: 'Terapia' }
      ]
    },
    {
      id: 'barbearia', name: 'Barbearia', emoji: '💈', accent: '#f59e0b', accent2: '#ef4444',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Serviço', services: 'Serviços', pro: 'Barbeiro', pros: 'Barbeiros', appt: 'Agendamento', appts: 'Agendamentos', newAppt: 'Novo agendamento', team: 'Equipe', business: 'Barbearia' },
      hours: { open: '09:00', close: '20:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5, 6],
      services: [
        { name: 'Corte masculino', duration: 30, price: 50, category: 'Cabelo' },
        { name: 'Barba', duration: 20, price: 35, category: 'Barba' },
        { name: 'Corte + barba', duration: 45, price: 75, category: 'Combo' },
        { name: 'Degradê', duration: 40, price: 60, category: 'Cabelo' },
        { name: 'Pigmentação', duration: 30, price: 45, category: 'Barba' },
        { name: 'Sobrancelha', duration: 15, price: 20, category: 'Acabamento' }
      ]
    },
    {
      id: 'salao', name: 'Salão de beleza', emoji: '💇‍♀️', accent: '#ec4899', accent2: '#a855f7',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Serviço', services: 'Serviços', pro: 'Cabeleireiro', pros: 'Cabeleireiros', appt: 'Agendamento', appts: 'Agendamentos', newAppt: 'Novo agendamento', team: 'Equipe', business: 'Salão' },
      hours: { open: '09:00', close: '19:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [2, 3, 4, 5, 6],
      services: [
        { name: 'Corte feminino', duration: 45, price: 80, category: 'Cabelo' },
        { name: 'Escova', duration: 40, price: 60, category: 'Cabelo' },
        { name: 'Coloração', duration: 90, price: 180, category: 'Coloração' },
        { name: 'Mechas', duration: 150, price: 350, category: 'Coloração' },
        { name: 'Hidratação', duration: 45, price: 90, category: 'Tratamento' },
        { name: 'Corte + escova', duration: 75, price: 120, category: 'Combo' }
      ]
    },
    {
      id: 'manicure', name: 'Manicure & Nail Design', emoji: '💅', accent: '#f43f5e', accent2: '#ec4899',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Serviço', services: 'Serviços', pro: 'Manicure', pros: 'Manicures', appt: 'Agendamento', appts: 'Agendamentos', newAppt: 'Novo agendamento', team: 'Equipe', business: 'Studio de unhas' },
      hours: { open: '09:00', close: '19:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5, 6],
      services: [
        { name: 'Mão simples', duration: 40, price: 40, category: 'Mão' },
        { name: 'Pé simples', duration: 45, price: 50, category: 'Pé' },
        { name: 'Mão + pé', duration: 80, price: 80, category: 'Combo' },
        { name: 'Alongamento em gel', duration: 120, price: 180, category: 'Alongamento' },
        { name: 'Manutenção', duration: 90, price: 130, category: 'Alongamento' },
        { name: 'Esmaltação em gel', duration: 60, price: 90, category: 'Mão' }
      ]
    },
    {
      id: 'estetica', name: 'Estética', emoji: '✨', accent: '#a855f7', accent2: '#ec4899',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Procedimento', services: 'Procedimentos', pro: 'Esteticista', pros: 'Esteticistas', appt: 'Agendamento', appts: 'Agendamentos', newAppt: 'Novo agendamento', team: 'Equipe', business: 'Studio de estética' },
      hours: { open: '09:00', close: '19:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5, 6],
      services: [
        { name: 'Limpeza de pele', duration: 60, price: 180, category: 'Facial' },
        { name: 'Design de sobrancelha', duration: 30, price: 60, category: 'Sobrancelha' },
        { name: 'Extensão de cílios', duration: 90, price: 180, category: 'Cílios' },
        { name: 'Depilação', duration: 45, price: 90, category: 'Depilação' },
        { name: 'Massagem relaxante', duration: 60, price: 160, category: 'Corporal' },
        { name: 'Peeling', duration: 60, price: 200, category: 'Facial' }
      ]
    },
    {
      id: 'personal', name: 'Personal trainer', emoji: '🏋️', accent: '#22c55e', accent2: '#14b8a6',
      labels: { client: 'Aluno', clients: 'Alunos', service: 'Treino', services: 'Treinos', pro: 'Personal trainer', pros: 'Personal trainers', appt: 'Sessão', appts: 'Sessões', newAppt: 'Nova sessão', team: 'Equipe', business: 'Estúdio de treino' },
      hours: { open: '06:00', close: '21:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Treino individual', duration: 60, price: 120, category: 'Treino' },
        { name: 'Avaliação física', duration: 45, price: 150, category: 'Avaliação' },
        { name: 'Treino em dupla', duration: 60, price: 180, category: 'Treino' },
        { name: 'Consultoria online', duration: 30, price: 100, category: 'Consultoria' }
      ]
    },
    {
      id: 'veterinario', name: 'Veterinária', emoji: '🐾', accent: '#14b8a6', accent2: '#0ea5e9',
      labels: { client: 'Tutor', clients: 'Tutores', service: 'Atendimento', services: 'Atendimentos', pro: 'Veterinário', pros: 'Veterinários', appt: 'Consulta', appts: 'Consultas', newAppt: 'Nova consulta', team: 'Equipe veterinária', business: 'Clínica veterinária' },
      hours: { open: '08:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5, 6],
      services: [
        { name: 'Consulta', duration: 30, price: 150, category: 'Consulta' },
        { name: 'Vacinação', duration: 20, price: 90, category: 'Vacina' },
        { name: 'Banho e tosa', duration: 90, price: 120, category: 'Estética' },
        { name: 'Retorno', duration: 20, price: 80, category: 'Consulta' },
        { name: 'Exames', duration: 45, price: 200, category: 'Exames' }
      ]
    },
    {
      id: 'tatuagem', name: 'Tatuagem & Piercing', emoji: '🖋️', accent: '#8b5cf6', accent2: '#6366f1',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Sessão', services: 'Sessões', pro: 'Tatuador', pros: 'Tatuadores', appt: 'Sessão', appts: 'Sessões', newAppt: 'Nova sessão', team: 'Estúdio', business: 'Estúdio de tatuagem' },
      hours: { open: '10:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00' }, workdays: [2, 3, 4, 5, 6],
      services: [
        { name: 'Orçamento', duration: 30, price: 0, category: 'Avaliação' },
        { name: 'Sessão pequena', duration: 60, price: 250, category: 'Tatuagem' },
        { name: 'Sessão média', duration: 120, price: 500, category: 'Tatuagem' },
        { name: 'Sessão longa', duration: 240, price: 900, category: 'Tatuagem' },
        { name: 'Piercing', duration: 30, price: 120, category: 'Piercing' }
      ]
    },
    {
      id: 'nutricionista', name: 'Nutrição', emoji: '🥗', accent: '#84cc16', accent2: '#22c55e',
      labels: { client: 'Paciente', clients: 'Pacientes', service: 'Consulta', services: 'Consultas', pro: 'Nutricionista', pros: 'Nutricionistas', appt: 'Consulta', appts: 'Consultas', newAppt: 'Nova consulta', team: 'Equipe', business: 'Consultório' },
      hours: { open: '08:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Primeira consulta', duration: 60, price: 250, category: 'Consulta' },
        { name: 'Retorno', duration: 30, price: 150, category: 'Consulta' },
        { name: 'Avaliação física', duration: 45, price: 200, category: 'Avaliação' },
        { name: 'Plano alimentar', duration: 45, price: 180, category: 'Acompanhamento' }
      ]
    },
    {
      id: 'fisioterapia', name: 'Fisioterapia', emoji: '🦴', accent: '#10b981', accent2: '#0ea5e9',
      labels: { client: 'Paciente', clients: 'Pacientes', service: 'Sessão', services: 'Sessões', pro: 'Fisioterapeuta', pros: 'Fisioterapeutas', appt: 'Sessão', appts: 'Sessões', newAppt: 'Nova sessão', team: 'Equipe', business: 'Clínica' },
      hours: { open: '07:00', close: '19:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Avaliação', duration: 45, price: 200, category: 'Avaliação' },
        { name: 'Sessão de fisioterapia', duration: 50, price: 120, category: 'Sessão' },
        { name: 'Pilates', duration: 60, price: 140, category: 'Pilates' },
        { name: 'Liberação miofascial', duration: 40, price: 130, category: 'Sessão' }
      ]
    },
    {
      id: 'massagem', name: 'Massoterapia', emoji: '💆', accent: '#fb7185', accent2: '#f59e0b',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Sessão', services: 'Sessões', pro: 'Massoterapeuta', pros: 'Massoterapeutas', appt: 'Sessão', appts: 'Sessões', newAppt: 'Nova sessão', team: 'Equipe', business: 'Studio' },
      hours: { open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00' }, workdays: [1, 2, 3, 4, 5, 6],
      services: [
        { name: 'Massagem relaxante', duration: 60, price: 150, category: 'Relaxante' },
        { name: 'Massagem terapêutica', duration: 60, price: 180, category: 'Terapêutica' },
        { name: 'Drenagem linfática', duration: 60, price: 160, category: 'Drenagem' },
        { name: 'Pedras quentes', duration: 90, price: 220, category: 'Relaxante' }
      ]
    },
    {
      id: 'outro', name: 'Outro / Personalizado', emoji: '⭐', accent: '#7c3aed', accent2: '#a855f7',
      labels: { client: 'Cliente', clients: 'Clientes', service: 'Serviço', services: 'Serviços', pro: 'Profissional', pros: 'Profissionais', appt: 'Agendamento', appts: 'Agendamentos', newAppt: 'Novo agendamento', team: 'Equipe', business: 'Meu negócio' },
      hours: { open: '09:00', close: '18:00', breakStart: '12:00', breakEnd: '13:00' }, workdays: [1, 2, 3, 4, 5],
      services: [
        { name: 'Atendimento', duration: 60, price: 100, category: 'Atendimento' },
        { name: 'Avaliação', duration: 30, price: 80, category: 'Avaliação' },
        { name: 'Sessão completa', duration: 90, price: 150, category: 'Atendimento' }
      ]
    }
  ];

  const DEMO_CLIENTS = [
    { name: 'Ana Souza', phone: '(11) 98765-4321', email: 'ana.souza@email.com', tags: ['VIP'], notes: 'Prefere atendimento pela manhã.' },
    { name: 'Bruno Lima', phone: '(11) 99812-3344', email: 'bruno.lima@email.com', tags: ['Recorrente'] },
    { name: 'Carla Mendes', phone: '(21) 97654-8899', email: 'carla.mendes@email.com', tags: [] },
    { name: 'Diego Alves', phone: '(11) 99123-7788', email: 'diego.alves@email.com', tags: ['Novo'] },
    { name: 'Elisa Rocha', phone: '(11) 98888-1122', email: 'elisa.rocha@email.com', tags: ['VIP', 'Recorrente'], notes: 'Alergia a esmalte comum — usar hipoalergênico.' },
    { name: 'Felipe Castro', phone: '(31) 98444-5566', email: 'felipe.castro@email.com', tags: [] },
    { name: 'Gabriela Nunes', phone: '(11) 97777-6655', email: 'gabriela.nunes@email.com', tags: ['Recorrente'] },
    { name: 'Henrique Dias', phone: '(11) 96666-4433', email: 'henrique.dias@email.com', tags: [] },
    { name: 'Isabela Martins', phone: '(11) 95555-3322', email: 'isabela.martins@email.com', tags: ['VIP'], notes: 'Indicação da Ana.' },
    { name: 'João Pedro Silva', phone: '(11) 94444-2211', email: 'joao.silva@email.com', tags: [] },
    { name: 'Larissa Freitas', phone: '(11) 93333-1100', email: 'larissa.freitas@email.com', tags: ['Novo'] },
    { name: 'Marcos Vinícius', phone: '(11) 92222-0099', email: 'marcos.v@email.com', tags: [] }
  ];

  const segment = id => SEGMENTS.find(s => s.id === id) || SEGMENTS[SEGMENTS.length - 1];

  function birthdayFor(index, now = new Date()) {
    const month = index < 2 ? now.getMonth() : (now.getMonth() + 1 + index) % 12;
    const day = index < 2 ? [5, 18][index] : ((index * 3) % 27) + 1;
    return `${now.getFullYear() - (24 + index)}-${U.pad(month + 1)}-${U.pad(day)}`;
  }

  function secondProName(seg) {
    if (seg.id === 'medico') return 'Dra. Camila Ribeiro';
    if (seg.id === 'dentista') return 'Dr. Rafael Costa';
    if (seg.id === 'barbearia') return 'Rafael Costa';
    if (seg.id === 'salao') return 'Camila Ribeiro';
    if (seg.id === 'manicure') return 'Juliana Prado';
    if (seg.id === 'estetica') return 'Juliana Prado';
    if (seg.id === 'personal') return 'Rafael Costa';
    if (seg.id === 'veterinario') return 'Dra. Camila Ribeiro';
    return 'Camila Ribeiro';
  }

  function build(opts = {}) {
    const seg = segment(opts.segmentId);
    const now = new Date();
    const hours = Array.from({ length: 7 }, (_, d) => {
      const active = (opts.workdays || seg.workdays).includes(d);
      const h = opts.hours || seg.hours;
      return { active, open: h.open, close: h.close, breakStart: h.breakStart || '', breakEnd: h.breakEnd || '' };
    });

    const services = seg.services.map((s, i) => ({
      id: U.uid('svc'),
      name: s.name,
      duration: s.duration,
      price: s.price,
      buffer: 0,
      color: i === 0 ? seg.accent : PALETTE[(i + 1) % PALETTE.length],
      category: s.category || '',
      description: '',
      active: true,
      createdAt: now.toISOString()
    }));

    const professional = {
      id: U.uid('pro'),
      name: (opts.ownerName || '').trim() || 'Meu nome',
      role: seg.labels.pro,
      color: seg.accent,
      phone: '',
      email: '',
      services: [],
      hours,
      active: true,
      createdAt: now.toISOString()
    };

    const db = {
      version: 1,
      createdAt: now.toISOString(),
      settings: {
        onboarded: true,
        businessName: (opts.businessName || '').trim() || seg.labels.business,
        segment: seg.id,
        emoji: opts.emoji || seg.emoji,
        accent: seg.accent,
        accent2: seg.accent2,
        themePreset: opts.themePreset || 'custom',
        theme: opts.theme || 'light',
        language: opts.language || 'pt',
        currency: opts.currency || 'BRL',
        slotMinutes: opts.slotMinutes || 30,
        labels: { ...seg.labels },
        reminderTemplate: 'Olá, {cliente}! 😊 Seu horário de {servico} está marcado para {data} às {hora} com {profissional}. Se precisar remarcar, é só me avisar. — {negocio}',
        customFields: [],
        paymentMethods: [...PAYMENT_METHODS]
      },
      professionals: [professional],
      services,
      clients: [],
      appointments: [],
      blocks: []
    };

    if (opts.demo) addDemo(db, seg);
    return db;
  }

  function addDemo(db, seg) {
    const now = new Date();
    const nowMin = U.nowMin();
    let seed = 20261029;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const pick = arr => arr[Math.floor(rnd() * arr.length) % arr.length];

    db.clients = DEMO_CLIENTS.map((c, i) => ({
      id: U.uid('cli'),
      name: c.name,
      phone: c.phone,
      email: c.email,
      birthdate: birthdayFor(i, now),
      notes: c.notes || '',
      tags: c.tags || [],
      custom: {},
      createdAt: U.addDays(now, -120 + i * 3).toISOString()
    }));

    if (seg.id !== 'outro') {
      const second = JSON.parse(JSON.stringify(db.professionals[0]));
      second.id = U.uid('pro');
      second.name = secondProName(seg);
      second.color = PALETTE[1];
      second.phone = '';
      second.email = '';
      db.professionals.push(second);
    }

    const shortServices = db.services.filter(s => s.duration <= 60 && s.price > 0);
    const servicePool = shortServices.length ? shortServices : db.services;
    const appts = [];

    const makeAppt = (date, tMin, pro, client, svc, status, paid, method, notes) => {
      appts.push({
        id: U.uid('apt'),
        clientId: client.id,
        professionalId: pro.id,
        serviceId: svc.id,
        date: U.iso(date),
        start: U.minToTime(tMin),
        duration: svc.duration,
        buffer: svc.buffer || 0,
        price: svc.price,
        status,
        paid: !!paid,
        paymentMethod: paid ? method : '',
        paidAt: paid ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0).toISOString() : '',
        notes: notes || '',
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0).toISOString()
      });
    };

    const statusForPast = () => {
      const r = rnd();
      if (r < 0.055) return 'faltou';
      if (r < 0.1) return 'cancelado';
      return 'concluido';
    };

    const dayPlan = (date, kind) => {
      const dow = date.getDay();
      const pros = db.professionals.filter(p => p.hours[dow] && p.hours[dow].active);
      if (!pros.length) return;

      const offsets = kind === 'past' ? [0, 140, 320]
        : kind === 'today' ? [0, 95, 195, 310, 425, 545]
          : [25, 145, 315];

      offsets.forEach((off, idx) => {
        const pro = pros[idx % pros.length];
        const wh = pro.hours[dow];
        const open = U.timeToMin(wh.open);
        const close = U.timeToMin(wh.close);
        const bS = wh.breakStart ? U.timeToMin(wh.breakStart) : null;
        const bE = wh.breakEnd ? U.timeToMin(wh.breakEnd) : null;

        let t = open + off;
        const svc = pick(servicePool);
        const dur = svc.duration;
        if (bS !== null && bE !== null && t < bE && t + dur > bS) t = bE;
        if (t < open || t + dur > close) return;
        if (kind !== 'today' && rnd() < 0.12) return;

        const client = pick(db.clients);
        let status, paid = false, method = '';

        if (kind === 'past') {
          status = statusForPast();
          if (status === 'concluido') {
            paid = rnd() > 0.09;
            method = paid ? pick(PAYMENT_METHODS) : '';
          }
        } else if (kind === 'today') {
          if (t + dur <= nowMin) {
            status = rnd() < 0.07 ? 'faltou' : 'concluido';
            if (status === 'concluido') {
              paid = rnd() > 0.15;
              method = paid ? pick(PAYMENT_METHODS) : '';
            }
          } else {
            status = rnd() < 0.6 ? 'confirmado' : 'agendado';
          }
        } else {
          status = rnd() < 0.5 ? 'confirmado' : 'agendado';
        }

        makeAppt(date, t, pro, client, svc, status, paid, method,
          rnd() < 0.18 ? pick(['Cliente pediu confirmação por WhatsApp.', 'Primeira visita.', 'Retorno de acompanhamento.', 'Prefere atendimento rápido.']) : '');
      });
    };

    for (let i = 45; i >= 1; i--) {
      const date = U.addDays(now, -i);
      if (date.getDay() === 0) continue;
      dayPlan(date, 'past');
    }

    dayPlan(now, 'today');

    for (let i = 1; i <= 12; i++) {
      const date = U.addDays(now, i);
      if (date.getDay() === 0) continue;
      dayPlan(date, 'future');
    }

    db.appointments = appts.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

    db.blocks = [];
    const nextWeek = U.addDays(now, 7);
    const dow = nextWeek.getDay();
    const pro = db.professionals[0];
    const wh = pro.hours[dow];
    if (wh && wh.active) {
      db.blocks.push({
        id: U.uid('blk'),
        professionalId: pro.id,
        date: U.iso(nextWeek),
        allDay: false,
        start: '15:00',
        end: '16:00',
        reason: 'Compromisso pessoal'
      });
    }

    const waitClients = db.clients.slice(0, 3);
    db.waitlist = waitClients.map((c, i) => ({
      id: U.uid('wl'),
      clientId: c.id,
      serviceId: servicePool[i % servicePool.length].id,
      professionalId: i % 2 ? db.professionals[0].id : '',
      date: '',
      period: ['manha', 'tarde', 'qualquer'][i % 3],
      priority: i === 0 ? 'alta' : 'normal',
      notes: i === 0 ? 'Prefere encaixe pela manhã.' : '',
      status: 'aguardando',
      appointmentId: '',
      createdAt: U.addDays(now, -i).toISOString()
    }));
  }

  function applySegment(db, segmentId) {
    const seg = segment(segmentId);
    db.settings.segment = seg.id;
    db.settings.accent = seg.accent;
    db.settings.accent2 = seg.accent2;
    db.settings.labels = { ...seg.labels };
    return seg;
  }

  return { SEGMENTS, PALETTE, PAYMENT_METHODS, segment, build, applySegment, DEMO_CLIENTS };
})();
