/* ==========================================================================
   I18n — idiomas PT/EN, catálogo de tradução e aplicação em tempo de execução
   ========================================================================== */
const I18n = (() => {
  const LANGS = {
    pt: { code: 'pt', locale: 'pt-BR', label: 'Português', native: 'Português (Brasil)' },
    en: { code: 'en', locale: 'en-US', label: 'English', native: 'English (US)' }
  };

  const EN = {
    /* Navegação, seções e títulos */
    'Visão geral': 'Overview',
    'Agenda': 'Schedule',
    'Lista de espera': 'Waitlist',
    'Clientes': 'Clients',
    'Serviços': 'Services',
    'Equipe': 'Team',
    'Financeiro': 'Finance',
    'Lembretes': 'Reminders',
    'Configurações': 'Settings',
    'Principal': 'Main',
    'Gestão': 'Management',
    'Sistema': 'System',
    'Identidade': 'Identity',
    'Textos': 'Texts',
    'Acesso': 'Access',
    'Dados e backup': 'Data & backup',
    'Idioma': 'Language',
    'Manual': 'Manual',
    'Manual do usuário': 'User manual',
    'Temas': 'Themes',
    'Aparência': 'Appearance',
    'Tema': 'Theme',
    'Temas prontos': 'Ready-made themes',
    'Tema claro': 'Light theme',
    'Tema escuro': 'Dark theme',
    'Claro': 'Light',
    'Escuro': 'Dark',
    'Seguir o sistema': 'Follow system',
    'Moeda': 'Currency',
    'Segmento': 'Segment',
    'Emoji / ícone': 'Emoji / icon',
    'Cor principal': 'Primary color',
    'Cor secundária': 'Secondary color',
    'Nome do negócio': 'Business name',
    'Usada em botões, destaques e gráficos.': 'Used in buttons, highlights and charts.',
    'Compõe o degradê da identidade.': 'Builds the identity gradient.',
    'Aparece no menu, nos lembretes e nos relatórios.': 'Shown in the menu, reminders and reports.',
    'Aplicar identidade do segmento': 'Apply segment identity',
    'Trocar o segmento não altera seus dados. Use': "Changing the segment doesn't change your data. Use",
    'para atualizar cores e nomenclaturas automaticamente.': 'to update colors and terminology automatically.',
    'Salvar identidade': 'Save identity',
    'Personalize o Hora Marcada para o seu jeito de atender.': 'Customize Hora Marcada to the way you work.',
    'Definido pelo gestor': 'Set by manager',

    /* Agenda / configurações */
    'Granularidade dos horários sugeridos.': 'Granularity of suggested times.',
    'Intervalo da agenda': 'Schedule interval',
    'Formas de pagamento': 'Payment methods',
    'Separe por vírgula.': 'Separate with commas.',
    'Campos personalizados do cliente': 'Custom client fields',
    'Adicione informações extras ao cadastro, como convênio, plano, número de prontuário etc.': 'Add extra information to the profile, such as insurance, plan, record number, etc.',
    'Número': 'Number',
    'Data': 'Date',
    'Texto': 'Text',
    'Remover campo': 'Remove field',
    'Nenhum campo extra cadastrado.': 'No custom fields added.',
    'Nome do campo': 'Field name',
    'Ex.: Convênio': 'E.g.: Insurance',
    'Adicionar': 'Add',
    'Salvar preferências': 'Save preferences',
    'Nomenclaturas': 'Terminology',
    'Adapte o sistema ao seu segmento: paciente, cliente, aluno, consulta, sessão...': 'Adapt the system to your field: patient, client, student, consultation, session...',
    'Modelo de mensagem / lembrete': 'Message / reminder template',
    'As variáveis são substituídas automaticamente ao enviar pelo WhatsApp.': 'Variables are replaced automatically when sending via WhatsApp.',
    'Restaurar nomes do segmento': 'Restore segment names',
    'Salvar textos': 'Save texts',
    'Cliente (singular)': 'Client (singular)',
    'Clientes (plural)': 'Clients (plural)',
    'Serviço (singular)': 'Service (singular)',
    'Serviços (plural)': 'Services (plural)',
    'Profissional (singular)': 'Professional (singular)',
    'Profissionais (plural)': 'Professionals (plural)',
    'Atendimento (singular)': 'Appointment (singular)',
    'Atendimentos (plural)': 'Appointments (plural)',
    'Botão de novo agendamento': 'New appointment button',
    'Nome da equipe': 'Team name',
    'Tipo de negócio': 'Business type',
    'Intervalo': 'Buffer',
    'Intervalo após o atendimento (min)': 'Buffer after appointment (min)',
    'Tempo de limpeza/organização entre clientes.': 'Cleanup/reset time between clients.',

    /* Acesso */
    'Acesso restrito': 'Restricted access',
    'Esta área é exclusiva do gestor. Desbloqueie com o PIN para alterar o modo de recepção, o PIN ou os dados do sistema.': 'This area is for the manager only. Unlock it with the PIN to change reception mode, the PIN or system data.',
    'Desbloquear como gestor': 'Unlock as manager',
    'Acesso do gestor': 'Manager access',
    'Valores financeiros protegidos': 'Financial values protected',
    'Acesso do gestor liberado nesta sessão.': 'Manager access unlocked for this session.',
    'O acesso do gestor já está liberado.': 'Manager access is already unlocked.',
    'Modo gestor ativo': 'Manager mode active',
    'Modo recepção': 'Reception mode',
    'Você pode ver valores financeiros e dados do sistema nesta sessão.': 'You can see financial values and system data in this session.',
    'Valores financeiros ficam ocultos para quem está no balcão.': 'Financial values are hidden from reception.',
    'Bloquear agora': 'Lock now',
    'Desbloquear': 'Unlock',
    'Liberar acesso': 'Unlock access',
    'Quando ativo, valores, relatórios financeiros e backups ficam protegidos por PIN. O desbloqueio vale apenas para esta sessão.': 'When active, financial values, reports and backups are protected by PIN. Unlocking applies to this session only.',
    'Proteger valores financeiros': 'Protect financial values',
    'Recomendado para recepções e balcões compartilhados.': 'Recommended for reception desks and shared counters.',
    'PIN do gestor': 'Manager PIN',
    'Um PIN já está definido. Informe um novo PIN para substituí-lo.': 'A PIN is already set. Enter a new PIN to replace it.',
    'Nenhum PIN definido. Defina de 4 a 8 números para proteger o acesso.': 'No PIN set. Choose 4 to 8 digits to protect access.',
    'Novo PIN': 'New PIN',
    'Criar PIN': 'Create PIN',
    'Confirmar PIN': 'Confirm PIN',
    'Repita o PIN': 'Repeat PIN',
    '4 a 8 números': '4 to 8 digits',
    'Remover PIN': 'Remove PIN',
    'Sem PIN, qualquer pessoa pode desbloquear.': 'Without a PIN, anyone can unlock.',
    'Salvar acesso': 'Save access',
    'Dados protegidos': 'Protected data',
    'Backups, planilhas e a zona de risco só ficam disponíveis para o gestor. Desbloqueie com o PIN para continuar.': 'Backups, spreadsheets and the danger zone are available to the manager only. Unlock with the PIN to continue.',
    'Sem PIN, o modo gestor pode ser desbloqueado por qualquer pessoa. Deseja remover?': 'Without a PIN, anyone can unlock manager mode. Remove it?',
    'O acesso do gestor será bloqueado e os valores financeiros ficarão ocultos novamente. Deseja continuar?': 'Manager access will be locked and financial values will be hidden again. Continue?',
    'Defina um PIN em Configurações → Acesso.': 'Set a PIN in Settings → Access.',
    'O modo recepção está desativado. Ative em Configurações → Acesso.': 'Reception mode is off. Enable it in Settings → Access.',
    'O modo recepção oculta valores financeiros. Informe o PIN do gestor para liberar o acesso nesta sessão.': 'Reception mode hides financial values. Enter the manager PIN to unlock this session.',
    'O PIN não é armazenado nesta sessão. Ao recarregar, os valores voltam a ficar protegidos.': 'The PIN is not stored in this session. After reloading, values are protected again.',
    'Nenhum PIN foi definido ainda. Você pode liberar o acesso e criar um PIN em': 'No PIN has been set yet. You can unlock access and create a PIN in',
    'Configurações → Acesso': 'Settings → Access',

    /* Dados */
    'Armazenamento': 'Storage',
    'Seus dados ficam salvos apenas neste dispositivo/navegador. Faça backups regulares antes de limpar o navegador ou trocar de computador.': 'Your data is stored only on this device/browser. Make regular backups before clearing the browser or switching computers.',
    'Backup completo': 'Full backup',
    'Exportar backup': 'Export backup',
    'Importar backup': 'Import backup',
    'Importar': 'Import',
    'Planilhas': 'Spreadsheets',
    'Exportar clientes': 'Export clients',
    'Exportar agendamentos': 'Export appointments',
    'Dados de exemplo': 'Sample data',
    'Substitui todos os dados atuais por uma demonstração completa com clientes e agendamentos fictícios.': 'Replaces all current data with a complete demo containing fictional clients and appointments.',
    'Carregar demonstração': 'Load demo',
    'Zona de risco': 'Danger zone',
    'Apaga todos os dados e reinicia o Hora Marcada. Exporte um backup antes.': 'Deletes all data and restarts Hora Marcada. Export a backup first.',
    'Apagar tudo e recomeçar': 'Delete everything and start over',
    'Versão': 'Version',
    'Nome': 'Name',
    'Publicação': 'Release',
    'Privacidade': 'Privacy',
    'Nenhum dado é enviado para servidores. Tudo fica no seu dispositivo, sob seu controle.': 'No data is sent to servers. Everything stays on your device, under your control.',
    'Microsoft Store': 'Microsoft Store',
    'JSON': 'JSON',
    'CSV (Excel)': 'CSV (Excel)',
    'CSV': 'CSV',

    /* Barra superior / navegação */
    'Fechar menu': 'Close menu',
    'Abrir menu': 'Open menu',
    'Buscar cliente, serviço...': 'Search clients, services...',
    'Busca global': 'Global search',
    'Alternar tema': 'Toggle theme',
    'Gestor': 'Manager',
    'Recepção': 'Reception',
    'Gestor — clique para bloquear os valores': 'Manager — click to hide financial values',
    'Modo recepção — valores protegidos': 'Reception mode — values protected',
    'Atalho: Alt+N': 'Shortcut: Alt+N',
    'Nenhum resultado encontrado.': 'No results found.',
    'Nenhum resultado': 'No results',
    'Tente outro nome ou categoria.': 'Try another name or category.',
    'Tente outro nome, telefone ou tag.': 'Try another name, phone or tag.',
    'Sem contato': 'No contact',
    'Sem contato cadastrado': 'No contact on file',
    'Sem telefone': 'No phone',
    'Cliente removido': 'Deleted client',
    'Serviço removido': 'Deleted service',
    'Profissional removido': 'Deleted professional',

    /* Status */
    'Agendado': 'Scheduled',
    'Agendados': 'Scheduled',
    'Confirmado': 'Confirmed',
    'Confirmados': 'Confirmed',
    'Concluído': 'Completed',
    'Concluídos': 'Completed',
    'Faltou': 'No-show',
    'Cancelado': 'Cancelled',
    'Cancelada': 'Cancelled',
    'Todos': 'All',
    'Todas': 'All',
    'Todos os status': 'All statuses',
    'Todos os profissionais': 'All professionals',
    'Todas as categorias': 'All categories',
    'Todos os futuros': 'All upcoming',
    'a confirmar': 'to confirm',
    'confirmados ·': 'confirmed ·',
    'confirmado(s)': 'confirmed',
    'concluído': 'completed',
    'aguardando chegada': 'awaiting arrival',
    'clientes aguardando encaixe': 'clients waiting for a slot',
    'atendimentos concluídos': 'completed appointments',
    'livre': 'free',
    'clique para agendar': 'click to schedule',
    'prioridade': 'high priority',
    'manhã': 'morning',
    'tarde': 'afternoon',
    'qualquer horário': 'any time',
    'Ativo': 'Active',
    'Inativo': 'Inactive',

    /* Dashboard */
    'Resumo do dia, ocupação e próximos atendimentos.': "Today's summary, occupancy and upcoming appointments.",
    'Agenda de hoje': "Today's schedule",
    'Próximo atendimento': 'Next appointment',
    'Agenda livre': 'Schedule free',
    'Nenhum atendimento futuro marcado.': 'No upcoming appointments.',
    'Nenhum atendimento hoje.': 'No appointments today.',
    'Agendar agora': 'Schedule now',
    'Atendimentos hoje': 'Appointments today',
    'Ocupação de hoje': "Today's occupancy",
    'Faturamento do mês': 'Monthly revenue',
    'A receber': 'Receivable',
    'Ticket médio': 'Average ticket',
    'Check-ins de hoje': "Today's check-ins",
    'Ver completa': 'View full',
    'Ver agenda': 'View schedule',
    'Ver financeiro': 'View finance',
    'Ver lista de espera': 'View waitlist',
    'Próximos 7 dias': 'Next 7 days',
    'Aniversariantes do mês': 'Birthdays this month',
    'Nenhum aniversariante este mês.': 'No birthdays this month.',
    'Pagamentos pendentes': 'Pending payments',
    'Tudo em dia! 🎉': 'All caught up! 🎉',
    'Seu dia está livre. Aproveite para organizar os próximos atendimentos.': 'Your day is free. Take the time to organize upcoming appointments.',
    'Dica rápida': 'Quick tip',
    'Clique em um atendimento para confirmar, concluir ou remarcar.': 'Click an appointment to confirm, complete or reschedule it.',
    'Agenda inteligente': 'Smart schedule',
    'Clique em um espaço vazio da coluna para agendar naquele horário.': 'Click an empty slot in the column to book that time.',
    'Encaixe fácil': 'Easy fit-in',
    'Ao surgir um horário, chame o próximo da lista e confirme em segundos.': 'When a slot opens, call the next person on the list and confirm in seconds.',
    'Controle': 'Control',
    'Só atendimentos concluídos e pagos entram como recebido.': 'Only completed and paid appointments count as received.',
    'Menos faltas': 'Fewer no-shows',
    'Envie o lembrete um dia antes e confirme o horário.': 'Send the reminder a day before and confirm the time.',
    'Seu jeito': 'Your way',
    'Ajuste nomes, cores e textos para combinar com o seu negócio.': 'Adjust names, colors and texts to match your business.',
    'Fidelize': 'Build loyalty',
    'Use as tags para marcar clientes VIP, recorrentes ou novos.': 'Use tags to mark VIP, recurring or new clients.',
    'Evite atrasos': 'Avoid delays',
    'O intervalo após o atendimento reserva tempo de organização entre clientes.': 'The buffer after an appointment reserves time to reset between clients.',
    'Bloqueios removem apenas um período, sem mudar o horário padrão.': 'Blocks remove only a specific period without changing your regular hours.',
    'Chegou': 'Arrived',
    'Registrar chegada': 'Register arrival',
    'Registre a chegada do cliente ao chegar.': 'Register the client when they arrive.',

    /* Agenda */
    'Dia': 'Day',
    'Semana': 'Week',
    'Mês': 'Month',
    'Mês anterior': 'Previous month',
    'Hoje': 'Today',
    'Amanhã': 'Tomorrow',
    'Ontem': 'Yesterday',
    'Anterior': 'Previous',
    'Próximo': 'Next',
    'Próximo:': 'Next:',
    'Último:': 'Last:',
    'Imprimir': 'Print',
    'Imprimir agenda do dia': 'Print daily schedule',
    'Filtrar por profissional': 'Filter by professional',
    'Filtrar por status': 'Filter by status',
    'Nenhum profissional cadastrado': 'No professionals added',
    'Cadastre a equipe para começar a montar a agenda.': 'Add your team to start building the schedule.',
    'Cadastrar profissional': 'Add professional',
    'Nenhum atendimento neste dia': 'No appointments on this day',
    'Nenhum profissional tem horário de trabalho configurado para esta data.': 'No professional has working hours set for this date.',
    'Ocupação:': 'Occupancy:',
    'Nenhum horário livre neste dia. Você pode marcar como encaixe abaixo.': 'No free time on this day. You can book it as a fit-in below.',
    'Nenhum horário livre neste dia.': 'No free time on this day.',
    'Nenhum horário livre nos próximos 60 dias. Ajuste os filtros ou bloqueios.': 'No free time in the next 60 days. Adjust filters or blocks.',
    'Dia inteiro': 'All day',
    'Bloquear horário': 'Block time',
    'Bloqueios futuros': 'Upcoming blocks',
    'Horário de trabalho': 'Working hours',
    'Horário de trabalho:': 'Working hours:',
    'Bloqueado': 'Blocked',
    'Check-in realizado': 'Checked in',
    'Você pode marcar como encaixe abaixo.': 'You can book it as a fit-in below.',
    'Você pode editar antes de enviar. Placeholders disponíveis nas configurações.': 'You can edit before sending. Placeholders are available in settings.',

    /* Lista de espera */
    'Encaixes, prioridades e clientes aguardando um horário.': 'Fit-ins, priorities and clients waiting for a time.',
    'Registre quem quer um horário e encaixe quando vagar.': 'Register who wants a time and fit them in when one opens.',
    'Registre quem procura um horário e avise ou encaixe assim que surgir uma vaga.': 'Register who is looking for a time, then notify or fit them in as soon as a slot opens.',
    'Nenhum cliente na lista de espera': 'No clients on the waitlist',
    'Adicionar à lista de espera': 'Add to waitlist',
    'Adicionar à lista': 'Add to list',
    'Remover da lista de espera': 'Remove from waitlist',
    'Remover da lista': 'Remove from list',
    'Editar lista de espera': 'Edit waitlist',
    'Editar entrada': 'Edit entry',
    'Encaixe sugerido:': 'Suggested slot:',
    'Prioridade': 'Priority',
    'Alta — encaixar assim que possível': 'High — fit in as soon as possible',
    'Normal': 'Normal',
    'Período preferido': 'Preferred period',
    'Manhã': 'Morning',
    'Tarde': 'Afternoon',
    'Qualquer horário': 'Any time',
    'Data desejada': 'Preferred date',
    'Deixe em branco para qualquer dia.': 'Leave blank for any day.',
    'Total na lista:': 'Total on the list:',
    'Encaixe sugerido': 'Suggested slot',
    'Ligar': 'Call',
    'Abrir WhatsApp': 'Open WhatsApp',
    'Agendar': 'Schedule',
    'Clientes que querem um horário. Encaixe quando vagar.': 'Clients who want a time. Fit them in when a slot opens.',

    /* Clientes */
    'Cadastro, contato e histórico de atendimentos.': 'Profile, contact and appointment history.',
    'Cadastre para agilizar os próximos agendamentos.': 'Register clients to speed up future appointments.',
    'Novo cliente': 'New client',
    'Editar cliente': 'Edit client',
    'Ficha do cliente': 'Client profile',
    'Nome completo': 'Full name',
    'Telefone / WhatsApp': 'Phone / WhatsApp',
    'Telefone': 'Phone',
    'E-mail': 'Email',
    'Data de nascimento': 'Date of birth',
    'Observações': 'Notes',
    'Tags': 'Tags',
    'Cadastro recente': 'Recently added',
    'Maior gasto': 'Highest spend',
    'Último atendimento': 'Last visit',
    'Histórico': 'History',
    'Total pago': 'Total paid',
    'Atendimentos': 'Appointments',
    'Novo': 'New',
    'Recorrente': 'Recurring',
    'Atualize os dados cadastrais.': 'Update the profile information.',
    'Cadastre um cliente primeiro.': 'Add a client first.',
    'Informe o nome do cliente.': 'Enter the client name.',
    'Cadastre seus clientes para agilizar os agendamentos e manter o histórico.': 'Add your clients to speed up appointments and keep their history.',
    'Sem atendimentos': 'No appointments yet',
    'Nenhum atendimento registrado ainda.': 'No appointments recorded yet.',
    'visita': 'visit',
    'visitas': 'visits',
    'este mês': 'this month',
    'Nome (A–Z)': 'Name (A–Z)',
    'Nome (A-Z)': 'Name (A-Z)',
    'Mais recentes': 'Most recent',
    'Cliente': 'Client',
    'Próximo': 'Next',

    /* Serviços */
    'Duração, preço e organização dos serviços.': 'Duration, price and service organization.',
    'Defina duração e valor para agilizar os agendamentos.': 'Set duration and price to speed up appointments.',
    'Cadastre os serviços com duração e valor para agilizar os agendamentos.': 'Add services with duration and price to speed up appointments.',
    'Novo serviço': 'New service',
    'Editar serviço': 'Edit service',
    'Nome do serviço': 'Service name',
    'Duração': 'Duration',
    'Duração (min)': 'Duration (min)',
    'Preço': 'Price',
    'Preço (BRL)': 'Price (BRL)',
    'Valor': 'Amount',
    'Valor (BRL)': 'Amount (BRL)',
    'Categoria': 'Category',
    'Descrição': 'Description',
    'Serviço ativo': 'Active service',
    'Cor na agenda': 'Schedule color',
    'Duração e cor na agenda. Ticket médio:': 'Duration and schedule color. Average ticket:',
    'Serviços que realiza': 'Services provided',
    'Desmarque para limitar os serviços deste profissional.': 'Uncheck to limit this professional to specific services.',
    'Informe o nome do serviço.': 'Enter the service name.',
    'Informe a duração.': 'Enter the duration.',
    'Informe um intervalo válido (fim depois do início).': 'Enter a valid interval (end after start).',
    'Nenhum serviço cadastrado.': 'No services added.',
    'Mais duração': 'Longest duration',
    'Menos duração': 'Shortest duration',
    'Menor preço': 'Lowest price',
    'Maior preço': 'Highest price',
    'Cadastrar serviço': 'Add service',
    'Serviço': 'Service',

    /* Equipe */
    'Profissionais, horários de trabalho e bloqueios.': 'Professionals, working hours and blocks.',
    'Cadastre quem atende para distribuir os horários na agenda.': 'Add your team to distribute schedule times.',
    'Novo profissional': 'New professional',
    'Editar profissional': 'Edit professional',
    'Nome do profissional': 'Professional name',
    'Cargo / especialidade': 'Role / specialty',
    'Cor': 'Color',
    'Ativo na agenda': 'Active in schedule',
    'Horários, serviços e identificação na agenda.': 'Hours, services and schedule identity.',
    'Defina os dias e horários de atendimento.': 'Set working days and hours.',
    'Informe o nome do profissional.': 'Enter the professional name.',
    'Profissional não encontrado.': 'Professional not found.',
    'Cadastre pelo menos um profissional antes de agendar.': 'Add at least one professional before scheduling.',
    'Cadastre pelo menos um serviço antes de agendar.': 'Add at least one service before scheduling.',
    'Cadastre pelo menos um serviço antes de usar a lista de espera.': 'Add at least one service before using the waitlist.',
    'Escolha pelo menos um dia de atendimento.': 'Choose at least one working day.',
    'O horário de fechamento deve ser depois da abertura.': 'Closing time must be after opening time.',
    'A pausa deve terminar depois de começar.': 'The break must end after it starts.',
    'Preencha o início e o fim da pausa, ou deixe os dois vazios.': 'Fill in the break start and end, or leave both empty.',
    'Verifique os horários: o fechamento deve ser depois da abertura e a pausa deve ter início antes do fim.': 'Check the hours: closing must be after opening and the break must start before it ends.',
    'Nenhum bloqueio futuro. Use para almoço, folgas, feriados ou compromissos.': 'No upcoming blocks. Use them for lunch, days off, holidays or personal commitments.',
    'Repetir por': 'Repeat for',
    'semanas': 'weeks',
    'pausa': 'break',
    'Serviços:': 'Services:',
    'define quando cada profissional aparece na agenda e quais horários ficam disponíveis.': 'defines when each professional appears in the schedule and which times are available.',
    'removem um período específico da disponibilidade, sem alterar o horário padrão.': 'remove a specific period from availability without changing regular hours.',
    'ao limitar, o profissional só recebe os serviços marcados.': 'when limited, the professional only receives the selected services.',

    /* Financeiro */
    'Recebimentos, valores a receber e previsão.': 'Payments received, amounts due and forecasts.',
    'Financeiro protegido': 'Finance protected',
    'Os valores financeiros estão ocultos no modo recepção. Desbloqueie com o PIN do gestor para acessar.': 'Financial values are hidden in reception mode. Unlock with the manager PIN to access.',
    'Recebimentos': 'Received',
    'Recebido': 'Received',
    'Receber': 'Receive',
    'Previsto (agendado)': 'Expected (scheduled)',
    'Este mês': 'This month',
    'Últimos 30 dias': 'Last 30 days',
    'Este ano': 'This year',
    'Personalizado': 'Custom',
    'Fim': 'End',
    'Início': 'Start',
    'De': 'From',
    'Até': 'To',
    'Forma de pagamento': 'Payment method',
    'Pagamento': 'Payment',
    'Pagamento recebido agora': 'Payment received now',
    'Confirmar recebimento': 'Confirm payment',
    'Se desmarcar, o valor ficará como "a receber" no financeiro.': 'If unchecked, the amount will stay as "receivable" in finance.',
    'Nenhum recebimento registrado no período.': 'No payments recorded in this period.',
    'Nenhum registro': 'No records',
    'Não há atendimentos nesta seleção. Conclua atendimentos para gerar receita.': 'No appointments in this selection. Complete appointments to generate revenue.',
    'Situação': 'Status',
    'Confirmar': 'Confirm',
    'Cancelar': 'Cancel',
    'Concluir': 'Complete',
    'Concluir atendimento': 'Complete appointment',
    'Confirmar atendimento': 'Confirm appointment',
    'Detalhes do agendamento': 'Appointment details',
    'Alterar status': 'Change status',
    'Editar agendamento': 'Edit appointment',
    'Excluir agendamento': 'Delete appointment',
    'Cancelar agendamento': 'Cancel appointment',
    'Reabrir': 'Reopen',
    'Reabrir atendimento': 'Reopen appointment',
    'Excluir cliente': 'Delete client',
    'Excluir': 'Delete',
    'Excluir profissional': 'Delete professional',
    'Remover': 'Remove',
    'Salvar': 'Save',
    'Salvar alterações': 'Save changes',
    'Fechar': 'Close',
    'Voltar': 'Back',
    'Continuar': 'Continue',
    'Copiar mensagem': 'Copy message',
    'Mensagem': 'Message',
    'Enviar lembrete': 'Send reminder',
    'Enviar no WhatsApp': 'Send on WhatsApp',
    'Enviar': 'Send',
    'Ver': 'View',
    'Editar': 'Edit',
    'Total': 'Total',
    'Status': 'Status',
    'Ações': 'Actions',
    'Filtros': 'Filters',
    'Limpar filtros': 'Clear filters',
    'Abrir': 'Open',

    /* Lembretes */
    'Confirmações e mensagens para reduzir faltas.': 'Confirmations and messages to reduce no-shows.',
    'Confirme horários e reduza faltas com mensagens prontas.': 'Confirm times and reduce no-shows with ready-made messages.',
    'Mensagem padrão de lembrete': 'Default reminder message',
    'Editar modelo': 'Edit template',
    'Como funciona': 'How it works',
    'Variáveis: {cliente} {servico} {profissional} {data} {hora} {valor} {negocio}': 'Variables: {cliente} {servico} {profissional} {data} {hora} {valor} {negocio}',
    'Cliente pediu confirmação por WhatsApp.': 'Client requested confirmation via WhatsApp.',
    'Compromisso pessoal': 'Personal commitment',
    'Motivo': 'Reason',
    'Bloqueios:': 'Blocks:',
    'Impeça agendamentos em um período específico.': 'Prevent appointments during a specific period.',
    'Nenhum lembrete pendente': 'No pending reminders',
    'Não há agendamentos aguardando confirmação neste período.': 'No appointments awaiting confirmation in this period.',
    'Confirmar presença': 'Confirm attendance',
    'O atendimento será marcado como': 'The appointment will be marked as',
    'Confirmar teste': 'Confirm test',
    'Sugestão:': 'Suggestion:',

    /* Formulários / modais */
    'Novo agendamento': 'New appointment',
    'Preencha os dados do atendimento.': 'Fill in the appointment details.',
    'Data e horário': 'Date and time',
    'Horário': 'Time',
    'Observações do atendimento': 'Appointment notes',
    'Permitir encaixe (ignorar conflito de horário)': 'Allow fit-in (ignore time conflict)',
    'Qualquer profissional': 'Any professional',
    'Qualquer dia': 'Any day',
    'Selecione um cliente.': 'Select a client.',
    'Selecione um serviço.': 'Select a service.',
    'Selecione um profissional.': 'Select a professional.',
    'Selecione o cliente.': 'Select the client.',
    'Selecione o serviço.': 'Select the service.',
    'Informe a data.': 'Enter the date.',
    'Informe o horário.': 'Enter the time.',
    'Agendamento atualizado.': 'Appointment updated.',
    'Agendamento criado.': 'Appointment created.',
    'Agendamento confirmado.': 'Appointment confirmed.',
    'Agendamento excluído.': 'Appointment deleted.',
    'Agendamento não encontrado.': 'Appointment not found.',
    'Agendamento reaberto.': 'Appointment reopened.',
    'Atendimento concluído.': 'Appointment completed.',
    'Atendimento concluído e registrado.': 'Appointment completed and recorded.',
    'Cliente cadastrado.': 'Client added.',
    'Cliente atualizado.': 'Client updated.',
    'Cliente excluído.': 'Client deleted.',
    'Cliente já chegou.': 'Client already checked in.',
    'Serviço cadastrado.': 'Service added.',
    'Serviço atualizado.': 'Service updated.',
    'Serviço excluído.': 'Service deleted.',
    'Profissional excluído.': 'Professional deleted.',
    'Lista de espera atualizada.': 'Waitlist updated.',
    'Entrada removida da lista.': 'Entry removed from the list.',
    'Entrada não encontrada.': 'Entry not found.',
    'Cliente adicionado à lista de espera.': 'Client added to the waitlist.',
    'O serviço desta entrada não existe mais.': 'The service for this entry no longer exists.',
    'Não é possível fazer check-in neste atendimento.': 'Check-in is not available for this appointment.',
    'Fazer check-in': 'Check in',
    'Desfazer check-in': 'Undo check-in',
    'Check-in': 'Check-in',
    'protegido': 'protected',
    'Este cliente não tem telefone cadastrado. Copie a mensagem e envie pelo canal que preferir.': "This client has no phone number on file. Copy the message and send it through the channel you prefer.",
    'Essa ação remove o agendamento permanentemente. Deseja continuar?': 'This permanently deletes the appointment. Continue?',
    'O horário será liberado na agenda. Deseja continuar?': 'The time will be freed in the schedule. Continue?',
    'O período voltará a ficar disponível.': 'The period will become available again.',
    'O cadastro será removido. O histórico de agendamentos é mantido, mas ficará sem vínculo com o cliente. Deseja continuar?': 'The profile will be removed. Appointment history is kept but will no longer be linked to the client. Continue?',
    'Os valores já preenchidos nos cadastros deixarão de aparecer. Deseja remover?': 'Values already entered in profiles will no longer appear. Remove it?',
    'Os nomes personalizados serão substituídos pelos nomes padrão do segmento. Deseja continuar?': 'Custom names will be replaced by the segment defaults. Continue?',
    'Todos os dados atuais serão substituídos pelos dados do arquivo. Deseja continuar?': 'All current data will be replaced by the file data. Continue?',
    'Todos os dados atuais serão substituídos por dados fictícios de demonstração. Deseja continuar?': 'All current data will be replaced by fictional demo data. Continue?',
    'Esta ação é irreversível. Todos os clientes, agendamentos, serviços e configurações serão apagados. Deseja continuar?': 'This action is irreversible. All clients, appointments, services and settings will be deleted. Continue?',
    'Apagar todos os dados': 'Delete all data',
    'Aplicar': 'Apply',
    'Restaurar': 'Restore',
    'Substituir': 'Replace',
    'Sim': 'Yes',
    'Não': 'No',
    'Cadastrar': 'Add',
    'Sem atendimentos': 'No appointments yet',
    'O valor': 'The amount',
    'Pago': 'Paid',
    'Não pago': 'Unpaid',
    'Desconto': 'Discount',
    'Forma de pagamento': 'Payment method',
    'Observações': 'Notes',

    /* Toasts / erros */
    'Identidade atualizada.': 'Identity updated.',
    'Identidade do segmento aplicada.': 'Segment identity applied.',
    'Preferências de agenda salvas.': 'Schedule preferences saved.',
    'Campo personalizado adicionado.': 'Custom field added.',
    'Campo removido.': 'Field removed.',
    'Textos atualizados.': 'Texts updated.',
    'Nomes restaurados.': 'Names restored.',
    'Configurações de acesso salvas.': 'Access settings saved.',
    'PIN removido.': 'PIN removed.',
    'Sessão bloqueada. Valores financeiros ocultos.': 'Session locked. Financial values hidden.',
    'Backup exportado.': 'Backup exported.',
    'Backup importado com sucesso.': 'Backup imported successfully.',
    'Clientes exportados.': 'Clients exported.',
    'Agendamentos exportados.': 'Appointments exported.',
    'Demonstração carregada.': 'Demo loaded.',
    'Os PINs não conferem.': 'PINs do not match.',
    'Informe o nome do campo.': 'Enter the field name.',
    'O PIN deve ter de 4 a 8 números.': 'The PIN must have 4 to 8 digits.',
    'PIN incorreto. Tente novamente.': 'Incorrect PIN. Try again.',
    'Não foi possível salvar. O armazenamento do navegador pode estar cheio.': 'Could not save. Browser storage may be full.',
    'Não foi possível copiar.': 'Could not copy.',
    'Não foi possível ler o arquivo. Verifique se é um JSON válido.': 'Could not read the file. Check that it is valid JSON.',
    'Arquivo inválido: não parece ser um backup do Hora Marcada.': 'Invalid file: this does not look like a Hora Marcada backup.',
    'Base de dados não carregada.': 'Database not loaded.',
    'Falha ao carregar dados:': 'Failed to load data:',
    'Falha ao salvar:': 'Failed to save:',
    'Service worker não registrado:': 'Service worker not registered:',
    'Não foi possível abrir esta tela': 'Could not open this screen',
    'Erro inesperado.': 'Unexpected error.',
    'Voltar à visão geral': 'Back to overview',

    /* Onboarding */
    'Qual é o seu segmento?': 'What is your segment?',
    'Escolha o mais próximo do seu trabalho. Você poderá personalizar nomes, cores e serviços depois.': 'Choose the closest to your work. You can customize names, colors and services later.',
    'Selecionado:': 'Selected:',
    'os nomes padrão serão': 'the default names will be',
    'cliente': 'client',
    'serviço': 'service',
    'agendamento': 'appointment',
    'Leva menos de 1 minuto': 'Takes less than 1 minute',
    'Tudo pronto para começar': 'All set to start',
    'Como o seu negócio aparece?': 'How does your business appear?',
    'Essas informações ficam no menu e nos lembretes enviados aos clientes.': 'This information appears in the menu and in reminders sent to clients.',
    'Seu nome': 'Your name',
    'Como você quer ser chamado(a)': 'What should we call you?',
    'Seu nome': 'Your name',
    'Quando você atende?': 'When do you work?',
    'Defina o horário padrão. Cada profissional pode ter horários próprios depois.': 'Set your default hours. Each professional can have their own hours later.',
    'Dias de atendimento': 'Working days',
    'Abre às': 'Opens at',
    'Fecha às': 'Closes at',
    'Pausa — início': 'Break — start',
    'Pausa — fim': 'Break — end',
    'Intervalo dos horários': 'Time slot interval',
    'Começar com': 'Start with',
    'Dados de exemplo': 'Sample data',
    'nenhum dia': 'no days',
    'com dados de exemplo': 'with sample data',
    'Criar minha agenda': 'Create my schedule',
    'Gerenciador de horários': 'Appointment manager',
    'Vamos cadastrar o primeiro cliente.': "Let's add your first client.",

    /* Idioma / manual / temas */
    'Português (Brasil)': 'Portuguese (Brazil)',
    'English (US)': 'English (US)',
    'Idioma do aplicativo': 'Application language',
    'Escolha o idioma da interface. A mudança é aplicada imediatamente.': 'Choose the interface language. The change is applied immediately.',
    'Manual completo do usuário': 'Complete user manual',
    'Consulte o guia completo do Hora Marcada no idioma selecionado.': 'Read the complete Hora Marcada guide in the selected language.',
    'Abrir manual': 'Open manual',
    'Abrir manual completo': 'Open complete manual',
    'Manual em português': 'Manual in Portuguese',
    'Manual em inglês': 'Manual in English',
    'Baixar manual (.html)': 'Download manual (.html)',
    'Idioma alterado para português.': 'Language changed to Portuguese.',
    'Idioma alterado para inglês.': 'Language changed to English.',
    'Tema aplicado.': 'Theme applied.',
    'Manual do usuário — Hora Marcada': 'User manual — Hora Marcada',
    'Manual completo do Hora Marcada': 'Complete Hora Marcada manual',
    'Escolha um tema pronto ou ajuste as cores manualmente.': 'Choose a ready-made theme or adjust the colors manually.',
    'Tema claro ou escuro': 'Light or dark theme',
    'Cores personalizadas': 'Custom colors',
    'Aplicar cores personalizadas': 'Apply custom colors',
    'As cores são aplicadas em botões, destaques, gráficos e na identidade do menu.': 'Colors are applied to buttons, highlights, charts and the menu identity.',
    'Tema aplicado em todo o aplicativo.': 'Theme applied across the app.',
    'Cores personalizadas aplicadas.': 'Custom colors applied.',
    'Selecione um tema abaixo. A mudança é imediata e pode ser desfeita escolhendo outro.': 'Select a theme below. The change is immediate and can be undone by choosing another.',
    'Roxo moderno': 'Modern violet',
    'Azul clínico': 'Clinical blue',
    'Verde saúde': 'Health green',
    'Teal spa': 'Spa teal',
    'Rosa beleza': 'Beauty rose',
    'Dourado barbearia': 'Barbershop gold',
    'Vermelho vinho': 'Wine red',
    'Índigo': 'Indigo',
    'Grafite': 'Graphite',
    'Coral': 'Coral',
    'Lavanda': 'Lavender',
    'Padrão do Hora Marcada. Moderno e versátil.': 'Hora Marcada default. Modern and versatile.',
    'Consultórios, clínicas e saúde em geral.': 'Medical offices, clinics and healthcare.',
    'Bem-estar, nutrição e fisioterapia.': 'Wellness, nutrition and physiotherapy.',
    'Massoterapia, estética e terapias.': 'Massage, aesthetics and therapies.',
    'Salões, manicure e estética.': 'Salons, nail design and beauty.',
    'Barbearias e estúdios com estilo clássico.': 'Barbershops and classic studios.',
    'Marcante e sofisticado, para estúdios.': 'Bold and sophisticated, for studios.',
    'Psicologia, coaching e consultorias.': 'Psychology, coaching and consulting.',
    'Neutro e discreto, para qualquer segmento.': 'Neutral and discreet, for any segment.',
    'Energético e acolhedor, para personal e fitness.': 'Energetic and friendly, for fitness.',
    'Suave e relaxante, para terapias e bem-estar.': 'Soft and relaxing, for therapies.',

    /* Aplicativo / instalação PWA */
    'Aplicativo': 'App',
    'Instalação': 'Installation',
    'PWA instalável': 'Installable PWA',
    'Instalar app': 'Install app',
    'Instalar aplicativo': 'Install app',
    'Instalar novamente': 'Install again',
    'Ver instruções': 'View instructions',
    'Instalado': 'Installed',
    'Não instalado': 'Not installed',
    'Pronto para instalar': 'Ready to install',
    'Requer servidor local': 'Local server required',
    'Aplicativo instalado': 'App installed',
    'Aplicativo no navegador': 'App in browser',
    'Instalado neste dispositivo': 'Installed on this device',
    'Você está usando o Hora Marcada em janela própria, sem barra de endereços.': 'You are using Hora Marcada in its own window, without an address bar.',
    'O Hora Marcada está instalado. Abra pelo atalho do Menu Iniciar para usar a janela própria.': 'Hora Marcada is installed. Open it from the Start menu shortcut to use the standalone window.',
    'Instale para abrir em janela própria, sem barra de endereços, e usar offline pelo atalho.': 'Install it to open in its own window, without an address bar, and use it offline from the shortcut.',
    'Detalhes': 'Details',
    'Modo de exibição': 'Display mode',
    'Janela própria': 'Standalone window',
    'Navegador': 'Browser',
    'Endereço': 'Address',
    'Arquivo local (file://)': 'Local file (file://)',
    'Servidor local (HTTP)': 'Local server (HTTP)',
    'HTTP sem segurança': 'Insecure HTTP',
    'Sim (sem cache PWA)': 'Yes (without PWA cache)',
    'Sim, após a primeira visita': 'Yes, after the first visit',
    'A instalação só funciona quando o app é servido por HTTP ou HTTPS. Feche esta aba e execute o': 'Installation only works when the app is served over HTTP or HTTPS. Close this tab and run',
    '; ele abre o endereço correto.': '; it opens the correct address.',
    'A instalação exige HTTPS ou localhost. Abra o app por um endereço seguro.': 'Installation requires HTTPS or localhost. Open the app from a secure address.',
    'A instalação não envia dados para servidores. Tudo continua salvo neste dispositivo.': 'Installation does not send data to servers. Everything remains stored on this device.',
    'Os dados do modo arquivo (file://) não aparecem no app instalado. Exporte um backup em Configurações → Dados antes de instalar e importe depois.': 'Data from file mode (file://) does not appear in the installed app. Export a backup in Settings → Data before installing and import it afterwards.',
    'Clique com o botão direito no ícone do app e escolha Fixar na barra de tarefas.': 'Right-click the app icon and choose Pin to taskbar.',
    'Os dados ficam neste dispositivo e o app abre mesmo sem internet.': 'Data stays on this device and the app opens even without internet.',
    'Rever boas-vindas': 'Show welcome again',
    'Você já está usando o aplicativo instalado.': 'You are already using the installed app.',
    'Instalação cancelada.': 'Installation canceled.',
    'Não foi possível instalar. Use as instruções.': 'Could not install. Use the instructions.',
    'Como instalar o aplicativo': 'How to install the app',
    'Use o Edge ou o Chrome': 'Use Edge or Chrome',
    'O Firefox no computador não instala PWAs. Abra este endereço no Microsoft Edge ou no Google Chrome.': 'Firefox on desktop does not install PWAs. Open this address in Microsoft Edge or Google Chrome.',
    'Abra o menu do navegador': 'Open the browser menu',
    'Toque no menu de três pontos ou no botão Compartilhar.': 'Tap the three-dot menu or the Share button.',
    'Escolha adicionar à tela inicial': 'Choose Add to Home Screen',
    'Procure por Instalar aplicativo ou Adicionar à tela inicial.': 'Look for Install app or Add to Home Screen.',
    'Confirme': 'Confirm',
    'O atalho do Hora Marcada aparecerá na tela inicial do seu aparelho.': 'The Hora Marcada shortcut will appear on your device home screen.',
    'Use o Microsoft Edge ou o Google Chrome': 'Use Microsoft Edge or Google Chrome',
    'No computador, abra este endereço em um navegador compatível com instalação de PWAs.': 'On your computer, open this address in a browser that supports PWA installation.',
    'No Edge, escolha Aplicativos → Instalar este site como app. No Chrome, escolha Salvar e compartilhar → Instalar página como app.': 'In Edge, choose Apps → Install this site as an app. In Chrome, choose Save and share → Install page as app.',
    'Confirme a instalação': 'Confirm installation',
    'O Hora Marcada abrirá em janela própria e o atalho será criado no Menu Iniciar.': 'Hora Marcada will open in its own window and a Start menu shortcut will be created.',
    'Este app está aberto como arquivo local (file://). O navegador não permite instalar nesse modo. Feche esta aba e execute o': 'This app is open as a local file (file://). The browser does not allow installation in this mode. Close this tab and run',
    '. Ele inicia o servidor local e abre o endereço correto para instalar.': '. It starts the local server and opens the correct address for installation.',
    'Depois de instalar, o Hora Marcada passa a abrir em janela própria, sem barra de endereços, e continua funcionando offline.': 'After installing, Hora Marcada opens in its own window, without an address bar, and keeps working offline.',
    'Configurações do app': 'App settings',
    'Entendi': 'Got it',
    'Bem-vindo ao Hora Marcada': 'Welcome to Hora Marcada',
    'Tudo pronto!': 'All set!',
    'A instalação foi concluída. A partir de agora, o Hora Marcada abre em janela própria, sem barra de endereços.': 'Installation is complete. From now on, Hora Marcada opens in its own window, without an address bar.',
    'Atalho no Menu Iniciar': 'Start menu shortcut',
    'Use o atalho criado pelo Windows para abrir o app a qualquer momento.': 'Use the shortcut created by Windows to open the app at any time.',
    'Fixe na barra de tarefas': 'Pin to the taskbar',
    'Com o app aberto, clique com o botão direito no ícone da barra de tarefas e escolha Fixar na barra de tarefas.': 'With the app open, right-click its taskbar icon and choose Pin to taskbar.',
    'Funciona offline': 'Works offline',
    'Seus dados ficam no dispositivo e o app continua abrindo sem internet.': 'Your data stays on the device and the app keeps opening without internet.',
    'Aplicativo instalado. Abra pelo atalho do Menu Iniciar.': 'App installed. Open it from the Start menu shortcut.',

    /* Diversos */
    'Nada por aqui': 'Nothing here',
    'Total': 'Total',
    'Filtros': 'Filters',
    'Ações': 'Actions',
    'Nome (A–Z)': 'Name (A–Z)',
    'Mais recentes': 'Most recent',
    'Menor preço': 'Lowest price',
    'Maior preço': 'Highest price',
    'Mais duração': 'Longest duration',
    'Menos duração': 'Shortest duration',
    'Geral': 'General',
    'Semana': 'Week',
    'Mês': 'Month',
    'Dia': 'Day',

    /* Complementos de tradução */
    'Visualize e organize os horários por dia, semana ou mês.': 'View and organize times by day, week or month.',
    'Identidade, agenda, acessos e backup.': 'Identity, schedule, access and backup.',
    'Adicionar cliente': 'Add client',
    'A mudança é imediata.': 'The change is immediate.',
    'Textos da interface, datas e números usam o idioma escolhido. Nomes de clientes, serviços e observações digitados por você não são traduzidos.': 'Interface texts, dates and numbers use the selected language. Client names, services and notes you typed are not translated.',
    'Editar bloqueio': 'Edit block',
    'Excluir bloqueio': 'Delete block',
    'Profissional atualizado.': 'Professional updated.',
    'Profissional cadastrado.': 'Professional added.',
    'Próximo agendamento': 'Next appointment',
    'atendimento(s) concluído(s)': 'completed appointment(s)',
    'pagamento(s)': 'payment(s)',
    'pagamentos': 'payments',
    'pagamento': 'payment',
    'agendamento(s)': 'appointment(s)',
    'agendamentos': 'appointments',
    'Agendamentos': 'Appointments',
    'atendimento': 'appointment',
    'atendimentos': 'appointments',
    'por dia': 'per day',
    'por mês': 'per month',
    'Horários livres': 'Available times',
    'às': 'to',
    'Profissional': 'Professional',
    'Profissionais': 'Professionals',
    'Bloquear horário': 'Block time',
    'Nenhum bloqueio futuro. Use para almoço, folgas, feriados ou compromissos.': 'No upcoming blocks. Use them for lunch, days off, holidays or commitments.'
  };

  /* Nomes de segmentos e rótulos padrão em inglês */
  const SEGMENT_EN = {
    medico: {
      name: 'Medical office',
      labels: { client: 'Patient', clients: 'Patients', service: 'Consultation', services: 'Consultations', pro: 'Doctor', pros: 'Doctors', appt: 'Consultation', appts: 'Consultations', newAppt: 'New consultation', team: 'Medical team', business: 'Medical office' }
    },
    dentista: {
      name: 'Dentistry',
      labels: { client: 'Patient', clients: 'Patients', service: 'Procedure', services: 'Procedures', pro: 'Dentist', pros: 'Dentists', appt: 'Consultation', appts: 'Consultations', newAppt: 'New evaluation', team: 'Dental team', business: 'Dental clinic' }
    },
    psicologo: {
      name: 'Psychology',
      labels: { client: 'Patient', clients: 'Patients', service: 'Session', services: 'Sessions', pro: 'Psychologist', pros: 'Psychologists', appt: 'Session', appts: 'Sessions', newAppt: 'New session', team: 'Team', business: 'Office' }
    },
    barbearia: {
      name: 'Barbershop',
      labels: { client: 'Client', clients: 'Clients', service: 'Service', services: 'Services', pro: 'Barber', pros: 'Barbers', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Team', business: 'Barbershop' }
    },
    salao: {
      name: 'Beauty salon',
      labels: { client: 'Client', clients: 'Clients', service: 'Service', services: 'Services', pro: 'Hairstylist', pros: 'Hairstylists', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Team', business: 'Salon' }
    },
    manicure: {
      name: 'Manicure & Nail Design',
      labels: { client: 'Client', clients: 'Clients', service: 'Service', services: 'Services', pro: 'Manicurist', pros: 'Manicurists', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Team', business: 'Nail studio' }
    },
    estetica: {
      name: 'Aesthetics',
      labels: { client: 'Client', clients: 'Clients', service: 'Procedure', services: 'Procedures', pro: 'Esthetician', pros: 'Estheticians', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Team', business: 'Aesthetics studio' }
    },
    personal: {
      name: 'Personal training',
      labels: { client: 'Student', clients: 'Students', service: 'Workout', services: 'Workouts', pro: 'Personal trainer', pros: 'Personal trainers', appt: 'Session', appts: 'Sessions', newAppt: 'New session', team: 'Team', business: 'Training studio' }
    },
    veterinario: {
      name: 'Veterinary',
      labels: { client: 'Owner', clients: 'Owners', service: 'Service', services: 'Services', pro: 'Veterinarian', pros: 'Veterinarians', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Veterinary team', business: 'Veterinary clinic' }
    },
    tatuagem: {
      name: 'Tattoo & Piercing',
      labels: { client: 'Client', clients: 'Clients', service: 'Session', services: 'Sessions', pro: 'Tattoo artist', pros: 'Tattoo artists', appt: 'Session', appts: 'Sessions', newAppt: 'New session', team: 'Studio', business: 'Tattoo studio' }
    },
    nutricionista: {
      name: 'Nutrition',
      labels: { client: 'Patient', clients: 'Patients', service: 'Consultation', services: 'Consultations', pro: 'Nutritionist', pros: 'Nutritionists', appt: 'Consultation', appts: 'Consultations', newAppt: 'New consultation', team: 'Team', business: 'Office' }
    },
    fisioterapia: {
      name: 'Physiotherapy',
      labels: { client: 'Patient', clients: 'Patients', service: 'Session', services: 'Sessions', pro: 'Physiotherapist', pros: 'Physiotherapists', appt: 'Session', appts: 'Sessions', newAppt: 'New session', team: 'Team', business: 'Clinic' }
    },
    massagem: {
      name: 'Massage therapy',
      labels: { client: 'Client', clients: 'Clients', service: 'Session', services: 'Sessions', pro: 'Massage therapist', pros: 'Massage therapists', appt: 'Session', appts: 'Sessions', newAppt: 'New session', team: 'Team', business: 'Studio' }
    },
    outro: {
      name: 'Other / Custom',
      labels: { client: 'Client', clients: 'Clients', service: 'Service', services: 'Services', pro: 'Professional', pros: 'Professionals', appt: 'Appointment', appts: 'Appointments', newAppt: 'New appointment', team: 'Team', business: 'My business' }
    }
  };

  const REMINDER = {
    pt: 'Olá, {cliente}! 😊 Seu horário de {servico} está marcado para {data} às {hora} com {profissional}. Se precisar remarcar, é só me avisar. — {negocio}',
    en: 'Hello, {cliente}! 😊 Your {servico} appointment is scheduled for {data} at {hora} with {profissional}. If you need to reschedule, just let me know. — {negocio}'
  };

  const PAYMENTS = {
    pt: ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Transferência', 'Boleto', 'Outro'],
    en: ['Pix', 'Cash', 'Debit card', 'Credit card', 'Bank transfer', 'Bank slip', 'Other']
  };

  const WEEKDAYS = {
    pt: {
      long: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      mini: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      months: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    },
    en: {
      long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      mini: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  // Acrescenta nomes de segmentos e rótulos ao catálogo.
  if (typeof Seed !== 'undefined') {
    Seed.SEGMENTS.forEach(seg => {
      const en = SEGMENT_EN[seg.id];
      if (!en) return;
      EN[seg.name] = en.name;
      EN[`${seg.emoji} ${seg.name}`] = `${seg.emoji} ${en.name}`;
      Object.keys(seg.labels).forEach(k => {
        const ptValue = seg.labels[k];
        const enValue = en.labels[k];
        if (ptValue && enValue) EN[ptValue] = enValue;
      });
    });
  }

  let lang = 'pt';
  let observer = null;
  let started = false;

  const locale = () => (LANGS[lang] || LANGS.pt).locale;

  function plural(n, one, many) {
    return `${n} ${Number(n) === 1 ? one : many}`;
  }

  const PATTERNS = [
    [/^Olá, (.+)! 👋$/, m => `Hello, ${m[1]}! 👋`],
    [/^Navegador detectado: (.+)$/, m => `Detected browser: ${m[1]}`],
    [/^(\d+) atendimentos? hoje · (\d+) confirmado\(s\)(?: · (\d+) a confirmar)?$/, m => {
      let out = `${plural(m[1], 'appointment', 'appointments')} today · ${m[2]} confirmed`;
      if (m[3]) out += ` · ${m[3]} to confirm`;
      return out;
    }],
    [/^(\d+) confirmados · (\d+) a confirmar$/, m => `${m[1]} confirmed · ${m[2]} to confirm`],
    [/^(\d+) aguardando confirmação$/, m => `${plural(m[1], 'awaiting confirmation', 'awaiting confirmation')}`],
    [/^(\d+) registro\(s\)( na lista)?$/, m => `${plural(m[1], 'entry', 'entries')}${m[2] ? ' in the list' : ''}`],
    [/^(.+) a (.+) · (\d+) registro\(s\)( na lista)?$/, m => `${m[1]} – ${m[2]} · ${plural(m[3], 'entry', 'entries')}${m[4] ? ' in the list' : ''}`],
    [/^(\d+) ativos?$/, m => `${m[1]} active`],
    [/^(\d+) com prioridade$/, m => `${m[1]} high priority`],
    [/^(\d+) para lembrar$/, m => `${m[1]} to remind`],
    [/^(\d+) atend\.$/, m => `${m[1]} appts.`],
    [/^(\d+) agendamentos$/, m => `${m[1]} appointments`],
    [/^(\d+) agendamento\(s\)$/, m => `${m[1]} appointment(s)`],
    [/^(\d+) atendimentos?$/, m => `${plural(m[1], 'appointment', 'appointments')}`],
    [/^(\d+) atendimento\(s\) concluído\(s\)$/, m => `${m[1]} completed appointment(s)`],
    [/^(\d+) pagamento\(s\)$/, m => `${m[1]} payment(s)`],
    [/^\+(\d+) mais$/, m => `+${m[1]} more`],
    [/^\+(\d+) este mês$/, m => `+${m[1]} this month`],
    [/^(\d+) de (\d+)$/, m => `${m[1]} of ${m[2]}`],
    [/^(\d+) min(?:utos)?$/, m => `${m[1]} min`],
    [/^(\d+)min$/, m => `${m[1]} min`],
    [/^(\d+) semanas$/, m => `${m[1]} weeks`],
    [/^(\d+)h (\d+)min$/, m => `${m[1]}h ${m[2]}min`],
    [/^de ([\d.,]+)h disponíveis$/, m => `${m[1]}h available`],
    [/^(\d+) horários$/, m => `${m[1]} times`],
    [/^Ocupação: (.+)$/, m => `Occupancy: ${m[1]}`],
    [/^Total na lista: (\d+)$/, m => `Total on the list: ${m[1]}`],
    [/^Encaixe sugerido: (.+)$/, m => `Suggested slot: ${m[1]}`],
    [/^Próximo: (.+)$/, m => `Next: ${m[1]}`],
    [/^Último: (.+)$/, m => `Last: ${m[1]}`],
    [/^Ver (.+) \((.+)\)$/, m => `View ${translateDynamic(m[1])} (${m[2]})`],
    [/^(.+) de (\d{4})$/, m => `${m[1]}, ${m[2]}`],
    [/^(.+) às (\d{2}:\d{2})$/, m => `${translateDynamic(m[1])} at ${m[2]}`],
    [/^(.+) às (\d{2}:\d{2}) · (.+)$/, m => `${translateDynamic(m[1])} at ${m[2]} · ${translateDynamic(m[3])}`],
    [/^Horários livres · (.+)$/, m => `Available times · ${m[1]}`],
    [/^(.+) · pausa (.+)$/, m => `${m[1]} · break ${m[2]}`],
    [/^(\d{2}\/\d{2}) às (\d{2}:\d{2})$/, m => `${m[1]} at ${m[2]}`],
    [/^(.+) · (\d{2}\/\d{2}) às (\d{2}:\d{2})$/, m => `${translateDynamic(m[1])} · ${m[2]} at ${m[3]}`],
    [/^(.+) · (Agendado|Confirmado|Concluído|Faltou|Cancelado)$/, m => `${translateDynamic(m[1])} · ${EN[m[2]] || m[2]}`],
    [/^(\d+) clientes? aguardando encaixe$/, m => `${m[1]} clients waiting for a slot`],
    [/^(\d+) confirmado\(s\)$/, m => `${m[1]} confirmed`],
    [/^(\d+) atendimento\(s\)$/, m => `${m[1]} appointment(s)`],
    [/^(\d+) visitas?$/, m => `${plural(m[1], 'visit', 'visits')}`],
    [/^(\d+) anos?$/, m => `${plural(m[1], 'year', 'years')}`],
    [/^(\d+) conflito\(s\) ignorado\(s\)$/, m => `${m[1]} conflict(s) ignored`],
    [/^(\d+) agendamentos criados(?: · (\d+) conflito\(s\) ignorado\(s\))?\.$/, m => `${m[1]} appointments created${m[2] ? ` · ${m[2]} conflict(s) ignored` : ''}.`],
    [/^Sugestão: (.+) às (\d{2}:\d{2}) com (.+)\.$/, m => `Suggestion: ${m[1]} at ${m[2]} with ${m[3]}.`],
    [/^Nenhum (.+) cadastrado$/, m => `No ${translateDynamic(m[1]).toLowerCase()} added`],
    [/^Nenhum (.+) na lista de espera$/, m => `No ${translateDynamic(m[1]).toLowerCase()} on the waitlist`],
    [/^Cadastrar (.+)$/, m => `Add ${translateDynamic(m[1]).toLowerCase()}`],
    [/^Cadastre seus (.+) para agilizar os agendamentos e manter o histórico\.$/, m => `Add your ${translateDynamic(m[1]).toLowerCase()} to speed up appointments and keep their history.`],
    [/^Pago(?: · (.+))?$/, m => m[1] ? `Paid · ${m[1]}` : 'Paid'],
    [/^Check-in (\d{2}:\d{2})$/, m => `Check-in ${m[1]}`],
    [/^(\d+)\/(\d+) de (\d{4})$/, m => `${m[1]}/${m[2]}/${m[3]}`]
  ];

  function translateDynamic(value) {
    const raw = String(value ?? '');
    if (EN[raw] != null) return EN[raw];
    const out = raw.replace(/([A-Za-zÀ-ÿ]+)/g, w => {
      const tr = EN[w] || EN[w[0].toUpperCase() + w.slice(1)] || EN[w.toLowerCase()];
      return tr || w;
    });
    return out;
  }

  function translateString(value) {
    if (lang === 'pt') return value;
    const raw = String(value ?? '');
    if (!raw) return raw;
    if (EN[raw] != null) return EN[raw];

    const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m) return raw;
    const core = m[2];
    if (!core) return raw;

    if (EN[core] != null) return m[1] + EN[core] + m[3];

    for (const [re, replace] of PATTERNS) {
      if (re.test(core)) {
        const out = core.replace(re, (...args) => replace(args));
        return m[1] + out + m[3];
      }
    }
    return raw;
  }

  function t(value, vars) {
    let out = translateString(value);
    if (vars && typeof vars === 'object') {
      Object.keys(vars).forEach(k => {
        out = out.split(`{${k}}`).join(String(vars[k]));
      });
    }
    return out;
  }

  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);

  function skipElement(el) {
    if (!el) return true;
    if (SKIP.has(el.tagName)) return true;
    return !!(el.closest && el.closest('[data-i18n-skip]'));
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (!parent || skipElement(parent)) return;
    const current = node.nodeValue;
    if (!current) return;
    const next = translateString(current);
    if (next !== current) node.nodeValue = next;
  }

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  function translateElementAttrs(el) {
    if (!el || el.nodeType !== 1 || skipElement(el)) return;
    ATTRS.forEach(attr => {
      if (!el.hasAttribute(attr)) return;
      const value = el.getAttribute(attr);
      const next = translateString(value);
      if (next !== value) el.setAttribute(attr, next);
    });
  }

  function apply(root = document.body) {
    if (lang === 'pt' || !root) return;
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    translateElementAttrs(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) translateTextNode(node);
      else if (node.nodeType === 1) translateElementAttrs(node);
      node = walker.nextNode();
    }
  }

  function start() {
    if (started || lang === 'pt') return;
    started = true;
    apply(document.body);
    observer = new MutationObserver(records => {
      if (lang === 'pt') return;
      records.forEach(rec => {
        if (rec.type === 'characterData') translateTextNode(rec.target);
        else if (rec.type === 'attributes') translateElementAttrs(rec.target);
        else if (rec.type === 'childList') {
          rec.addedNodes.forEach(n => {
            if (n.nodeType === 3) translateTextNode(n);
            else if (n.nodeType === 1) apply(n);
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  function stop() {
    if (observer) { observer.disconnect(); observer = null; }
    started = false;
  }

  function refreshWeekdayArrays() {
    const pack = WEEKDAYS[lang] || WEEKDAYS.pt;
    if (typeof U === 'undefined') return;
    [U.weekdayLong, U.weekdayShort, U.weekdayMini, U.monthLong, U.monthShort].forEach((arr, i) => {
      const source = [pack.long, pack.short, pack.mini, pack.months, pack.monthsShort][i];
      arr.splice(0, arr.length, ...source);
    });
  }

  function setLanguage(next, opts = {}) {
    lang = LANGS[next] ? next : 'pt';
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    refreshWeekdayArrays();
    stop();
    if (!opts.silent && lang === 'en') start();
  }

  const valuesEqual = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);

  // Converte textos padrão (rótulos, lembrete, formas de pagamento) ao trocar
  // de idioma, sem tocar em conteúdo personalizado pelo usuário.
  function localizeDefaults(from, to) {
    if (!Store.db || from === to) return false;
    const s = Store.settings();
    const seg = Seed.segment(s.segment);
    const en = SEGMENT_EN[seg.id];
    let changed = false;

    if (en) {
      Object.keys(seg.labels).forEach(k => {
        const pt = seg.labels[k];
        const tr = en.labels[k];
        if (!pt || !tr) return;
        if (s.labels[k] === pt || s.labels[k] === tr) {
          const next = to === 'en' ? tr : pt;
          if (s.labels[k] !== next) { s.labels[k] = next; changed = true; }
        }
      });
      if (s.businessName === 'Meu negócio' || s.businessName === 'My business') {
        const next = to === 'en' ? 'My business' : 'Meu negócio';
        if (s.businessName !== next) { s.businessName = next; changed = true; }
      }
      const owner = Store.db.professionals && Store.db.professionals[0];
      if (owner && (owner.name === 'Meu nome' || owner.name === 'My name')) {
        const next = to === 'en' ? 'My name' : 'Meu nome';
        if (owner.name !== next) { owner.name = next; changed = true; }
      }
    }

    if (s.reminderTemplate === REMINDER.pt || s.reminderTemplate === REMINDER.en) {
      const next = REMINDER[to] || REMINDER.pt;
      if (s.reminderTemplate !== next) { s.reminderTemplate = next; changed = true; }
    }

    if (valuesEqual(s.paymentMethods, PAYMENTS.pt) || valuesEqual(s.paymentMethods, PAYMENTS.en)) {
      const next = [...(PAYMENTS[to] || PAYMENTS.pt)];
      if (!valuesEqual(s.paymentMethods, next)) { s.paymentMethods = next; changed = true; }
    }

    if (changed) Store.save();
    return changed;
  }

  function themeName(pt, en) {
    return lang === 'en' ? en : pt;
  }

  refreshWeekdayArrays();

  return {
    LANGS, EN, SEGMENT_EN, REMINDER, PAYMENTS, WEEKDAYS,
    t, translateString, apply, start, stop, setLanguage, localizeDefaults,
    themeName,
    locale,
    get lang() { return lang; },
    get isEnglish() { return lang === 'en'; }
  };
})();
