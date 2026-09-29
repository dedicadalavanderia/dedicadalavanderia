// Posts do blog revisados. Cada post mantém o endereço (slug) e o assunto do original.
// Regras: só fatos dos guias, da página central e da ferramenta; falas só as já aprovadas
// (a "fala" do guia de quem assina); nada de "o melhor", "exclusivo", "garantia", "definitivo",
// percentuais sem fonte, receitas caseiras ou "toda Florianópolis".
//
// Campos:
//   slug, tituloAntigo      endereço (não muda) e título atual, para comparar
//   titulo                  título do post (vira o H1 do tema)
//   seoTitulo, meta         título e descrição para o plugin de SEO
//   assina                  liliane | jorge | alejandro; falaDe: id da peça cuja fala aprovada entra (ou null)
//   resposta                resposta curta do começo (cerca de 40 a 60 palavras)
//   ancora                  aonde o botão leva na ferramenta: 'm-vinho' (mancha), 'viscose' (peça) ou '' (início)
//   assunto                 o assunto do post, na mensagem do WhatsApp ("Vim do post sobre ...")
//   chamada                 texto do botão para a ferramenta
//   secoes                  [{ h2, html }]; html pode usar {{TABELA}} para a tabela de urgência
//   tabela                  [[peça, problema], ...] da ferramenta: urgência e "o que acontece" dos guias
//   perguntas               [[pergunta, resposta], ...]: viram seção visível e dados estruturados
//   guias                   ids das peças cujos guias entram em "Leia também"
//   mudou                   o que mudou em relação ao post no ar
import { LOTE1 } from './posts-lote1.mjs';

