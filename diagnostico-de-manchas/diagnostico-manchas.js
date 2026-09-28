/*
 * Dedicada Lavanderia · Diagnóstico de Manchas (versão 3)
 * Snippet WPCode 3164 (JavaScript). Vai DEPOIS de <div id="dm-app"> no conteúdo da página 3165.
 * Protótipo de 28/09/2026. Não publicar sem a revisão descrita em LEIA-ME.md.
 *
 * DE ONDE VEM O CONTEÚDO
 *   Tudo foi tirado dos 17 guias de Cuidados por Tecido no ar em 28/09/2026: a tabela
 *   "problemas mais comuns" (problema, o que geralmente acontece e urgência), os erros que
 *   estragam a peça, as perguntas frequentes, o processo da Dedicada, prazos, preços e falas.
 *   As três famílias de manchas vêm da tabela tira-manchas da Seitz (Base técnica do Plano)
 *   e do guia de cetim e organza. As notas de tecido citam a ANEL, como os guias.
 *   Nada do banco antigo foi reaproveitado.
 *
 * COMO O BANCO ESTÁ ORGANIZADO (tudo abaixo, antes do "funcionamento")
 *   PESSOAS  → quem assina (nome, papel, foto).
 *   NIVEIS   → níveis de urgência e a ordem em que aparecem.
 *   FAMILIAS → gordurosas e sintéticas, orgânicas e proteicas, vegetais e de tanino, outras
 *              manchas e danos no tecido; "primeiro" é o primeiro cuidado de cada família.
 *   BLOG     → posts do blog que passaram pela conferência das regras.
 *   MANCHAS  → 44 manchas e danos, com sinônimos para a busca, "dica" (cuidado próprio,
 *              tirado dos guias) e "leia" (post do blog).
 *   GRUPOS   → os 5 grupos da página central, mais "Outras peças e tecidos".
 *   PECAS    → os 17 guias e 5 peças sem guia próprio (semGuia). Cada peça traz os fatos do
 *              guia e a lista de problemas:
 *     problema = { id, nome, manchas[], nivel, urgencia, acontece, fazer[], evitar[], dedicada }
 *       manchas:  ids de MANCHAS que caem neste problema (liga a busca ao problema certo)
 *       nivel:    chave de NIVEIS
 *       urgencia: texto da coluna "Urgência" do guia, sem mudar nada
 *       acontece: texto da coluna "O que geralmente acontece" do guia
 *       dedicada: o que é próprio deste problema no processo (opcional)
 *   Qualquer peça com qualquer mancha tem resultado: o problema do guia, quando existe, ou a
 *   orientação pela família da mancha.
 *
 * Regra: só fatos confirmados pela Dedicada. Nada de "único", "o melhor", "exclusivo",
 * "100%", percentuais sem fonte ou "toda Florianópolis".
 */
