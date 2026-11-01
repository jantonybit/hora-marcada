/* ==========================================================================
   Manual — guia completo do usuário em português e inglês
   ========================================================================== */
const Manual = (() => {
  const PT = [
    {
      id: 'sobre',
      title: '1. Sobre o Hora Marcada',
      html: `<p>O <strong>Hora Marcada</strong> é um gerenciador de horários para profissionais que atendem com hora marcada: consultórios, clínicas, salões, barbearias, estúdios de estética, tatuagem, fisioterapia, nutrição, psicologia, personal trainers e outros serviços.</p>
      <p>O aplicativo funciona no navegador e pode ser instalado como um aplicativo (PWA) no Windows, Android ou iPhone. Todos os dados ficam salvos <strong>somente no seu dispositivo</strong>. Não existe cadastro online, mensalidade ou envio de informações para servidores.</p>
      <p>O Hora Marcada foi pensado para dois tipos de uso no mesmo computador:</p>
      <ul>
        <li><strong>Recepção:</strong> vê a agenda e os contatos, mas não vê valores financeiros, backups nem a zona de risco.</li>
        <li><strong>Gestor:</strong> desbloqueia a sessão com um PIN e passa a ver valores, relatórios e dados do sistema.</li>
      </ul>`
    },
    {
      id: 'instalacao',
      title: '2. Instalação e funcionamento offline',
      html: `<p>Na primeira visita, o aplicativo guarda uma cópia local dos arquivos. Depois disso, ele abre e funciona mesmo sem internet.</p>
      <h4>Instalar no Windows (Microsoft Edge ou Chrome)</h4>
      <ul>
        <li>No Windows, dê duplo clique em <strong>servir.bat</strong>. Ele inicia o servidor local e abre o endereço correto (necessário para instalar e para a primeira carga).</li>
        <li>Com o app aberto, clique em <strong>Instalar app</strong> na barra superior ou use <strong>Configurações → Aplicativo</strong>.</li>
        <li>Como alternativa, clique no ícone de instalação na barra de endereços (ou menu <strong>… → Aplicativos → Instalar este site</strong>).</li>
        <li>Confirme. O aplicativo passa a abrir em uma janela própria e aparece no menu Iniciar.</li>
      </ul>
      <p>Depois de instalado, o app abre pelo atalho do menu Iniciar e funciona offline, sem precisar do servidor local.</p>
      <p>Na Microsoft Store, instale pela página do produto. A atualização é feita pela própria Store.</p>
      <h4>Instalar no celular</h4>
      <ul>
        <li><strong>Android/Chrome:</strong> menu <strong>⋮ → Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</li>
        <li><strong>iPhone/Safari:</strong> botão <strong>Compartilhar → Adicionar à Tela de Início</strong>.</li>
      </ul>
      <div class="manual-note"><strong>Importante:</strong> abrir o <strong>index.html</strong> direto (file://) não permite instalar. Os dados desse modo ficam em um endereço separado e <strong>não aparecem</strong> no app instalado. Exporte um backup em <strong>Configurações → Dados e backup</strong> antes de instalar e importe depois.</div>
      <div class="manual-note"><strong>Importante:</strong> o aplicativo funciona offline, mas os dados ficam no navegador deste dispositivo. Limpar os dados do navegador apaga o Hora Marcada. Faça backups regulares em <strong>Configurações → Dados e backup</strong>.</div>`
    },
    {
      id: 'primeiros-passos',
      title: '3. Primeiros passos',
      html: `<p>Na primeira abertura, um assistente em três etapas configura o essencial:</p>
      <ol>
        <li><strong>Segmento:</strong> escolha a área mais próxima do seu trabalho. Isso define nomes padrão (paciente/cliente/aluno), serviços sugeridos e cores iniciais.</li>
        <li><strong>Identidade:</strong> informe o nome do negócio, o seu nome e um emoji. Esses dados aparecem no menu, nos lembretes e nos relatórios.</li>
        <li><strong>Horários:</strong> marque os dias de atendimento, o horário de abertura e fechamento, a pausa e o intervalo entre horários. Você pode começar com dados de exemplo para explorar o sistema.</li>
      </ol>
      <p>Ao concluir, o sistema cria a sua agenda. Se escolheu dados de exemplo, clientes e agendamentos fictícios são carregados; depois você pode apagá-los em <strong>Configurações → Dados e backup → Zona de risco</strong>.</p>
      <p>Se preferir recomeçar do zero, use <strong>Apagar tudo e recomeçar</strong>. O assistente será exibido novamente.</p>`
    },
    {
      id: 'visao-geral',
      title: '4. Visão geral',
      html: `<p>A tela inicial resume o dia e aponta o que precisa de atenção:</p>
      <ul>
        <li><strong>Atendimentos hoje:</strong> total do dia, confirmados e ainda a confirmar.</li>
        <li><strong>Ocupação de hoje:</strong> quanto do horário disponível já está reservado.</li>
        <li><strong>Faturamento do mês:</strong> recebido, a receber e ticket médio (visível apenas para o gestor).</li>
        <li><strong>Check-ins de hoje:</strong> quem já chegou e quem ainda é esperado.</li>
        <li><strong>Próximo atendimento:</strong> cliente, serviço, profissional, data e horário.</li>
        <li><strong>Agenda de hoje:</strong> lista cronológica com acesso rápido para confirmar, concluir ou remarcar.</li>
      </ul>
      <p>Os cartões <strong>Aniversariantes do mês</strong>, <strong>Pagamentos pendentes</strong> e <strong>Próximos 7 dias</strong> ajudam no contato proativo com os clientes. Clique em qualquer item para abrir os detalhes.</p>`
    },
    {
      id: 'agenda',
      title: '5. Agenda',
      html: `<p>A agenda pode ser vista por <strong>Dia</strong>, <strong>Semana</strong> ou <strong>Mês</strong>. Use as setas para navegar, o botão <strong>Hoje</strong> para voltar à data atual e os filtros para ver apenas um profissional ou um status.</p>
      <h4>Visão do dia</h4>
      <ul>
        <li>Cada coluna é um profissional. Os horários livres aparecem em branco.</li>
        <li>Clique em um espaço vazio para criar um agendamento naquele horário.</li>
        <li>Clique em um atendimento para abrir os detalhes, confirmar, concluir, remarcar, excluir ou enviar lembrete.</li>
        <li>O intervalo de almoço e os bloqueios aparecem destacados.</li>
      </ul>
      <h4>Visão da semana e do mês</h4>
      <ul>
        <li>Mostram a distribuição dos atendimentos e a quantidade por dia.</li>
        <li>Clique em um dia para abrir a visão diária correspondente.</li>
      </ul>
      <h4>Impressão</h4>
      <p>Use <strong>Imprimir agenda do dia</strong> para gerar uma folha com os horários, clientes e serviços do dia. A impressão respeita o filtro de profissional ativo.</p>
      <h4>Bloqueios</h4>
      <p>Em <strong>Equipe</strong>, clique em <strong>Bloquear horário</strong> para impedir agendamentos em um período específico: almoço, folga, feriado, curso ou compromisso pessoal. O bloqueio pode valer para todos os profissionais ou para um deles, e pode ser repetido por várias semanas.</p>`
    },
    {
      id: 'agendamentos',
      title: '6. Agendamentos',
      html: `<p>Para criar um agendamento, use o botão <strong>Novo agendamento</strong> no topo (atalho <strong>Alt+N</strong>), o botão dentro da agenda ou o atalho em um espaço vazio.</p>
      <h4>Como preencher</h4>
      <ul>
        <li><strong>Cliente:</strong> selecione um cliente já cadastrado. Se ainda não existir, cadastre primeiro em <strong>Clientes</strong>.</li>
        <li><strong>Serviço:</strong> define a duração, o valor e o intervalo de organização (buffer).</li>
        <li><strong>Profissional:</strong> somente profissionais ativos e habilitados para o serviço aparecem.</li>
        <li><strong>Data e horário:</strong> os horários sugeridos respeitam a jornada, a pausa, os bloqueios e os agendamentos existentes.</li>
        <li><strong>Observações:</strong> informações úteis para o atendimento.</li>
        <li><strong>Permitir encaixe:</strong> ignore o conflito de horário e marque dois atendimentos no mesmo período, quando isso for possível na vida real.</li>
      </ul>
      <h4>Status</h4>
      <ul>
        <li><strong>Agendado:</strong> horário reservado, ainda sem confirmação.</li>
        <li><strong>Confirmado:</strong> cliente confirmou presença.</li>
        <li><strong>Concluído:</strong> atendimento realizado; permite registrar pagamento.</li>
        <li><strong>Faltou:</strong> o cliente não compareceu.</li>
        <li><strong>Cancelado:</strong> libera o horário e não entra no faturamento.</li>
      </ul>
      <h4>Check-in</h4>
      <p>Quando o cliente chegar, use <strong>Check-in</strong>. O atendimento passa para <strong>Confirmado</strong> e a recepção sabe quem está na sala de espera. É possível desfazer o check-in.</p>
      <h4>Concluir e receber</h4>
      <p>Ao concluir, informe se o valor foi pago e qual a forma de pagamento. Apenas atendimentos <strong>concluídos e pagos</strong> entram como receita recebida. Atendimentos concluídos sem pagamento ficam em <strong>A receber</strong> no financeiro.</p>`
    },
    {
      id: 'lista-espera',
      title: '7. Lista de espera',
      html: `<p>A lista de espera organiza quem quer um horário e ainda não tem data definida.</p>
      <ul>
        <li>Cadastre cliente, serviço, profissional de preferência, período (manhã, tarde ou qualquer) e prioridade.</li>
        <li>O sistema sugere o próximo horário livre compatível com a duração do serviço.</li>
        <li>Use <strong>Agendar</strong> para transformar a entrada em agendamento, ou <strong>Remover da lista</strong> quando não for mais necessário.</li>
        <li>Entradas de alta prioridade aparecem no topo.</li>
      </ul>
      <p>Ao abrir um horário por cancelamento, consulte a lista e chame o próximo cliente. O contato pode ser feito por telefone ou WhatsApp diretamente pela ficha.</p>`
    },
    {
      id: 'clientes',
      title: '8. Clientes',
      html: `<p>O cadastro de clientes guarda nome, telefone/WhatsApp, e-mail, data de nascimento, tags e observações. Campos extras podem ser criados em <strong>Configurações → Agenda</strong>, como convênio, plano ou número de prontuário.</p>
      <ul>
        <li>Use as tags para marcar <strong>VIP</strong>, <strong>Recorrente</strong> ou <strong>Novo</strong> e filtrar a lista.</li>
        <li>A ficha mostra histórico de atendimentos, total pago, último atendimento e próximo agendamento.</li>
        <li>É possível ligar, abrir o WhatsApp ou enviar e-mail direto da ficha.</li>
        <li>A busca global (<strong>Ctrl+K</strong>) encontra clientes, serviços e agendamentos.</li>
      </ul>
      <p>Ao excluir um cliente, o histórico de agendamentos é mantido, mas deixa de estar vinculado ao cadastro. Os valores financeiros continuam protegidos pela regra de acesso.</p>`
    },
    {
      id: 'servicos',
      title: '9. Serviços',
      html: `<p>Cada serviço tem nome, duração, preço, categoria, cor na agenda e um intervalo após o atendimento.</p>
      <ul>
        <li>A <strong>duração</strong> determina quantos horários o atendimento ocupa.</li>
        <li>O <strong>intervalo</strong> reserva tempo para limpeza, organização ou preparação entre clientes.</li>
        <li>A <strong>cor</strong> ajuda a identificar o serviço na agenda.</li>
        <li>Serviços inativos não aparecem nos novos agendamentos, mas permanecem no histórico.</li>
      </ul>
      <p>Você pode limitar quais serviços cada profissional realiza. Nesse caso, o agendamento só permite escolher serviços habilitados para o profissional selecionado.</p>`
    },
    {
      id: 'equipe',
      title: '10. Equipe e horários',
      html: `<p>Cadastre cada profissional com nome, cargo/especialidade, cor, telefone, e-mail e serviços que realiza.</p>
      <ul>
        <li>Defina os dias e horários de atendimento de cada pessoa, incluindo pausa.</li>
        <li>Profissionais inativos deixam de aparecer na agenda, mas mantêm o histórico.</li>
        <li>Bloqueios podem ser aplicados a todos ou a um profissional específico.</li>
        <li>O primeiro profissional cadastrado é usado como dono da conta no menu lateral.</li>
      </ul>
      <p>Se a agenda estiver vazia, verifique se existe pelo menos um profissional ativo com horário configurado para o dia e pelo menos um serviço ativo.</p>`
    },
    {
      id: 'financeiro',
      title: '11. Financeiro',
      html: `<p>O financeiro é exclusivo do gestor. A recepção vê apenas a agenda e os contatos.</p>
      <ul>
        <li><strong>Recebido:</strong> atendimentos concluídos e pagos.</li>
        <li><strong>A receber:</strong> atendimentos concluídos sem pagamento registrado.</li>
        <li><strong>Previsto (agendado):</strong> valores de atendimentos futuros confirmados ou agendados.</li>
        <li><strong>Ticket médio:</strong> média dos atendimentos concluídos.</li>
      </ul>
      <p>Filtre por período (este mês, últimos 30 dias, este ano ou intervalo personalizado) e por profissional. O gráfico mostra a evolução dos recebimentos. Para registrar um pagamento, abra o atendimento concluído e informe a forma de pagamento.</p>
      <div class="manual-note">Valores financeiros nunca aparecem para quem está no modo recepção. O bloqueio é aplicado em todas as telas, inclusive nos totais da visão geral, nos serviços e na ficha do cliente.</div>`
    },
    {
      id: 'lembretes',
      title: '12. Lembretes e WhatsApp',
      html: `<p>A tela de lembretes lista os atendimentos que ainda precisam de confirmação. Você pode:</p>
      <ul>
        <li>Confirmar o atendimento com um clique.</li>
        <li>Copiar a mensagem pronta e enviar pelo canal que preferir.</li>
        <li>Abrir o WhatsApp com a mensagem já preenchida, quando o cliente tem telefone cadastrado.</li>
        <li>Editar o modelo de mensagem em <strong>Configurações → Textos</strong>.</li>
      </ul>
      <p>Variáveis disponíveis: <code>{cliente}</code>, <code>{servico}</code>, <code>{profissional}</code>, <code>{data}</code>, <code>{hora}</code>, <code>{valor}</code> e <code>{negocio}</code>. Elas são substituídas automaticamente no envio.</p>
      <p>O envio pelo WhatsApp depende do aplicativo ou do WhatsApp Web instalado no dispositivo. O Hora Marcada apenas prepara a mensagem; nada é enviado automaticamente.</p>`
    },
    {
      id: 'identidade',
      title: '13. Identidade do negócio',
      html: `<p>Em <strong>Configurações → Identidade</strong> você ajusta nome do negócio, emoji, segmento, cores, tema claro/escuro e moeda.</p>
      <ul>
        <li>O <strong>segmento</strong> define sugestões de nomes, serviços e cores. Trocar o segmento não altera seus dados.</li>
        <li><strong>Aplicar identidade do segmento</strong> atualiza cores e nomenclaturas automaticamente.</li>
        <li>As <strong>cores</strong> podem ser personalizadas livremente.</li>
        <li>A <strong>moeda</strong> altera a formatação dos valores em todo o sistema.</li>
      </ul>`
    },
    {
      id: 'temas',
      title: '14. Temas e aparência',
      html: `<p>Em <strong>Configurações → Temas</strong> há combinações prontas usadas em aplicativos de agendamento:</p>
      <ul>
        <li><strong>Roxo moderno</strong>, <strong>Azul clínico</strong>, <strong>Verde saúde</strong>, <strong>Teal spa</strong>, <strong>Rosa beleza</strong>, <strong>Dourado barbearia</strong>, <strong>Vermelho vinho</strong>, <strong>Índigo</strong>, <strong>Grafite</strong>, <strong>Coral</strong> e <strong>Lavanda</strong>.</li>
      </ul>
      <p>Escolha um tema para aplicar as cores imediatamente. Também é possível usar as cores personalizadas e alternar entre <strong>claro</strong>, <strong>escuro</strong> ou <strong>seguir o sistema</strong>. O tema muda a identidade visual (cores de botões, destaques, gráficos e menu), mas não altera o layout nem a organização das telas.</p>`
    },
    {
      id: 'idioma',
      title: '15. Idioma e manual',
      html: `<p>Em <strong>Configurações → Idioma</strong> escolha <strong>Português</strong> ou <strong>English</strong>. A mudança é imediata.</p>
      <ul>
        <li>Textos da interface, datas, meses, dias da semana e formatação de números passam a usar o idioma escolhido.</li>
        <li>Nomes de clientes, serviços e observações digitados por você <strong>não</strong> são traduzidos.</li>
        <li>Rótulos padrão (cliente, serviço, agendamento), o modelo de lembrete e as formas de pagamento padrão são convertidos automaticamente. Textos personalizados são preservados.</li>
      </ul>
      <p>O <strong>manual completo</strong> está disponível nos dois idiomas e pode ser aberto ou baixado em <strong>Configurações → Idioma</strong>.</p>`
    },
    {
      id: 'acesso',
      title: '16. Acesso, recepção e PIN',
      html: `<p>O <strong>modo recepção</strong> vem ativado por padrão e protege valores financeiros, relatórios, backups e a zona de risco.</p>
      <ul>
        <li>No topo, o selo mostra <strong>Recepção</strong> ou <strong>Gestor</strong>.</li>
        <li>Clique no selo para desbloquear com o PIN do gestor.</li>
        <li>O desbloqueio vale apenas para a sessão atual; ao recarregar ou fechar o app, os valores voltam a ficar protegidos.</li>
        <li>Use <strong>Bloquear agora</strong> para esconder os valores antes de entregar o computador a outra pessoa.</li>
      </ul>
      <p>Defina o PIN em <strong>Configurações → Acesso</strong>. Use de 4 a 8 números. Sem PIN, qualquer pessoa pode desbloquear o modo gestor — por isso o PIN é recomendado em balcões compartilhados.</p>
      <div class="manual-note">Se você esquecer o PIN, será necessário restaurar um backup em um navegador com o armazenamento limpo. Guarde o PIN em local seguro.</div>`
    },
    {
      id: 'dados',
      title: '17. Dados, backup e planilhas',
      html: `<p>Todos os dados ficam no armazenamento local do navegador. Em <strong>Configurações → Dados e backup</strong> (modo gestor) você encontra:</p>
      <ul>
        <li><strong>Exportar backup:</strong> gera um arquivo JSON com clientes, agendamentos, serviços, equipe, bloqueios, lista de espera e configurações.</li>
        <li><strong>Importar backup:</strong> substitui os dados atuais pelo arquivo escolhido.</li>
        <li><strong>Exportar clientes / agendamentos:</strong> gera planilhas CSV compatíveis com Excel.</li>
        <li><strong>Carregar demonstração:</strong> substitui os dados por um exemplo completo.</li>
        <li><strong>Apagar tudo e recomeçar:</strong> remove todos os dados e reinicia o assistente.</li>
      </ul>
      <p>Faça backup antes de limpar o navegador, trocar de computador ou atualizar o sistema operacional. O arquivo de backup deve ser guardado em local seguro, pois contém dados pessoais de clientes.</p>`
    },
    {
      id: 'atalhos',
      title: '18. Atalhos e busca',
      html: `<ul>
        <li><strong>Alt+N:</strong> novo agendamento.</li>
        <li><strong>Ctrl+K</strong> (ou <strong>Cmd+K</strong>): busca global por cliente, serviço ou agendamento.</li>
        <li><strong>Esc:</strong> fecha modais, menus e a busca.</li>
        <li><strong>Enter:</strong> confirma o primeiro resultado da busca.</li>
      </ul>
      <p>A busca global ignora acentos e encontra nomes, telefones, tags, serviços e observações.</p>`
    },
    {
      id: 'problemas',
      title: '19. Solução de problemas',
      html: `<h4>A agenda não mostra horários livres</h4>
      <p>Verifique se o profissional está ativo, se o dia da semana tem horário configurado, se há pausa ou bloqueio no período e se os serviços estão ativos. O botão <strong>Ver próximo dia livre</strong> ajuda a encontrar a próxima data disponível.</p>
      <h4>O aplicativo abriu em branco</h4>
      <p>Recarregue a página. Se estiver offline, confirme que o aplicativo já foi aberto ao menos uma vez com internet. Em caso de atualização, feche e abra novamente.</p>
      <h4>Os dados desapareceram</h4>
      <p>Provavelmente o navegador foi limpo, o modo anônimo foi usado ou outro perfil do navegador foi aberto. Restaure o backup mais recente em <strong>Dados e backup</strong>.</p>
      <h4>O PIN não funciona</h4>
      <p>Verifique se o número foi digitado sem espaços. Se não lembrar, restaure um backup em um navegador limpo. Não existe recuperação de PIN por e-mail.</p>
      <h4>O WhatsApp não abre</h4>
      <p>Confirme se o telefone do cliente tem DDD e se o WhatsApp está instalado ou aberto no navegador. Você também pode copiar a mensagem e enviar manualmente.</p>
      <h4>A impressão corta conteúdo</h4>
      <p>Na janela de impressão, escolha orientação retrato, margens padrão e reduza a escala se necessário. A agenda do dia foi desenhada para uma folha A4.</p>`
    },
    {
      id: 'privacidade',
      title: '20. Privacidade e Microsoft Store',
      html: `<p>O Hora Marcada não possui servidor, conta online, anúncios ou rastreamento. Nenhum dado é transmitido para a internet. Recursos como WhatsApp e e-mail abrem os aplicativos do próprio dispositivo.</p>
      <p>Como os dados ficam no navegador, a segurança depende do acesso físico ao dispositivo e do PIN do gestor. Use senha no computador e mantenha backups atualizados.</p>
      <p>A distribuição pela Microsoft Store segue a política de privacidade publicada com o aplicativo. Consulte também o arquivo <strong>docs/PRIVACY.md</strong> do projeto.</p>
      <p><strong>Versão do manual:</strong> 1.0 — Hora Marcada 1.0.0.</p>`
    }
  ];

  const EN = [
    {
      id: 'about',
      title: '1. About Hora Marcada',
      html: `<p><strong>Hora Marcada</strong> is an appointment manager for professionals who work with scheduled times: medical offices, clinics, salons, barbershops, aesthetics studios, tattoo artists, physiotherapy, nutrition, psychology, personal trainers and other services.</p>
      <p>The app runs in the browser and can be installed as an app (PWA) on Windows, Android or iPhone. All data is stored <strong>only on your device</strong>. There is no online account, subscription or upload to servers.</p>
      <p>Hora Marcada is designed for two kinds of use on the same computer:</p>
      <ul>
        <li><strong>Reception:</strong> sees the schedule and contacts, but not financial values, backups or the danger zone.</li>
        <li><strong>Manager:</strong> unlocks the session with a PIN and can see values, reports and system data.</li>
      </ul>`
    },
    {
      id: 'install',
      title: '2. Installation and offline use',
      html: `<p>On the first visit, the app stores a local copy of its files. After that, it opens and works even without internet.</p>
      <h4>Install on Windows (Microsoft Edge or Chrome)</h4>
      <ul>
        <li>On Windows, double-click <strong>servir.bat</strong>. It starts the local server and opens the correct address (needed to install and for the first load).</li>
        <li>With the app open, click <strong>Install app</strong> in the top bar or use <strong>Settings → App</strong>.</li>
        <li>Alternatively, click the install icon in the address bar (or menu <strong>… → Apps → Install this site</strong>).</li>
        <li>Confirm. The app opens in its own window and appears in the Start menu.</li>
      </ul>
      <p>Once installed, the app opens from the Start menu shortcut and works offline, without the local server.</p>
      <p>From the Microsoft Store, install it from the product page. Updates are delivered by the Store.</p>
      <h4>Install on a phone</h4>
      <ul>
        <li><strong>Android/Chrome:</strong> menu <strong>⋮ → Install app</strong> or <strong>Add to Home screen</strong>.</li>
        <li><strong>iPhone/Safari:</strong> <strong>Share → Add to Home Screen</strong>.</li>
      </ul>
      <div class="manual-note"><strong>Important:</strong> opening <strong>index.html</strong> directly (file://) does not allow installation. Data in that mode lives at a separate address and <strong>does not appear</strong> in the installed app. Export a backup in <strong>Settings → Data & backup</strong> before installing and import it afterwards.</div>
      <div class="manual-note"><strong>Important:</strong> the app works offline, but data lives in this device's browser. Clearing browser data erases Hora Marcada. Make regular backups in <strong>Settings → Data & backup</strong>.</div>`
    },
    {
      id: 'getting-started',
      title: '3. Getting started',
      html: `<p>On the first launch, a three-step assistant sets up the essentials:</p>
      <ol>
        <li><strong>Segment:</strong> choose the area closest to your work. This defines default names (patient/client/student), suggested services and starting colors.</li>
        <li><strong>Identity:</strong> enter the business name, your name and an emoji. This information appears in the menu, reminders and reports.</li>
        <li><strong>Hours:</strong> select working days, opening and closing times, break and slot interval. You can start with sample data to explore the system.</li>
      </ol>
      <p>When you finish, the system creates your schedule. If you chose sample data, fictional clients and appointments are loaded; you can delete them later in <strong>Settings → Data & backup → Danger zone</strong>.</p>
      <p>To start over from scratch, use <strong>Delete everything and start over</strong>. The assistant appears again.</p>`
    },
    {
      id: 'overview',
      title: '4. Overview',
      html: `<p>The home screen summarizes the day and highlights what needs attention:</p>
      <ul>
        <li><strong>Appointments today:</strong> daily total, confirmed and still to confirm.</li>
        <li><strong>Today's occupancy:</strong> how much of the available time is already booked.</li>
        <li><strong>Monthly revenue:</strong> received, receivable and average ticket (manager only).</li>
        <li><strong>Today's check-ins:</strong> who has arrived and who is still expected.</li>
        <li><strong>Next appointment:</strong> client, service, professional, date and time.</li>
        <li><strong>Today's schedule:</strong> chronological list with quick actions to confirm, complete or reschedule.</li>
      </ul>
      <p>The <strong>Birthdays this month</strong>, <strong>Pending payments</strong> and <strong>Next 7 days</strong> cards help you reach out proactively. Click any item to see its details.</p>`
    },
    {
      id: 'schedule',
      title: '5. Schedule',
      html: `<p>View the schedule by <strong>Day</strong>, <strong>Week</strong> or <strong>Month</strong>. Use the arrows to navigate, the <strong>Today</strong> button to return to the current date and the filters to show only one professional or status.</p>
      <h4>Day view</h4>
      <ul>
        <li>Each column is a professional. Free times appear blank.</li>
        <li>Click an empty slot to create an appointment at that time.</li>
        <li>Click an appointment to open details, confirm, complete, reschedule, delete or send a reminder.</li>
        <li>Lunch breaks and blocks are highlighted.</li>
      </ul>
      <h4>Week and month views</h4>
      <ul>
        <li>They show how appointments are distributed and how many there are per day.</li>
        <li>Click a day to open its daily view.</li>
      </ul>
      <h4>Printing</h4>
      <p>Use <strong>Print daily schedule</strong> to generate a sheet with the day's times, clients and services. Printing follows the active professional filter.</p>
      <h4>Blocks</h4>
      <p>In <strong>Team</strong>, click <strong>Block time</strong> to prevent appointments in a specific period: lunch, day off, holiday, course or personal commitment. A block can apply to all professionals or to one of them, and can repeat for several weeks.</p>`
    },
    {
      id: 'appointments',
      title: '6. Appointments',
      html: `<p>To create an appointment, use <strong>New appointment</strong> at the top (shortcut <strong>Alt+N</strong>), the button inside the schedule or the shortcut on an empty slot.</p>
      <h4>What to fill in</h4>
      <ul>
        <li><strong>Client:</strong> select an existing client. If there is none, add one first in <strong>Clients</strong>.</li>
        <li><strong>Service:</strong> defines duration, price and the reset buffer.</li>
        <li><strong>Professional:</strong> only active professionals enabled for the service are listed.</li>
        <li><strong>Date and time:</strong> suggested times respect working hours, breaks, blocks and existing appointments.</li>
        <li><strong>Notes:</strong> useful information for the appointment.</li>
        <li><strong>Allow fit-in:</strong> ignore the time conflict and book two appointments in the same period when that is possible in real life.</li>
      </ul>
      <h4>Statuses</h4>
      <ul>
        <li><strong>Scheduled:</strong> time reserved, not confirmed yet.</li>
        <li><strong>Confirmed:</strong> the client confirmed attendance.</li>
        <li><strong>Completed:</strong> the appointment happened; allows payment registration.</li>
        <li><strong>No-show:</strong> the client did not arrive.</li>
        <li><strong>Cancelled:</strong> frees the time and does not count as revenue.</li>
      </ul>
      <h4>Check-in</h4>
      <p>When the client arrives, use <strong>Check in</strong>. The appointment becomes <strong>Confirmed</strong> and reception knows who is waiting. You can undo the check-in.</p>
      <h4>Completing and receiving</h4>
      <p>When completing, state whether the amount was paid and the payment method. Only <strong>completed and paid</strong> appointments count as received revenue. Completed appointments without payment remain under <strong>Receivable</strong> in finance.</p>`
    },
    {
      id: 'waitlist',
      title: '7. Waitlist',
      html: `<p>The waitlist organizes people who want an appointment but do not have a date yet.</p>
      <ul>
        <li>Add client, service, preferred professional, period (morning, afternoon or any) and priority.</li>
        <li>The system suggests the next free time compatible with the service duration.</li>
        <li>Use <strong>Schedule</strong> to turn the entry into an appointment, or <strong>Remove from list</strong> when it is no longer needed.</li>
        <li>High-priority entries appear at the top.</li>
      </ul>
      <p>When a cancellation opens a slot, check the list and call the next client. Contact can be made by phone or WhatsApp directly from the profile.</p>`
    },
    {
      id: 'clients',
      title: '8. Clients',
      html: `<p>The client profile stores name, phone/WhatsApp, email, date of birth, tags and notes. Extra fields can be created in <strong>Settings → Schedule</strong>, such as insurance, plan or record number.</p>
      <ul>
        <li>Use tags to mark <strong>VIP</strong>, <strong>Recurring</strong> or <strong>New</strong> and filter the list.</li>
        <li>The profile shows appointment history, total paid, last visit and next appointment.</li>
        <li>You can call, open WhatsApp or send an email right from the profile.</li>
        <li>Global search (<strong>Ctrl+K</strong>) finds clients, services and appointments.</li>
      </ul>
      <p>When you delete a client, appointment history is kept but is no longer linked to the profile. Financial values remain protected by the access rules.</p>`
    },
    {
      id: 'services',
      title: '9. Services',
      html: `<p>Each service has a name, duration, price, category, schedule color and a buffer after the appointment.</p>
      <ul>
        <li><strong>Duration</strong> determines how many slots the appointment takes.</li>
        <li><strong>Buffer</strong> reserves time for cleanup, reset or preparation between clients.</li>
        <li><strong>Color</strong> helps identify the service in the schedule.</li>
        <li>Inactive services do not appear in new appointments but remain in history.</li>
      </ul>
      <p>You can limit which services each professional performs. In that case, scheduling only allows services enabled for the selected professional.</p>`
    },
    {
      id: 'team',
      title: '10. Team and hours',
      html: `<p>Add each professional with name, role/specialty, color, phone, email and the services they perform.</p>
      <ul>
        <li>Set each person's working days and hours, including breaks.</li>
        <li>Inactive professionals no longer appear in the schedule but keep their history.</li>
        <li>Blocks can apply to everyone or to a specific professional.</li>
        <li>The first professional is used as the account owner in the side menu.</li>
      </ul>
      <p>If the schedule looks empty, check that there is at least one active professional with hours set for that day and at least one active service.</p>`
    },
    {
      id: 'finance',
      title: '11. Finance',
      html: `<p>Finance is manager-only. Reception sees only the schedule and contacts.</p>
      <ul>
        <li><strong>Received:</strong> completed and paid appointments.</li>
        <li><strong>Receivable:</strong> completed appointments without a recorded payment.</li>
        <li><strong>Expected (scheduled):</strong> amounts from future confirmed or scheduled appointments.</li>
        <li><strong>Average ticket:</strong> average of completed appointments.</li>
      </ul>
      <p>Filter by period (this month, last 30 days, this year or a custom range) and by professional. The chart shows revenue over time. To record a payment, open a completed appointment and enter the payment method.</p>
      <div class="manual-note">Financial values never appear in reception mode. The protection applies to every screen, including overview totals, services and the client profile.</div>`
    },
    {
      id: 'reminders',
      title: '12. Reminders and WhatsApp',
      html: `<p>The reminders screen lists appointments that still need confirmation. You can:</p>
      <ul>
        <li>Confirm the appointment with one click.</li>
        <li>Copy the ready-made message and send it through any channel.</li>
        <li>Open WhatsApp with the message already filled in when the client has a phone number.</li>
        <li>Edit the message template in <strong>Settings → Texts</strong>.</li>
      </ul>
      <p>Available variables: <code>{cliente}</code>, <code>{servico}</code>, <code>{profissional}</code>, <code>{data}</code>, <code>{hora}</code>, <code>{valor}</code> and <code>{negocio}</code>. They are replaced automatically when sending.</p>
      <p>Sending through WhatsApp depends on the app or WhatsApp Web installed on the device. Hora Marcada only prepares the message; nothing is sent automatically.</p>`
    },
    {
      id: 'identity',
      title: '13. Business identity',
      html: `<p>In <strong>Settings → Identity</strong> you adjust business name, emoji, segment, colors, light/dark theme and currency.</p>
      <ul>
        <li>The <strong>segment</strong> defines suggested names, services and colors. Changing it does not change your data.</li>
        <li><strong>Apply segment identity</strong> updates colors and terminology automatically.</li>
        <li><strong>Colors</strong> can be customized freely.</li>
        <li><strong>Currency</strong> changes how amounts are formatted across the system.</li>
      </ul>`
    },
    {
      id: 'themes',
      title: '14. Themes and appearance',
      html: `<p>In <strong>Settings → Themes</strong> there are ready-made combinations commonly used in appointment apps:</p>
      <ul>
        <li><strong>Modern violet</strong>, <strong>Clinical blue</strong>, <strong>Health green</strong>, <strong>Spa teal</strong>, <strong>Beauty rose</strong>, <strong>Barbershop gold</strong>, <strong>Wine red</strong>, <strong>Indigo</strong>, <strong>Graphite</strong>, <strong>Coral</strong> and <strong>Lavender</strong>.</li>
      </ul>
      <p>Choose a theme to apply its colors immediately. You can also use custom colors and switch between <strong>light</strong>, <strong>dark</strong> or <strong>follow system</strong>. The theme changes the visual identity (button colors, highlights, charts and menu) but not the layout or screen organization.</p>`
    },
    {
      id: 'language',
      title: '15. Language and manual',
      html: `<p>In <strong>Settings → Language</strong> choose <strong>Portuguese</strong> or <strong>English</strong>. The change is immediate.</p>
      <ul>
        <li>Interface texts, dates, months, weekdays and number formatting use the selected language.</li>
        <li>Client names, services and notes you typed are <strong>not</strong> translated.</li>
        <li>Default labels (client, service, appointment), the reminder template and default payment methods are converted automatically. Custom texts are preserved.</li>
      </ul>
      <p>The <strong>complete manual</strong> is available in both languages and can be opened or downloaded in <strong>Settings → Language</strong>.</p>`
    },
    {
      id: 'access',
      title: '16. Access, reception and PIN',
      html: `<p><strong>Reception mode</strong> is enabled by default and protects financial values, reports, backups and the danger zone.</p>
      <ul>
        <li>The badge at the top shows <strong>Reception</strong> or <strong>Manager</strong>.</li>
        <li>Click the badge to unlock with the manager PIN.</li>
        <li>Unlocking applies to the current session only; reloading or closing the app protects the values again.</li>
        <li>Use <strong>Lock now</strong> to hide values before handing the computer to someone else.</li>
      </ul>
      <p>Set the PIN in <strong>Settings → Access</strong>. Use 4 to 8 digits. Without a PIN, anyone can unlock manager mode, so a PIN is recommended for shared counters.</p>
      <div class="manual-note">If you forget the PIN, you will need to restore a backup in a browser with clean storage. Keep the PIN in a safe place.</div>`
    },
    {
      id: 'data',
      title: '17. Data, backup and spreadsheets',
      html: `<p>All data lives in the browser's local storage. In <strong>Settings → Data & backup</strong> (manager mode) you find:</p>
      <ul>
        <li><strong>Export backup:</strong> creates a JSON file with clients, appointments, services, team, blocks, waitlist and settings.</li>
        <li><strong>Import backup:</strong> replaces current data with the selected file.</li>
        <li><strong>Export clients / appointments:</strong> creates CSV spreadsheets compatible with Excel.</li>
        <li><strong>Load demo:</strong> replaces data with a complete example.</li>
        <li><strong>Delete everything and start over:</strong> removes all data and restarts the assistant.</li>
      </ul>
      <p>Make a backup before clearing the browser, switching computers or updating the operating system. Store the backup file safely because it contains clients' personal data.</p>`
    },
    {
      id: 'shortcuts',
      title: '18. Shortcuts and search',
      html: `<ul>
        <li><strong>Alt+N:</strong> new appointment.</li>
        <li><strong>Ctrl+K</strong> (or <strong>Cmd+K</strong>): global search for client, service or appointment.</li>
        <li><strong>Esc:</strong> closes modals, menus and search.</li>
        <li><strong>Enter:</strong> opens the first search result.</li>
      </ul>
      <p>Global search ignores accents and finds names, phone numbers, tags, services and notes.</p>`
    },
    {
      id: 'troubleshooting',
      title: '19. Troubleshooting',
      html: `<h4>The schedule shows no free times</h4>
      <p>Check that the professional is active, that the weekday has working hours, that there is no break or block in the period, and that services are active. The <strong>View next free day</strong> button helps find the next available date.</p>
      <h4>The app opened blank</h4>
      <p>Reload the page. If offline, make sure the app has been opened at least once with internet. After an update, close and open it again.</p>
      <h4>Data disappeared</h4>
      <p>The browser was probably cleared, private mode was used or another browser profile was opened. Restore the latest backup in <strong>Data & backup</strong>.</p>
      <h4>The PIN does not work</h4>
      <p>Check that the number was typed without spaces. If you cannot remember it, restore a backup in a clean browser. There is no PIN recovery by email.</p>
      <h4>WhatsApp does not open</h4>
      <p>Check that the client's phone has an area code and that WhatsApp is installed or open in the browser. You can also copy the message and send it manually.</p>
      <h4>Printing cuts content</h4>
      <p>In the print window, choose portrait orientation, standard margins and reduce scale if needed. The daily schedule is designed for A4 paper.</p>`
    },
    {
      id: 'privacy',
      title: '20. Privacy and Microsoft Store',
      html: `<p>Hora Marcada has no server, online account, ads or tracking. No data is transmitted to the internet. Features such as WhatsApp and email open the device's own apps.</p>
      <p>Because data lives in the browser, security depends on physical access to the device and on the manager PIN. Use a computer password and keep backups up to date.</p>
      <p>Distribution through the Microsoft Store follows the privacy policy published with the app. See also the project file <strong>docs/PRIVACY.md</strong>.</p>
      <p><strong>Manual version:</strong> 1.0 — Hora Marcada 1.0.0.</p>`
    }
  ];

  const SECTIONS = { pt: PT, en: EN };

  const ui = {
    pt: {
      title: 'Manual do usuário — Hora Marcada',
      sub: 'Guia completo do Hora Marcada',
      toc: 'Nesta página',
      download: 'Baixar manual (.html)',
      close: 'Fechar',
      note: 'Dica',
      footer: 'Hora Marcada · Manual completo · Português'
    },
    en: {
      title: 'User manual — Hora Marcada',
      sub: 'Complete Hora Marcada guide',
      toc: 'On this page',
      download: 'Download manual (.html)',
      close: 'Close',
      note: 'Tip',
      footer: 'Hora Marcada · Complete manual · English'
    }
  };

  function list(lang) {
    return SECTIONS[lang] || SECTIONS.pt;
  }

  function tocHTML(lang) {
    const t = ui[lang] || ui.pt;
    return `<div class="manual-toc">
      <div class="manual-toc-title">${t.toc}</div>
      <div class="manual-toc-grid">
        ${list(lang).map(s => `<button type="button" class="manual-toc-item" data-goto="${s.id}">${s.title}</button>`).join('')}
      </div>
    </div>`;
  }

  function docHTML(lang) {
    return `<div class="manual-doc" data-i18n-skip>
      ${tocHTML(lang)}
      ${list(lang).map(s => `<section class="manual-sec" id="manual-${s.id}">
        <h3>${s.title}</h3>
        ${s.html}
      </section>`).join('')}
      <p class="manual-foot">${(ui[lang] || ui.pt).footer}</p>
    </div>`;
  }

  function toolbarHTML(lang) {
    const t = ui[lang] || ui.pt;
    return `<div class="manual-toolbar" data-i18n-skip>
      <div class="lang-pills">
        <button type="button" class="lang-pill ${lang === 'pt' ? 'active' : ''}" data-manual-lang="pt">Português</button>
        <button type="button" class="lang-pill ${lang === 'en' ? 'active' : ''}" data-manual-lang="en">English</button>
      </div>
      <div class="spacer"></div>
      <button type="button" class="btn btn-sm" data-manual-download>${Icon('download', 15)} ${t.download}</button>
    </div>`;
  }

  function mount(overlay, lang) {
    const body = overlay.querySelector('.manual-body');
    if (!body) return;
    body.innerHTML = toolbarHTML(lang) + docHTML(lang);

    body.querySelectorAll('[data-manual-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.dataset.manualLang;
        if (next === lang) return;
        lang = next;
        body.innerHTML = toolbarHTML(lang) + docHTML(lang);
        syncChrome(overlay, lang);
        bind(overlay, body);
      });
    });

    const dl = body.querySelector('[data-manual-download]');
    if (dl) dl.addEventListener('click', () => download(lang));

    syncChrome(overlay, lang);
    bind(overlay, body);
  }

  // Mantém o cabeçalho e o rodapé do modal no mesmo idioma do conteúdo.
  function syncChrome(overlay, lang) {
    const t = ui[lang] || ui.pt;
    const dialog = overlay.querySelector('.modal');
    const h = overlay.querySelector('.modal-head h3');
    const p = overlay.querySelector('.modal-head p');
    const close = overlay.querySelector('.modal-foot [data-ui-close]');
    if (dialog) dialog.setAttribute('aria-label', t.title);
    if (h) h.textContent = t.title;
    if (p) p.textContent = t.sub;
    if (close) close.textContent = t.close;
  }

  function bind(overlay, body) {
    body.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = body.querySelector('#manual-' + btn.dataset.goto);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function open(lang) {
    let current = lang === 'en' ? 'en' : 'pt';
    const t = ui[current];
    const modal = UI.open({
      title: t.title,
      subtitle: t.sub,
      size: 'modal-xl',
      body: `<div class="manual-body"></div>`,
      footer: `<div class="spacer"></div><button class="btn btn-primary" data-ui-close>${t.close}</button>`,
      onMount: overlay => {
        const modal = overlay.querySelector('.modal');
        if (modal) {
          modal.classList.add('modal-manual');
          // O manual mantém o idioma escolhido nele, independente da interface.
          modal.setAttribute('data-i18n-skip', '');
        }
        overlay.querySelectorAll('.modal-head h3, .modal-head p, .modal-foot').forEach(el => {
          el.setAttribute('data-i18n-skip', '');
        });
        mount(overlay, current);
      }
    });
    return modal;
  }

  function standalone(lang) {
    const t = ui[lang] || ui.pt;
    const sections = list(lang).map(s => `<section class="manual-sec" id="manual-${s.id}">
      <h2>${s.title}</h2>
      ${s.html}
    </section>`).join('');
    return `<!doctype html>
<html lang="${lang === 'en' ? 'en' : 'pt-BR'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.title}</title>
<style>
  :root{--accent:#7c3aed;--text:#131827;--muted:#5b6478;--border:#e6e9f2;}
  *{box-sizing:border-box}
  body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--text);line-height:1.62;max-width:860px;margin:36px auto;padding:0 22px 60px;}
  h1{font-size:26px;margin:0 0 4px} .sub{color:var(--muted);margin:0 0 26px}
  h2{font-size:19px;margin:34px 0 10px;padding-top:8px;border-top:1px solid var(--border)}
  h4{font-size:14px;margin:18px 0 6px}
  p,li{font-size:14px} ul,ol{padding-left:22px}
  code{background:#f2f3f8;border-radius:5px;padding:1px 5px;font-size:12.5px}
  .manual-note{background:#f6f3ff;border-left:3px solid var(--accent);padding:10px 14px;border-radius:8px;margin:14px 0;font-size:13.5px}
  .toc{background:#fafbfe;border:1px solid var(--border);border-radius:12px;padding:14px 18px;margin-bottom:10px}
  .toc a{color:var(--accent);text-decoration:none;font-size:13.5px;display:block;padding:2px 0}
  @media print{body{margin:0;max-width:none} h2{page-break-after:avoid}}
</style>
</head>
<body>
  <h1>${t.title}</h1>
  <p class="sub">${t.sub}</p>
  <div class="toc">${list(lang).map(s => `<a href="#manual-${s.id}">${s.title}</a>`).join('')}</div>
  ${sections}
</body>
</html>`;
  }

  function download(lang) {
    const l = lang === 'en' ? 'en' : 'pt';
    const name = l === 'en' ? 'hora-marcada-manual-en.html' : 'hora-marcada-manual-pt.html';
    U.download(name, standalone(l), 'text/html;charset=utf-8');
    if (typeof UI !== 'undefined') UI.toast(l === 'en' ? 'Manual downloaded.' : 'Manual baixado.', 'success');
  }

  return { open, download, standalone, sections: SECTIONS, list };
})();