export const POSTS = [
  {
    slug: 'removemos-manchas-de-vinho-dedicada-lavanderia',
    tituloAntigo: 'Removemos manchas de vinho das suas roupas com segurança e eficiência',
    titulo: 'Mancha de vinho na roupa: o que fazer e como a lavanderia tira?',
    seoTitulo: 'Mancha de Vinho na Roupa: o Que Fazer e Como Tirar',
    meta: 'Caiu vinho na roupa? Tire o excesso com um pano, sem esfregar e sem água quente, e leve a peça logo. Veja a urgência na seda, no linho, na lã e no couro.',
    assina: 'liliane', falaDe: 'seda',
    resposta: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente, que fixa a mancha de vinho. Não passe ferro nem secador e leve a peça quanto antes: na seda, o vinho tinto pede cuidado em menos de 24 horas; no linho, na lã e no couro, em até 24 horas.',
    ancora: 'm-vinho', assunto: 'mancha de vinho',
    chamada: 'Está com vinho na roupa agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['seda', 'vinho-tinto'], ['linho', 'vinho-cafe-cha'], ['la', 'vinho'], ['veludo', 'bebida-comida'], ['couro', 'vinho'], ['festa-noiva', 'barra-comida-vinho']],
    secoes: [
      { h2: 'O que fazer logo que cai vinho na roupa?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use água quente: ela fixa manchas de vinho, café e chá.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair: o calor fixa a mancha.</li>
<li>Não use tira-manchas caseiro, álcool nem água sanitária: em seda, couro e jeans colorido, o dano costuma ser pior que a mancha.</li>
<li>Até levar, deixe a peça arejar, longe do calor e fora de saco plástico.</li>
<li>Ao entregar, conte que é vinho, quando aconteceu e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Por que a mancha de vinho é difícil de tirar?', html: `<p>Porque o vinho é uma mancha vegetal, de tanino, como café, chá, suco e refrigerante. Ela pede um tira-manchas próprio, diferente do usado para gordura ou para comida, e a água quente fixa a mancha no tecido.</p>
<p>Alguns tecidos pioram o caso. Na seda, a bebida com álcool pode tirar a cor no ponto onde cai, e esfregar deixa uma marca esbranquiçada. No couro, o vinho dissolve o corante e deixa um desenho típico: mancha clara no centro e borda mais escura. O linho absorve rápido.</p>` },
      { h2: 'Em quanto tempo levar a peça com vinho?', html: `<p>Depende do tecido. A tabela traz o prazo que os guias da Dedicada recomendam para cada peça:</p>
{{TABELA}}
<p>Em camisas, toalhas de mesa e outras peças, a regra é a mesma: quanto antes a peça chega, maior a chance de a mancha sair.</p>` },
      { h2: 'Como a Dedicada tira a mancha de vinho?', html: `<p>Cada família de mancha tem o seu tira-manchas da Seitz, o V1, o V2 ou o V3, e o vinho vai com o das manchas de tanino. Dois desses produtos se anulam se forem usados juntos, por isso cada mancha é tratada na sua vez, antes da lavagem. Na Dedicada, isso se chama protocolos de manchas.</p>
<ul>
<li><strong>Seda:</strong> o álcool é retirado primeiro; depois a seda é lavada a seco e, se ficar sombra, em água fria, no programa da Seitz para seda.</li>
<li><strong>Vestido de festa e de noiva:</strong> pré-lavagem à mão, molho e o tira-manchas certo para cada mancha, antes das lavagens no programa da Seitz para vestidos. O vestido de noiva fica pronto em 7 dias.</li>
<li><strong>Couro:</strong> wet cleaning, secagem natural e só então a hidratação, em 5 a 7 dias. No couro, a mancha de vinho costuma sair só em parte.</li>
</ul>
{{FALA}}` },
      { h2: 'Quais peças com vinho a Dedicada recebe?', html: `<p>Camisas, vestidos de festa e de noiva, ternos, peças de seda, linho, lã, veludo e couro, toalhas de mesa e guardanapos, lençóis e edredons. Cada tecido tem um guia com o processo, o prazo e o preço, em <a href="https://dedicadalavanderia.com.br/cuidados-por-tecido/">Cuidados por Tecido</a>.</p>` }
    ],
    perguntas: [
      ['Mancha de vinho sai?', 'Costuma sair quando é tratada antes da lavagem e sem água quente. No couro, o vinho dissolve o corante, e a recuperação costuma ser parcial: pode ficar marca.'],
      ['Posso usar produto caseiro na mancha de vinho?', 'Não é o indicado. Tira-manchas caseiro, álcool e água sanitária costumam piorar: em seda, couro e jeans colorido, o dano costuma ser pior que a mancha. Tire só o excesso com um pano limpo, sem esfregar, e leve a peça.'],
      ['Quanto tempo a lavanderia leva?', 'Na Dedicada, a maioria das peças fica pronta em 2 dias; vestidos finos, em cerca de 5; couro, em 5 a 7; e vestido de noiva, em 7. Há serviço expresso para a maioria das peças, no mesmo dia ou no seguinte, com acréscimo de 50%; couro e tênis não têm expresso.']
    ],
    guias: ['seda', 'festa-noiva', 'linho', 'la', 'couro'],
    mudou: [
      'Saíram "produto exclusivo", "da melhor marca do mundo" e "uma das melhores lavanderias do Brasil"; da descrição, saiu "definitivamente".',
      'Saiu "o V2 retira as manchas de vinho tinto": os guias ligam o vinho ao tira-manchas das manchas de tanino, e falta confirmar qual dos três (V1, V2 ou V3) é esse (pergunta 20).',
      '"Vários bairros de Florianópolis" virou a coleta confirmada: 26 bairros da Ilha e do Continente, em dias fixos.',
      'Entraram a resposta curta no começo, o passo a passo, a urgência de cada tecido tirada dos guias, o processo de cada peça, a fala aprovada da Liliane e perguntas frequentes com dados estruturados.',
      'Entraram o botão para o Diagnóstico de Manchas, já na mancha de vinho, e os links para os guias.'
    ]
  },
  {
    slug: 'como-lavar-roupa-com-xixi',
    tituloAntigo: 'Roupa com cheiro de xixi: como resolver de forma segura e definitiva',
    titulo: 'Roupa com xixi: como lavar e tirar o cheiro?',
    seoTitulo: 'Roupa com Xixi: Como Lavar e Tirar o Cheiro',
    meta: 'Xixi no edredom, na pelúcia, no carrinho ou na roupa de bebê? Tire o excesso sem esfregar, sem água quente nem água sanitária, e leve em até 24 horas.',
    assina: 'alejandro', falaDe: 'carrinho',
    resposta: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente, secadora nem água sanitária. Leve a peça em até 24 horas: no edredom, na pelúcia e no acolchoado do carrinho de bebê, a urina entra no enchimento, e o cheiro volta com a umidade.',
    ancora: 'm-xixi', assunto: 'roupa com xixi',
    chamada: 'Tem uma peça com xixi agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['couro', 'sangue-leite'], ['edredom', 'xixi'], ['pelucias', 'xixi-vomito-leite'], ['carrinho', 'xixi']],
    secoes: [
      { h2: 'O que fazer logo depois do xixi?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar.</li>
<li>Não use água quente nem secadora antes de a peça ser tratada: o calor fixa as manchas orgânicas, como sangue, suor e comida.</li>
<li>Não use água sanitária: no edredom, o cloro amarela o poliéster e pode mudar a cor de bordados; nos lençóis brancos, use só alvejante à base de oxigênio.</li>
<li>Até levar, deixe a peça arejar, fora de saco plástico, e não guarde a peça úmida.</li>
<li>Ao entregar, conte o que aconteceu, quando e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Por que o cheiro de xixi volta?', html: `<p>Porque a urina entra no enchimento. No edredom, na pelúcia e no acolchoado do carrinho de bebê, ela passa do tecido para o recheio, e o cheiro volta com a umidade. No couro, a urina penetra e endurece o material, e a maciez original pode não voltar totalmente.</p>
<p>Por isso o prazo pesa. Os guias da Dedicada recomendam levar estas peças em até 24 horas:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada lava peças com xixi?', html: `<p>O xixi é uma mancha orgânica e é tratado antes da lavagem, com o tira-manchas da Seitz próprio dessa família (V1, V2 ou V3). Depois, cada peça segue o seu processo:</p>
<ul>
<li><strong>Edredom:</strong> remoção manual de manchas e lavagem em máquinas industriais; os claros passam por duplo alvejamento sem cloro. Pronto em 2 dias; solteiro a partir de R$ 69,00.</li>
<li><strong>Pelúcia:</strong> escovação à mão, wet cleaning e secagem natural, sem secadora. Pronta em 3 dias, a partir de R$ 80,00.</li>
<li><strong>Carrinho e bebê conforto:</strong> desmontados e lavados à mão; os cintos são higienizados por fora, sem encharcar, e tudo seca ao natural, com ventilador profissional. Prontos em 7 dias; carrinho a partir de R$ 390,00 e bebê conforto, R$ 290,00.</li>
<li><strong>Lençóis e fronhas:</strong> em água, no ciclo de enxoval da Seitz. Prontos em 3 dias; lençóis a partir de R$ 44,00 o quilo. O protetor de colchão seca ao natural, ou em secadora quando a etiqueta permite.</li>
<li><strong>Roupas de bebê e do dia a dia:</strong> além de carrinho e bebê conforto, a Dedicada lava ninhos de bebê, enxoval e roupas de bebê.</li>
</ul>
{{FALA}}` }
    ],
    perguntas: [
      ['Lavanderia tira cheiro de xixi?', 'A Dedicada lava edredons, pelúcias, carrinhos, roupa de cama e roupas com xixi, com o tira-manchas próprio para manchas orgânicas antes da lavagem. Quanto antes a peça chega, melhor: a urina entra no enchimento, e o cheiro volta com a umidade.'],
      ['Posso lavar o edredom com xixi em casa?', 'Edredons de casal ou king não cabem direito na máquina de casa. Em qualquer tamanho, o enchimento precisa secar por completo: guardado sem secar por dentro, o edredom cria mofo.'],
      ['Posso usar água sanitária no xixi?', 'Não. No edredom, o cloro amarela o poliéster e pode mudar a cor de bordados; nos lençóis brancos, use só alvejante à base de oxigênio. Na Dedicada, os edredons claros passam por duplo alvejamento sem cloro.']
    ],
    guias: ['edredom', 'pelucias', 'carrinho', 'roupa-de-cama'],
    mudou: [
      'Saíram "de forma segura e definitiva", "eliminando o odor" e "eliminar o odor de forma definitiva": o post não promete resultado.',
      'Saíram os colchões (a lavagem de colchão não está confirmada; pergunta 14) e as roupas íntimas.',
      'Saiu a explicação química (amônia e sais minerais), que não está nos guias; entrou a que está: a urina entra no enchimento, e o cheiro volta com a umidade.',
      '"Wet cleaning" para tudo virou o processo de cada peça, com prazo e preço dos guias.',
      '"Coleta e entrega em Florianópolis" virou a coleta confirmada: 26 bairros da Ilha e do Continente, em dias fixos.',
      'Entraram a resposta curta, o passo a passo, a urgência de cada peça, a fala aprovada do Alejandro, perguntas frequentes com dados estruturados e o botão para o Diagnóstico de Manchas, já na mancha de xixi.'
    ]
  },
  ...LOTE1
];
