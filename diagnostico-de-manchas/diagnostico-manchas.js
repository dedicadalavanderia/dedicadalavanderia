/*
 * Dedicada Lavanderia · Diagnóstico de Manchas
 * Snippet WPCode 3164 (JavaScript). Vai DEPOIS de <div id="dm-app"> no conteúdo da página 3165.
 * Protótipo de 28/09/2026. Não publicar sem a revisão descrita em LEIA-ME.md.
 *
 * COMO O BANCO ESTÁ ORGANIZADO
 *   GRUPOS  → os 5 grupos da página central (Cuidados por Tecido).
 *   PECAS   → um item por guia (17). Cada peça traz os fatos do guia: se vai na máquina
 *             de casa, como a Dedicada lava, prazo, preço e expresso; a fala aprovada; e a
 *             lista de problemas.
 *   problema → { id, nome, urgencia, prazo?, fazer[], evitar[], naDedicada?, origem }
 *     urgencia: 'urgente' | 'logo' | 'avaliar' | 'prevenir' | 'sem_volta' (ver URGENCIA)
 *     origem:   'briefing' = montado com os fatos do briefing e do Plano (28/09);
 *               'guia'     = conferido com a tabela "problemas mais comuns" do guia no ar.
 *               Antes de publicar, todos devem estar como 'guia'.
 *
 * Regra: só fatos confirmados pela Dedicada. Nada de "único", "o melhor", "exclusivo",
 * "100%", percentuais sem fonte ou "toda Florianópolis".
 */