(function () {
  'use strict';

  var CONFIG = window.DM_CONFIG || {};
  var WHATSAPP = '5548984280639';
  var SITE = 'https://dedicadalavanderia.com.br';
  // Miniaturas dos cartões (pasta prototipo-img/). Suba os arquivos dm-*.webp na biblioteca
  // de mídia e ajuste este endereço. Se a imagem não carregar, o cartão fica só com o texto.
  var FOTOS = CONFIG.fotos || SITE + '/wp-content/uploads/2026/09/';
  var UPLOADS = SITE + '/wp-content/uploads/2026/09/';

  /* ---------- Quem assina ---------- */
  var PESSOAS = {
    liliane: { nome: 'Liliane Sella Mazza', papel: 'sócia fundadora', foto: CONFIG.fotoLiliane || UPLOADS + 'liliane-sella-mazza-dedicada-lavanderia.webp' },
    jorge: { nome: 'Jorge Isaac Mazza', papel: 'sócio fundador', foto: CONFIG.fotoJorge || UPLOADS + 'jorge-isaac-mazza-dedicada-lavanderia.webp' },
    alejandro: { nome: 'Alejandro David Mazza', papel: 'sócio administrador', foto: CONFIG.fotoAlejandro || UPLOADS + 'alejandro-david-mazza-dedicada-lavanderia.webp' }
  };

  /* ---------- Níveis de urgência (ordem da lista no passo 2) ---------- */
  var NIVEIS = {
    muito_urgente: { ordem: 1, rotulo: 'Muito urgente', tom: 'forte' },
    urgente: { ordem: 2, rotulo: 'Urgente', tom: 'forte' },
    media: { ordem: 3, rotulo: 'Média urgência', tom: 'medio' },
    logo: { ordem: 3, rotulo: 'Leve logo', tom: 'medio' },
    atencao: { ordem: 4, rotulo: 'Atenção', tom: 'leve' },
    sem_urgencia: { ordem: 5, rotulo: 'Sem urgência', tom: 'leve' },
    dificil: { ordem: 6, rotulo: 'Difícil de reverter', tom: 'aviso' },
    sem_solucao: { ordem: 7, rotulo: 'Sem solução na lavagem', tom: 'aviso' }
  };

  /* ---------- Famílias de manchas (tira-manchas Hydret da Seitz) ---------- */
  var FAMILIAS = {
    gordura: {
      nome: 'Gordurosas e sintéticas', singular: 'gordurosa ou sintética', hydret: 'Hydret 1',
      exemplos: 'maquiagem, batom, caneta, tinta, esmalte, cola, óleo e graxa',
      primeiro: 'Tire o excesso sem esfregar e não use álcool, acetona nem removedor: em couro e em detalhes sintéticos, eles tiram a cor ou dissolvem o material.'
    },
    proteina: {
      nome: 'Orgânicas e proteicas', singular: 'orgânica ou proteica', hydret: 'Hydret 2',
      exemplos: 'sangue, suor, comida, leite, ovo e urina',
      primeiro: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente: o calor fixa sangue, suor e comida.'
    },
    tanino: {
      nome: 'Vegetais e de tanino', singular: 'vegetal ou de tanino', hydret: 'Hydret 3',
      exemplos: 'vinho, café, chá, suco, refrigerante e perfume',
      primeiro: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente, que fixa manchas de café, chá e vinho.'
    },
    outras: { nome: 'Outras manchas', hydret: null, exemplos: '', primeiro: 'Não esfregue, não use produto caseiro e não passe ferro antes de a mancha sair.' },
    dano: { nome: 'Danos no tecido', hydret: null, exemplos: '', primeiro: 'Mande uma foto ou leve a peça para a equipe avaliar: alguns danos não se desfazem na lavagem.' }
  };

  /* Posts do blog que passaram pela conferência das regras (28/09/2026): sem "o melhor",
   * "definitivo", percentuais ou receitas caseiras. Os outros ficaram de fora até serem revisados. */
  var BLOG = {
    sangue: ['/como-remover-manchas-de-sangue-de-roupas-de-forma-segura/', 'Como remover manchas de sangue das roupas'],
    gordura: ['/como-remover-manchas-de-gordura-das-roupas-descubra-a-solucao-definitiva/', 'Como remover manchas de gordura das roupas'],
    maquiagem: ['/remocao-de-manchas-de-maquiagem/', 'Remoção de manchas de maquiagem'],
    vomito: ['/lavanderia-lava-roupa-com-vomito/', 'Lavanderia lava roupa com vômito?'],
    cupro: ['/lavagem-de-roupas-em-cupro-cuidados-para-pecas-delicadas/', 'Lavagem de roupas em cupro'],
    fitness: ['/lavagem-de-roupas-fitness-e-esportivas/', 'Lavagem de roupas fitness e esportivas']
  };

  /* ---------- Vocabulário de manchas e danos ----------
   * familia: chave de FAMILIAS. sinonimos: palavras que a busca reconhece (escritas sem acento).
   * dica: primeiro cuidado próprio desta mancha, tirado dos guias. leia: chave de BLOG. */
  var MANCHAS = [
    { id: 'vinho', nome: 'Vinho', familia: 'tanino', sinonimos: ['vinho', 'vinho tinto', 'tinto', 'vinho branco'] },
    { id: 'cafe', nome: 'Café', familia: 'tanino', sinonimos: ['cafe', 'cafezinho', 'capuccino', 'cappuccino', 'cafe com leite'] },
    { id: 'cha', nome: 'Chá ou mate', familia: 'tanino', sinonimos: ['cha', 'mate', 'erva mate', 'chimarrao', 'terere'] },
    { id: 'suco', nome: 'Suco ou fruta', familia: 'tanino', sinonimos: ['suco', 'fruta', 'acai', 'morango', 'uva', 'suco de uva', 'amora', 'jabuticaba', 'laranja', 'beterraba', 'banana', 'nodoa', 'nodoa de banana', 'manga', 'goiaba', 'jenipapo'] },
    { id: 'refrigerante', nome: 'Refrigerante', familia: 'tanino', sinonimos: ['refrigerante', 'refri', 'coca', 'guarana'] },
    { id: 'bebida', nome: 'Cerveja ou drinque', familia: 'tanino', sinonimos: ['cerveja', 'chopp', 'chope', 'drinque', 'drink', 'bebida', 'licor', 'caipirinha', 'alcool', 'espumante', 'champanhe'] },
    { id: 'perfume', nome: 'Perfume', familia: 'tanino', sinonimos: ['perfume', 'colonia', 'body splash'] },
    { id: 'grama', nome: 'Grama', familia: 'tanino', sinonimos: ['grama', 'clorofila', 'folha', 'gramado'] },
    { id: 'acafrao', nome: 'Açafrão, urucum ou curry', familia: 'tanino', sinonimos: ['acafrao', 'curcuma', 'acafrao da terra', 'urucum', 'colorau', 'curry', 'mostarda'] },
    { id: 'sangue', nome: 'Sangue', familia: 'proteina', sinonimos: ['sangue', 'menstruacao', 'menstrual', 'sangramento'], leia: 'sangue' },
    { id: 'suor', nome: 'Suor', familia: 'proteina', sinonimos: ['suor', 'transpiracao', 'axila', 'sovaco', 'debaixo do braco', 'de baixo do braco', 'embaixo do braco', 'cheiro de suor'] },
    { id: 'comida', nome: 'Comida ou molho', familia: 'proteina', sinonimos: ['comida', 'molho', 'molho de tomate', 'tomate', 'carne', 'churrasco', 'ketchup', 'maionese', 'chocolate', 'nescau', 'achocolatado', 'sorvete', 'caldo', 'shoyu', 'feijao', 'pizza'] },
    { id: 'leite', nome: 'Leite', familia: 'proteina', sinonimos: ['leite', 'iogurte', 'mamadeira', 'golfada', 'papinha', 'leite materno'] },
    { id: 'ovo', nome: 'Ovo', familia: 'proteina', sinonimos: ['ovo', 'gema', 'clara de ovo'] },
    { id: 'xixi', nome: 'Xixi', familia: 'proteina', sinonimos: ['xixi', 'urina', 'pipi', 'fralda', 'fralda vazou'] },
    { id: 'vomito', nome: 'Vômito', familia: 'proteina', sinonimos: ['vomito', 'vomitou', 'golfou'], leia: 'vomito' },
    { id: 'fezes', nome: 'Fezes', familia: 'proteina', sinonimos: ['fezes', 'coco de cachorro', 'coco de gato', 'coco de bebe', 'coco do bebe', 'dejeto'] },
    { id: 'maquiagem', nome: 'Maquiagem', familia: 'gordura', sinonimos: ['maquiagem', 'base', 'corretivo', 'po compacto', 'rimel', 'delineador', 'blush', 'make', 'lapis de olho'], leia: 'maquiagem', dica: 'Não use demaquilante: os óleos criam uma segunda mancha, geralmente maior que a original.' },
    { id: 'batom', nome: 'Batom', familia: 'gordura', sinonimos: ['batom', 'gloss', 'lip tint'], leia: 'maquiagem', dica: 'Não use demaquilante: os óleos criam uma segunda mancha, geralmente maior que a original.' },
    { id: 'caneta', nome: 'Caneta', familia: 'gordura', sinonimos: ['caneta', 'esferografica', 'canetinha', 'marcador', 'tinta de caneta', 'hidrocor', 'pincel atomico', 'marca texto', 'lapis', 'lapis de cor'] },
    { id: 'tinta', nome: 'Tinta', familia: 'gordura', sinonimos: ['tinta', 'tinta de parede', 'guache', 'tinta acrilica', 'pintura', 'tinta seca', 'tinta a oleo'] },
    { id: 'esmalte', nome: 'Esmalte', familia: 'gordura', sinonimos: ['esmalte', 'unha'] },
    { id: 'cola', nome: 'Cola', familia: 'gordura', sinonimos: ['cola', 'adesivo', 'super bonder', 'cola quente'] },
    { id: 'gordura', nome: 'Óleo ou gordura', familia: 'gordura', sinonimos: ['gordura', 'oleo', 'azeite', 'manteiga', 'fritura', 'oleo de cozinha', 'engordurado', 'hidratante', 'creme', 'oleo corporal', 'oleo de massagem', 'dende', 'azeite de dende'], leia: 'gordura' },
    { id: 'graxa', nome: 'Graxa', familia: 'gordura', sinonimos: ['graxa', 'oleo de motor', 'oleo de carro', 'oleo de maquina', 'oleo diesel', 'corrente de bicicleta', 'bicicleta', 'moto', 'piche', 'graxa de sapato', 'nugget'], dica: 'Não esfregue com detergente: a fricção tira o corante e deixa a área clara.' },
    { id: 'protetor', nome: 'Protetor solar', familia: 'gordura', sinonimos: ['protetor', 'protetor solar', 'filtro solar', 'bronzeador', 'mancha alaranjada', 'alaranjada'], dica: 'Não use água sanitária, que fixa a mancha, e não passe a ferro antes de tratar.' },
    { id: 'mofo', nome: 'Mofo', familia: 'outras', sinonimos: ['mofo', 'mofado', 'mofada', 'bolor', 'fungo', 'cheiro de guardado', 'pintas pretas', 'mancha de guardado', 'roupa guardada'], dica: 'Não escove nem esfregue a área, para não espalhar o mofo.' },
    { id: 'ferrugem', nome: 'Ferrugem', familia: 'outras', sinonimos: ['ferrugem', 'enferrujado', 'enferrujada'], dica: 'Não use água sanitária: ela escurece a mancha de ferrugem.' },
    { id: 'cor', nome: 'Cor de outra peça', familia: 'outras', sinonimos: ['cor de outra peca', 'outra roupa', 'outra peca', 'manchada por outra', 'manchou de outra', 'soltou tinta', 'soltou cor', 'transferencia de cor', 'passou cor', 'tingiu', 'manchou na lavagem', 'manchou na maquina', 'jeans manchou', 'roupa tingida', 'manchou de vermelho', 'manchou de azul', 'desbotou em', 'uma roupa na outra', 'roupa na outra', 'colorida na branca', 'colorida em roupa branca', 'colorida na roupa branca', 'roupa de cor na branca'], dica: 'Não seque a peça: o calor da secadora fixa o corante de vez.' },
    { id: 'desodorante', nome: 'Desodorante', familia: 'outras', sinonimos: ['desodorante', 'antitranspirante'], dica: 'Não passe a ferro sobre a mancha: o calor fixa desodorante e suor.' },
    { id: 'lama', nome: 'Lama ou terra', familia: 'outras', sinonimos: ['lama', 'barro', 'terra', 'poeira', 'areia'], dica: 'Não coloque na máquina com outras roupas: a terra espalha e encarde o resto.' },
    { id: 'amarelado', nome: 'Amarelado', familia: 'outras', sinonimos: ['amarelado', 'amarelada', 'amarelou', 'encardido', 'encardida', 'amarelamento', 'mancha amarela'], dica: 'Não use água sanitária: o cloro deixa o amarelado mais forte e enfraquece a fibra.' },
    { id: 'agua-sanitaria', nome: 'Água sanitária ou cloro', familia: 'outras', sinonimos: ['agua sanitaria', 'qboa', 'quiboa', 'candida', 'cloro', 'alvejante com cloro', 'descoloriu'], dica: 'Em peça colorida, o cloro deixa manchas claras que não voltam, como no jeans e na sarja; em peça branca, enfraquece a fibra. Na Dedicada, o alvejamento é à base de oxigênio, sem cloro.' },
    { id: 'amaciante', nome: 'Amaciante', familia: 'outras', sinonimos: ['amaciante', 'mancha de amaciante'] },
    { id: 'tinta-cabelo', nome: 'Tinta de cabelo ou henna', familia: 'outras', sinonimos: ['tinta de cabelo', 'tintura', 'tintura de cabelo', 'henna', 'hena', 'descolorante'] },
    { id: 'remedio', nome: 'Remédio ou pomada', familia: 'outras', sinonimos: ['remedio', 'xarope', 'pomada', 'iodo', 'mertiolate', 'merthiolate', 'noripurum', 'sulfato ferroso', 'antibiotico', 'nebacetin', 'violeta genciana', 'medicamento', 'povidine', 'betadine', 'hipoglos'] },
    { id: 'cera', nome: 'Cera de vela', familia: 'outras', sinonimos: ['vela', 'cera', 'cera de vela', 'parafina'] },
    { id: 'chiclete', nome: 'Chiclete', familia: 'outras', sinonimos: ['chiclete', 'goma de mascar', 'chicle'] },
    { id: 'pasta', nome: 'Pasta de dente', familia: 'outras', sinonimos: ['pasta de dente', 'creme dental'] },
    { id: 'queimado', nome: 'Marca de ferro ou queimado', familia: 'dano', sinonimos: ['queimado', 'queimou', 'queimei', 'queimada', 'ferro quente', 'passei ferro', 'passei o ferro', 'marca de ferro', 'ferro de passar', 'brilho de ferro', 'chamuscado', 'brilho'], dica: 'O calor achata a fibra, e em alguns tecidos a marca não sai. Da próxima vez, passe a vapor ou com um pano por cima.' },
    { id: 'encolheu', nome: 'Encolheu', familia: 'dano', sinonimos: ['encolheu', 'encolhida', 'encolhido', 'encolhimento', 'diminuiu', 'feltrou', 'feltragem', 'ficou pequena', 'ficou pequeno'], dica: 'Água quente e secadora são as causas mais comuns, e em muitos tecidos o encolhimento não tem volta na lavagem.' },
    { id: 'desbotou', nome: 'Desbotou ou perdeu a cor', familia: 'dano', sinonimos: ['desbotou', 'desbotada', 'desbotado', 'desbote', 'perdeu a cor', 'clareou', 'mancha clara', 'manchas claras'], dica: 'Álcool e água sanitária atacam o corante, e as manchas claras que eles deixam costumam não voltar.' },
    { id: 'bolinhas', nome: 'Bolinhas e pelos', familia: 'dano', sinonimos: ['bolinhas', 'bolinha', 'pelinhos', 'pilling'], dica: 'Não puxe as bolinhas com a mão nem com lâmina: pode furar ou abrir a malha.' },
    { id: 'cheiro', nome: 'Cheiro ruim', familia: 'dano', sinonimos: ['cheiro', 'fedor', 'odor', 'cheiro ruim', 'catinga', 'fedendo', 'cheirando mal'], dica: 'Deixe a peça arejar e não guarde úmida: cheiro de guardado costuma vir da umidade.' }
  ];

  /* ---------- Frases dos guias usadas em vários problemas ---------- */
  var F = {
    pano: 'Tire o excesso encostando um pano limpo, sem esfregar.',
    ateLevar: 'Até levar, deixe a peça arejar, longe do calor e fora de saco plástico.',
    mofoNaoEscovar: 'Não escove nem esfregue a área, para não espalhar o mofo.',
    mofoGuardar: 'Depois, guarde a peça limpa e seca, em local arejado e em capa de tecido, nunca de plástico.',
    levarMenos24: 'Leve a peça em menos de 24 horas.',
    levar24: 'Leve a peça em até 24 horas.',
    levar48: 'Leve a peça em até 48 horas.',
    levarLogo: 'Leve a peça quanto antes.',
    avaliar: 'Leve a peça para a equipe avaliar.',
    esfregar: 'Esfregar: o atrito espalha a mancha e pode tirar a cor.',
    quenteTanino: 'Água quente: ela fixa manchas de café, chá e vinho.',
    quenteProteina: 'Água quente: o calor fixa manchas de sangue, suor e comida.',
    calor: 'Ferro, secador de cabelo ou secadora antes de a mancha sair: o calor fixa a mancha.',
    plastico: 'Guardar a peça em capa plástica fechada.',
    umida: 'Guardar a peça ainda úmida.',
    sanitaria: 'Água sanitária ou alvejante com cloro.'
  };

  /* ---------- Grupos (mesma ordem da página central) ---------- */
  var GRUPOS = [
    { id: 'finas', nome: 'Festa e peças finas' },
    { id: 'inverno', nome: 'Inverno, couro e alfaiataria' },
    { id: 'dia', nome: 'Dia a dia' },
    { id: 'casa', nome: 'Casa' },
    { id: 'criancas', nome: 'Crianças' },
    { id: 'outras', nome: 'Outras peças e tecidos' }
  ];

  /* Processo das peças que ainda não têm guia próprio (só fatos gerais confirmados). */
  var PROCESSO_GERAL = [
    'Avaliação da peça e da etiqueta antes da lavagem.',
    'Mancha tratada antes da lavagem, com o tira-manchas da família dela, da linha Hydret da Seitz.',
    'Lavagem a seco com percloroetileno, wet cleaning com produtos Seitz ou lavagem em água, conforme a etiqueta e o tecido.',
    'Alvejamento, quando a peça pede, à base de oxigênio, sem cloro.'
  ];

  /* ---------- As 17 peças ----------
   * expresso: 'sim' | 'nao' | 'consultar' | texto próprio
   * caseiro: o que o guia manda evitar em casa, usado quando a mancha não está na tabela.
   * sinonimos: palavras que levam a esta peça na busca.
   */
  var PECAS = [
    {
      id: 'seda', grupo: 'finas', nome: 'Seda', exemplos: 'Vestidos e blusas de seda',
      sinonimos: ['seda', 'blusa de seda', 'vestido de seda', 'camisa de seda', 'cambraia'],
      guia: SITE + '/cuidados-seda/', assina: 'liliane',
      fala: 'Muita seda chega com mancha de bebida. Primeiro tiramos o álcool, lavamos a seco e depois em água, para sumir a sombra que a bebida deixa. Quando o tecido colorido fica com aqueles quebrados brancos, um amaciante concentrado da Seitz alinha de novo o brilho da fibra.',
      maquina: 'Não. Mesmo um ciclo rápido pode encolher ou deformar a peça de forma permanente.',
      maquinaNao: true,
      caseiro: ['Tira-manchas caseiro: produtos feitos para algodão são agressivos demais para a seda.', 'Torcer para tirar a água: a seda perde a forma e marca.'],
      processo: [
        'Remoção do álcool deixado por perfume ou bebida, antes de qualquer lavagem.',
        'Tira-manchas Seitz, escolhido conforme o tipo de mancha.',
        'Lavagem a seco com percloroetileno.',
        'Quando fica sombra de bebida, lavagem em água no programa da Seitz para seda: 16 °C, 22 minutos e pouca ação mecânica.',
        'Amaciante concentrado Seitz, quando a seda colorida tem quebrados brancos.',
        'Passadoria a vapor.'
      ],
      prazo: '2 dias; vestidos finos, 5 dias',
      preco: 'Blusa a partir de R$ 29,00; vestido a partir de R$ 65,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'vinho-tinto', nome: 'Vinho tinto', manchas: ['vinho'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Alto risco de fixação; nunca esfregar nem usar água quente.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levarMenos24, F.ateLevar],
          evitar: ['Esfregar, mesmo de leve: tira parte da cor e deixa uma marca esbranquiçada.', F.quenteTanino, F.calor],
          dedicada: 'O álcool é retirado primeiro; depois a seda é lavada a seco e, se ficar sombra, em água, no programa da Seitz para seda.'
        },
        {
          id: 'bebida-alcool', nome: 'Bebida com álcool', manchas: ['bebida'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Tira a cor e deixa sombra; sai com remoção do álcool, lavagem a seco e depois em água.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levar24, F.ateLevar],
          evitar: ['Esfregar, mesmo de leve: tira parte da cor e deixa uma marca esbranquiçada.', F.quenteTanino, F.calor],
          dedicada: 'Remoção do álcool antes de qualquer lavagem; depois, lavagem a seco e em água.'
        },
        {
          id: 'suor', nome: 'Suor e amarelamento', manchas: ['suor', 'amarelado'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O suor ataca e descolore a seda com o tempo, se não for tratado.',
          fazer: [F.levar24, F.ateLevar],
          evitar: ['Esperar para tratar: manchas de suor, sangue e comida se fixam com o tempo.', F.quenteProteina, F.calor]
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Ataca a seda com mais força que outras fibras e pode enfraquecer o tecido.',
          fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
          evitar: [F.umida, F.plastico]
        },
        {
          id: 'quebrados-brancos', nome: 'Quebrados brancos', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; tem tratamento',
          acontece: 'Áreas esbranquiçadas em seda colorida, por desalinhamento da fibra.',
          fazer: ['Leve a peça para tratar: não é mancha, é a fibra desalinhada refletindo a luz em várias direções.'],
          evitar: ['Esfregar ou lavar em casa: o atrito desalinha ainda mais a fibra.'],
          dedicada: 'Amaciante concentrado da Seitz, que alinha de novo as fibras e devolve o brilho uniforme.'
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas sem solução caseira',
          acontece: 'Vem de lavagem em água quente ou de secadora.',
          fazer: [F.avaliar],
          evitar: ['Água quente e secadora.']
        },
        {
          id: 'brilho-ferro', nome: 'Brilho de ferro', manchas: ['queimado'], nivel: 'dificil',
          urgencia: 'Sem urgência; difícil de reverter',
          acontece: 'O calor achata a fibra e cria um efeito espelhado.',
          fazer: ['Da próxima vez, passe a vapor ou com ferro morno e um pano por cima.'],
          evitar: ['Ferro direto no tecido.']
        }
      ]
    },
    {
      id: 'festa-noiva', grupo: 'finas', nome: 'Cetim e organza', exemplos: 'Vestidos de festa e de noiva',
      sinonimos: ['vestido de noiva', 'noiva', 'vestido de festa', 'festa', 'formatura', 'madrinha', 'cetim', 'organza', 'tule', 'zibeline', 'tafeta', 'vestido longo', 'casamento', 'renda', 'crepe', 'chiffon', 'musseline', 'shantung'],
      guia: SITE + '/cuidados-cetim-organza/', assina: 'liliane',
      fala: 'O vestido de noiva costuma chegar com a barra muito suja e manchas de comida e vinho. Fazemos a pré-lavagem, deixamos de molho e tratamos cada tipo de mancha com um protocolo próprio antes de lavar no programa da Seitz para noivas. Por isso o prazo é de 7 dias.',
      maquina: 'Não. Zibeline e tafetá perdem a estrutura, e a saia fica sem volume.',
      maquinaNao: true,
      caseiro: ['Demaquilante: cria uma segunda mancha, de óleo.', 'Borrifar perfume com o vestido já vestido: o álcool pode tirar a cor das pedrarias.'],
      processo: [
        'Teste de solidez da cor e proteção manual das pedrarias.',
        'Pré-lavagem manual, com as barras lavadas à mão.',
        'Molho e protocolos de manchas, com o tira-manchas certo para gordura, proteína e tanino.',
        'Duas ou três lavagens em wet cleaning, no programa da Seitz para vestidos de festa e de noiva.',
        'Lavagem a seco e secagem natural.',
        'Passadoria e um dia de descanso antes da embalagem, para dissipar a umidade e o calor do ferro.'
      ],
      prazo: 'Vestido de noiva, 7 dias; vestidos de festa e finos, 5 dias',
      preco: 'Sob consulta pelo WhatsApp, conforme o vestido',
      expresso: 'Vestido de festa tem expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. Se só precisa passar, é na hora, sem agendar.',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo (guarda prolongada)', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Frequente em vestidos de noiva guardados em capa ou caixa fechada.',
          fazer: ['Tire o vestido da capa plástica e deixe arejar.', F.mofoNaoEscovar, F.levarMenos24],
          evitar: ['Guardar em capa plástica fechada: é a principal causa de mofo em vestidos guardados.']
        },
        {
          id: 'suor', nome: 'Suor nas axilas', manchas: ['suor'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Ataca o corante e pode causar desbotamento irreversível na região.',
          fazer: [F.levar24, F.ateLevar],
          evitar: ['Esfregar: o dano do atrito costuma ser pior que a mancha.', F.quenteProteina, F.calor]
        },
        {
          id: 'maquiagem', nome: 'Maquiagem no decote (base, batom)', manchas: ['maquiagem', 'batom'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'Comum em vestidos de festa; nunca usar demaquilante em casa.',
          fazer: ['Leve o vestido para tratamento em até 48 horas.', F.ateLevar],
          evitar: ['Demaquilante líquido ou bifásico: os óleos criam uma segunda mancha, geralmente maior que a original.', 'Esfregar: o dano do atrito costuma ser pior que a mancha.']
        },
        {
          id: 'barra-comida-vinho', nome: 'Barra suja e manchas de comida e vinho', manchas: ['vinho', 'comida', 'lama'], nivel: 'logo',
          urgencia: 'Leve logo depois da festa',
          acontece: 'É o estado em que a maioria dos vestidos de noiva chega depois da festa; sai com pré-lavagem e protocolos de manchas.',
          fazer: [F.pano, 'Leve o vestido logo depois da festa.', F.ateLevar],
          evitar: ['Esfregar: o dano do atrito costuma ser pior que a mancha.', F.quenteTanino, 'Adiar a limpeza de bebidas e doces: o açúcar de drinks, sucos e caldas se fixa nas tramas finas.'],
          dedicada: 'Pré-lavagem à mão, molho e o tira-manchas certo para cada mancha, antes das lavagens no programa da Seitz para vestidos.'
        },
        {
          id: 'marcas-agua', nome: 'Marcas de água (auréolas)', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas não disfarçar em casa',
          acontece: 'Pede lavagem da peça inteira para uniformizar o tecido.',
          fazer: ['Leve o vestido para lavar inteiro.'],
          evitar: ['Tentar disfarçar a marca em casa.']
        },
        {
          id: 'pedrarias', nome: 'Pedrarias e paetês soltando cor', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urgência, mas avaliar antes de guardar',
          acontece: 'Pedem teste de solidez antes de qualquer lavagem.',
          fazer: ['Leve o vestido para avaliar antes de guardar.'],
          evitar: ['Borrifar perfume com o vestido já vestido: o álcool pode tirar a cor das pedrarias.'],
          dedicada: 'Teste de solidez da cor e proteção manual das pedrarias antes de qualquer lavagem.'
        },
        {
          id: 'saia-sem-volume', nome: 'Saia sem volume', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; não tente engomar em casa',
          acontece: 'Lavagem caseira errada deixa a peça murcha, sem estrutura.',
          fazer: [F.avaliar],
          evitar: ['Engomar em casa.', 'Lavar em casa com água e sabão.']
        }
      ]
    },
    {
      id: 'veludo', grupo: 'finas', nome: 'Veludo', exemplos: 'Blazers, calças e veludo cotelê',
      sinonimos: ['veludo', 'cotele', 'veludo cotele', 'veludo molhado'],
      guia: SITE + '/cuidados-veludo/', assina: 'liliane',
      fala: 'Veludo, lavamos com produtos Seitz e secamos ao natural. Se precisar passar, é só com o ferro a distância e em temperatura baixa. No fim, alinhamos o pelo numa só direção para o tecido não ficar rajado.',
      maquina: 'Só se a etiqueta permitir água: do avesso, em saco de proteção, em ciclo curto e com centrifugação breve.',
      maquinaNao: false,
      caseiro: ['Torcer para tirar a água: o pelo amassa e a peça perde a forma.', 'Secadora: o calor e o atrito do tambor achatam o pelo.'],
      processo: [
        'Avaliação da peça e da etiqueta antes da lavagem.',
        'Lavagem a seco, em percloroetileno, ou em água, com produtos Seitz, conforme a etiqueta.',
        'Secagem natural, sem secadora.',
        'Passadoria só quando necessária, com o ferro a distância e em temperatura baixa, sem encostar no pelo.',
        'Alinhamento do pelo numa só direção, para o tecido não ficar rajado.'
      ],
      prazo: 'Conforme a peça; consulte pelo WhatsApp',
      preco: 'Sob consulta pelo WhatsApp',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Pontos escuros e cheiro de guardado; na umidade de Florianópolis, aparece em peças guardadas sem ventilação.',
          fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
          evitar: [F.plastico, 'Escovar ou esfregar a área: espalha o mofo e marca o pelo.']
        },
        {
          id: 'marca-agua', nome: 'Marca de água', manchas: [], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: '“Marca de pisada” de uma gota que secou sozinha; molhar em volta piora.',
          fazer: ['Leve a peça logo para avaliação: quanto mais tempo o líquido seca sozinho, maior a chance de a marca ficar.'],
          evitar: ['Molhar em volta para disfarçar: a marca aumenta.']
        },
        {
          id: 'bebida-comida', nome: 'Mancha de bebida ou comida', manchas: ['vinho', 'cafe', 'cha', 'suco', 'refrigerante', 'bebida', 'comida', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Esfregar espalha a mancha e achata o pelo; retire o excesso encostando um pano, sem pressionar.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levar24, F.ateLevar],
          evitar: ['Esfregar: o pelo deita em outra direção e fica uma área brilhante.', F.calor]
        },
        {
          id: 'marca-ferro', nome: 'Marca de ferro', manchas: ['queimado'], nivel: 'sem_solucao',
          urgencia: 'Sem urgência; o dano não tem volta',
          acontece: 'Pelo esmagado pelo ferro encostado, liso e brilhante no formato da base.',
          fazer: ['Da próxima vez, use vapor pelo avesso, sem encostar, e penteie o pelo numa só direção com uma escova macia.'],
          evitar: ['Passar com o ferro encostado, mesmo com um pano por cima.']
        },
        {
          id: 'rajado', nome: 'Aspecto rajado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; alinhar o pelo resolve',
          acontece: 'Luz refletindo no pelo desalinhado; não é mancha nem desbote.',
          fazer: ['Leve a peça: depois da lavagem, o pelo é alinhado numa só direção.'],
          evitar: ['Escovar contra o pelo: para tirar poeira, escove de leve e sempre na direção do pelo.']
        },
        {
          id: 'brilho-joelho', nome: 'Brilho no joelho e no assento', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urgência; avaliar a peça',
          acontece: 'Pelo achatado pelo uso e pelo atrito, comum nas calças.',
          fazer: [F.avaliar],
          evitar: ['Passar com o ferro encostado.']
        },
        {
          id: 'marcas-dobra', nome: 'Marcas de dobra', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; vapor e alinhamento do pelo',
          acontece: 'Pelo achatado por guardar a peça dobrada sob peso.',
          fazer: ['Use vapor pelo avesso, sem encostar, e penteie o pelo numa só direção.'],
          evitar: ['Guardar dobrado sob peso.']
        }
      ]
    },
    {
      id: 'linho', grupo: 'finas', nome: 'Linho', exemplos: 'Camisas, blazers, calças e vestidos',
      sinonimos: ['linho', 'camisa de linho', 'calca de linho', 'blazer de linho', 'vestido de linho'],
      guia: SITE + '/cuidados-linho/', assina: 'liliane',
      fala: 'A maior parte do linho lavamos a seco, para não encolher. As camisas de linho vão para a água e secam ao natural, e a engomadoria devolve a estrutura, na peça inteira ou só nas partes que precisam.',
      maquina: 'Só se a etiqueta permitir água: do avesso, em água fria e ciclo delicado, com secagem à sombra e sem secadora.',
      maquinaNao: false,
      caseiro: ['Água sanitária: o cloro enfraquece a fibra do linho, e o tecido afina e pode furar.'],
      processo: [
        'Blazers, calças, vestidos e a maior parte das peças: lavagem a seco, em percloroetileno, para não encolher.',
        'Camisas de linho e peças muito sujas: lavagem em água, que ajuda a tirar as manchas.',
        'Tudo o que vai para a água seca ao natural, sem secadora.',
        'Peças brancas ou amareladas: alvejamento sem cloro.',
        'Camisas passadas no manequim e finalizadas à mão; blazers, calças e vestidos passados à mão, com ferro e banca profissional.'
      ],
      prazo: '2 dias; vestidos finos, 5 dias',
      preco: 'Camisa a partir de R$ 23,90; calça social, R$ 42,00; blazer, R$ 49,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Peça guardada úmida ou suada; na umidade de Florianópolis, aparece rápido.',
          fazer: [F.mofoNaoEscovar, F.levarMenos24, F.mofoGuardar],
          evitar: [F.umida, F.plastico]
        },
        {
          id: 'vinho-cafe-cha', nome: 'Vinho, café ou chá', manchas: ['vinho', 'cafe', 'cha'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O linho absorve rápido; água quente fixa a mancha.',
          fazer: [F.pano, F.levar24, F.ateLevar],
          evitar: ['Esfregar: a mancha esfregada deixa uma área clara ou marcada, que não tem conserto na lavagem.', F.quenteTanino, F.calor]
        },
        {
          id: 'amarelado-suor', nome: 'Amarelado de suor', manchas: ['suor', 'amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; alvejamento sem cloro',
          acontece: 'Suor e tempo guardado; água sanitária piora e enfraquece a fibra.',
          fazer: ['Para clarear, use alvejante sem cloro, se a etiqueta permitir, ou leve a peça.'],
          evitar: ['Água sanitária: o cloro enfraquece a fibra, e o tecido afina e pode furar.'],
          dedicada: 'Alvejamento sem cloro nas peças brancas ou amareladas.'
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Água quente ou secadora em linho não pré-encolhido.',
          fazer: ['Da próxima vez, siga a etiqueta: se ela permitir água, lave em água fria e seque à sombra.'],
          evitar: ['Água quente e secadora.']
        },
        {
          id: 'mudanca-cor', nome: 'Mudança de cor', manchas: ['desbotou'], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Linho tingido lavado em água, segundo a ANEL.',
          fazer: ['Da próxima vez, se a etiqueta tiver a tina com X, leve a peça para lavar a seco.'],
          evitar: ['Lavar em água o linho tingido cuja etiqueta proíbe água.']
        },
        {
          id: 'area-clara', nome: 'Área clara ou marcada', manchas: ['desbotou'], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Mancha esfregada.',
          fazer: ['Na próxima mancha, só encoste um pano limpo, sem esfregar, e leve a peça.'],
          evitar: ['Esfregar a mancha.']
        },
        {
          id: 'amassado', nome: 'Amassado duro', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; a passadoria profissional resolve',
          acontece: 'Peça que secou embolada ou na secadora.',
          fazer: ['Leve para passar: a passadoria profissional resolve.'],
          evitar: ['Secadora.']
        }
      ]
    },
    {
      id: 'alfaiataria', grupo: 'inverno', nome: 'Ternos e alfaiataria', exemplos: 'Ternos, blazers, calças sociais e gravatas',
      sinonimos: ['terno', 'ternos', 'blazer', 'paleto', 'calca social', 'gravata', 'smoking', 'alfaiataria', 'costume'],
      guia: SITE + '/cuidados-alfaiataria/', assina: 'jorge',
      fala: 'O terno vai para a lavagem a seco. Quando tem cheiro nas axilas, fazemos um tratamento específico que tira o odor e preserva a entretela, sem deixar bolhas no paletó.',
      maquina: 'Não. A água encolhe a lã e pode soltar a cola da entretela, criando bolhas no peito.',
      maquinaNao: true,
      caseiro: ['Encharcar o paletó: a água pode soltar a cola da entretela.'],
      processo: [
        'Lavagem a seco com percloroetileno, em máquinas italianas Firbimatic.',
        'Quando há cheiro nas axilas, um tratamento específico que tira o odor e preserva a entretela, sem deixar bolhas no paletó.',
        'Passadoria à mão, com ferro e banca profissional.',
        'Gravatas só na lavagem a seco, porque em geral são de seda.'
      ],
      prazo: '2 dias',
      preco: 'Terno a partir de R$ 91,00; paletó, R$ 49,00; calça social, R$ 42,00; gravata, R$ 35,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Terno guardado úmido ou em capa plástica; ataca a lã e a cola da entretela.',
          fazer: [F.mofoNaoEscovar, F.levarMenos24, 'Depois, guarde o terno limpo, em cabide de madeira de ombro largo e capa de tecido, com espaço no armário.'],
          evitar: ['Capa plástica fina: não deixa o tecido respirar e favorece o mofo.', 'Guardar o terno com suor: ele amarela e mofa.']
        },
        {
          id: 'suor-axilas', nome: 'Suor e cheiro nas axilas', manchas: ['suor', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O suor amarela e endurece o tecido com o tempo.',
          fazer: [F.levar24, 'Quem usa terno todo dia deve lavá-lo a seco a cada 15 a 20 dias.'],
          evitar: ['Encharcar o paletó.', F.calor],
          dedicada: 'Tratamento específico que tira o odor e preserva a entretela, sem deixar bolhas no paletó.'
        },
        {
          id: 'bolhas', nome: 'Bolhas no peito', manchas: [], nivel: 'dificil',
          urgencia: 'Muitas vezes não tem conserto',
          acontece: 'A cola da entretela soltou com água ou calor.',
          fazer: [F.avaliar],
          evitar: ['Água e calor no paletó.']
        },
        {
          id: 'brilho', nome: 'Brilho no tecido', manchas: ['queimado'], nivel: 'dificil',
          urgencia: 'Difícil de reverter',
          acontece: 'Ferro quente direto na lã escura achata a fibra.',
          fazer: ['Da próxima vez, passe com um pano por cima.'],
          evitar: ['Ferro quente direto na lã escura.']
        },
        {
          id: 'ombros', nome: 'Ombros deformados', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urgência; avaliar a peça',
          acontece: 'Cabide fino de arame ou de plástico estreito.',
          fazer: [F.avaliar, 'Use cabide de madeira de ombro largo, que segura a forma dos ombros.'],
          evitar: ['Cabide fino de arame ou de plástico estreito.']
        },
        {
          id: 'desgaste', nome: 'Desgaste e fios puxados', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Atrito entre as pernas da calça ou nos braços do paletó.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'la', grupo: 'inverno', nome: 'Lã', exemplos: 'Ternos, casacos e suéteres',
      sinonimos: ['la', 'casaco de la', 'la batida', 'sueter', 'pulover', 'cashmere', 'caxemira', 'trico', 'cardiga', 'cachecol', 'alpaca', 'merino', 'poncho'],
      guia: SITE + '/cuidados-la/', assina: 'jorge',
      fala: 'Casaco de lã batida e suéter vão para a lavagem a seco. Depois, tiramos à mão os pelos e as bolinhas, peça por peça.',
      maquina: 'Não, nem no ciclo delicado: a agitação com água morna ou quente feltra a fibra, e a peça encolhe sem volta.',
      maquinaNao: true,
      caseiro: ['Secadora: o calor acelera a feltragem.'],
      processo: [
        'Lavagem a seco com percloroetileno.',
        'Peças que pedem água vão para o wet cleaning, no programa da Seitz para lã: 28 °C, 25 minutos e pouca ação mecânica.',
        'Remoção de pelos e bolinhas à mão e com máquina própria.'
      ],
      prazo: '2 dias',
      preco: 'Agasalho de lã a partir de R$ 49,00; paletó, R$ 49,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'vinho', nome: 'Vinho tinto', manchas: ['vinho'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Esfregar quebra a maciez do fio; nunca esfregar.',
          fazer: [F.pano, F.levar24, F.ateLevar],
          evitar: ['Esfregar: quebra a maciez do fio.', F.quenteTanino, F.calor]
        },
        {
          id: 'suor', nome: 'Suor nas axilas (casacos e blazers)', manchas: ['suor'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Sais e proteínas amarelam e endurecem o tecido.',
          fazer: [F.levar24, F.ateLevar],
          evitar: [F.quenteProteina, F.calor]
        },
        {
          id: 'bolinhas', nome: 'Bolinhas e pelos (pilling)', manchas: ['bolinhas'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Desgaste natural do uso, mais comum em misturas com poliéster e acrílico.',
          fazer: ['Leve a peça: os pelos e as bolinhas são tirados à mão e com máquina própria, depois da lavagem.'],
          evitar: ['Puxar as bolinhas com a mão ou com lâmina: pode furar ou abrir a malha.']
        },
        {
          id: 'feltragem', nome: 'Encolheu e endureceu (feltragem)', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Dano físico; nenhum processo recupera.',
          fazer: ['Da próxima vez, nada de máquina de casa nem de secadora: leve a lã para lavar a seco.'],
          evitar: ['Máquina de casa, mesmo no ciclo delicado.', 'Secadora: o calor acelera a feltragem.']
        },
        {
          id: 'traca', nome: 'Furos de traça', manchas: [], nivel: 'atencao',
          urgencia: 'Pede cerzido depois da limpeza',
          acontece: 'As larvas comem a fibra em peças guardadas sujas.',
          fazer: ['Leve a peça para limpar; depois, o furo pede cerzido.', 'Guarde a lã sempre limpa e seca, em local ventilado.'],
          evitar: ['Guardar sem lavar na troca de estação.']
        },
        {
          id: 'bolhas', nome: 'Bolhas na entretela', manchas: [], nivel: 'dificil',
          urgencia: 'Muitas vezes irreversível',
          acontece: 'Bolhas no peito de blazers, por água ou calor errados.',
          fazer: [F.avaliar],
          evitar: ['Água e calor no blazer.']
        }
      ]
    },
    {
      id: 'jaquetas', grupo: 'inverno', nome: 'Jaquetas e sintéticos', exemplos: 'Jaquetas de pena, nylon, poliéster e PU, e roupa de neve',
      sinonimos: ['jaqueta de pena', 'jaqueta de nylon', 'jaqueta impermeavel', 'jaqueta sintetica', 'jaqueta corta vento', 'pena', 'puffer', 'corta vento', 'nylon', 'poliuretano', 'pu', 'couro sintetico', 'couro ecologico', 'roupa de neve', 'parka', 'impermeavel', 'capa de chuva', 'sintetico', 'fleece', 'polar'],
      guia: SITE + '/cuidados-sintetico/', assina: 'jorge',
      fala: 'Jaqueta de pena tem que sair daqui completamente seca. Secamos em temperatura baixa até as penas voltarem soltas para os gomos, porque pena que fica úmida pode mofar.',
      maquina: 'Nylon e poliéster, se a etiqueta permitir: zíperes fechados, do avesso, água fria, ciclo delicado e sem amaciante comum.',
      maquinaNao: false,
      caseiro: ['Removedor, querosene ou álcool na mancha: derretem o nylon e ressecam o poliuretano.', 'Amaciante comum: entope os poros da membrana impermeável e térmica.'],
      processo: [
        'Lavagem a seco ou em água, conforme a etiqueta; na água, em programa da Seitz.',
        'Jaqueta de pena: secagem completa em temperatura baixa, até as penas voltarem soltas para os gomos.',
        'Poliuretano: lavagem em água ou higienização só da superfície, e secagem natural. Se a peça já estiver descascando, o cliente é avisado antes.',
        'Conferência final: a jaqueta só sai completamente seca, porque pena úmida pode mofar.'
      ],
      prazo: '2 dias',
      preco: 'Jaqueta a partir de R$ 69,00; poliéster, R$ 99,00; pena, R$ 120,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo-pena', nome: 'Mofo no recheio de pena', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'A jaqueta foi guardada úmida e o recheio mofou por dentro dos gomos.',
          fazer: [F.levarMenos24, F.ateLevar],
          evitar: ['Guardar úmida em armário fechado: o recheio mofa e a peça pega cheiro.', 'Deixar a jaqueta de pena secando sozinha no varal: o recheio demora a secar e mofa.']
        },
        {
          id: 'penas-empelotadas', nome: 'Penas empelotadas', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; a secagem completa solta as penas',
          acontece: 'A pena molhou e secou mal; a jaqueta fica fina e perde o calor.',
          fazer: ['Leve a jaqueta: a secagem completa, em temperatura baixa, solta as penas.'],
          evitar: ['Secadora quente: derrete fitas das costuras, zíperes emborrachados e o nylon.']
        },
        {
          id: 'cheiro-suor', nome: 'Cheiro de suor preso', manchas: ['suor', 'cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas acumula',
          acontece: 'Suor acumulado no recheio e na membrana; o amaciante comum piora.',
          fazer: ['Leve a jaqueta para lavar antes de guardar.'],
          evitar: ['Amaciante comum: entope os poros da membrana.']
        },
        {
          id: 'descascando', nome: 'Poliuretano descascando', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'O revestimento envelheceu, ressecou e rachou.',
          fazer: ['Leve para avaliação: quando a peça já está descascando, a Dedicada avisa antes.'],
          evitar: ['Lavagem a seco em poliuretano: o solvente danifica o revestimento.']
        },
        {
          id: 'impermeabilidade', nome: 'Impermeabilidade perdida', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'A água para de escorrer e o tecido começa a encharcar, pelo desgaste do uso.',
          fazer: [F.avaliar],
          evitar: ['Amaciante comum: entope os poros da membrana.']
        },
        {
          id: 'fitas-derretidas', nome: 'Fitas e zíperes derretidos', manchas: ['queimado'], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Calor de secadora ou de ferro.',
          fazer: ['Da próxima vez, secadora só se a etiqueta permitir, e em temperatura baixa.'],
          evitar: ['Secadora quente ou ferro.']
        },
        {
          id: 'nylon-amarelado', nome: 'Nylon claro amarelado', manchas: ['amarelado'], nivel: 'atencao',
          urgencia: 'Sem urgência; avaliar a peça',
          acontece: 'Sol ou cloro, segundo a ANEL.',
          fazer: [F.avaliar],
          evitar: ['Secar nylon claro ao sol.', F.sanitaria]
        }
      ]
    },
    {
      id: 'couro', grupo: 'inverno', nome: 'Couro', exemplos: 'Jaquetas, calças e saias de couro, inclusive de moto',
      sinonimos: ['couro', 'jaqueta de couro', 'calca de couro', 'saia de couro', 'jaqueta de moto', 'couro liso'],
      guia: SITE + '/cuidados-couro/', assina: 'alejandro',
      fala: 'Das duas ou três peças de couro que chegam por dia, a maioria vem com mofo. Lavamos em wet cleaning, deixamos secar ao natural e só então hidratamos. Por isso o couro leva de 5 a 7 dias: pular a secagem estraga a peça.',
      maquina: 'Não: a estrutura do couro se danifica de forma irreparável.',
      maquinaNao: true,
      caseiro: ['Álcool ou água sanitária na mancha: os dois atacam o corante.', 'Graxa de sapato para disfarçar esfolados: costuma piorar o problema.'],
      processo: [
        'Lavagem e higienização em wet cleaning, com produtos Seitz, que removem o mofo e os cheiros fortes.',
        'Secagem natural, sem calor, até a peça secar por completo.',
        'Alguns minutos na secadora, só para amaciar o couro antes do hidratante.',
        'Hidratação, para devolver a maciez ao couro.'
      ],
      prazo: '5 a 7 dias',
      preco: 'Sob consulta pelo WhatsApp, conforme a peça',
      expresso: 'nao',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'No couro escuro, geralmente sai; no couro claro, pode deixar marca avermelhada, violeta ou esverdeada.',
          fazer: [F.levarMenos24, 'Depois, guarde a peça pendurada, em cabide de ombro largo e em local ventilado.'],
          evitar: ['Secar no sol forte ou perto de fonte de calor: enrijece e deforma o couro.', 'Guardar sem ventilação.']
        },
        {
          id: 'sangue-leite', nome: 'Sangue, leite e resíduos biológicos', manchas: ['sangue', 'leite', 'xixi', 'vomito'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Penetram e endurecem o couro; a maciez original pode não voltar totalmente.',
          fazer: [F.pano, F.levarMenos24],
          evitar: ['Álcool ou água sanitária: atacam o corante.', 'Lavar na máquina de casa.']
        },
        {
          id: 'vinho', nome: 'Vinho e bebidas alcoólicas', manchas: ['vinho', 'bebida', 'perfume'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Dissolvem o corante; a recuperação costuma ser parcial e pode ficar marca.',
          fazer: [F.pano, F.levar24],
          evitar: ['Álcool ou água sanitária: atacam o corante.', 'Esfregar.']
        },
        {
          id: 'gordura', nome: 'Gordura e graxa', manchas: ['gordura', 'graxa'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'A oleosidade sai, mas a marca escura pode continuar levemente.',
          fazer: [F.levar48],
          evitar: ['Álcool ou água sanitária: atacam o corante.', 'Graxa de sapato para disfarçar: costuma piorar o problema.']
        },
        {
          id: 'ferrugem', nome: 'Ferrugem (zíperes e fivelas)', manchas: ['ferrugem'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas não adiar muito',
          acontece: 'Melhora com tratamento técnico, mas pode não sair por completo.',
          fazer: ['Leve a peça sem adiar muito.'],
          evitar: ['Álcool ou água sanitária.']
        },
        {
          id: 'encolhimento-calor', nome: 'Encolhimento por calor', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Enrugamento por calor não tem correção.',
          fazer: ['Guarde o couro pendurado, em cabide de ombro largo, longe do calor.'],
          evitar: ['Secar no sol forte ou perto de fonte de calor.', 'Guardar dobrado ou amassado: com calor e pressão, o couro enruga de forma irreversível.']
        }
      ]
    },
    {
      id: 'peles', grupo: 'inverno', nome: 'Peles', exemplos: 'Casacos, coletes e golas de pele natural e sintética',
      sinonimos: ['pele', 'peles', 'casaco de pele', 'colete de pele', 'gola de pele', 'estola', 'pelo sintetico', 'pele sintetica', 'coelho', 'pele natural'],
      guia: SITE + '/cuidados-peles/', assina: 'jorge',
      fala: 'O que mais chega aqui é colete de pele sintética. Lavamos a seco ou em água, conforme a etiqueta, e depois penteamos o pelo. Na pele natural, também hidratamos o couro; a de coelho vai sempre a seco, porque encolhe na água.',
      maquina: 'Não, nem secadora: a agitação embaraça o pelo, e a secadora deforma a pelagem sintética e resseca o couro da pele natural.',
      maquinaNao: true,
      caseiro: ['Perfume ou desodorante direto na peça: o álcool pode manchar ou endurecer o material.'],
      processo: [
        'Avaliação da peça, principalmente das antigas: se o couro estiver ressecado, a Dedicada avisa os riscos antes de lavar.',
        'Lavagem a seco ou em wet cleaning, conforme a instrução de lavagem; pele de coelho, sempre a seco.',
        'Pelo penteado, para voltar ao volume.',
        'Hidratação do couro, na pele natural.'
      ],
      prazo: '7 dias',
      preco: 'A partir de R$ 280,00',
      expresso: 'consultar',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Peça guardada com umidade; aparece no couro, no forro e no pelo.',
          fazer: [F.levarLogo, F.mofoGuardar],
          evitar: [F.plastico, F.umida]
        },
        {
          id: 'cheiro-guardado', nome: 'Cheiro de guardado', manchas: ['cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; lave antes de usar',
          acontece: 'Meses no armário, sem ventilação.',
          fazer: ['Leve para lavar antes de usar.', 'Da próxima vez, lave antes de guardar, no fim do inverno.'],
          evitar: ['Guardar sem ventilação.']
        },
        {
          id: 'pelo-embaracado', nome: 'Pelo embaraçado ou amassado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; o pelo é penteado depois da lavagem',
          acontece: 'Uso, atrito e armazenamento apertado.',
          fazer: ['Leve a peça: o pelo é penteado depois da lavagem.'],
          evitar: ['Máquina de casa: a agitação embaraça o pelo.']
        },
        {
          id: 'couro-ressecado', nome: 'Couro ressecado ou duro', manchas: [], nivel: 'atencao',
          urgencia: 'Avaliar antes de lavar: pode rasgar',
          acontece: 'Tempo, calor e falta de hidratação na pele natural.',
          fazer: ['Leve para avaliação: nas peças antigas, a Dedicada avisa os riscos antes de lavar.'],
          evitar: ['Secadora ou calor.']
        },
        {
          id: 'perfume', nome: 'Mancha de perfume', manchas: ['perfume'], nivel: 'atencao',
          urgencia: 'Prevenção: perfume nunca direto na peça',
          acontece: 'O álcool mancha ou endurece o material.',
          fazer: [F.avaliar],
          evitar: ['Perfume ou desodorante direto na peça.']
        }
      ]
    },
    {
      id: 'camisas', grupo: 'dia', nome: 'Camisas e algodão', exemplos: 'Camisas, camisetas e polos',
      sinonimos: ['camisa', 'camisas', 'camiseta', 'polo', 'algodao', 'camisa social', 'colarinho', 'punho', 'blusa de algodao', 'regata', 'moletom'],
      guia: SITE + '/cuidados-algodao/', assina: 'alejandro',
      fala: 'Colarinho amarelado sai com branqueador óptico, escovação à mão e o programa de alta sujidade da Seitz. Depois a camisa vai para um manequim italiano da Trevil, que, segundo o fabricante, reduz em cerca de 80% o atrito do ferro; o ferro só finaliza colarinho e punhos.',
      maquina: 'Sim, conforme a etiqueta: desabotoada, sem torcer e sem água quente nas coloridas.',
      maquinaNao: false,
      caseiro: ['Água sanitária: deixa o amarelado mais forte e enfraquece a fibra.', 'Secadora com a peça manchada: o calor fixa a mancha e o corante de vez.'],
      processo: [
        'Escovação à mão de colarinho e punhos, com branqueador óptico.',
        'Só nas camisas muito amareladas e com gordura no colarinho, nos punhos ou nas axilas: lavagem a seco antes e uma pasta própria, que age de um dia para o outro.',
        'Lavagem em água no programa de alta sujidade da Seitz, com alvejamento à base de oxigênio, sem cloro.',
        'Passadoria no manequim italiano Trevil, que passa a camisa com vapor e ar quente, sem o ferro sobre o tecido.',
        'Ferro só para finalizar colarinho e punhos.'
      ],
      prazo: '2 dias',
      preco: 'Camisa a partir de R$ 23,90; camiseta, R$ 18,90; alvejamento sem cloro, R$ 12,00 por peça',
      expresso: 'sim',
      problemas: [
        {
          id: 'cor-outra-peca', nome: 'Cor de outra peça', manchas: ['cor'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'O algodão absorve corante solto com facilidade; a secadora fixa.',
          fazer: [F.levarMenos24, 'Não seque a peça: deixe como está até levar.'],
          evitar: ['Secadora: o calor fixa o corante de vez.', 'Misturar de novo peças de cor forte com as brancas.']
        },
        {
          id: 'colarinho', nome: 'Colarinho e punho amarelados', manchas: ['suor', 'amarelado'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'Suor e oleosidade oxidados; repassar a ferro sem lavar fixa a mancha.',
          fazer: ['Molhe a área, aplique detergente, esfregue com escova macia e lave com alvejante à base de oxigênio, se a etiqueta permitir.', 'Só passe a ferro depois de a mancha sair.', 'Se o amarelado for forte e com gordura, leve a camisa.'],
          evitar: ['Água sanitária: deixa o amarelado mais forte e enfraquece a fibra.', 'Repassar a camisa usada: o ferro fixa o suor e o amarelado a cada vez.'],
          dedicada: 'Branqueador óptico, escovação à mão e o programa de alta sujidade da Seitz. Nas camisas muito amareladas e com gordura: lavagem a seco antes da água e uma pasta que age de um dia para o outro.'
        },
        {
          id: 'desodorante', nome: 'Mancha de desodorante', manchas: ['desodorante'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'Sais de alumínio e suor deixam marca amarelada e endurecem o tecido das axilas.',
          fazer: ['Trate antes de passar a ferro: esfregue a axila com detergente e escova macia e lave com alvejante à base de oxigênio, se a etiqueta permitir.', 'Marca antiga, que já endureceu o tecido, pede tratamento profissional.'],
          evitar: ['Passar a ferro sobre a mancha: o calor fixa desodorante e suor.'],
          dedicada: 'Quando as axilas estão muito amareladas e com gordura, a camisa vai antes para a lavagem a seco, e as axilas recebem a mesma pasta do colarinho.'
        },
        {
          id: 'alaranjada', nome: 'Mancha alaranjada', manchas: ['protetor'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'Protetor solar que reage com minerais da água; o cloro fixa a mancha.',
          fazer: [F.levar48],
          evitar: ['Água sanitária: fixa a mancha.', 'Passar a ferro antes de tratar.']
        },
        {
          id: 'puidos', nome: 'Colarinho e punho puídos', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem urgência; não tem conserto na lavagem',
          acontece: 'Desgaste pelo atrito do uso e do ferro nas bordas do tecido.',
          fazer: ['Da próxima vez, evite repassar a camisa usada e o ferro forte nas bordas.'],
          evitar: ['Água sanitária: com o tempo, o cloro enfraquece a fibra, e o colarinho fica puído antes do resto da camisa.']
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem urgência; não tem volta na lavagem',
          acontece: 'Água quente e secadora, principalmente na malha.',
          fazer: ['Da próxima vez, use a temperatura da etiqueta e seque no cabide ou no varal, à sombra.'],
          evitar: ['Água quente e secadora.']
        },
        {
          id: 'bolinhas', nome: 'Bolinhas', manchas: ['bolinhas'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Desgaste do fio, comum em misturas com poliéster.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'jeans', grupo: 'dia', nome: 'Jeans e sarja', exemplos: 'Calças jeans e de sarja',
      sinonimos: ['jeans', 'calca jeans', 'sarja', 'calca de sarja', 'bermuda jeans', 'short jeans', 'jaqueta jeans', 'saia jeans'],
      guia: SITE + '/cuidados-jeans-sarja/', assina: 'alejandro',
      fala: 'A pergunta que mais ouvimos é como lavar sem desbotar. Lavamos em água fria, no wet cleaning, e, quando a peça permite, a seco, sem água nenhuma.',
      maquina: 'Sim: do avesso, em água fria, longe das roupas claras e sem lotar a máquina.',
      maquinaNao: false,
      caseiro: ['Alvejante com cloro em jeans ou sarja colorida: deixa manchas claras que não voltam.'],
      processo: [
        'Leitura da etiqueta e da composição, que decide entre a água e a lavagem a seco.',
        'Manchas tratadas antes da lavagem, com o produto certo para cada família: gordura e graxa, manchas orgânicas ou manchas vegetais, como a grama.',
        'Lavagem em água fria, no wet cleaning: no programa da Seitz para peças coloridas, a água não passa de 30 °C.',
        'Lavagem a seco, sem água, sempre que a etiqueta e a composição permitem.'
      ],
      prazo: '2 dias',
      preco: 'Calça esporte ou jeans a partir de R$ 29,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'graxa', nome: 'Graxa de bicicleta ou moto', manchas: ['graxa'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Precisa de produto próprio antes da água; esfregar com detergente tira a cor.',
          fazer: [F.levar24, 'Não molhe antes: a graxa precisa de um produto próprio antes de qualquer contato com água.'],
          evitar: ['Esfregar com detergente: a fricção tira o corante e deixa a área clara.']
        },
        {
          id: 'grama', nome: 'Grama nos joelhos e na barra', manchas: ['grama'], nivel: 'media',
          urgencia: 'Média (48h)',
          acontece: 'A clorofila age como corante; esfregar com força desbota o jeans em volta.',
          fazer: [F.levar48],
          evitar: ['Esfregar com força: desbota o jeans em volta.']
        },
        {
          id: 'barro', nome: 'Barro e lama', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas não misture na máquina',
          acontece: 'Se a peça for direto para a máquina, a terra espalha e encarde o resto.',
          fazer: ['Lave separada das outras peças, ou leve à Dedicada.'],
          evitar: ['Colocar direto na máquina com outras roupas.']
        },
        {
          id: 'desbote', nome: 'Desbote', manchas: ['desbotou'], nivel: 'atencao',
          urgencia: 'Prevenção',
          acontece: 'O corante fica na superfície do fio e sai a cada lavagem.',
          fazer: ['Lave do avesso, em água fria, longe das roupas claras e sem lotar a máquina.'],
          evitar: ['Lavar jeans escuro novo com roupas claras: a cor passa para as outras peças.']
        },
        {
          id: 'riscos-brancos', nome: 'Riscos brancos', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Quebra do corante por lavar muitas calças com pouca água.',
          fazer: ['Da próxima vez, não lote a máquina.'],
          evitar: ['Lotar a máquina.']
        },
        {
          id: 'elastano', nome: 'Calça frouxa, sem elasticidade', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Elastano danificado por secadora ou ferro muito quentes.',
          fazer: ['Da próxima vez, passe pelo avesso, com o ferro em temperatura média, e evite a secadora quente.'],
          evitar: ['Secadora quente ou ferro no máximo em calça com elastano.']
        },
        {
          id: 'rasgo', nome: 'Rasgo no entrepernas', manchas: [], nivel: 'atencao',
          urgencia: 'Costure antes de lavar, para não abrir mais',
          acontece: 'Desgaste do atrito, mais comum em jeans fino com elastano.',
          fazer: ['Costure antes de lavar, para não abrir mais.'],
          evitar: []
        }
      ]
    },
    {
      id: 'tenis', grupo: 'dia', nome: 'Tênis e calçados', exemplos: 'Tênis de tecido, lona, sintético e couro',
      sinonimos: ['tenis', 'calcado', 'calcados', 'sapato', 'sapatenis', 'all star', 'sola', 'palmilha'],
      guia: SITE + '/cuidados-tenis-calcados/', assina: 'alejandro',
      fala: 'O tênis é lavado à mão, com uma pasta especial que tira a sujeira e o cheiro, e seca ao natural. Também higienizamos tênis de couro, que não podem ir na água.',
      maquina: 'Não: a centrifugação solta partes coladas e deforma o calçado.',
      maquinaNao: true,
      caseiro: ['Acetona em detalhes sintéticos: dissolve o material e tira a cor na hora.', 'Mergulhar tênis de couro na água: o couro resseca e mancha.'],
      processo: [
        'Molho de 24 horas, para soltar a sujeira mais funda.',
        'Escovação à mão do corpo, da sola e dos cadarços, com uma pasta especial que tira a sujeira e o cheiro.',
        'Lavagem em wet cleaning, com controle da ação mecânica.',
        'Branqueamento.',
        'Secagem natural, sem secadora. O tênis de couro, que não pode ir na água, é higienizado à mão.'
      ],
      prazo: '3 dias',
      preco: 'A partir de R$ 85,00',
      expresso: 'nao',
      problemas: [
        {
          id: 'graxa-oleo', nome: 'Graxa e óleo', manchas: ['graxa', 'gordura'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram rápido nos poros do tecido, do couro e da borracha.',
          fazer: [F.levar24],
          evitar: ['Esfregar com detergente.', 'Acetona em detalhes sintéticos.']
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Tênis guardado úmido, comum na umidade de Florianópolis.',
          fazer: [F.levar24, 'Depois, guarde o tênis seco por dentro.'],
          evitar: ['Guardar úmido: o tênis pega cheiro e mofa por dentro.']
        },
        {
          id: 'lama', nome: 'Lama e terra', manchas: ['lama'], nivel: 'media',
          urgencia: 'Média urgência (48h)',
          acontece: 'Terra que seca endurece no tecido e fica presa na trama.',
          fazer: ['Bata e escove a sujeira seca, antes de molhar.', F.levar48],
          evitar: ['Máquina de lavar: descola biqueiras e solados e deforma o cabedal.']
        },
        {
          id: 'cheiro', nome: 'Cheiro forte', manchas: ['suor', 'cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência, mas acumula',
          acontece: 'Bactérias do suor na palmilha e no forro.',
          fazer: ['Lave a palmilha separada e deixe o tênis secar por completo por dentro.'],
          evitar: ['Guardar úmido.']
        },
        {
          id: 'sola-amarelada', nome: 'Sola amarelada', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; parte pode não voltar',
          acontece: 'A borracha branca oxida com o tempo e o uso.',
          fazer: ['Leve o tênis: o branqueamento faz parte da lavagem.'],
          evitar: ['Palha de aço ou esponja abrasiva: riscam o relevo da borracha.']
        },
        {
          id: 'cola-solta', nome: 'Cola solta e tênis deformado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Máquina de lavar, secadora ou calor.',
          fazer: ['Da próxima vez, seque em local ventilado, com papel dentro, sem secadora nem secador de cabelo.'],
          evitar: ['Máquina de lavar, secadora ou calor.']
        }
      ]
    },
    {
      id: 'roupa-de-cama', grupo: 'casa', nome: 'Roupa de cama e toalhas', exemplos: 'Lençóis, toalhas, mantas e capas de sofá',
      sinonimos: ['lencol', 'lencois', 'fronha', 'toalha de banho', 'toalha de rosto', 'roupao', 'roupa de cama', 'manta', 'colcha de croche', 'capa de sofa', 'almofada', 'protetor de colchao', 'enxoval', 'airbnb'],
      guia: SITE + '/cuidados-roupa-de-cama/', assina: 'liliane',
      fala: 'Lençóis, fronhas e toalhas vão sempre para a água, no ciclo de enxoval da Seitz; só o lençol de seda vai a seco. As toalhas passam por duplo alvejamento, e os lençóis saem passados e embalados por jogo, prontos para usar ou guardar.',
      maquina: 'Sim, na temperatura da etiqueta; lençol de seda, não.',
      maquinaNao: false,
      caseiro: ['Água sanitária: prefira alvejante à base de oxigênio nas peças brancas.'],
      processo: [
        'Lençóis, fronhas e toalhas: ciclo de enxoval da Seitz, sempre em água; lençol de seda, só a seco.',
        'Toalhas: duplo alvejamento sem cloro; depois, secas, dobradas e embaladas.',
        'Lençóis e fronhas: passados e embalados por jogo.',
        'Capas de sofá e de almofada: lavagem, alvejamento e secagem natural, para não encolher.'
      ],
      prazo: '3 dias',
      preco: 'Lençóis a partir de R$ 44,00 o quilo; toalha de banho, R$ 14,00; rosto, piso ou mão, R$ 8,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'toalha-mofo', nome: 'Toalha com cheiro de mofo', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Guardada úmida; o fungo enfraquece a felpa.',
          fazer: [F.levar24, 'Depois, seque a toalha por completo antes de guardar.'],
          evitar: ['Guardar a toalha úmida.']
        },
        {
          id: 'lencol-amarelado', nome: 'Lençol amarelado', manchas: ['amarelado', 'suor'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; alvejante à base de oxigênio',
          acontece: 'Suor e oleosidade oxidados, ou tempo guardado.',
          fazer: ['Use alvejante à base de oxigênio nas peças brancas, se a etiqueta permitir.', 'Lave toda semana e não guarde a roupa de cama úmida.'],
          evitar: ['Água sanitária.']
        },
        {
          id: 'bambu-amarelado', nome: 'Lençol de bambu amarelado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; lavar sempre em temperatura baixa',
          acontece: 'Calor na lavagem ou na secagem.',
          fazer: ['Lave sempre em temperatura baixa, em ciclo delicado e sem secadora quente.'],
          evitar: ['Água quente e secadora quente.']
        },
        {
          id: 'toalha-aspera', nome: 'Toalha áspera que não absorve', manchas: ['amaciante'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Excesso de amaciante ou de sabão nos fios.',
          fazer: ['Use pouco amaciante e seque a toalha por completo antes de guardar.'],
          evitar: ['Excesso de amaciante: deixa uma película que impede a toalha de absorver.']
        },
        {
          id: 'capa-encolhida', nome: 'Capa de sofá encolhida', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Não tem volta na lavagem',
          acontece: 'Calor da secadora.',
          fazer: ['Da próxima vez, seque a capa ao natural.'],
          evitar: ['Secadora.']
        },
        {
          id: 'protetor-rachado', nome: 'Protetor impermeável rachado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Não tem conserto na lavagem',
          acontece: 'Calor forte na secagem ou no ferro.',
          fazer: ['Da próxima vez, lave em água, seguindo a etiqueta, e seque sem calor forte.'],
          evitar: ['Calor forte na secagem ou no ferro.']
        },
        {
          id: 'ferrugem', nome: 'Mancha de ferrugem', manchas: ['ferrugem'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; nunca usar cloro',
          acontece: 'Contato com molas ou estrado de metal; água sanitária escurece a mancha.',
          fazer: [F.avaliar],
          evitar: ['Água sanitária: escurece a mancha.']
        }
      ]
    },
    {
      id: 'edredom', grupo: 'casa', nome: 'Edredom', exemplos: 'Edredons, colchas e cobertores, inclusive de pena',
      sinonimos: ['edredom', 'edredon', 'edredons', 'colcha', 'cobertor', 'duvet', 'edredom de pena', 'coberta'],
      guia: SITE + '/cuidados-edredom/', assina: 'liliane',
      fala: 'Todo edredom passa por remoção manual de manchas, e os claros, por um ciclo de duplo alvejamento sem cloro. O de pena, quando vai para a água, fica de 2 a 3 horas na secadora, até as penas secarem por completo.',
      maquina: 'Casal e king não cabem direito: sem espaço para girar, a manta interna rasga e o enchimento embola.',
      maquinaNao: false,
      caseiro: ['Água sanitária: o cloro amarela o poliéster e pode mudar a cor de bordados.'],
      processo: [
        'Remoção manual de manchas antes da lavagem.',
        'Lavagem em máquinas industriais Girbau e Electrolux, nos programas da Seitz para edredom: 40 °C para os claros e 30 °C para os coloridos.',
        'Duplo alvejamento sem cloro nos edredons claros; os coloridos e estampados lavam sem alvejamento.',
        'Higienização com ácido peracético, desinfetante de uso hospitalar que age contra fungos, bactérias e percevejos.',
        'Edredom de pena: a seco ou em água; na água, de 2 a 3 horas de secadora, em média, até as penas secarem por completo.',
        'Edredom usado pelo pet: lavadora reservada só para peças de animais, nas duas lojas.'
      ],
      prazo: '2 dias',
      preco: 'Solteiro a partir de R$ 69,00; casal, R$ 94,00; king, R$ 110,00; pena, R$ 190,00',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo e cheiro de guardado', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente: lave logo',
          acontece: 'Umidade presa no enchimento, comum no clima de Florianópolis.',
          fazer: [F.levarLogo, 'Depois, lave sempre antes de guardar.'],
          evitar: [F.plastico, F.umida]
        },
        {
          id: 'xixi', nome: 'Xixi de criança ou de pet', manchas: ['xixi'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'A urina entra no enchimento, e o cheiro volta com a umidade.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina],
          dedicada: 'Edredom usado pelo pet vai para uma lavadora reservada só para peças de animais, nas duas lojas.'
        },
        {
          id: 'percevejos', nome: 'Percevejos', manchas: [], nivel: 'urgente',
          urgencia: 'Urgente',
          acontece: 'Escondem-se nas costuras e voltam se a peça não for higienizada.',
          fazer: [F.levarLogo],
          evitar: [],
          dedicada: 'Higienização com ácido peracético, desinfetante de uso hospitalar que age contra fungos, bactérias e percevejos.'
        },
        {
          id: 'amarelado', nome: 'Amarelado', manchas: ['amarelado', 'suor'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência; alvejante sem cloro',
          acontece: 'Suor e oleosidade oxidam com o tempo; o cloro piora no poliéster.',
          fazer: ['Use alvejante à base de oxigênio, se a etiqueta permitir, ou leve o edredom.'],
          evitar: ['Água sanitária: o cloro amarela o poliéster e pode mudar a cor de bordados.'],
          dedicada: 'Duplo alvejamento sem cloro nos edredons claros.'
        },
        {
          id: 'pelos', nome: 'Pelos de animais', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Os pelos se prendem no tecido e entram no enchimento.',
          fazer: ['Lave o edredom do pet a cada 2 meses.'],
          evitar: []
        },
        {
          id: 'embolado', nome: 'Enchimento embolado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Manta rasgada e costura rompida por lavagem em máquina pequena.',
          fazer: ['Da próxima vez, edredom de casal ou king vai para máquina industrial.'],
          evitar: ['Lavar edredom grande na máquina de casa.']
        },
        {
          id: 'manta-bolinhas', nome: 'Manta sem volume, com bolinhas', manchas: ['bolinhas'], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Desgaste natural da manta de poliéster com o uso e as lavagens.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'cortinas', grupo: 'casa', nome: 'Cortinas', exemplos: 'Voal, linho, algodão e blackout lavável',
      sinonimos: ['cortina', 'cortinas', 'voal', 'blackout', 'blecaute'],
      guia: SITE + '/cuidados-cortinas/', assina: 'jorge',
      fala: 'Nas cortinas, esfregamos as barras à mão, lavamos em ciclo próprio e secamos ao natural. Blackout, só lavamos quando o tecido é lavável: a maioria fica pegajosa ou quebradiça.',
      maquina: 'Voal e poliéster leves, se a etiqueta permitir: água fria, ciclo delicado, sem centrifugação forte; linho, blackout e cortinas grandes, não.',
      maquinaNao: false,
      caseiro: ['Secadora.'],
      processo: [
        'Avaliação do tecido: blackout só é lavado quando o tecido é lavável.',
        'Barras esfregadas à mão antes da lavagem.',
        'Wet cleaning em ciclo próprio para cortinas, nos programas da Seitz: 30 °C para sujidade leve e 40 °C para barras muito sujas, amarelado e poeira.',
        'Cortinas de linho que não foram pré-encolhidas vão para a lavagem a seco.',
        'Remoção de mofo, quando possível.',
        'Secagem natural, sem secadora. A Dedicada não tira nem coloca a cortina no trilho.'
      ],
      prazo: '3 a 4 dias',
      preco: 'Conforme o tecido, o tamanho e a forma de lavagem; orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Umidade na janela e cortina encostada no vidro.',
          fazer: [F.levarLogo, 'Deixe a cortina fora do trilho no dia da coleta.'],
          evitar: ['Deixar a cortina encostada no vidro úmido.'],
          dedicada: 'Remoção de mofo, quando possível, antes do ciclo próprio para cortinas.'
        },
        {
          id: 'barras', nome: 'Barras encardidas', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Poeira e sujeira do chão se acumulam na parte de baixo.',
          fazer: ['Leve a cortina: as barras são esfregadas à mão antes da lavagem.'],
          evitar: []
        },
        {
          id: 'amarelado', nome: 'Amarelado ou acinzentado', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Sol, poeira e fumaça mudam a cor do tecido com o tempo.',
          fazer: ['Lave as cortinas a cada 6 meses, e com mais frequência em casas com pets, fumantes ou janela para rua movimentada.'],
          evitar: []
        },
        {
          id: 'cheiro', nome: 'Cheiro de cigarro ou de fritura', manchas: ['cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'O tecido absorve a fumaça e a gordura do ar.',
          fazer: [F.avaliar],
          evitar: []
        },
        {
          id: 'blackout', nome: 'Revestimento do blackout soltando', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solução',
          acontece: 'Sol, calor e lavagem inadequada quebram a camada do avesso.',
          fazer: ['Antes de lavar outro blackout, confirme se o tecido é lavável.'],
          evitar: ['Lavar blackout que não é lavável.']
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solução, apenas prevenção',
          acontece: 'Linho ou algodão sem pré-encolhimento lavado em água.',
          fazer: ['Da próxima vez, cortina de linho que não foi pré-encolhida vai para a lavagem a seco.'],
          evitar: ['Lavar em água linho ou algodão sem pré-encolhimento.']
        }
      ]
    },
    {
      id: 'pelucias', grupo: 'criancas', nome: 'Pelúcias e fantasias', exemplos: 'Bichos de pelúcia e fantasias, inclusive de mascote',
      sinonimos: ['pelucia', 'pelucias', 'bicho de pelucia', 'ursinho', 'urso', 'boneco', 'fantasia', 'mascote', 'naninha'],
      guia: SITE + '/cuidados-pelucias-fantasias/', assina: 'liliane',
      fala: 'Escovamos a pelúcia à mão antes do wet cleaning e secamos ao natural, sem secadora. Nas fantasias de mascote, a cabeça e o corpo com estrutura não vão para a máquina: higienizamos à mão e secamos ao sol.',
      maquina: 'Pelúcias pequenas e sem estrutura às vezes aceitam ciclo delicado com água fria, se a etiqueta permitir; secadora, nunca.',
      maquinaNao: false,
      caseiro: ['Secadora: o calor deforma o pelo sintético.'],
      processo: [
        'Conferência do tamanho (até 1 metro de altura por 40 a 50 cm de largura) e das peças eletrônicas, que precisam ser retiradas.',
        'Escovação manual do pelo, para soltar a sujeira.',
        'Lavagem em wet cleaning.',
        'Secagem natural, sem secadora.',
        'Nas fantasias, as partes laváveis vão para o wet cleaning; cabeças e corpos com estrutura recebem limpeza manual e higienização com Odorsorb.'
      ],
      prazo: 'Pelúcia, 3 dias; fantasia, 5 dias em média',
      preco: 'Pelúcia a partir de R$ 80,00; fantasia, R$ 180,00 (simples) e R$ 390,00 (com cabeça e corpo estruturados)',
      expresso: 'consultar',
      problemas: [
        {
          id: 'xixi-vomito-leite', nome: 'Xixi, vômito ou leite', manchas: ['xixi', 'vomito', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram no enchimento, e o cheiro volta com a umidade.',
          fazer: [F.pano, F.levar24],
          evitar: ['Secadora: o calor deforma o pelo sintético.', F.quenteProteina]
        },
        {
          id: 'mofo', nome: 'Mofo na pelúcia', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Pelúcia guardada com umidade; o enchimento segura a água.',
          fazer: [F.levarLogo, 'Depois de lavar, guarde a pelúcia seca, em lugar ventilado.'],
          evitar: ['Guardar em armário ou caixa fechada.']
        },
        {
          id: 'amarelado', nome: 'Amarelado de tempo', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Poeira, mãos e tempo de guardado mudam a cor do pelo.',
          fazer: ['Leve a pelúcia para lavar.'],
          evitar: []
        },
        {
          id: 'suor-mascote', nome: 'Suor na fantasia de mascote', manchas: ['suor'], nivel: 'atencao',
          urgencia: 'Higienize depois de cada evento',
          acontece: 'Cabeça e corpo acumulam o suor de quem veste.',
          fazer: ['Leve a fantasia para higienizar depois de cada evento.'],
          evitar: ['Colocar cabeça e corpo com estrutura na máquina.'],
          dedicada: 'Cabeças e corpos com estrutura recebem limpeza manual e higienização com Odorsorb, e secam ao sol.'
        },
        {
          id: 'pedrarias', nome: 'Pedrarias e lantejoulas soltando', manchas: [], nivel: 'atencao',
          urgencia: 'Prevenção: nada de máquina de casa',
          acontece: 'Agitação e calor em fantasias de festa lavadas em casa.',
          fazer: [F.avaliar],
          evitar: ['Máquina de casa.']
        }
      ]
    },
    {
      id: 'carrinho', grupo: 'criancas', nome: 'Carrinho de bebê', exemplos: 'Carrinho e bebê conforto, lavados à mão',
      sinonimos: ['carrinho', 'carrinho de bebe', 'bebe conforto', 'cadeirinha', 'moises', 'cadeira de carro'],
      guia: SITE + '/cuidados-carrinho-de-bebe/', assina: 'alejandro',
      fala: 'Desmontamos o carrinho inteiro e lavamos à mão a capa e a estrutura; os cintos são higienizados por fora, sem encharcar. A secagem é natural, com ventilador profissional, e depois montamos de novo. Se for para guardar, entregamos desmontado.',
      maquina: 'Estrutura, não; capas, conforme a etiqueta e o manual.',
      maquinaNao: false,
      caseiro: ['Mangueira na estrutura: a água parada oxida o metal e danifica os rolamentos.'],
      processo: [
        'Desmontagem completa do carrinho ou do bebê conforto.',
        'Lavagem manual da capa e da estrutura.',
        'Higienização dos cintos de segurança por fora, sem encharcar.',
        'Secagem natural, com ajuda de ventilador profissional, até tudo secar por completo.',
        'Montagem de novo, ou entrega desmontado, que é o ideal para guardar.'
      ],
      prazo: '7 dias',
      preco: 'Carrinho a partir de R$ 390,00; bebê conforto, R$ 290,00',
      expresso: 'consultar',
      problemas: [
        {
          id: 'vomito-leite', nome: 'Vômito e leite', manchas: ['vomito', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Azedam e entram na espuma do assento.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina]
        },
        {
          id: 'xixi', nome: 'Xixi ou fralda vazada', manchas: ['xixi'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram no acolchoado e deixam cheiro.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina]
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Carrinho guardado úmido ou em lugar fechado; aparece no tecido, nas espumas e nas costuras.',
          fazer: [F.levarLogo, 'Depois, guarde o carrinho seco, em lugar ventilado.'],
          evitar: ['Guardar úmido ou em lugar fechado.']
        },
        {
          id: 'comida', nome: 'Restos de comida', manchas: ['comida'], nivel: 'media',
          urgencia: 'Média',
          acontece: 'Acumulam nas costuras, no cesto e nos cantos da estrutura.',
          fazer: [F.levar48],
          evitar: []
        },
        {
          id: 'terra', nome: 'Terra e poeira da rua', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urgência',
          acontece: 'Rodas, cesto e barra da capa acumulam sujeira.',
          fazer: ['Com uso frequente, lave a cada 15 a 30 dias.'],
          evitar: []
        },
        {
          id: 'cheiro-guardado', nome: 'Cheiro de guardado', manchas: ['cheiro'], nivel: 'atencao',
          urgencia: 'Lave antes de usar de novo',
          acontece: 'Umidade presa nas espumas depois de meses parado.',
          fazer: ['Lave antes de usar de novo.'],
          evitar: []
        }
      ]
    },

    /* ---------- Peças sem guia próprio (grupo "outras") ----------
     * semGuia: o botão leva à página central de Cuidados por Tecido e não há fala nem tabela de
     * problemas. Qualquer mancha é resolvida pela família dela. nota: fato do tecido com fonte.
     * leia: chaves de BLOG. Quando houver guia, troque guia, assina, fala, processo e problemas. */
    {
      id: 'viscose', grupo: 'outras', nome: 'Viscose e malha fria', exemplos: 'Viscose, raiom, cupro, modal e malha fria',
      sinonimos: ['viscose', 'viscolycra', 'malha fria', 'raiom', 'rayon', 'cupro', 'modal', 'liocel', 'tencel', 'viscolinho', 'crepe de viscose', 'vestido de viscose', 'blusa de viscose'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Segundo a ANEL, a viscose perde boa parte da resistência quando está molhada. Por isso, não esfregue nem torça a peça molhada.',
      leia: ['cupro'],
      maquina: 'Siga a etiqueta. Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.',
      maquinaNao: false,
      caseiro: ['Esfregar ou torcer a peça molhada: a viscose fica mais frágil quando está molhada.', 'Secadora e água quente: a peça pode encolher ou deformar.'],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das peças fica pronta em 2 dias; confirme pelo WhatsApp',
      preco: 'Conforme a peça; peça o orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    },
    {
      id: 'sinteticos', grupo: 'outras', nome: 'Poliéster e roupa de academia', exemplos: 'Legging, top, dry fit, poliéster, poliamida e elastano',
      sinonimos: ['poliester', 'poliamida', 'elastano', 'lycra', 'legging', 'top', 'dry fit', 'dryfit', 'roupa de academia', 'roupa de ginastica', 'roupa fitness', 'fitness', 'roupa esportiva', 'roupa de treino', 'roupa de ciclismo', 'tactel', 'microfibra', 'oxford', 'tecido oxford', 'malha de academia', 'camisa de time', 'camisa de futebol'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Segundo a ANEL, o poliéster e a poliamida, que é o nylon, amarelam com cloro, e secadora ou ferro muito quentes fazem o elastano perder a força.',
      leia: ['fitness'],
      maquina: 'Siga a etiqueta. Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.',
      maquinaNao: false,
      caseiro: ['Água sanitária ou alvejante com cloro: segundo a ANEL, o poliéster e a poliamida amarelam com cloro.', 'Secadora quente ou ferro no máximo: o elastano perde a força.'],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das peças fica pronta em 2 dias; confirme pelo WhatsApp',
      preco: 'Conforme a peça; peça o orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    },
    {
      id: 'bebe', grupo: 'outras', nome: 'Roupa de bebê e infantil', exemplos: 'Roupinhas, enxoval, ninho e manta de bebê',
      sinonimos: ['roupa de bebe', 'roupinha', 'roupinha de bebe', 'body', 'body de bebe', 'macacao de bebe', 'enxoval de bebe', 'ninho', 'ninho de bebe', 'manta de bebe', 'roupa infantil', 'roupa de crianca', 'babador', 'cueiro', 'saida de maternidade'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Além de carrinho e bebê conforto, a Dedicada lava ninhos de bebê, enxoval e roupas de bebê.',
      maquina: 'Siga a etiqueta. Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.',
      maquinaNao: false,
      caseiro: [F.sanitaria, 'Água quente em mancha de leite, xixi ou vômito: o calor fixa manchas orgânicas.'],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das peças fica pronta em 2 dias; confirme pelo WhatsApp',
      preco: 'Conforme a peça; peça o orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    },
    {
      id: 'mesa', grupo: 'outras', nome: 'Toalhas de mesa e guardanapos', exemplos: 'Toalhas de mesa, guardanapos e caminhos de mesa',
      sinonimos: ['toalha de mesa', 'guardanapo', 'guardanapo de pano', 'jogo americano', 'caminho de mesa', 'pano de prato', 'jacquard', 'toalha de natal', 'mesa posta'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: null,
      maquina: 'Siga a etiqueta. Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.',
      maquinaNao: false,
      caseiro: [F.quenteTanino, 'Esperar para tratar: manchas de comida e de bebida se fixam com o tempo.', F.umida],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das peças fica pronta em 2 dias; confirme pelo WhatsApp',
      preco: 'Conforme a peça; peça o orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    },
    {
      id: 'outra', grupo: 'outras', nome: 'Outra peça ou tecido', exemplos: 'O que não está na lista: a equipe avalia pela foto',
      sinonimos: ['outro tecido', 'uniforme', 'jaleco', 'farda', 'camurca', 'suede', 'nobuck', 'acrilico', 'kimono', 'quimono', 'tapete', 'bolsa', 'mochila', 'bone', 'colchao', 'sofa', 'estofado'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Esta peça ainda não tem guia próprio. Mande uma foto da peça e da etiqueta pelo WhatsApp: a equipe diz se lava e como.',
      maquina: 'Siga a etiqueta. Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.',
      maquinaNao: false,
      caseiro: [],
      processo: PROCESSO_GERAL,
      prazo: 'Conforme a peça; confirme pelo WhatsApp',
      preco: 'Conforme a peça; peça o orçamento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    }
  ];

  /* =====================================================================
   * Daqui para baixo é o funcionamento da ferramenta. O conteúdo fica acima.
   * ===================================================================== */

  var EXPRESSO = {
    sim: 'Tem expresso, no mesmo dia ou no seguinte, com acréscimo de 50%.',
    nao: 'Não tem serviço expresso.',
    consultar: 'A maioria das peças tem expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. Confirme pelo WhatsApp.'
  };
  var COLETA = 'Coleta e entrega grátis em 26 bairros da Ilha e do Continente, em dias fixos da semana. De outros bairros, é só levar a peça a uma das lojas, no Centro ou no Santa Mônica.';
  var QUANDO = ['Hoje', 'Ontem', 'Nesta semana', 'Há mais tempo', 'Não sei'];
  // Manchas que não são um líquido derramado: "tire o excesso com um pano" não se aplica.
  var SEM_PANO = ['suor', 'amarelado', 'desodorante', 'cor', 'ferrugem', 'mofo', 'lama', 'grama', 'protetor', 'agua-sanitaria', 'amaciante', 'cera', 'chiclete'];
  var CORES_PECA = ['Branca', 'Clara', 'Colorida', 'Escura'];

  /* ---------- Utilidades ---------- */
  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function minuscula(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function acharPeca(id) {
    for (var i = 0; i < PECAS.length; i++) if (PECAS[i].id === id) return PECAS[i];
    return null;
  }
  function acharMancha(id) {
    for (var i = 0; i < MANCHAS.length; i++) if (MANCHAS[i].id === id) return MANCHAS[i];
    return null;
  }
  function acharProblema(peca, id) {
    if (!peca) return null;
    for (var i = 0; i < peca.problemas.length; i++) if (peca.problemas[i].id === id) return peca.problemas[i];
    return null;
  }
  function problemaDaMancha(peca, manchaId) {
    if (!peca) return null;
    var lista = problemasOrdenados(peca);
    for (var i = 0; i < lista.length; i++) if (lista[i].manchas.indexOf(manchaId) >= 0) return lista[i];
    return null;
  }
  function problemasOrdenados(peca) {
    return peca.problemas.map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return (NIVEIS[a.p.nivel].ordem - NIVEIS[b.p.nivel].ordem) || (a.i - b.i); })
      .map(function (x) { return x.p; });
  }
  function linkWhats(msg) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg); }
  function evento(nome, dados) {
    try { if (typeof window.gtag === 'function') window.gtag('event', nome, dados || {}); } catch (e) { /* sem medição */ }
  }

  /* Cria elementos sem innerHTML: h('p', {class: 'x'}, 'texto', filho, ...) */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
        if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
        else if (k === 'class') el.className = attrs[k];
        else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
      }
    }
    for (var i = 2; i < arguments.length; i++) anexar(el, arguments[i]);
    return el;
  }
  function anexar(el, filho) {
    if (filho == null || filho === false) return;
    if (Array.isArray(filho)) { filho.forEach(function (f) { anexar(el, f); }); return; }
    el.appendChild(typeof filho === 'string' ? document.createTextNode(filho) : filho);
  }

  /* ---------- Resultado: problema da tabela, mancha por família ou mancha desconhecida ---------- */
  function resolver(peca, chave) {
    if (!peca || !chave) return null;
    var pr = acharProblema(peca, chave);
    if (pr) return { tipo: 'problema', chave: pr.id, peca: peca, titulo: pr.nome + ' em ' + minuscula(peca.nome), nome: pr.nome, pr: pr, familia: familiaDoProblema(pr) };
    if (chave === 'm-desconhecida') {
      return {
        tipo: 'desconhecida', chave: chave, peca: peca, nome: 'Mancha desconhecida', titulo: 'Mancha desconhecida em ' + minuscula(peca.nome),
        pr: {
          nivel: 'logo', urgencia: 'Quanto antes, melhor',
          acontece: 'Sem saber o que é a mancha, qualquer produto caseiro pode fixá-la ou tirar a cor do tecido.',
          fazer: ['Não aplique nenhum produto: só encoste um pano limpo, se a mancha ainda estiver úmida.', 'Mande uma foto pelo WhatsApp e conte onde a peça esteve e o que pode ter caído.', F.levarLogo, F.ateLevar],
          evitar: [F.esfregar, 'Água quente.', F.calor].concat(peca.caseiro || [])
        }
      };
    }
    if (chave.indexOf('m-') === 0) {
      var m = acharMancha(chave.slice(2));
      if (!m) return null;
      var especifico = problemaDaMancha(peca, m.id);
      if (especifico) return resolver(peca, especifico.id);
      var titulo = m.familia === 'dano' ? peca.nome + ': ' + minuscula(m.nome) : m.nome + ' em ' + minuscula(peca.nome);
      return { tipo: 'mancha', chave: chave, peca: peca, nome: m.nome, titulo: titulo, pr: problemaGenerico(peca, m), familia: FAMILIAS[m.familia].hydret ? m.familia : null, mancha: m };
    }
    return null;
  }

  function familiaDoProblema(pr) {
    var conta = {};
    (pr.manchas || []).forEach(function (id) { var m = acharMancha(id); if (m && FAMILIAS[m.familia].hydret) conta[m.familia] = (conta[m.familia] || 0) + 1; });
    var fams = Object.keys(conta);
    return fams.length === 1 ? fams[0] : null;
  }

  /* Mancha que não está na tabela do guia: orientação pela família da mancha. */
  function problemaGenerico(peca, m) {
    // Dano no tecido, e a água sanitária, que tira a cor: não há o que correr, é caso de avaliar.
    if (m.familia === 'dano' || m.id === 'agua-sanitaria') {
      return {
        nivel: 'atencao', urgencia: 'Leve para avaliação',
        acontece: m.dica || null,
        fazer: [F.avaliar, 'Se preferir, mande antes uma foto da peça e da etiqueta pelo WhatsApp.'],
        evitar: []
      };
    }
    var evitar = [F.esfregar];
    if (m.familia === 'tanino') evitar.push(F.quenteTanino);
    if (m.familia === 'proteina') evitar.push(F.quenteProteina);
    evitar.push(F.calor);
    if (m.id === 'ferrugem' || m.id === 'protetor') evitar.push('Água sanitária: escurece ou fixa a mancha.');
    if (m.id === 'maquiagem' || m.id === 'batom') evitar.push('Demaquilante: cria uma segunda mancha, de óleo.');
    // O que o guia da peça manda evitar, sem repetir a água quente que a família já trouxe.
    var temQuente = m.familia === 'tanino' || m.familia === 'proteina';
    (peca.caseiro || []).forEach(function (t) {
      if (evitar.indexOf(t) < 0 && !(temQuente && t.indexOf('Água quente') === 0)) evitar.push(t);
    });
    if (peca.maquinaNao) evitar.push('Lavar na máquina de casa.');

    if (m.id === 'mofo') {
      return {
        nivel: 'urgente', urgencia: 'Quanto antes, de preferência em até 24 horas',
        acontece: 'Mofo é o problema que mais chega à Dedicada em veludo, couro, peles e pelúcias; quanto antes a peça for lavada, maior a chance de sair.',
        fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
        evitar: [F.plastico, F.umida]
      };
    }
    var fam = FAMILIAS[m.familia];
    return {
      nivel: 'logo', urgencia: 'Quanto antes, melhor',
      acontece: m.dica || (fam && fam.hydret
        ? 'É uma mancha ' + fam.singular + ': pede um tira-manchas próprio, diferente do usado nas outras famílias de manchas.'
        : null),
      fazer: (SEM_PANO.indexOf(m.id) >= 0 ? [] : [F.pano]).concat([F.levarLogo, F.ateLevar]),
      evitar: evitar
    };
  }

  /* ---------- Busca em linguagem natural ----------
   * "vinho na camisa branca": acha a mancha (vinho), a peça (camisa) e a cor (branca).
   * Entende plural, falta de acento e um erro de digitação em palavras de 5 letras ou mais.
   * GENERICAS: palavras que não dizem o tecido; a busca oferece as peças possíveis.
   * CORES: a cor da peça vai junto na mensagem do WhatsApp. */
  var GENERICAS = {
    blusa: ['camisas', 'seda', 'linho', 'viscose', 'sinteticos', 'la'],
    blusinha: ['camisas', 'seda', 'linho', 'viscose', 'sinteticos', 'la'],
    vestido: ['festa-noiva', 'seda', 'linho', 'viscose'],
    calca: ['jeans', 'alfaiataria', 'linho', 'veludo', 'couro', 'sinteticos'],
    saia: ['linho', 'seda', 'couro', 'viscose', 'festa-noiva'],
    casaco: ['la', 'couro', 'jaquetas', 'peles'],
    jaqueta: ['jaquetas', 'couro', 'jeans'],
    short: ['jeans', 'linho', 'sinteticos'],
    bermuda: ['jeans', 'linho', 'sinteticos'],
    macacao: ['jeans', 'linho', 'viscose', 'jaquetas'],
    pijama: ['camisas', 'seda', 'viscose'],
    malha: ['camisas', 'viscose', 'sinteticos'],
    toalha: ['roupa-de-cama', 'mesa'],
    roupa: [], peca: [], tecido: []
  };
  var CORES = {
    branca: 'Branca', branco: 'Branca', clara: 'Clara', claro: 'Clara', bege: 'Clara', creme: 'Clara', 'off white': 'Clara',
    colorida: 'Colorida', colorido: 'Colorida', estampada: 'Colorida', estampado: 'Colorida',
    preta: 'Escura', preto: 'Escura', escura: 'Escura', escuro: 'Escura', 'azul marinho': 'Escura'
  };
  var LIGA = ['de', 'da', 'do', 'em', 'na', 'no', 'com'];

  function singular(w) { return w.length > 3 && /s$/.test(w) && !/(is|us|ss)$/.test(w) ? w.slice(0, -1) : w; }
  function palavras(texto) { return normalizar(texto).split(' ').filter(Boolean).map(singular); }
  // Distância de no máximo uma letra: troca, falta, sobra ou duas letras invertidas ("vihno").
  function quaseIgual(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    if (a.length === b.length) {
      return a.slice(i + 1) === b.slice(i + 1) ||
        (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    }
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }
  // 3: palavra igual · 2: um erro de digitação · 1: começo da última palavra, ainda sendo digitada
  function compara(qw, tw, digitando) {
    if (qw === tw) return 3;
    if (qw.length >= 5 && tw.length >= 5 && quaseIgual(qw, tw)) return 2;
    if (digitando && qw.length >= 3 && tw.indexOf(qw) === 0) return 1;
    return 0;
  }
  // Onde o termo (lista de palavras) aparece na frase: { n, ini, fim } do melhor encaixe.
  function encaixe(q, termo, aberta) {
    var melhor = null;
    for (var i = 0; i + termo.length <= q.length; i++) {
      var n = 3;
      for (var k = 0; k < termo.length && n; k++) {
        var digitando = aberta && i + k === q.length - 1 && k === termo.length - 1;
        n = Math.min(n, compara(q[i + k], termo[k], digitando));
      }
      if (!n) continue;
      // "lã" e "PU" só valem sozinhos ou depois de "de", "na"...: "fui lá" não é lã.
      if (termo.length === 1 && termo[0].length <= 2 && q.length > 1 && LIGA.indexOf(q[i - 1]) < 0) continue;
      if (!melhor || n > melhor.n) melhor = { n: n, ini: i, fim: i + termo.length };
    }
    return melhor;
  }

  var INDICE = null;
  function montarIndice() {
    INDICE = { manchas: [], pecas: [], problemas: [] };
    function termos(nome, sinonimos) {
      return [nome].concat(sinonimos || []).map(palavras).filter(function (t) { return t.length; });
    }
    MANCHAS.forEach(function (m) { INDICE.manchas.push({ alvo: m, termos: termos(m.nome, m.sinonimos) }); });
    PECAS.forEach(function (p) {
      INDICE.pecas.push({ alvo: p, termos: termos(p.nome, p.sinonimos) });
      p.problemas.forEach(function (pr) { INDICE.problemas.push({ alvo: { p: p, pr: pr }, termos: termos(pr.nome), nome: normalizar(pr.nome) }); });
    });
  }

  /* Lê a frase e devolve o que entendeu: { manchas, pecas, candidatas, generica, problemas, cor }. */
  function analisar(texto) {
    if (!INDICE) montarIndice();
    var bruto = String(texto || '');
    var q = palavras(bruto);
    var aberta = !/\s$/.test(bruto);
    var achados = [];
    function testa(tipo, x) {
      var melhor = null;
      x.termos.forEach(function (t) {
        var e = encaixe(q, t, aberta);
        if (e && (!melhor || e.n > melhor.n || (e.n === melhor.n && e.fim - e.ini > melhor.fim - melhor.ini))) melhor = e;
      });
      if (melhor) achados.push({ tipo: tipo, alvo: x.alvo, n: melhor.n, ini: melhor.ini, fim: melhor.fim });
    }
    if (q.length) {
      INDICE.manchas.forEach(function (x) { testa('mancha', x); });
      INDICE.pecas.forEach(function (x) { testa('peca', x); });
      INDICE.problemas.forEach(function (x) { testa('problema', x); });
      Object.keys(GENERICAS).forEach(function (g) { testa('generica', { alvo: g, termos: [palavras(g)] }); });
      Object.keys(CORES).forEach(function (c) { testa('cor', { alvo: CORES[c], termos: [palavras(c)] }); });
    }
    // Fica de fora o que está dentro de um termo maior ("calça" em "calça jeans", "clara" em
    // "clara de ovo") e o encaixe aproximado onde há um exato. Problema só tira a cor.
    achados = achados.filter(function (a) {
      return !achados.some(function (b) {
        if (b === a || (b.tipo === 'problema' && a.tipo !== 'cor')) return false;
        var contem = b.ini <= a.ini && b.fim >= a.fim && (b.fim - b.ini) > (a.fim - a.ini) && b.n >= a.n;
        var cruza = b.ini < a.fim && a.ini < b.fim;
        return contem || (cruza && b.n > a.n);
      });
    });
    // "mancha branca na camisa preta": a cor logo depois de "mancha" é a da mancha, não a da peça.
    achados = achados.filter(function (a) { return a.tipo !== 'cor' || q[a.ini - 1] !== 'mancha'; });
    achados.sort(function (a, b) { return (b.n - a.n) || ((b.fim - b.ini) - (a.fim - a.ini)) || (a.ini - b.ini); });
    function doTipo(t) { return achados.filter(function (a) { return a.tipo === t; }).map(function (a) { return a.alvo; }); }
    var genericas = doTipo('generica');
    var candidatas = [];
    genericas.forEach(function (g) {
      GENERICAS[g].forEach(function (id) { var p = acharPeca(id); if (p && candidatas.indexOf(p) < 0) candidatas.push(p); });
    });
    var problemas = doTipo('problema');
    // Sem nada inteiro, ainda acha o problema pelo nome enquanto a pessoa digita ("riscos").
    if (!achados.length) {
      var ws = normalizar(bruto).split(' ').filter(function (w) { return w.length >= 4; });
      if (ws.length) {
        INDICE.problemas.forEach(function (x) {
          if (ws.every(function (w) { return x.nome.indexOf(w) >= 0; })) problemas.push(x.alvo);
        });
      }
    }
    return {
      manchas: doTipo('mancha'), pecas: doTipo('peca'), generica: genericas[0] || null,
      candidatas: candidatas, problemas: problemas, cor: doTipo('cor')[0] || null
    };
  }

  /* Sugestões a partir do que a busca entendeu, da mais provável para a menos. */
  function sugestoes(a) {
    var itens = [];
    function add(item) { if (item && !itens.some(function (i) { return i.hash === item.hash; })) itens.push(item); }
    function doResultado(p, m) {
      var r = resolver(p, 'm-' + m.id);
      return r && { rotulo: r.nome, detalhe: p.nome, hash: '#' + p.id + '/' + r.chave, nivel: r.pr.nivel };
    }
    var pecas = a.pecas.length ? a.pecas.slice(0, 3) : a.candidatas;
    var daPeca = a.problemas.filter(function (x) { return pecas.indexOf(x.p) >= 0; });
    daPeca.forEach(function (x) { add({ rotulo: x.pr.nome, detalhe: x.p.nome, hash: '#' + x.p.id + '/' + x.pr.id, nivel: x.pr.nivel }); });

    if (a.manchas.length && pecas.length) {
      pecas.forEach(function (p) {
        a.manchas.slice(0, a.pecas.length ? 2 : 1).forEach(function (m) { add(doResultado(p, m)); });
      });
      if (!a.pecas.length) add({ rotulo: a.manchas[0].nome, detalhe: 'Em outra peça', hash: '#m-' + a.manchas[0].id, nivel: null });
    } else if (a.manchas.length) {
      a.manchas.slice(0, 2).forEach(function (m) {
        add({ rotulo: m.nome, detalhe: 'Escolha a peça manchada', hash: '#m-' + m.id, nivel: null });
      });
      a.manchas.slice(0, 2).forEach(function (m) {
        PECAS.forEach(function (p) {
          var pr = problemaDaMancha(p, m.id);
          if (pr && NIVEIS[pr.nivel].ordem <= 3) add({ rotulo: pr.nome, detalhe: p.nome, hash: '#' + p.id + '/' + pr.id, nivel: pr.nivel });
        });
      });
    } else if (pecas.length) {
      pecas.forEach(function (p) {
        add({ rotulo: p.nome, detalhe: p.problemas.length ? 'Ver os problemas mais comuns' : 'Escolher a mancha', hash: '#' + p.id, nivel: null });
      });
    }
    if (!pecas.length) a.problemas.forEach(function (x) { add({ rotulo: x.pr.nome, detalhe: x.p.nome, hash: '#' + x.p.id + '/' + x.pr.id, nivel: x.pr.nivel }); });
    return itens.slice(0, 8);
  }
  function buscar(texto) { return sugestoes(analisar(texto)); }

  /* ---------- Estado na URL ----------
   * #seda  ·  #seda/vinho-tinto  ·  #seda/m-caneta  ·  #seda/m-desconhecida  ·  #m-caneta (mancha, falta a peça) */
  function lerEstado(hash) {
    var bruto = hash === undefined ? location.hash : hash;
    var partes = decodeURIComponent((bruto || '').replace(/^#\/?/, '')).split('/');
    var e = { peca: null, resultado: null, mancha: null };
    if (partes[0].indexOf('m-') === 0) { e.mancha = acharMancha(partes[0].slice(2)); return e; }
    e.peca = acharPeca(partes[0]);
    if (e.peca && partes[1]) e.resultado = resolver(e.peca, partes[1]);
    return e;
  }
  // Âncora de uma seção da página (ex.: #onde-levar), e não um passo da ferramenta.
  function ehAncoraDaPagina(hash) {
    if (!hash || hash.length < 2) return false;
    var e = lerEstado(hash);
    if (e.peca || e.mancha) return false;
    try { return !!document.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { return false; }
  }
  // Troca o endereço sem recarregar. Onde o navegador não deixa (algumas pré-visualizações),
  // usa o próprio #, que também funciona com o botão voltar.
  function mudarUrl(hash, substituir) {
    try {
      var url = hash || (location.pathname + location.search);
      if (substituir) history.replaceState(null, '', url); else history.pushState(null, '', url);
    } catch (e) {
      try { if (substituir) location.replace(hash || '#'); else location.hash = hash; } catch (e2) { /* segue sem mudar o endereço */ }
    }
  }
  function irPara(hash, substituir) {
    var atual = location.hash || '';
    if (hash === atual) { desenhar(true); return; }
    mudarUrl(hash, substituir);
    desenhar(true);
  }

  /* ---------- Desenho ---------- */
  var raiz, avisoLeitor, ultimoHash = null, corDaBusca = null;
  var contexto = { quando: null, tentou: null, cor: null };

  function desenhar(mudouPasso) {
    var e = lerEstado();
    // Mancha que tem problema próprio na peça: usa o endereço do problema.
    if (e.resultado && e.resultado.chave !== decodeURIComponent(location.hash.split('/')[1] || '')) {
      mudarUrl('#' + e.peca.id + '/' + e.resultado.chave, true);
    }
    ultimoHash = location.hash;
    var passo = e.resultado ? 3 : e.peca ? 2 : 1;
    // Respostas do "Conte para a equipe" valem só para este resultado; a cor pode vir da busca.
    if (passo === 3) { contexto = { quando: null, tentou: null, cor: corDaBusca }; corDaBusca = null; }
    var tela = passo === 1 ? telaPeca(e.mancha) : passo === 2 ? telaProblema(e.peca) : telaResultado(e.resultado);

    raiz.textContent = '';
    raiz.appendChild(etapas(passo, e));
    raiz.appendChild(tela);
    raiz.setAttribute('data-passo', String(passo));

    if (passo === 2) evento('dm_peca', { peca: e.peca.id });
    if (passo === 3) { evento('dm_resultado', { peca: e.peca.id, problema: e.resultado.chave, tipo: e.resultado.tipo }); }

    if (mudouPasso) {
      var titulo = raiz.querySelector('.dm-titulo');
      avisoLeitor.textContent = 'Passo ' + passo + ' de 3. ' + (titulo ? titulo.textContent : '');
      var topo = raiz.getBoundingClientRect().top;
      if (topo < 0 || topo > window.innerHeight * 0.6) {
        var suave = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        raiz.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
      }
      if (titulo) titulo.focus({ preventScroll: true });
    }
  }

  function etapas(passo, e) {
    var valorProblema = e.resultado ? e.resultado.nome : e.mancha ? e.mancha.nome : null;
    var itens = [
      { n: 1, rotulo: 'Peça', valor: e.peca && e.peca.nome, ir: function () { irPara(''); } },
      { n: 2, rotulo: 'Problema', valor: valorProblema, ir: function () { irPara(e.peca ? '#' + e.peca.id : ''); } },
      { n: 3, rotulo: 'O que fazer', valor: null, ir: null }
    ];
    return h('ol', { class: 'dm-etapas', 'aria-label': 'Passos do diagnóstico' },
      itens.map(function (it) {
        var st = it.n < passo ? 'feito' : it.n === passo ? 'atual' : 'depois';
        var mostraValor = it.valor && (st === 'feito' || (it.n === 2 && e.mancha));
        var miolo = [
          h('span', { class: 'dm-etapa-num', 'aria-hidden': 'true' }, String(it.n)),
          h('span', { class: 'dm-etapa-txt' },
            h('span', { class: 'dm-etapa-rotulo' }, it.rotulo),
            mostraValor ? h('span', { class: 'dm-etapa-valor' }, it.valor) : null)
        ];
        return h('li', { class: 'dm-etapa dm-etapa--' + st, 'aria-current': st === 'atual' ? 'step' : null },
          st === 'feito' && it.ir
            ? h('button', { type: 'button', class: 'dm-etapa-btn', onclick: it.ir, 'aria-label': 'Voltar ao passo ' + it.n + ': ' + it.rotulo + (it.valor ? ' (' + it.valor + ')' : '') }, miolo)
            : h('span', { class: 'dm-etapa-btn' }, miolo));
      }));
  }

  /* Passo 1: a peça (com busca em linguagem natural) */
  function telaPeca(mancha) {
    var lista = h('ul', { class: 'dm-sugestoes', role: 'list', id: 'dm-sugestoes', 'aria-live': 'polite' });
    var campo = h('input', {
      id: 'dm-q', class: 'dm-campo', type: 'search', autocomplete: 'off', enterkeyhint: 'search',
      placeholder: 'Ex.: vinho na camisa branca', 'aria-describedby': 'dm-q-dica', 'aria-controls': 'dm-sugestoes'
    });
    var itens = [], analise = null;
    function ir(it) {
      evento('dm_busca', { termo: campo.value.slice(0, 40) });
      corDaBusca = analise && analise.cor;
      irPara(it.hash);
    }
    function entendi(a) {
      var partes = [];
      if (a.manchas.length) partes.push((a.manchas[0].familia === 'dano' ? 'problema: ' : 'mancha: ') + minuscula(a.manchas[0].nome));
      if (a.pecas.length) partes.push('peça: ' + minuscula(a.pecas[0].nome));
      else if (a.generica) partes.push('peça: ' + a.generica + (a.candidatas.length ? ' (escolha o tecido)' : ''));
      if (a.cor) partes.push('cor: ' + minuscula(a.cor));
      return partes.length > 1 ? h('li', { class: 'dm-entendi' }, 'Entendi ' + partes.join(' · ')) : null;
    }
    function atualizar() {
      analise = analisar(campo.value);
      itens = sugestoes(analise);
      lista.textContent = '';
      if (!campo.value.trim()) return;
      if (!itens.length) {
        var soPeca = analise.generica || analise.cor;
        lista.appendChild(h('li', { class: 'dm-sugestao-vazia' },
          soPeca ? 'Conte também o que manchou e a peça, por exemplo: café na camisa branca. Ou escolha a peça abaixo, ou ' : 'Nada encontrado. Escolha a peça abaixo ou ',
          h('a', { href: linkWhats('Olá! Vim do Diagnóstico de Manchas e não achei o meu caso: ' + campo.value), target: '_blank', rel: 'noopener' }, 'fale pelo WhatsApp'), '.'));
        return;
      }
      anexar(lista, entendi(analise));
      itens.forEach(function (it) {
        lista.appendChild(h('li', null, h('a', {
          class: 'dm-sugestao', href: it.hash,
          onclick: function (ev) { ev.preventDefault(); ir(it); }
        }, h('span', { class: 'dm-sugestao-nome' }, it.rotulo), h('span', { class: 'dm-sugestao-det' }, it.detalhe),
          it.nivel ? selo(it.nivel) : null)));
      });
    }
    campo.addEventListener('input', atualizar);
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      atualizar();
      if (itens.length) ir(itens[0]);
    });

    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t1' },
      h('h2', { class: 'dm-titulo', id: 'dm-t1', tabindex: '-1' }, 'Qual é a peça?'),
      mancha
        ? h('div', { class: 'dm-contexto' },
          h('p', null, h('strong', null, (mancha.familia === 'dano' ? 'Problema: ' : 'Mancha: ') + mancha.nome + '. '), 'Agora escolha a peça.'),
          h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, 'Trocar'))
        : h('div', { class: 'dm-busca', role: 'search' },
          h('label', { for: 'dm-q', class: 'dm-busca-rotulo' }, 'O que aconteceu? Escreva a mancha e a peça'),
          campo,
          h('p', { id: 'dm-q-dica', class: 'dm-so-leitor' }, 'As sugestões aparecem abaixo do campo enquanto você digita. Enter abre a primeira.'),
          lista),
      h('p', { class: 'dm-dica' }, mancha ? 'Toque na peça manchada.' : 'Ou escolha a peça. Não sabe o tecido? Veja a etiqueta.'),
      GRUPOS.map(function (g) {
        var pecas = PECAS.filter(function (p) { return p.grupo === g.id; });
        return h('div', { class: 'dm-grupo' },
          h('h3', { class: 'dm-grupo-nome' }, g.nome),
          h('ul', { class: 'dm-grade', role: 'list' }, pecas.map(function (p) {
            var img = null;
            if (p.foto !== false) {
              img = h('img', { class: 'dm-cartao-img', src: FOTOS + 'dm-' + p.id + '.webp', alt: '', width: '320', height: '200', loading: 'lazy', decoding: 'async' });
              img.addEventListener('error', function () { img.remove(); });
            }
            return h('li', null, h('button', {
              type: 'button', class: 'dm-cartao' + (img ? '' : ' dm-cartao--sem-foto'),
              onclick: function () { irPara('#' + p.id + (mancha ? '/m-' + mancha.id : '')); }
            }, img, h('span', { class: 'dm-cartao-txt' },
              h('span', { class: 'dm-cartao-nome' }, p.nome),
              h('span', { class: 'dm-cartao-sub' }, p.exemplos))));
          })));
      }),
      h('p', { class: 'dm-rodape-tela' }, 'Não encontrou a peça? ',
        h('a', { href: linkWhats('Olá! Vim do Diagnóstico de Manchas e não encontrei a minha peça. Posso mandar uma foto?'), target: '_blank', rel: 'noopener' }, 'Mande uma foto pelo WhatsApp'), '.')
    );
  }

  function selo(nivel) {
    var n = NIVEIS[nivel];
    return h('span', { class: 'dm-selo dm-selo--' + n.tom }, n.rotulo);
  }

  function nomeDoGuia(peca) { return peca.semGuia ? 'Cuidados por Tecido' : 'Guia de ' + minuscula(peca.nome); }

  /* Passo 2: o problema */
  function telaProblema(peca) {
    var familias = ['gordura', 'proteina', 'tanino', 'outras', 'dano'];
    var temTabela = peca.problemas.length > 0;
    var escolha = h(temTabela ? 'details' : 'div', { class: 'dm-outra' + (temTabela ? '' : ' dm-outra--aberta') },
      temTabela ? h('summary', null, 'Outra mancha ou dano? Escolha pelo tipo') : null,
      h('p', { class: 'dm-outra-dica' }, 'Cada família de mancha pede um tira-manchas diferente.'),
      familias.map(function (fid) {
        var fam = FAMILIAS[fid];
        var ms = MANCHAS.filter(function (m) { return m.familia === fid; });
        return h('div', { class: 'dm-familia' },
          h('h3', { class: 'dm-familia-nome' }, fam.nome),
          h('ul', { class: 'dm-chips', role: 'list' }, ms.map(function (m) {
            return h('li', null, h('button', { type: 'button', class: 'dm-chip', onclick: function () { irPara('#' + peca.id + '/m-' + m.id); } }, m.nome));
          })));
      }));
    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t2' },
      h('h2', { class: 'dm-titulo', id: 'dm-t2', tabindex: '-1' }, 'Qual é o problema?'),
      temTabela
        ? [h('p', { class: 'dm-dica' }, 'Os problemas que mais chegam à Dedicada em ' + minuscula(peca.nome) + ', do mais urgente ao menos urgente.'),
          h('ul', { class: 'dm-lista', role: 'list' }, problemasOrdenados(peca).map(function (pr) {
            return h('li', null, h('button', { type: 'button', class: 'dm-opcao', onclick: function () { irPara('#' + peca.id + '/' + pr.id); } },
              h('span', { class: 'dm-opcao-nome' }, pr.nome), selo(pr.nivel)));
          }))]
        : h('p', { class: 'dm-dica' }, 'Escolha a mancha ou o dano pelo tipo.'),
      escolha,
      h('ul', { class: 'dm-lista dm-lista--extra', role: 'list' },
        h('li', null, h('button', { type: 'button', class: 'dm-opcao dm-opcao--leve', onclick: function () { irPara('#' + peca.id + '/m-desconhecida'); } },
          h('span', { class: 'dm-opcao-nome' }, 'Não sei o que é a mancha'), h('span', { class: 'dm-seta', 'aria-hidden': 'true' }, '→')))),
      h('div', { class: 'dm-nao-achei' },
        h('p', null, h('strong', null, 'Prefere mostrar? '), 'Mande uma foto da peça pelo WhatsApp' + (peca.semGuia ? '.' : ' ou leia o guia completo.')),
        h('div', { class: 'dm-acoes' },
          h('a', { class: 'dm-btn dm-btn--primario', href: linkWhats('Olá! Vim do Diagnóstico de Manchas. Tenho um problema em ' + minuscula(peca.nome) + '. Posso mandar uma foto?'), target: '_blank', rel: 'noopener' }, 'Mandar foto pelo WhatsApp'),
          h('a', { class: 'dm-btn', href: peca.guia }, nomeDoGuia(peca)))),
      h('p', { class: 'dm-voltar' }, h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, '← Escolher outra peça'))
    );
  }

  function lista(tag, itens, classe) {
    if (!itens || !itens.length) return null;
    return h(tag, { class: classe }, itens.map(function (t) { return h('li', null, t); }));
  }

  // Mensagem pronta, uma informação por linha, com o link do resultado que a pessoa viu.
  function mensagemWhats(r) {
    var linhas = ['Olá! Vim do Diagnóstico de Manchas do site.', '', 'Peça: ' + r.peca.nome, 'Problema: ' + r.nome];
    if (contexto.cor) linhas.push('Cor da peça: ' + minuscula(contexto.cor));
    if (contexto.quando) linhas.push('Quando aconteceu: ' + minuscula(contexto.quando));
    if (contexto.tentou) linhas.push(contexto.tentou === 'Sim' ? 'Já tentei tirar em casa.' : 'Ainda não tentei nada em casa.');
    linhas.push('Resultado que vi: ' + SITE + '/diagnostico-de-manchas/#' + r.peca.id + '/' + r.chave, '', 'Posso mandar uma foto?');
    return linhas.join('\n');
  }

  // Posts do blog ligados à mancha do resultado e ao tecido.
  function leituras(r) {
    var chaves = [];
    var ids = r.mancha ? [r.mancha.id] : (r.pr.manchas || []);
    ids.forEach(function (id) { var m = acharMancha(id); if (m && m.leia) chaves.push(m.leia); });
    chaves = chaves.concat(r.peca.leia || []);
    return chaves.filter(function (k, i) { return BLOG[k] && chaves.indexOf(k) === i; }).map(function (k) { return BLOG[k]; });
  }

  /* Passo 3: o que fazer */
  function telaResultado(r) {
    var peca = r.peca, pr = r.pr, n = NIVEIS[pr.nivel];
    var pessoa = PESSOAS[peca.assina];
    var prevencao = pr.nivel === 'sem_solucao' || pr.nivel === 'dificil';
    var fam = r.familia && FAMILIAS[r.familia];
    var leia = leituras(r);
    var botaoWhats = h('a', { class: 'dm-btn dm-btn--primario dm-btn--whats', href: linkWhats(mensagemWhats(r)), target: '_blank', rel: 'noopener',
      onclick: function () { evento('dm_whatsapp', { peca: peca.id, problema: r.chave }); } }, 'Falar com a Dedicada pelo WhatsApp');
    function atualizarWhats() { botaoWhats.setAttribute('href', linkWhats(mensagemWhats(r))); }
    function grupoChips(rotulo, opcoes, chaveCtx) {
      return h('div', { class: 'dm-pergunta', role: 'group', 'aria-label': rotulo },
        h('p', { class: 'dm-pergunta-rotulo' }, rotulo),
        h('div', { class: 'dm-chips' }, opcoes.map(function (op) {
          var b = h('button', { type: 'button', class: 'dm-chip', 'aria-pressed': contexto[chaveCtx] === op ? 'true' : 'false' }, op);
          b.addEventListener('click', function () {
            var ativo = contexto[chaveCtx] === op;
            contexto[chaveCtx] = ativo ? null : op;
            Array.prototype.forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
            if (!ativo) b.setAttribute('aria-pressed', 'true');
            atualizarWhats();
          });
          return b;
        })));
    }
    var compartilhar = null;
    if (navigator.share || (navigator.clipboard && navigator.clipboard.writeText)) {
      compartilhar = h('button', { type: 'button', class: 'dm-link', onclick: function (ev) {
        var url = location.href, botao = ev.currentTarget;
        function copiar() {
          if (!navigator.clipboard) return;
          navigator.clipboard.writeText(url).then(function () { botao.textContent = 'Link copiado'; }, function () {});
        }
        if (navigator.share) { navigator.share({ title: r.titulo + ' | Dedicada Lavanderia', url: url }).catch(copiar); return; }
        copiar();
      } }, navigator.share ? 'Compartilhar' : 'Copiar link');
    }

    return h('section', { class: 'dm-tela dm-resultado', 'aria-labelledby': 'dm-t3' },
      h('h2', { class: 'dm-titulo', id: 'dm-t3', tabindex: '-1' }, r.titulo),

      h('div', { class: 'dm-alerta dm-alerta--' + n.tom },
        h('div', { class: 'dm-alerta-topo' }, selo(pr.nivel), h('strong', { class: 'dm-alerta-urg' }, pr.urgencia)),
        pr.acontece ? h('p', { class: 'dm-alerta-txt' }, pr.acontece) : null),

      h('div', { class: 'dm-bloco' },
        h('h3', null, prevencao ? 'Como evitar da próxima vez' : 'O que fazer agora'),
        lista('ol', pr.fazer, 'dm-passos')),

      pr.evitar && pr.evitar.length ? h('div', { class: 'dm-bloco' },
        h('h3', null, 'O que não fazer'),
        lista('ul', pr.evitar, 'dm-evitar')) : null,

      peca.nota ? h('p', { class: 'dm-nota-tecido' }, h('strong', null, 'Sobre o tecido: '), peca.nota) : null,

      h('p', { class: 'dm-maquina' }, h('strong', null, 'Pode ir na máquina de casa? '), peca.maquina),

      h('div', { class: 'dm-bloco dm-dedicada' },
        h('h3', null, 'Como a Dedicada trata'),
        pr.dedicada ? h('p', null, pr.dedicada) : null,
        fam ? h('p', { class: 'dm-familia-nota' }, 'É uma mancha ' + fam.singular + ', como ' + fam.exemplos + '. Na Dedicada, cada família de mancha tem o seu tira-manchas, da linha Hydret da Seitz, e cada mancha é tratada na sua vez, antes da lavagem.') : null,
        h('details', { class: 'dm-processo' },
          h('summary', null, 'Ver as ' + peca.processo.length + ' etapas do processo'),
          lista('ol', peca.processo, 'dm-passos')),
        h('dl', { class: 'dm-fatos' },
          h('div', null, h('dt', null, 'Prazo'), h('dd', null, peca.prazo)),
          h('div', null, h('dt', null, 'Preço'), h('dd', null, peca.preco)),
          h('div', null, h('dt', null, 'Expresso'), h('dd', null, EXPRESSO[peca.expresso] || peca.expresso)))),

      pessoa && peca.fala ? h('figure', { class: 'dm-fala' },
        h('img', { class: 'dm-fala-foto', src: pessoa.foto, alt: pessoa.nome, width: '56', height: '56', loading: 'lazy' }),
        h('div', null,
          h('blockquote', null, h('p', null, '“' + peca.fala + '”')),
          h('figcaption', null, pessoa.nome + ', ' + pessoa.papel))) : null,

      h('div', { class: 'dm-contato' },
        h('h3', null, 'Conte para a equipe'),
        h('p', { class: 'dm-contato-dica' }, 'Opcional: as respostas vão junto na mensagem do WhatsApp.'),
        grupoChips('Quando aconteceu?', QUANDO, 'quando'),
        grupoChips('Já tentou tirar em casa?', ['Não', 'Sim'], 'tentou'),
        grupoChips('Cor da peça?', CORES_PECA, 'cor'),
        h('div', { class: 'dm-acoes dm-acoes--final' },
          botaoWhats,
          h('a', { class: 'dm-btn', href: peca.guia }, nomeDoGuia(peca)))),

      leia.length ? h('div', { class: 'dm-leia' },
        h('h3', null, 'Leia também'),
        h('ul', null, leia.map(function (b) { return h('li', null, h('a', { href: SITE + b[0] }, b[1])); }))) : null,

      h('p', { class: 'dm-coleta' }, COLETA, ' ', h('a', { href: '#onde-levar', onclick: function (ev) {
        var alvo = document.getElementById('onde-levar');
        if (alvo) { ev.preventDefault(); alvo.scrollIntoView({ behavior: 'smooth' }); }
      } }, 'Ver endereços e dias da coleta'), '.'),

      h('div', { class: 'dm-navegar' },
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara('#' + peca.id); } }, '← Outro problema'),
        compartilhar,
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, 'Começar de novo'))
    );
  }

  /* ---------- Conferência do banco (usada no teste e pelo gerador da página) ---------- */
  function validar() {
    var erros = [], avisos = [], ids = {};
    MANCHAS.forEach(function (m) {
      if (ids['m-' + m.id]) erros.push('Mancha repetida: ' + m.id);
      ids['m-' + m.id] = true;
      if (!FAMILIAS[m.familia]) erros.push('Mancha ' + m.id + ': família inválida');
      if (m.leia && !BLOG[m.leia]) erros.push('Mancha ' + m.id + ': post do blog inexistente ' + m.leia);
    });
    PECAS.forEach(function (p) {
      if (ids[p.id]) erros.push('Peça repetida: ' + p.id);
      ids[p.id] = true;
      ['nome', 'grupo', 'exemplos', 'guia', 'maquina', 'prazo', 'preco', 'expresso'].forEach(function (c) { if (!p[c]) erros.push(p.id + ': falta ' + c); });
      if (!GRUPOS.some(function (g) { return g.id === p.grupo; })) erros.push(p.id + ': grupo inexistente');
      if (!p.semGuia) {
        if (!PESSOAS[p.assina]) erros.push(p.id + ': quem assina não existe');
        if (!p.fala) avisos.push(p.id + ': sem fala');
        if (!p.problemas.length) erros.push(p.id + ': peça com guia sem tabela de problemas');
      }
      (p.leia || []).forEach(function (k) { if (!BLOG[k]) erros.push(p.id + ': post do blog inexistente ' + k); });
      if (!p.processo || p.processo.length < 2) erros.push(p.id + ': processo incompleto');
      var idsPr = {};
      p.problemas.forEach(function (pr) {
        var k = p.id + '/' + pr.id;
        if (idsPr[pr.id]) erros.push(k + ': problema repetido');
        idsPr[pr.id] = true;
        if (pr.id.indexOf('m-') === 0) erros.push(k + ': id não pode começar com m-');
        if (!pr.nome || !pr.urgencia || !pr.acontece) erros.push(k + ': falta nome, urgência ou "o que acontece"');
        if (!NIVEIS[pr.nivel]) erros.push(k + ': nível inválido');
        if (!pr.fazer || !pr.fazer.length) erros.push(k + ': falta o que fazer');
        if (!Array.isArray(pr.manchas)) erros.push(k + ': manchas deve ser uma lista');
        (pr.manchas || []).forEach(function (m) { if (!acharMancha(m)) erros.push(k + ': mancha desconhecida ' + m); });
      });
    });
    return { erros: erros, avisos: avisos };
  }

  /* Exposto para o teste, para o gerador da página e para conferência no console. */
  window.DM_DIAGNOSTICO = {
    PECAS: PECAS, GRUPOS: GRUPOS, MANCHAS: MANCHAS, FAMILIAS: FAMILIAS, NIVEIS: NIVEIS, PESSOAS: PESSOAS, BLOG: BLOG, SITE: SITE,
    validar: validar, buscar: buscar, analisar: analisar, resolver: resolver, problemasOrdenados: problemasOrdenados,
    problemaDaMancha: problemaDaMancha
  };

  function iniciar() {
    raiz = document.getElementById('dm-app');
    if (!raiz) return;
    raiz.classList.add('dm-app');
    raiz.setAttribute('data-js', 'ok');
    var semJs = raiz.querySelector('.dm-sem-js');
    if (semJs) semJs.remove();
    avisoLeitor = h('p', { class: 'dm-so-leitor', 'aria-live': 'polite' });
    raiz.parentNode.insertBefore(avisoLeitor, raiz.nextSibling);
    function aoMudarUrl() {
      if (location.hash === ultimoHash) return;
      if (ehAncoraDaPagina(location.hash)) { ultimoHash = location.hash; return; } // como #onde-levar
      desenhar(true);
    }
    window.addEventListener('popstate', aoMudarUrl);
    window.addEventListener('hashchange', aoMudarUrl);
    var inicial = !!location.hash && !ehAncoraDaPagina(location.hash);
    desenhar(inicial);
  }

  if (typeof document === 'undefined' || !document.getElementById) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
