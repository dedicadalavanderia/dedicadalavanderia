// Lote 2 da revisão do blog (29/09/2026): toalhas de mesa, guardanapos e fardas, com o processo
// e o prazo que o dono confirmou em 29/09. O preço dessas peças ainda não foi confirmado.
const PRECO = 'O preço é conforme a peça: mande uma foto e peça o orçamento pelo WhatsApp.';
const PRAZO_MESA = `<p>Toalhas de mesa e guardanapos ficam prontos em 4 dias. São três etapas: a lavagem a seco, a lavagem em água e a goma, que seca ao natural, porque na secadora a goma desaparece. ${PRECO}</p>`;
const PRAZO_FARDAS = `<p>A farda fica pronta em 2 dias. ${PRECO}</p>`;

const PROCESSO_MESA = `<ol>
<li>Lavagem a seco primeiro, para tirar a gordura de comidas.</li>
<li>Lavagem em água, com a remoção do restante das manchas.</li>
<li>Goma e secagem natural, sem secadora: na secadora, a goma desaparece.</li>
<li>Passadoria à mão e embalagem: toalhas e guardanapos saem prontos para uso ou para guardar.</li>
</ol>`;

export const LOTE2 = [
  {
    slug: 'lavagem-de-toalhas-de-mesa-em-florianopolis',
    tituloAntigo: 'Lavagem de Toalhas de Mesa em Florianópolis',
    titulo: 'Toalha de mesa manchada: como a Dedicada lava em Florianópolis?',
    seoTitulo: 'Lavagem de Toalhas de Mesa em Florianópolis',
    meta: 'Toalha de mesa com vinho, molho ou gordura? Na Dedicada, ela vai primeiro a seco, para tirar a gordura, e depois para a água. Volta com goma, passada.',
    assina: 'jorge', falaDe: null,
    resposta: 'Tire o excesso encostando um pano limpo, sem esfregar, não use água quente e não guarde a toalha úmida. Na Dedicada, a toalha vai primeiro para a lavagem a seco, que tira a gordura de comidas, e depois para a água, onde sai o restante das manchas. Depois, recebe goma, seca ao natural e é passada à mão.',
    ancora: 'mesa', assunto: 'toalha de mesa',
    chamada: 'Toalha manchada agora? Escolha a mancha no Diagnóstico de Manchas e veja o que fazer',
    tabela: [],
    secoes: [
      { h2: 'O que fazer quando a toalha de mesa mancha?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use água quente: ela fixa manchas de vinho, café e chá, e o calor fixa manchas de comida.</li>
<li>Não guarde a toalha úmida nem com a mancha: manchas de comida e de bebida se fixam com o tempo.</li>
<li>Não use água sanitária: nas peças coloridas, o cloro deixa manchas claras que não voltam.</li>
<li>Ao entregar, conte o que caiu na toalha e quando.</li>
</ol>` },
      { h2: 'Por que a toalha vai primeiro a seco?', html: `<p>Para tirar a gordura de comidas. Depois, na água, sai o restante das manchas. Na Dedicada, cada família de mancha tem o seu tira-manchas da Seitz (V1, V2 ou V3), e cada mancha é tratada na sua vez.</p>` },
      { h2: 'Como a Dedicada lava toalhas de mesa?', html: `${PROCESSO_MESA}
<p>Os guardanapos de tecido passam pelo mesmo processo.</p>` },
      { h2: 'Por que a toalha leva 4 dias?', html: PRAZO_MESA }
    ],
    perguntas: [
      ['Toalha de mesa com gordura sai?', 'Na Dedicada, a toalha vai primeiro para a lavagem a seco, justamente para tirar a gordura de comidas. Depois, na água, é removido o restante das manchas.'],
      ['Quanto tempo leva a lavagem da toalha de mesa?', 'Na Dedicada, 4 dias: a toalha passa pela lavagem a seco, pela lavagem em água e pela goma, que seca ao natural. Na secadora, a goma desaparece.'],
      ['A toalha volta passada?', 'Sim. Depois da lavagem, recebe goma e seca ao natural; quando seca, é passada à mão e embalada, pronta para uso ou para guardar.'],
      ['Posso lavar toalha de mesa com mancha de vinho em casa?', 'Tire só o excesso com um pano limpo, sem esfregar, e não use água quente, que fixa a mancha de vinho. Quanto antes a toalha chega à lavanderia, melhor.']
    ],
    guias: [],
    extras: [['/lavagem-de-guardanapos/', 'Lavagem de guardanapos'], ['/retirada-de-manchas-de-comida-molhos-bebidas-e-sucos/', 'Mancha de comida, molho ou suco']],
    mudou: [
      'Saíram "os melhores produtos para lavanderia do mundo" e "isto remove todas as manchas gordurosas".',
      'O processo e o prazo ficaram como o dono descreveu em 29/09: a seco primeiro, depois em água, goma, secagem natural sem secadora, passadoria à mão e embalagem, em 4 dias.',
      'Saíram o alvejamento com ácido peracético e altas temperaturas e as opções de goma forte ou meia goma, que não foram confirmados.',
      'Entraram a resposta curta, o passo a passo e o botão para o Diagnóstico de Manchas, já em toalhas de mesa. O preço ficou geral, até o dono confirmar (pergunta 15).'
    ]
  },
  {
    slug: 'lavagem-de-guardanapos',
    tituloAntigo: 'Lavagem de Guardanapos',
    titulo: 'Guardanapos de tecido manchados: como a Dedicada lava?',
    seoTitulo: 'Lavagem de Guardanapos de Tecido em Florianópolis',
    meta: 'Guardanapos de tecido com gordura, vinho ou molho? Na Dedicada, vão primeiro a seco e depois para a água, recebem goma e voltam passados, prontos para usar.',
    assina: 'alejandro', falaDe: null,
    resposta: 'Na Dedicada, os guardanapos vão primeiro para a lavagem a seco, que tira a gordura de comidas, e depois para a água, onde sai o restante das manchas. Recebem goma, secam ao natural e são passados à mão e embalados, prontos para uso ou para guardar. Até levar, não use água quente e não guarde os guardanapos úmidos.',
    ancora: 'mesa', assunto: 'guardanapos',
    chamada: 'Guardanapo manchado? Escolha a mancha no Diagnóstico de Manchas e veja o que fazer',
    tabela: [],
    secoes: [
      { h2: 'O que fazer com o guardanapo manchado?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar.</li>
<li>Não use água quente: ela fixa manchas de vinho, café e chá, e o calor fixa manchas de comida.</li>
<li>Não guarde os guardanapos úmidos nem sujos: manchas de comida e de bebida se fixam com o tempo.</li>
<li>Ao entregar, conte o que caiu e quando.</li>
</ol>` },
      { h2: 'Como a Dedicada lava guardanapos?', html: `${PROCESSO_MESA}
<p>As toalhas de mesa passam pelo mesmo processo.</p>` },
      { h2: 'Por que os guardanapos levam 4 dias?', html: PRAZO_MESA }
    ],
    perguntas: [
      ['Por que o guardanapo vai primeiro a seco?', 'Para tirar a gordura de comidas. Depois, na água, é removido o restante das manchas.'],
      ['Quanto tempo leva a lavagem dos guardanapos?', 'Na Dedicada, 4 dias: os guardanapos passam pela lavagem a seco, pela lavagem em água e pela goma, que seca ao natural. Na secadora, a goma desaparece.'],
      ['Os guardanapos voltam passados?', 'Sim. Recebem goma, secam ao natural e, quando secos, são passados à mão e embalados, prontos para uso ou para guardar.'],
      ['Posso usar água sanitária nos guardanapos brancos?', 'Não é o indicado: o cloro enfraquece a fibra. Nas peças brancas, prefira alvejante à base de oxigênio, se a etiqueta permitir.']
    ],
    guias: [],
    extras: [['/lavagem-de-toalhas-de-mesa-em-florianopolis/', 'Lavagem de toalhas de mesa']],
    mudou: [
      'Saíram "os melhores do mundo" e "uma equipe especializada que garante a higienização".',
      '"Acabamento com goma, quando solicitado" virou o processo que o dono descreveu em 29/09: a seco, em água, goma, secagem natural sem secadora, passadoria à mão e embalagem, em 4 dias.',
      'Entraram a resposta curta, o passo a passo e o botão para o Diagnóstico de Manchas. O preço ficou geral, até o dono confirmar (pergunta 15).'
    ]
  },
  {
    slug: 'lavagem-de-fardas-higiene-e-imagem-em-cada-detalhe',
    tituloAntigo: 'Lavagem de Fardas: Higiene e Imagem em Cada Detalhe',
    titulo: 'Como a Dedicada lava fardas e uniformes de trabalho?',
    seoTitulo: 'Lavagem de Fardas e Uniformes em Florianópolis',
    meta: 'Fardas com entretela vão para a lavagem a seco; as sem entretela, para a água. Depois, são secas, passadas e entregues em cabide, prontas para uso.',
    assina: 'jorge', falaDe: 'alfaiataria',
    resposta: 'Depende da farda. A de estilo alfaiataria, com entretela, vai para a lavagem a seco; a que não tem entretela vai para a água. Depois, a farda é seca, passada e entregue em cabide, pronta para uso. Em casa, não encharque farda com entretela: a água pode soltar a cola da entretela.',
    ancora: 'fardas', assunto: 'lavagem de fardas',
    chamada: 'Farda manchada? Escolha a mancha no Diagnóstico de Manchas e veja o que fazer',
    tabela: [],
    secoes: [
      { h2: 'Por que a entretela muda a lavagem?', html: `<p>Porque água e calor soltam a cola da entretela e deixam bolhas no peito, como acontece no paletó do terno. Por isso, a farda estilo alfaiataria vai para a lavagem a seco, e a que não tem entretela vai para a água.</p>` },
      { h2: 'Como a Dedicada lava fardas?', html: `<ol>
<li>Lavagem a seco, quando a farda é estilo alfaiataria e tem entretela; em água, quando não tem.</li>
<li>Manchas tratadas antes da lavagem, com o tira-manchas da Seitz próprio da família de cada uma (V1, V2 ou V3).</li>
<li>Secagem e passadoria.</li>
<li>Entrega em cabide, pronta para uso.</li>
</ol>
{{FALA}}` },
      { h2: 'O que fazer com a farda manchada?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar.</li>
<li>Não encharque a farda com entretela: a água pode soltar a cola da entretela.</li>
<li>Não passe ferro antes de a mancha sair: o calor fixa a mancha.</li>
<li>Ao entregar, conte o que caiu, quando e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Quanto tempo leva e quanto custa?', html: PRAZO_FARDAS }
    ],
    perguntas: [
      ['Farda com entretela pode ir na máquina?', 'Não é o indicado: água e calor soltam a cola da entretela e deixam bolhas no peito. Na Dedicada, a farda estilo alfaiataria vai para a lavagem a seco.'],
      ['A farda volta passada?', 'Sim: depois de seca, é passada e entregue em cabide, pronta para uso.'],
      ['Quanto tempo leva a lavagem da farda?', 'Na Dedicada, a farda fica pronta em 2 dias.']
    ],
    guias: ['alfaiataria'],
    mudou: [
      'Saíram "garantindo que a farda esteja sempre bem-apresentada" e "para garantir conforto e bem-estar".',
      'Saiu "limpeza profissional elimina ácaros e bactérias", que não foi confirmado.',
      'Entraram o processo e o prazo que o dono descreveu em 29/09: a seco com entretela, em água sem entretela, secagem, passadoria e entrega em cabide, em 2 dias. Entraram também a fala aprovada do Jorge (guia de ternos) e o botão para o Diagnóstico de Manchas, já em fardas e uniformes. O preço ficou geral, até o dono confirmar (pergunta 15).'
    ]
  }
];