(function () {
  'use strict';

  var WHATSAPP = '5548984280639';
  var SITE = 'https://dedicadalavanderia.com.br';
  var GUIA_CENTRAL = SITE + '/cuidados-por-tecido/';

  /* ---------- Pessoas que assinam ---------- */
  var PESSOAS = {
    liliane: { nome: 'Liliane Sella Mazza', papel: 'sócia fundadora' },
    jorge: { nome: 'Jorge Isaac Mazza', papel: 'sócio fundador' },
    alejandro: { nome: 'Alejandro David Mazza', papel: 'sócio administrador' }
  };

  /* ---------- Níveis de urgência ---------- */
  var URGENCIA = {
    urgente: { ordem: 1, rotulo: 'Mais urgente', frase: 'Trate quanto antes.' },
    logo: { ordem: 2, rotulo: 'Leve logo', frase: 'Leve a peça assim que puder.' },
    avaliar: { ordem: 3, rotulo: 'Precisa de avaliação', frase: 'Traga a peça para a equipe avaliar.' },
    prevenir: { ordem: 4, rotulo: 'Como evitar', frase: 'Veja o que fazer para não acontecer.' },
    sem_volta: { ordem: 5, rotulo: 'Não tem volta', frase: 'Esse dano não se desfaz. Veja como evitar da próxima vez.' }
  };

  /* ---------- Frases confirmadas, usadas em vários problemas ---------- */
  var F = {
    pano: 'Tire o excesso encostando um pano limpo, sem esfregar.',
    aguaQuente: 'Não use água quente: ela fixa manchas de café, chá e vinho.',
    levar: 'Leve a peça à Dedicada quanto antes.',
    mofo24: 'Mofo se trata quanto antes, de preferência em até 24 horas.',
    guardar: 'Depois de limpas, guarde as peças secas, em armário arejado e em capa de tecido.',
    esfregar: 'Esfregar a mancha.',
    aguaQuenteEvitar: 'Água quente em manchas de café, chá ou vinho.',
    plastico: 'Guardar a peça em capa de plástico.',
    maquina: 'Lavar na máquina de casa.'
  };

  /* ---------- Grupos (mesma ordem da página central) ---------- */
  var GRUPOS = [
    { id: 'finas', nome: 'Festa e peças finas' },
    { id: 'inverno', nome: 'Inverno, couro e alfaiataria' },
    { id: 'dia', nome: 'Dia a dia' },
    { id: 'casa', nome: 'Casa' },
    { id: 'criancas', nome: 'Crianças' }
  ];

  /* ---------- As 17 peças ----------
   * guia: endereço do guia no ar. urlConfirmada:false = endereço deduzido, CONFERIR.
   * expresso: 'sim' | 'nao' | 'consultar'
   * fala: texto aprovado + autor (chave de PESSOAS). conferir: motivo, quando houver.
   */
  var PECAS = [
    {
      id: 'seda', grupo: 'finas', nome: 'Seda', exemplos: 'Blusas e vestidos',
      guia: SITE + '/cuidados-seda/', urlConfirmada: false,
      maquina: 'Não.',
      processo: 'Lavagem a seco. Quando a bebida deixa sombra, também em água fria, no programa para seda. Passadoria a vapor.',
      prazo: '2 dias (vestidos finos, 5 dias)',
      preco: 'Blusa a partir de R$ 29,00',
      expresso: 'consultar',
      fala: {
        autor: 'liliane',
        texto: 'Muita seda chega com mancha de bebida. Primeiro tiramos o álcool, lavamos a seco e depois em água, para sumir a sombra que a bebida deixa. Quando o tecido colorido fica com aqueles quebrados brancos, um amaciante concentrado da Seitz alinha de novo o brilho da fibra.'
      },
      problemas: [
        {
          id: 'vinho-tinto', nome: 'Vinho tinto', urgencia: 'urgente', origem: 'briefing',
          fazer: [F.pano, F.aguaQuente, F.levar],
          evitar: [F.esfregar, F.aguaQuenteEvitar, F.maquina],
          naDedicada: 'Tira-manchas da Seitz e remoção do álcool; depois, lavagem a seco e em água fria, no programa para seda, para sumir a sombra da bebida.'
        },
        {
          id: 'outras-bebidas', nome: 'Café, chá ou outra bebida', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.aguaQuente, F.levar],
          evitar: [F.esfregar, F.aguaQuenteEvitar, F.maquina],
          naDedicada: 'Tira-manchas da Seitz, remoção do álcool quando a bebida tem álcool, lavagem a seco e depois em água fria, no programa para seda.'
        },
        {
          id: 'quebrados-brancos', nome: 'Quebrados brancos no tecido colorido', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar.'],
          evitar: [F.maquina],
          naDedicada: 'Amaciante concentrado da Seitz, que alinha de novo o brilho da fibra.'
        }
      ]
    },
    {
      id: 'festa-noiva', grupo: 'finas', nome: 'Cetim e organza', exemplos: 'Vestidos de festa e de noiva',
      guia: SITE + '/cuidados-vestidos-festa-noiva/', urlConfirmada: false,
      maquina: 'Não.',
      processo: 'Pré-lavagem à mão, tratamento de cada tipo de mancha, duas ou três lavagens em wet cleaning no programa da Seitz, secagem natural e um dia de descanso antes da embalagem.',
      prazo: 'Noiva, 7 dias; festa, 5 dias',
      preco: 'Sob consulta',
      expresso: 'consultar',
      fala: {
        autor: 'liliane',
        texto: 'O vestido de noiva costuma chegar com a barra muito suja e manchas de comida e vinho. Fazemos a pré-lavagem, deixamos de molho e tratamos cada tipo de mancha com um protocolo próprio antes de lavar no programa da Seitz para noivas. Por isso o prazo é de 7 dias.'
      },
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico, F.maquina],
          naDedicada: null
        },
        {
          id: 'vinho', nome: 'Vinho', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.aguaQuente, F.levar],
          evitar: [F.esfregar, F.aguaQuenteEvitar, F.maquina],
          naDedicada: 'Cada tipo de mancha recebe um protocolo próprio antes da lavagem no programa da Seitz.'
        },
        {
          id: 'comida', nome: 'Mancha de comida', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar, F.maquina],
          naDedicada: 'Cada tipo de mancha recebe um protocolo próprio antes da lavagem no programa da Seitz.'
        },
        {
          id: 'barra-suja', nome: 'Barra suja', urgencia: 'logo', origem: 'briefing',
          fazer: [F.levar],
          evitar: [F.esfregar, F.maquina],
          naDedicada: 'Pré-lavagem à mão e molho antes das lavagens em wet cleaning.'
        }
      ]
    },
    {
      id: 'veludo', grupo: 'finas', nome: 'Veludo', exemplos: 'Blazers, calças e cotelê',
      guia: SITE + '/cuidados-veludo/', urlConfirmada: false,
      maquina: 'Só se a etiqueta permitir água.',
      processo: 'A seco ou em água, conforme a etiqueta, com produtos Seitz. Secagem natural, ferro a distância e em temperatura baixa, e pelo alinhado numa só direção.',
      prazo: 'Sob consulta',
      preco: 'Sob consulta',
      expresso: 'consultar',
      fala: {
        autor: 'liliane',
        texto: 'Veludo, lavamos com produtos Seitz e secamos ao natural. Se precisar passar, é só com o ferro a distância e em temperatura baixa. No fim, alinhamos o pelo numa só direção para o tecido não ficar rajado.'
      },
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico],
          naDedicada: null
        },
        {
          id: 'marca-ferro', nome: 'Marca de ferro', urgencia: 'sem_volta', origem: 'briefing',
          fazer: ['Da próxima vez, passe só com o ferro a distância e em temperatura baixa.'],
          evitar: ['Encostar o ferro no veludo.'],
          naDedicada: 'Ferro sempre a distância e em temperatura baixa, e pelo alinhado no fim.'
        },
        {
          id: 'rajado', nome: 'Tecido rajado', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar.'],
          evitar: ['Encostar o ferro no veludo.'],
          naDedicada: 'No fim da lavagem, o pelo é alinhado numa só direção para o tecido não ficar rajado.'
        }
      ]
    },
    {
      id: 'linho', grupo: 'finas', nome: 'Linho', exemplos: 'Camisas, blazers, calças e vestidos',
      guia: SITE + '/cuidados-linho/', urlConfirmada: true,
      maquina: 'Só se a etiqueta permitir, em água fria.',
      processo: 'A maior parte a seco, para não encolher. Camisas e peças muito sujas vão para a água e secam ao natural, sem secadora.',
      prazo: '2 dias (vestidos finos, 5 dias)',
      preco: 'Camisa a partir de R$ 23,90',
      expresso: 'consultar',
      fala: {
        autor: 'liliane',
        texto: 'A maior parte do linho lavamos a seco, para não encolher. As camisas de linho vão para a água e secam ao natural, e a engomadoria devolve a estrutura, na peça inteira ou só nas partes que precisam.'
      },
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico],
          naDedicada: null
        },
        {
          id: 'mancha-fresca', nome: 'Mancha fresca', urgencia: 'urgente', origem: 'briefing',
          fazer: [F.pano, F.aguaQuente, F.levar],
          evitar: [F.esfregar, F.aguaQuenteEvitar],
          naDedicada: 'Peças muito sujas vão para a água, para melhorar a lavagem e tirar as manchas, e secam ao natural.'
        },
        {
          id: 'encolhimento', nome: 'Medo de encolher', urgencia: 'prevenir', origem: 'briefing',
          fazer: ['Siga a etiqueta. Se ela permitir água, lave em água fria.'],
          evitar: ['Água quente.', 'Secadora.'],
          naDedicada: 'A maior parte do linho vai a seco, justamente para não encolher.'
        }
      ]
    },
    {
      id: 'la', grupo: 'inverno', nome: 'Lã', exemplos: 'Suéteres, agasalhos e casacos',
      guia: SITE + '/cuidados-la/', urlConfirmada: false,
      maquina: 'Não, nem no ciclo delicado.',
      processo: 'Lavagem a seco ou no programa de wet cleaning para lã. Pelos e bolinhas tirados à mão, peça por peça.',
      prazo: '2 dias',
      preco: 'Agasalho a partir de R$ 49,00',
      expresso: 'consultar',
      fala: {
        autor: 'jorge', conferir: 'autor',
        texto: 'Casaco de lã batida e suéter vão para a lavagem a seco. Depois, tiramos à mão os pelos e as bolinhas, peça por peça.'
      },
      problemas: [
        {
          id: 'feltragem', nome: 'Encolheu e endureceu (feltragem)', urgencia: 'sem_volta', origem: 'briefing',
          fazer: ['Da próxima vez, não lave a lã na máquina de casa, nem no ciclo delicado.'],
          evitar: ['Máquina de casa, mesmo no ciclo delicado.'],
          naDedicada: 'Lavagem a seco ou no programa de wet cleaning para lã, que evita a feltragem.'
        },
        {
          id: 'bolinhas', nome: 'Pelos e bolinhas', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar.'],
          evitar: [F.maquina],
          naDedicada: 'Pelos e bolinhas tirados à mão, peça por peça.'
        }
      ]
    },
    {
      id: 'alfaiataria', grupo: 'inverno', nome: 'Ternos e alfaiataria', exemplos: 'Ternos, blazers, calças sociais e gravatas',
      guia: SITE + '/cuidados-alfaiataria/', urlConfirmada: true,
      maquina: 'Não.',
      processo: 'Lavagem a seco em percloroetileno, nas máquinas Firbimatic. Tratamento próprio para o cheiro nas axilas, que preserva a entretela. Passadoria à mão, com ferro e banca profissional.',
      prazo: '2 dias',
      preco: 'Terno a partir de R$ 91,00; paletó, R$ 49,00; calça social, R$ 42,00; gravata, R$ 35,00',
      expresso: 'sim',
      fala: {
        autor: 'jorge',
        texto: 'O terno vai para a lavagem a seco. Quando tem cheiro nas axilas, fazemos um tratamento específico que tira o odor e preserva a entretela, sem deixar bolhas no paletó.'
      },
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar, 'Quem usa o terno de vez em quando deve lavá-lo sempre antes de guardar, para não amarelar nem mofar.'],
          evitar: [F.plastico, F.maquina],
          naDedicada: null
        },
        {
          id: 'cheiro-axilas', nome: 'Cheiro nas axilas', urgencia: 'logo', origem: 'briefing',
          fazer: [F.levar, 'Quem usa terno todo dia deve lavá-lo a seco a cada 15 a 20 dias.'],
          evitar: [F.maquina],
          naDedicada: 'Tratamento específico que tira o odor e preserva a entretela, sem deixar bolhas no paletó.'
        },
        {
          id: 'bolhas', nome: 'Bolhas no peito do paletó', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar. As bolhas aparecem quando a cola da entretela solta.'],
          evitar: [F.maquina],
          naDedicada: 'Lavagem a seco, e o tratamento das axilas preserva a entretela.'
        }
      ]
    },
    {
      id: 'jaquetas', grupo: 'inverno', nome: 'Jaquetas e sintéticos', exemplos: 'Nylon, poliéster, pena e poliuretano',
      guia: SITE + '/cuidados-sintetico/', urlConfirmada: true,
      maquina: 'Nylon e poliéster, se a etiqueta permitir.',
      processo: 'A seco ou em água, conforme a etiqueta; na água, no programa da Seitz. A jaqueta de pena seca por completo, em temperatura baixa.',
      prazo: '2 dias',
      preco: 'A partir de R$ 69,00; poliéster, R$ 99,00; pena, R$ 120,00',
      expresso: 'consultar',
      fala: {
        autor: 'jorge',
        texto: 'Jaqueta de pena tem que sair daqui completamente seca. Secamos em temperatura baixa até as penas voltarem soltas para os gomos, porque pena que fica úmida pode mofar.'
      },
      problemas: [
        {
          id: 'mofo-pena', nome: 'Mofo no recheio de pena', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico, 'Guardar a jaqueta ainda úmida.'],
          naDedicada: 'Secagem completa, em temperatura baixa, até as penas voltarem soltas para os gomos.'
        },
        {
          id: 'descascando', nome: 'Poliuretano descascando', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar.'],
          evitar: [],
          naDedicada: 'Lavagem em água ou higienização da superfície, com secagem natural. Se a peça já está descascando, a equipe avisa antes.'
        }
      ]
    },
    {
      id: 'couro', grupo: 'inverno', nome: 'Couro', exemplos: 'Jaquetas, calças e acessórios',
      guia: SITE + '/cuidados-couro/', urlConfirmada: false,
      maquina: 'Não.',
      processo: 'Wet cleaning, secagem natural e hidratação.',
      prazo: '5 a 7 dias',
      preco: 'Sob consulta',
      expresso: 'nao',
      fala: null, // A fala aprovada fala em "6 a 7 dias"; o briefing diz 5 a 7. Ver perguntas ao dono.
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico, F.maquina],
          naDedicada: 'Wet cleaning, secagem natural e só então hidratação. Pular a secagem estraga a peça.'
        }
      ]
    },
    {
      id: 'peles', grupo: 'inverno', nome: 'Peles', exemplos: 'Pele natural e sintética',
      guia: SITE + '/cuidados-peles/', urlConfirmada: true,
      maquina: 'Não.',
      processo: 'A seco ou em água, conforme a etiqueta; pele de coelho, sempre a seco. Pelo penteado e, na pele natural, couro hidratado.',
      prazo: '7 dias',
      preco: 'A partir de R$ 280,00',
      expresso: 'consultar',
      fala: null, // Aprovada em 27/09; copiar do guia no ar.
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico, F.maquina],
          naDedicada: null
        },
        {
          id: 'couro-ressecado', nome: 'Couro ressecado em peça antiga', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a peça para a equipe avaliar.'],
          evitar: [F.maquina],
          naDedicada: 'Na pele natural, o couro é hidratado. Em peças antigas, a equipe avisa antes de lavar.'
        }
      ]
    },
    {
      id: 'camisas', grupo: 'dia', nome: 'Camisas e algodão', exemplos: 'Camisas, camisetas e polos',
      guia: SITE + '/cuidados-algodao/', urlConfirmada: true,
      maquina: 'Sim, conforme a etiqueta.',
      processo: 'Colarinho e punhos escovados à mão, programa da Seitz para alta sujidade e passadoria no manequim italiano Trevil; o ferro só finaliza colarinho e punhos.',
      prazo: '2 dias',
      preco: 'Camisa a partir de R$ 23,90; camiseta, R$ 18,90',
      expresso: 'consultar',
      fala: {
        autor: 'alejandro',
        texto: 'Colarinho amarelado sai com branqueador óptico, escovação à mão e o programa de alta sujidade da Seitz. Depois a camisa vai para um manequim italiano da Trevil, que, segundo o fabricante, reduz em cerca de 80% o atrito do ferro; o ferro só finaliza colarinho e punhos.'
      },
      problemas: [
        {
          id: 'cor-transferida', nome: 'Cor que passou de outra peça', urgencia: 'urgente', origem: 'briefing',
          fazer: [F.levar],
          evitar: [],
          naDedicada: null
        },
        {
          id: 'colarinho-amarelado', nome: 'Colarinho ou punho amarelado', urgencia: 'avaliar', origem: 'briefing',
          fazer: [F.levar],
          evitar: [],
          naDedicada: 'Branqueador óptico, escovação à mão e o programa de alta sujidade da Seitz. Nas camisas muito amareladas e com gordura no colarinho, nos punhos ou nas axilas: lavagem a seco antes da água e uma pasta que age de um dia para o outro.'
        }
      ]
    },
    {
      id: 'jeans', grupo: 'dia', nome: 'Jeans e sarja', exemplos: 'Calças, jaquetas, shorts e bermudas',
      guia: SITE + '/cuidados-jeans-sarja/', urlConfirmada: false,
      maquina: 'Sim: do avesso, em água fria e sem lotar a máquina.',
      processo: 'Pré-tratamento das manchas e água fria no wet cleaning, ou lavagem a seco quando a peça permite.',
      prazo: '2 dias',
      preco: 'A partir de R$ 29,00',
      expresso: 'consultar',
      fala: {
        autor: 'alejandro',
        texto: 'A pergunta que mais ouvimos é como lavar sem desbotar. Lavamos em água fria, no wet cleaning, e, quando a peça permite, a seco, sem água nenhuma.'
      },
      problemas: [
        {
          id: 'graxa', nome: 'Graxa', urgencia: 'urgente', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: 'Pré-tratamento da mancha antes da lavagem.'
        },
        {
          id: 'desbote', nome: 'Desbote', urgencia: 'prevenir', origem: 'briefing',
          fazer: ['Lave do avesso, em água fria e sem lotar a máquina.'],
          evitar: ['Água quente.', 'Máquina lotada.'],
          naDedicada: 'Água fria no wet cleaning ou, quando a peça permite, lavagem a seco, sem água nenhuma.'
        }
      ]
    },
    {
      id: 'tenis', grupo: 'dia', nome: 'Tênis e calçados', exemplos: 'Tênis de tecido e de couro',
      guia: SITE + '/cuidados-tenis-calcados/', urlConfirmada: true,
      maquina: 'Não.',
      processo: 'Molho de 24 horas, escovação à mão do corpo, da sola e dos cadarços com pasta especial, wet cleaning, branqueamento e secagem natural. O tênis de couro, que não vai na água, é higienizado à mão.',
      prazo: '3 dias',
      preco: 'A partir de R$ 85,00',
      expresso: 'nao',
      fala: {
        autor: 'alejandro',
        texto: 'O tênis é lavado à mão, com uma pasta especial que tira a sujeira e o cheiro, e seca ao natural. Também higienizamos tênis de couro, que não podem ir na água.'
      },
      problemas: [
        {
          id: 'graxa-oleo', nome: 'Graxa ou óleo', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar, F.maquina],
          naDedicada: null
        },
        {
          id: 'cheiro', nome: 'Cheiro', urgencia: 'avaliar', origem: 'briefing',
          fazer: [F.levar],
          evitar: [F.maquina],
          naDedicada: 'A pasta especial usada na escovação à mão tira a sujeira e o cheiro.'
        }
      ]
    },
    {
      id: 'roupa-de-cama', grupo: 'casa', nome: 'Roupa de cama e toalhas', exemplos: 'Lençóis, fronhas, toalhas e enxoval',
      guia: SITE + '/cuidados-roupa-de-cama/', urlConfirmada: true,
      maquina: 'Sim; lençol de seda, não.',
      processo: 'Ciclo de enxoval da Seitz, sempre em água; lençol de seda só a seco. Toalhas com duplo alvejamento sem cloro; lençóis passados e embalados por jogo.',
      prazo: '3 dias',
      preco: 'Lençóis a partir de R$ 44,00 o quilo; toalha de banho, R$ 14,00',
      expresso: 'consultar',
      fala: {
        autor: 'liliane',
        texto: 'Lençóis, fronhas e toalhas vão sempre para a água, no ciclo de enxoval da Seitz; só o lençol de seda vai a seco. As toalhas passam por duplo alvejamento, e os lençóis saem passados e embalados por jogo, prontos para usar ou guardar.'
      },
      problemas: [
        {
          id: 'toalha-mofo', nome: 'Toalha com cheiro de mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: ['Guardar a toalha ainda úmida.'],
          naDedicada: 'Ciclo de enxoval da Seitz e duplo alvejamento sem cloro.'
        }
      ]
    },
    {
      id: 'edredom', grupo: 'casa', nome: 'Edredom', exemplos: 'Solteiro, casal, king e pena',
      guia: SITE + '/cuidados-edredom/', urlConfirmada: true,
      maquina: 'Casal e king não cabem direito na máquina de casa.',
      processo: 'Remoção manual de manchas e máquinas industriais. Os edredons claros passam por duplo alvejamento sem cloro. O de pena seca por completo.',
      prazo: '2 dias',
      preco: 'Solteiro a partir de R$ 69,00; casal, R$ 94,00; king, R$ 110,00; pena, R$ 190,00',
      expresso: 'consultar',
      fala: null, // Aprovada em 27/09; copiar do guia no ar.
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico],
          naDedicada: null
        },
        {
          id: 'xixi', nome: 'Xixi de criança ou de pet', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: 'Remoção manual de manchas. As duas lojas têm uma lavadora só para peças de pet.'
        },
        {
          id: 'percevejos', nome: 'Percevejos', urgencia: 'logo', origem: 'briefing',
          fazer: [F.levar],
          evitar: [],
          naDedicada: 'Ácido peracético contra percevejos, em todos os edredons.'
        }
      ]
    },
    {
      id: 'cortinas', grupo: 'casa', nome: 'Cortinas', exemplos: 'Voal, linho e blackout',
      guia: SITE + '/cuidados-cortinas/', urlConfirmada: true,
      maquina: 'Voal e poliéster leves, se a etiqueta permitir; linho, blackout e cortinas grandes, não.',
      processo: 'Barras esfregadas à mão, wet cleaning em ciclo próprio e secagem natural. Linho não pré-encolhido vai a seco. A equipe não tira nem coloca a cortina no trilho.',
      prazo: '3 a 4 dias',
      preco: 'Sob consulta',
      expresso: 'consultar',
      fala: null, // Aprovada em 27/09; copiar do guia no ar.
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [],
          naDedicada: 'O mofo é tratado quando possível, antes da lavagem em ciclo próprio.'
        },
        {
          id: 'barra-suja', nome: 'Barra suja', urgencia: 'avaliar', origem: 'briefing',
          fazer: [F.levar],
          evitar: [],
          naDedicada: 'Barras esfregadas à mão antes do wet cleaning.'
        },
        {
          id: 'blackout', nome: 'Cortina blackout suja', urgencia: 'avaliar', origem: 'briefing',
          fazer: ['Leve a cortina para a equipe avaliar se o tecido é lavável.'],
          evitar: [F.maquina],
          naDedicada: 'Blackout só é lavado quando o tecido é lavável: a maioria fica pegajosa ou quebradiça.'
        }
      ]
    },
    {
      id: 'pelucias', grupo: 'criancas', nome: 'Pelúcias e fantasias', exemplos: 'Bichos de pelúcia e fantasias',
      guia: SITE + '/cuidados-pelucias-fantasias/', urlConfirmada: true,
      maquina: 'Pelúcias pequenas, às vezes; secadora, nunca.',
      processo: 'Escovação à mão, wet cleaning e secagem natural. Pelúcias de até 1 metro de altura; com peças eletrônicas, só se elas puderem ser retiradas.',
      prazo: 'Pelúcia, 3 dias; fantasia, cerca de 5 dias',
      preco: 'Pelúcia a partir de R$ 80,00; fantasia, R$ 180,00',
      expresso: 'consultar',
      fala: null, // Aprovada em 27/09; copiar do guia no ar.
      problemas: [
        {
          id: 'xixi', nome: 'Xixi', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar, 'Secadora.'],
          naDedicada: null
        },
        {
          id: 'vomito', nome: 'Vômito', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar, 'Secadora.'],
          naDedicada: null
        },
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico, 'Secadora.'],
          naDedicada: null
        }
      ]
    },
    {
      id: 'carrinho', grupo: 'criancas', nome: 'Carrinho de bebê', exemplos: 'Carrinho e bebê conforto',
      guia: SITE + '/cuidados-carrinho-de-bebe/', urlConfirmada: true,
      maquina: 'Estrutura, não; capas, conforme a etiqueta e o manual.',
      processo: 'Desmontagem, lavagem à mão da capa e da estrutura, cinto de segurança higienizado só por fora, sem encharcar, e secagem natural com ventilador profissional.',
      prazo: '7 dias',
      preco: 'Carrinho a partir de R$ 390,00; bebê conforto, R$ 290,00',
      expresso: 'consultar',
      fala: null, // Aprovada em 27/09; copiar do guia no ar.
      problemas: [
        {
          id: 'vomito', nome: 'Vômito', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: null
        },
        {
          id: 'leite', nome: 'Leite', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: null
        },
        {
          id: 'xixi', nome: 'Xixi', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: null
        },
        {
          id: 'comida', nome: 'Restos de comida', urgencia: 'logo', origem: 'briefing',
          fazer: [F.pano, F.levar],
          evitar: [F.esfregar],
          naDedicada: null
        },
        {
          id: 'mofo', nome: 'Mofo', urgencia: 'urgente', prazo: 'de preferência em até 24 horas', origem: 'briefing',
          fazer: [F.mofo24, F.levar],
          evitar: [F.plastico],
          naDedicada: null
        }
      ]
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

  function acharPeca(id) {
    for (var i = 0; i < PECAS.length; i++) if (PECAS[i].id === id) return PECAS[i];
    return null;
  }
  function acharProblema(peca, id) {
    if (!peca) return null;
    for (var i = 0; i < peca.problemas.length; i++) if (peca.problemas[i].id === id) return peca.problemas[i];
    return null;
  }
  function problemasOrdenados(peca) {
    return peca.problemas.slice().sort(function (a, b) {
      return URGENCIA[a.urgencia].ordem - URGENCIA[b.urgencia].ordem;
    });
  }
  function linkWhats(msg) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }
  function minusculaInicial(s) {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  /* Cria elementos sem innerHTML: h('p', {class: 'x'}, 'texto', filho, ...) */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
        if (k === 'onclick') el.addEventListener('click', attrs[k]);
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

  /* ---------- Estado na URL: #seda  ou  #seda/vinho-tinto ---------- */
  function lerEstado() {
    var partes = decodeURIComponent((location.hash || '').replace(/^#\/?/, '')).split('/');
    var peca = acharPeca(partes[0]);
    var problema = acharProblema(peca, partes[1]);
    return { peca: peca, problema: problema };
  }
  function irPara(pecaId, problemaId) {
    var hash = pecaId ? '#' + pecaId + (problemaId ? '/' + problemaId : '') : '';
    if (hash === location.hash || (!hash && !location.hash)) { desenhar(true); return; }
    if (hash) history.pushState(null, '', hash);
    else history.pushState(null, '', location.pathname + location.search);
    desenhar(true);
  }

  /* ---------- Desenho ---------- */
  var raiz, avisoLeitor, ultimoHash = null;

  function desenhar(mudouPasso) {
    ultimoHash = location.hash;
    var estado = lerEstado();
    var passo = !estado.peca ? 1 : !estado.problema ? 2 : 3;
    var conteudo;
    if (passo === 1) conteudo = telaPeca();
    else if (passo === 2) conteudo = telaProblema(estado.peca);
    else conteudo = telaResultado(estado.peca, estado.problema);

    raiz.textContent = '';
    raiz.appendChild(etapas(passo, estado));
    raiz.appendChild(conteudo);
    raiz.setAttribute('data-passo', String(passo));

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

  function etapas(passo, estado) {
    var itens = [
      { n: 1, rotulo: 'Peça', valor: estado.peca && estado.peca.nome, ir: function () { irPara(null); } },
      { n: 2, rotulo: 'Problema', valor: estado.problema && estado.problema.nome, ir: function () { irPara(estado.peca.id); } },
      { n: 3, rotulo: 'O que fazer', valor: null, ir: null }
    ];
    return h('ol', { class: 'dm-etapas', 'aria-label': 'Passos do diagnóstico' },
      itens.map(function (it) {
        var estadoItem = it.n < passo ? 'feito' : it.n === passo ? 'atual' : 'depois';
        var miolo = [
          h('span', { class: 'dm-etapa-num', 'aria-hidden': 'true' }, String(it.n)),
          h('span', { class: 'dm-etapa-txt' },
            h('span', { class: 'dm-etapa-rotulo' }, it.rotulo),
            it.valor && estadoItem === 'feito' ? h('span', { class: 'dm-etapa-valor' }, it.valor) : null)
        ];
        return h('li', { class: 'dm-etapa dm-etapa--' + estadoItem, 'aria-current': estadoItem === 'atual' ? 'step' : null },
          estadoItem === 'feito' && it.ir
            ? h('button', { type: 'button', class: 'dm-etapa-btn', onclick: it.ir, 'aria-label': 'Voltar ao passo ' + it.n + ': ' + it.rotulo + (it.valor ? ' (' + it.valor + ')' : '') }, miolo)
            : h('span', { class: 'dm-etapa-btn' }, miolo));
      }));
  }

  function telaPeca() {
    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t1' },
      h('h2', { class: 'dm-titulo', id: 'dm-t1', tabindex: '-1' }, 'Qual é a peça?'),
      h('p', { class: 'dm-dica' }, 'Escolha o tecido ou o tipo de peça. Não sabe o tecido? Veja a etiqueta da peça.'),
      GRUPOS.map(function (g) {
        var pecas = PECAS.filter(function (p) { return p.grupo === g.id; });
        if (!pecas.length) return null;
        return h('div', { class: 'dm-grupo' },
          h('h3', { class: 'dm-grupo-nome' }, g.nome),
          h('ul', { class: 'dm-grade', role: 'list' }, pecas.map(function (p) {
            return h('li', null, h('button', { type: 'button', class: 'dm-cartao', onclick: function () { irPara(p.id); } },
              h('span', { class: 'dm-cartao-nome' }, p.nome),
              p.exemplos ? h('span', { class: 'dm-cartao-sub' }, p.exemplos) : null));
          })));
      }),
      h('p', { class: 'dm-rodape-tela' }, 'Não encontrou a peça? ',
        h('a', { href: linkWhats('Olá! Vim do Diagnóstico de Manchas e não encontrei minha peça. Podem me ajudar?'), target: '_blank', rel: 'noopener' }, 'Fale com a Dedicada pelo WhatsApp'), '.')
    );
  }

  function selo(urgencia) {
    var u = URGENCIA[urgencia];
    return h('span', { class: 'dm-selo dm-selo--' + urgencia }, u.rotulo);
  }

  function telaProblema(peca) {
    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t2' },
      h('h2', { class: 'dm-titulo', id: 'dm-t2', tabindex: '-1' }, 'Qual é o problema?'),
      h('p', { class: 'dm-dica' }, 'Em ' + minusculaInicial(peca.nome) + '. Os mais urgentes aparecem primeiro.'),
      h('ul', { class: 'dm-lista', role: 'list' }, problemasOrdenados(peca).map(function (pr) {
        return h('li', null, h('button', { type: 'button', class: 'dm-opcao', onclick: function () { irPara(peca.id, pr.id); } },
          h('span', { class: 'dm-opcao-nome' }, pr.nome),
          selo(pr.urgencia)));
      })),
      h('div', { class: 'dm-nao-achei' },
        h('p', null, h('strong', null, 'Não achou o seu problema? '), 'Mande uma foto da peça pelo WhatsApp ou veja o guia completo.'),
        h('div', { class: 'dm-acoes' },
          h('a', { class: 'dm-btn dm-btn--primario', href: linkWhats('Olá! Vim do Diagnóstico de Manchas. Tenho um problema em ' + minusculaInicial(peca.nome) + ' que não está na lista. Posso mandar uma foto?'), target: '_blank', rel: 'noopener' }, 'Mandar foto pelo WhatsApp'),
          h('a', { class: 'dm-btn', href: peca.guia }, 'Guia de ' + minusculaInicial(peca.nome)))),
      h('p', { class: 'dm-voltar' }, h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(null); } }, '← Escolher outra peça'))
    );
  }

  function lista(tag, itens, classe) {
    if (!itens || !itens.length) return null;
    return h(tag, { class: classe }, itens.map(function (t) { return h('li', null, t); }));
  }

  function telaResultado(peca, pr) {
    var u = URGENCIA[pr.urgencia];
    var pessoa = peca.fala && PESSOAS[peca.fala.autor];
    var tituloEvitar = pr.urgencia === 'sem_volta' || pr.urgencia === 'prevenir' ? 'O que evitar' : 'O que não fazer';
    var tituloFazer = pr.urgencia === 'sem_volta' || pr.urgencia === 'prevenir' ? 'Como evitar' : 'O que fazer agora, em casa';
    var msg = 'Olá! Vim do Diagnóstico de Manchas. Tenho ' + minusculaInicial(pr.nome) + ' em ' + minusculaInicial(peca.nome) + '. Podem me ajudar?';

    return h('section', { class: 'dm-tela dm-resultado', 'aria-labelledby': 'dm-t3' },
      h('h2', { class: 'dm-titulo', id: 'dm-t3', tabindex: '-1' }, pr.nome + ' em ' + minusculaInicial(peca.nome)),

      h('div', { class: 'dm-alerta dm-alerta--' + pr.urgencia },
        selo(pr.urgencia),
        h('p', null, pr.prazo ? 'Trate quanto antes, ' + pr.prazo + '.' : u.frase)),

      h('div', { class: 'dm-bloco' },
        h('h3', null, tituloFazer),
        lista('ol', pr.fazer, 'dm-passos')),

      pr.evitar && pr.evitar.length ? h('div', { class: 'dm-bloco' },
        h('h3', null, tituloEvitar),
        lista('ul', pr.evitar, 'dm-evitar')) : null,

      h('p', { class: 'dm-maquina' }, h('strong', null, 'Pode ir na máquina de casa? '), peca.maquina),

      h('div', { class: 'dm-bloco dm-dedicada' },
        h('h3', null, 'Como a Dedicada trata'),
        pr.naDedicada ? h('p', null, pr.naDedicada) : null,
        h('p', null, peca.processo),
        h('dl', { class: 'dm-fatos' },
          h('div', null, h('dt', null, 'Prazo'), h('dd', null, peca.prazo)),
          h('div', null, h('dt', null, 'Preço'), h('dd', null, peca.preco)),
          h('div', null, h('dt', null, 'Expresso'), h('dd', null, EXPRESSO[peca.expresso])))),

      pessoa ? h('figure', { class: 'dm-fala' },
        h('blockquote', null, h('p', null, '“' + peca.fala.texto + '”')),
        h('figcaption', null, pessoa.nome + ', ' + pessoa.papel)) : null,

      h('div', { class: 'dm-acoes dm-acoes--final' },
        h('a', { class: 'dm-btn dm-btn--primario', href: linkWhats(msg), target: '_blank', rel: 'noopener' }, 'Falar pelo WhatsApp'),
        h('a', { class: 'dm-btn', href: peca.guia }, 'Guia de ' + minusculaInicial(peca.nome))),

      h('p', { class: 'dm-coleta' }, COLETA),

      h('div', { class: 'dm-navegar' },
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(peca.id); } }, '← Outro problema em ' + minusculaInicial(peca.nome)),
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(null); } }, 'Começar de novo'))
    );
  }

  /* ---------- Conferência do banco (roda no console e no teste) ---------- */
  function validar() {
    var erros = [], avisos = [], ids = {};
    PECAS.forEach(function (p) {
      if (ids[p.id]) erros.push('Peça repetida: ' + p.id);
      ids[p.id] = true;
      ['nome', 'grupo', 'guia', 'maquina', 'processo', 'prazo', 'preco', 'expresso'].forEach(function (c) {
        if (!p[c]) erros.push(p.id + ': falta ' + c);
      });
      if (!GRUPOS.some(function (g) { return g.id === p.grupo; })) erros.push(p.id + ': grupo inexistente ' + p.grupo);
      if (!EXPRESSO[p.expresso]) erros.push(p.id + ': expresso inválido');
      if (!p.urlConfirmada) avisos.push(p.id + ': endereço do guia não confirmado (' + p.guia + ')');
      if (!p.fala) avisos.push(p.id + ': sem fala aprovada');
      else if (!PESSOAS[p.fala.autor]) erros.push(p.id + ': autor da fala inexistente');
      else if (p.fala.conferir) avisos.push(p.id + ': conferir ' + p.fala.conferir + ' da fala');
      if (!p.problemas || !p.problemas.length) erros.push(p.id + ': sem problemas');
      var idsPr = {};
      (p.problemas || []).forEach(function (pr) {
        if (idsPr[pr.id]) erros.push(p.id + '/' + pr.id + ': problema repetido');
        idsPr[pr.id] = true;
        if (!pr.nome) erros.push(p.id + '/' + pr.id + ': falta nome');
        if (!URGENCIA[pr.urgencia]) erros.push(p.id + '/' + pr.id + ': urgência inválida');
        if (!pr.fazer || !pr.fazer.length) erros.push(p.id + '/' + pr.id + ': falta o que fazer');
        if (pr.origem !== 'guia') avisos.push(p.id + '/' + pr.id + ': origem ' + pr.origem + ' (conferir com o guia)');
      });
    });
    return { erros: erros, avisos: avisos };
  }

  /* Exposto só para o teste e para conferência no console. */
  window.DM_DIAGNOSTICO = { PECAS: PECAS, GRUPOS: GRUPOS, URGENCIA: URGENCIA, PESSOAS: PESSOAS, validar: validar };

  function iniciar() {
    raiz = document.getElementById('dm-app');
    if (!raiz) return;
    raiz.classList.add('dm-app');
    raiz.setAttribute('data-js', 'ok');
    var aviso = raiz.querySelector('.dm-sem-js');
    if (aviso) aviso.remove();
    avisoLeitor = h('p', { class: 'dm-so-leitor', 'aria-live': 'polite' });
    raiz.parentNode.insertBefore(avisoLeitor, raiz.nextSibling);
    function aoMudarUrl() { if (location.hash !== ultimoHash) desenhar(true); }
    window.addEventListener('popstate', aoMudarUrl);
    window.addEventListener('hashchange', aoMudarUrl);
    desenhar(!!location.hash);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
