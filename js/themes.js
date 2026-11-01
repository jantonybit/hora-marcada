/* ==========================================================================
   Temas — combinações de cores usadas em agendas e apps de agendamento
   ========================================================================== */
const Themes = (() => {
  const LIST = [
    {
      id: 'roxo', accent: '#7c3aed', accent2: '#a855f7', icon: '✨',
      name: { pt: 'Roxo moderno', en: 'Modern violet' },
      hint: { pt: 'Padrão do Hora Marcada. Moderno e versátil.', en: 'Hora Marcada default. Modern and versatile.' }
    },
    {
      id: 'clinico', accent: '#0ea5e9', accent2: '#2563eb', icon: '🩺',
      name: { pt: 'Azul clínico', en: 'Clinical blue' },
      hint: { pt: 'Consultórios, clínicas e saúde em geral.', en: 'Medical offices, clinics and healthcare.' }
    },
    {
      id: 'saude', accent: '#10b981', accent2: '#059669', icon: '🌿',
      name: { pt: 'Verde saúde', en: 'Health green' },
      hint: { pt: 'Bem-estar, nutrição e fisioterapia.', en: 'Wellness, nutrition and physiotherapy.' }
    },
    {
      id: 'spa', accent: '#14b8a6', accent2: '#0d9488', icon: '💆',
      name: { pt: 'Teal spa', en: 'Spa teal' },
      hint: { pt: 'Massoterapia, estética e terapias.', en: 'Massage, aesthetics and therapies.' }
    },
    {
      id: 'beleza', accent: '#ec4899', accent2: '#db2777', icon: '💅',
      name: { pt: 'Rosa beleza', en: 'Beauty rose' },
      hint: { pt: 'Salões, manicure e estética.', en: 'Salons, nail design and beauty.' }
    },
    {
      id: 'barbearia', accent: '#b8860b', accent2: '#92400e', icon: '💈',
      name: { pt: 'Dourado barbearia', en: 'Barbershop gold' },
      hint: { pt: 'Barbearias e estúdios com estilo clássico.', en: 'Barbershops and classic studios.' }
    },
    {
      id: 'vinho', accent: '#b91c1c', accent2: '#7f1d1d', icon: '🍷',
      name: { pt: 'Vermelho vinho', en: 'Wine red' },
      hint: { pt: 'Marcante e sofisticado, para estúdios.', en: 'Bold and sophisticated, for studios.' }
    },
    {
      id: 'indigo', accent: '#4f46e5', accent2: '#4338ca', icon: '🔷',
      name: { pt: 'Índigo', en: 'Indigo' },
      hint: { pt: 'Psicologia, coaching e consultorias.', en: 'Psychology, coaching and consulting.' }
    },
    {
      id: 'grafite', accent: '#475569', accent2: '#334155', icon: '🪨',
      name: { pt: 'Grafite', en: 'Graphite' },
      hint: { pt: 'Neutro e discreto, para qualquer segmento.', en: 'Neutral and discreet, for any segment.' }
    },
    {
      id: 'coral', accent: '#f97316', accent2: '#ea580c', icon: '🧡',
      name: { pt: 'Coral', en: 'Coral' },
      hint: { pt: 'Energético e acolhedor, para personal e fitness.', en: 'Energetic and friendly, for fitness.' }
    },
    {
      id: 'lavanda', accent: '#8b5cf6', accent2: '#6d28d9', icon: '🪻',
      name: { pt: 'Lavanda', en: 'Lavender' },
      hint: { pt: 'Suave e relaxante, para terapias e bem-estar.', en: 'Soft and relaxing, for therapies.' }
    }
  ];

  const byId = id => LIST.find(t => t.id === id) || null;

  const name = (theme, lang) => {
    if (!theme) return '';
    const l = lang || (typeof I18n !== 'undefined' ? I18n.lang : 'pt');
    return (theme.name && (theme.name[l] || theme.name.pt)) || '';
  };

  const hint = (theme, lang) => {
    if (!theme) return '';
    const l = lang || (typeof I18n !== 'undefined' ? I18n.lang : 'pt');
    return (theme.hint && (theme.hint[l] || theme.hint.pt)) || '';
  };

  function apply(themeId) {
    const theme = byId(themeId);
    if (!theme || typeof Store === 'undefined' || !Store.db) return false;
    const s = Store.settings();
    s.accent = theme.accent;
    s.accent2 = theme.accent2;
    s.themePreset = theme.id;
    Store.save();
    return true;
  }

  return { LIST, byId, name, hint, apply };
})();
