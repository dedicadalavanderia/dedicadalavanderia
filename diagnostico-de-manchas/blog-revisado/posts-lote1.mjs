// Lote 1 da revisão do blog (29/09/2026): 12 posts com fatos suficientes nos guias.
// Os campos são os mesmos de posts.mjs. falaDe: null quando nenhuma fala aprovada combina com o assunto.
const ONDE_TRATAR = 'Cada tecido tem um guia com o processo, o prazo e o preço, em <a href="https://dedicadalavanderia.com.br/cuidados-por-tecido/">Cuidados por Tecido</a>.';

export const LOTE1 = [
  {
    slug: 'como-remover-mancha-de-cafe-de-suas-roupas-de-forma-segura',
    tituloAntigo: 'Lavagem de Roupas com Manchas de Café: como tiramos manchas do seu cafezinho diário, sem estragar a peça?',
    titulo: 'Mancha de café na roupa: o que fazer e como a lavanderia tira?',
    seoTitulo: 'Mancha de Café na Roupa: o Que Fazer e Como Tirar',
    meta: 'Caiu café na roupa? Tire o excesso com um pano, sem esfregar e sem água quente, que fixa a mancha, e leve a peça logo. Veja o cuidado no linho e no veludo.',
    assina: 'liliane', falaDe: null,
    resposta: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente, que fixa a mancha de café. Não passe ferro nem secador antes de a mancha sair e leve a peça quanto antes: no linho e no veludo, o café pede cuidado em até 24 horas.',
    ancora: 'm-cafe', assunto: 'mancha de café',
    chamada: 'Caiu café agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['linho', 'vinho-cafe-cha'], ['veludo', 'bebida-comida']],
    secoes: [
      { h2: 'O que fazer logo que cai café na roupa?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use água quente: ela fixa manchas de café, chá e vinho.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair: o calor fixa a mancha.</li>
<li>Não use tira-manchas caseiro, álcool nem água sanitária: em seda, couro e jeans colorido, o dano costuma ser pior que a mancha.</li>
<li>Até levar, deixe a peça arejar, longe do calor e fora de saco plástico.</li>
<li>Ao entregar, conte que é café, quando aconteceu e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Por que a mancha de café fixa?', html: `<p>Porque o café é uma mancha vegetal, de tanino, como vinho, chá e suco. Ela pede um tira-manchas próprio, diferente do usado para gordura ou para comida, e a água quente fixa a mancha no tecido.</p>
<p>No linho, que absorve rápido, e no veludo, em que esfregar achata o pelo, o cuidado é maior. Os guias da Dedicada recomendam estes prazos:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada tira a mancha de café?', html: `<p>Cada família de mancha tem o seu tira-manchas da Seitz, o V1, o V2 ou o V3, e o café vai com o das manchas de tanino. Dois desses produtos se anulam se forem usados juntos, por isso cada mancha é tratada na sua vez, antes da lavagem. Depois, a peça segue o processo do tecido: a maior parte do linho, por exemplo, vai para a lavagem a seco, para não encolher.</p>
<p>A Dedicada recebe camisas, peças de seda, linho, lã e veludo, ternos e vestidos com mancha de café. ${ONDE_TRATAR}</p>` }
    ],
    perguntas: [
      ['Mancha de café sai da roupa?', 'Costuma sair quando é tratada antes da lavagem e sem água quente, que fixa o café no tecido. Quanto antes a peça chega, maior a chance de a mancha sair.'],
      ['Posso usar água quente na mancha de café?', 'Não. A água quente fixa manchas de café, chá e vinho. Se a mancha ainda estiver úmida, só tire o excesso encostando um pano limpo, sem esfregar.'],
      ['E se a mancha de café for antiga?', 'Leve a peça assim mesmo e conte há quanto tempo a mancha está nela e se já passou por lavagem ou ferro: a equipe avalia e diz o que dá para fazer. Se preferir, mande antes uma foto pelo WhatsApp.']
    ],
    guias: ['linho', 'veludo', 'seda', 'camisas'],
    mudou: [
      'Saiu "utilizamos apenas os melhores produtos do mundo".',
      'Entraram a resposta curta no começo, o passo a passo, a urgência no linho e no veludo tirada dos guias, como a Dedicada trata as manchas de tanino e o botão para o Diagnóstico de Manchas, já na mancha de café.'
    ]
  },
  {
    slug: 'como-remover-manchas-de-graxa-das-roupas-de-forma-segura',
    tituloAntigo: 'Remoção de manchas de graxa: confie em quem entende do assunto',
    titulo: 'Mancha de graxa na roupa: o que fazer e como a lavanderia tira?',
    seoTitulo: 'Mancha de Graxa na Roupa: o Que Fazer e Como Tirar',
    meta: 'Graxa de bicicleta ou de moto na roupa? Não esfregue com detergente nem molhe: a graxa pede produto próprio antes da água. Leve a peça em até 24 horas.',
    assina: 'alejandro', falaDe: 'tenis',
    resposta: 'Não esfregue com detergente e não molhe a mancha: a fricção tira o corante e deixa a área clara, e a graxa precisa de um produto próprio antes de qualquer contato com água. Leve a peça em até 24 horas: quanto mais tempo a graxa passa no tecido, mais difícil fica tirar.',
    ancora: 'm-graxa', assunto: 'mancha de graxa',
    chamada: 'Sujou de graxa agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['jeans', 'graxa'], ['tenis', 'graxa-oleo'], ['couro', 'gordura']],
    secoes: [
      { h2: 'O que fazer logo que suja de graxa?', html: `<ol>
<li>Não esfregue com detergente: a fricção tira o corante junto e deixa a área clara.</li>
<li>Não molhe a mancha: a graxa precisa de um produto próprio antes de qualquer contato com água.</li>
<li>Não use removedor, querosene nem álcool: na jaqueta, eles derretem o nylon e ressecam o poliuretano; no couro, o álcool ataca o corante.</li>
<li>Não passe ferro nem use secadora antes de a mancha sair: o calor fixa a mancha.</li>
<li>Leve a peça em até 24 horas e conte o que sujou, quando e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Por que a graxa é tão difícil de tirar?', html: `<p>Porque ela entra rápido nos poros do tecido, do couro e da borracha, e quanto mais tempo passa, mais difícil fica tirar. É uma mancha gordurosa: pede um tira-manchas próprio, diferente do usado para comida ou para vinho.</p>
<p>Os guias da Dedicada recomendam estes prazos:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada tira a graxa?', html: `<p>A graxa é tratada antes da lavagem, com o tira-manchas da Seitz próprio das manchas gordurosas (V1, V2 ou V3). Depois, a peça segue o processo do tecido:</p>
<ul>
<li><strong>Jeans e sarja:</strong> lavagem em água fria, no wet cleaning, no programa da Seitz para peças coloridas, em que a água não passa de 30 °C; ou a seco, quando a peça permite.</li>
<li><strong>Tênis:</strong> lavado à mão e seco ao natural. O tênis de couro, que não pode ir na água, é higienizado à mão.</li>
<li><strong>Couro:</strong> wet cleaning, secagem natural e só então a hidratação, em 5 a 7 dias.</li>
</ul>
{{FALA}}` }
    ],
    perguntas: [
      ['Como tirar graxa de bicicleta do jeans?', 'Não esfregue com detergente: a fricção tira o corante e deixa a área clara. A graxa precisa de um produto próprio antes de qualquer contato com água, e o ideal é tratar em até 24 horas.'],
      ['Mancha de graxa sai do couro?', 'Em parte: a oleosidade sai, mas a marca escura pode continuar levemente. Leve a peça em até 48 horas e não use álcool, que ataca o corante do couro.'],
      ['Graxa no tênis sai?', 'Graxa e óleo são os casos mais urgentes no tênis: entram rápido nos poros do tecido e da borracha. Leve em até 24 horas. Na Dedicada, o tênis é lavado à mão, e o branqueamento faz parte da lavagem.']
    ],
    guias: ['jeans', 'tenis', 'couro', 'jaquetas'],
    mudou: [
      'Saíram "os melhores do mundo" e "garantindo".',
      'Saiu "produtos dermatologicamente testados e antialérgicos", que os guias não confirmam.',
      'Entraram a resposta curta, o passo a passo, a urgência no jeans, no tênis e no couro, o processo de cada peça, a fala aprovada do Alejandro e o botão para o Diagnóstico de Manchas, já na mancha de graxa.'
    ]
  },
  {
    slug: 'lavagem-de-roupas-com-manchas-de-terra',
    tituloAntigo: 'Lavagem de roupas com manchas de terra: como a lavanderia profissional remove até as sujeiras mais difíceis',
    titulo: 'Roupa suja de terra ou barro: como lavar sem espalhar a sujeira?',
    seoTitulo: 'Roupa Suja de Terra ou Barro: Como Lavar',
    meta: 'Terra e barro na roupa, no tênis ou na barra da cortina? Não coloque a peça na máquina com outras roupas: a terra espalha e encarde o resto. Veja o que fazer.',
    assina: 'jorge', falaDe: 'cortinas',
    resposta: 'Não coloque a peça na máquina com outras roupas: a terra espalha e encarde o resto. Lave separada ou leve à Dedicada. No tênis, bata e escove a sujeira seca antes de molhar e leve em até 48 horas; nas barras de cortina e no carrinho de bebê, não há urgência.',
    ancora: 'm-lama', assunto: 'roupa suja de terra',
    chamada: 'Sujou de terra ou barro? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['tenis', 'lama'], ['festa-noiva', 'barra-comida-vinho'], ['jeans', 'barro'], ['cortinas', 'barras'], ['carrinho', 'terra']],
    secoes: [
      { h2: 'O que fazer com a roupa suja de terra?', html: `<ol>
<li>Não coloque na máquina com outras roupas: a terra espalha e encarde o resto.</li>
<li>Lave a peça separada, ou leve à Dedicada.</li>
<li>No tênis, bata e escove a sujeira seca antes de molhar, e não mergulhe o tênis na água.</li>
<li>Não use esponja abrasiva nem palha de aço na sola: elas riscam o relevo da borracha.</li>
</ol>` },
      { h2: 'Por que a terra fica presa no tecido?', html: `<p>Porque a terra que seca endurece no tecido e fica presa na trama. Na barra das cortinas e dos vestidos, a poeira e a sujeira do chão se acumulam. Os guias da Dedicada dizem quando levar cada peça:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada lava peças com terra?', html: `<ul>
<li><strong>Tênis:</strong> fica de molho e é escovado à mão, com uma pasta especial que tira a sujeira e o cheiro, e seca ao natural.</li>
<li><strong>Cortinas:</strong> as barras são esfregadas à mão, a cortina lava em ciclo próprio e seca ao natural; fica pronta em 3 a 4 dias.</li>
<li><strong>Vestido de noiva:</strong> as barras são lavadas à mão na pré-lavagem, e o programa da Seitz para vestidos, a 35 °C e com pouca ação mecânica, tira o encardido da barra sem agredir o tecido.</li>
<li><strong>Carrinho de bebê:</strong> desmontado e lavado à mão; as rodas são escovadas, para tirar a terra acumulada.</li>
</ul>
{{FALA}}` }
    ],
    perguntas: [
      ['Mancha antiga de terra ainda sai?', 'Leve a peça e conte há quanto tempo a sujeira está nela: a equipe avalia e diz o que dá para fazer. Se preferir, mande antes uma foto pelo WhatsApp.'],
      ['Posso lavar o tênis com lama na máquina?', 'Não. A máquina de lavar pode descolar biqueiras e solados e deformar o tênis. Bata e escove a sujeira seca e esfregue o tecido com escova macia, água e sabão neutro, sem mergulhar o tênis.'],
      ['Como lavar a barra suja da cortina?', 'Na Dedicada, as barras são esfregadas à mão antes da lavagem, e a cortina lava em ciclo próprio e seca ao natural. A Dedicada busca e entrega a cortina, mas não tira nem coloca no trilho.']
    ],
    guias: ['tenis', 'jeans', 'cortinas', 'carrinho'],
    mudou: [
      'Saíram "garantindo resultados visíveis e duradouros" e "garantindo que a remoção das manchas difíceis aconteça sem agredir a peça".',
      '"Não damos garantias que as manchas saiam completamente" virou a orientação de levar a peça para a equipe avaliar.',
      'Entraram a resposta curta, o passo a passo, a urgência de cada peça, o processo do tênis, da cortina, do vestido de noiva e do carrinho, a fala aprovada do Jorge e o botão para o Diagnóstico de Manchas, já na mancha de terra.'
    ]
  },
  {
    slug: 'como-tirar-manchas-de-ferrugem-das-roupas',
    tituloAntigo: 'Como tirar manchas de ferrugem das roupas?',
    titulo: 'Mancha de ferrugem na roupa: o que fazer?',
    seoTitulo: 'Mancha de Ferrugem na Roupa: o Que Fazer',
    meta: 'Mancha de ferrugem no lençol, no casaco ou na camisa? Não use água sanitária, que escurece a mancha. Veja de onde ela vem e como a Dedicada trata.',
    assina: 'liliane', falaDe: 'roupa-de-cama',
    resposta: 'Não use água sanitária: ela escurece a mancha de ferrugem. Não esfregue, não passe ferro antes de tratar e leve a peça sem adiar muito. Nos lençóis, a ferrugem costuma vir de molas ou do estrado de metal; nos casacos de couro, de zíperes e fivelas.',
    ancora: 'm-ferrugem', assunto: 'mancha de ferrugem',
    chamada: 'Apareceu ferrugem na peça? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['roupa-de-cama', 'ferrugem'], ['couro', 'ferrugem']],
    secoes: [
      { h2: 'O que fazer com a mancha de ferrugem?', html: `<ol>
<li>Não use água sanitária nem alvejante com cloro: a água sanitária escurece a mancha.</li>
<li>Não esfregue: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair: o calor fixa a mancha.</li>
<li>Leve a peça sem adiar muito e conte de onde a mancha pode ter vindo.</li>
</ol>` },
      { h2: 'É ferrugem ou protetor solar?', html: `<p>Às vezes, a mancha cor de ferrugem é de protetor solar. O filtro solar que fica no tecido reage com minerais da água, como o ferro, e deixa manchas alaranjadas ou cor de ferrugem, principalmente na gola e nas mangas. Em cidade de praia, como Florianópolis, é uma mancha comum no verão.</p>
<p>Nos dois casos, a água sanitária piora: no protetor solar, o cloro fixa a mancha.</p>` },
      { h2: 'Onde a ferrugem mais aparece?', html: `<p>Nos guias da Dedicada, a ferrugem aparece nestas peças:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada trata a ferrugem?', html: `<p>A mancha é tratada antes da lavagem, sem cloro. Na roupa de cama, lençóis e fronhas vão para a água, no ciclo de enxoval da Seitz, e ficam prontos em 3 dias. No couro, a ferrugem melhora com tratamento técnico, mas pode não sair por completo.</p>
{{FALA}}` }
    ],
    perguntas: [
      ['Mancha de ferrugem sai?', 'Depende da peça. No couro, melhora com tratamento técnico, mas pode não sair por completo. Em qualquer peça, a água sanitária escurece a mancha: não use.'],
      ['Por que o lençol ficou com mancha de ferrugem?', 'Em geral, por contato com molas ou com o estrado de metal da cama.'],
      ['Mancha alaranjada na gola da camisa é ferrugem?', 'Pode ser protetor solar, que reage com minerais da água e deixa manchas alaranjadas, principalmente na gola e nas mangas. Não use água sanitária, que fixa a mancha, e não passe a ferro antes de tratar.']
    ],
    guias: ['roupa-de-cama', 'couro', 'camisas'],
    mudou: [
      'Saíram "utilizamos os melhores produtos do mundo" e "garantindo que ela volte limpa, preservada e pronta para uso".',
      'Entraram a resposta curta, o passo a passo, de onde a ferrugem costuma vir segundo os guias, como diferenciar da mancha de protetor solar, a fala aprovada da Liliane e o botão para o Diagnóstico de Manchas, já na mancha de ferrugem.'
    ]
  },
  {
    slug: 'remocao-de-manchas-de-remedios-das-roupas',
    tituloAntigo: 'Remoção de Manchas de Remédios das Roupas',
    titulo: 'Mancha de remédio na roupa: o que fazer?',
    seoTitulo: 'Mancha de Remédio na Roupa: o Que Fazer',
    meta: 'Iodo, pomada, xarope ou outro remédio manchou a roupa? Não esfregue, não use produto caseiro nem passe ferro. Mande uma foto pelo WhatsApp e leve a peça.',
    assina: 'alejandro', falaDe: null,
    resposta: 'Não esfregue, não use produto caseiro e não passe ferro antes de a mancha sair. Tire só o excesso encostando um pano limpo e leve a peça quanto antes, contando qual foi o remédio: saber o que é a mancha ajuda a escolher o tratamento. Se preferir, mande antes uma foto pelo WhatsApp.',
    ancora: 'm-remedio', assunto: 'mancha de remédio',
    chamada: 'Manchou de remédio agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [],
    secoes: [
      { h2: 'O que fazer quando o remédio mancha a roupa?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use produto caseiro, álcool nem água sanitária: sem saber o que é a mancha, qualquer produto pode fixá-la ou tirar a cor do tecido.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair: o calor fixa a mancha.</li>
<li>Até levar, deixe a peça arejar, longe do calor e fora de saco plástico.</li>
<li>Ao entregar, conte qual foi o remédio, quando aconteceu e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Como a Dedicada trata mancha de remédio?', html: `<p>A equipe avalia a peça e a mancha e escolhe o tratamento conforme o tecido, antes da lavagem. Se preferir, mande antes uma foto da peça e da etiqueta pelo WhatsApp: a Dedicada avalia peças por foto.</p>
<p>${ONDE_TRATAR}</p>` }
    ],
    perguntas: [
      ['Mancha de iodo ou de pomada sai da roupa?', 'Depende do tecido e de quanto tempo a mancha tem. Não use produto caseiro, tire só o excesso com um pano limpo e leve a peça, ou mande uma foto pelo WhatsApp para a equipe avaliar.'],
      ['Posso passar álcool na mancha de remédio?', 'Não é o indicado. Álcool e água sanitária atacam o corante, e as manchas claras que eles deixam costumam não voltar.'],
      ['Quanto tempo a lavanderia leva?', 'Na Dedicada, a maioria das peças fica pronta em 2 dias. O prazo de cada tecido está no guia dele, em Cuidados por Tecido.']
    ],
    guias: ['camisas', 'roupa-de-cama'],
    mudou: [
      'Saíram "trabalhamos com os melhores produtos do mundo" e "garantindo remoção eficaz". Nas tags do post, tire "melhor lavanderia do Brasil".',
      'Entraram a resposta curta, o passo a passo, o convite para mandar foto pelo WhatsApp (a Dedicada avalia peças por foto) e o botão para o Diagnóstico de Manchas, já na mancha de remédio.'
    ]
  },
  {
    slug: 'retirada-de-manchas-de-comida-molhos-bebidas-e-sucos',
    tituloAntigo: 'Retirada de Manchas de Comida: Molhos, Bebidas e Sucos',
    titulo: 'Mancha de comida, molho ou suco na roupa: o que fazer?',
    seoTitulo: 'Mancha de Comida, Molho ou Suco na Roupa',
    meta: 'Molho, óleo, chocolate, suco ou refrigerante na roupa? Cada mancha pede um tratamento. Tire o excesso sem esfregar, sem água quente, e leve a peça logo.',
    assina: 'liliane', falaDe: 'festa-noiva',
    resposta: 'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente: o calor fixa manchas de comida, e a água quente fixa as de suco, café e vinho. Não passe ferro antes de a mancha sair e leve a peça quanto antes: manchas de comida se fixam com o tempo.',
    ancora: 'm-comida', assunto: 'mancha de comida',
    chamada: 'Caiu comida na roupa agora? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['veludo', 'bebida-comida'], ['festa-noiva', 'barra-comida-vinho'], ['carrinho', 'comida']],
    secoes: [
      { h2: 'O que fazer logo que cai comida na roupa?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use água quente: o calor fixa manchas de comida, e a água quente fixa as de suco, café e vinho.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair.</li>
<li>Não adie: manchas de comida se fixam com o tempo, e o açúcar de drinques, sucos e caldas se fixa nas tramas finas.</li>
<li>Não use tira-manchas caseiro, álcool nem água sanitária: em seda, couro e jeans colorido, o dano costuma ser pior que a mancha.</li>
<li>Ao entregar, conte o que caiu, quando aconteceu e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Por que cada mancha de comida pede um tratamento?', html: `<p>Porque uma refeição mancha de jeitos diferentes. Nos guias da Dedicada, as manchas se dividem em famílias, e cada uma tem o seu tira-manchas da Seitz (V1, V2 ou V3):</p>
<ul>
<li><strong>Gordurosas:</strong> óleo de comida, azeite e manteiga.</li>
<li><strong>Orgânicas:</strong> comida, molhos, ovo e leite.</li>
<li><strong>Vegetais e de tanino:</strong> vinho, café, chá, suco e refrigerante.</li>
</ul>
<p>Dois desses produtos se anulam se forem usados juntos, por isso cada mancha é tratada na sua vez, antes da lavagem. Na Dedicada, isso se chama protocolos de manchas.</p>` },
      { h2: 'Em quanto tempo levar a peça?', html: `<p>Os guias da Dedicada recomendam estes prazos:</p>
{{TABELA}}
<p>No vestido de festa e de noiva, que costuma chegar com a barra suja e manchas de comida e vinho, são pré-lavagem à mão, molho e o tira-manchas certo para cada mancha, antes das lavagens no programa da Seitz para vestidos.</p>
{{FALA}}` }
    ],
    perguntas: [
      ['Mancha de comida sai da roupa?', 'Costuma sair quando é tratada antes da lavagem, com o tira-manchas certo para a família da mancha. Quanto antes a peça chega, melhor: manchas de comida se fixam com o tempo.'],
      ['O que fazer com mancha de chocolate ou de shoyu?', 'Trate como as outras manchas de comida: tire o excesso encostando um pano limpo, sem esfregar, não use água quente e leve a peça quanto antes.'],
      ['E o óleo de cozinha?', 'O óleo é uma mancha gordurosa: pede um tira-manchas próprio, diferente do usado para comida ou para vinho. Não use água quente nem ferro antes de tratar.']
    ],
    guias: ['veludo', 'festa-noiva', 'camisas', 'carrinho'],
    mudou: [
      'Saíram "os melhores produtos do mundo", "O melhor de tudo" e "garantindo limpeza profunda". Nas tags do post, tire "melhor lavanderia do Brasil".',
      '"As soluções caseiras acabam quase sempre ... imprimir a mancha permanentemente" virou o que os guias dizem: produto caseiro pode fixar a mancha ou tirar a cor.',
      'Entraram as famílias de manchas da refeição, a urgência no veludo, no vestido e no carrinho, a fala aprovada da Liliane e o botão para o Diagnóstico de Manchas, já na mancha de comida. O post passa a responder também chocolate e shoyu (pergunta 22).'
    ]
  },
  {
    slug: 'como-tirar-cheiro-de-mofo-da-roupa-de-forma-definitiva',
    tituloAntigo: 'Como tirar cheiro de mofo da roupa de forma definitiva?',
    titulo: 'Cheiro de mofo na roupa: de onde vem e como tirar?',
    seoTitulo: 'Cheiro de Mofo na Roupa: de Onde Vem e Como Tirar',
    meta: 'Roupa, toalha ou edredom com cheiro de mofo? O cheiro vem da umidade guardada. Veja o que fazer, em quanto tempo levar e como guardar para não voltar.',
    assina: 'jorge', falaDe: 'jaquetas',
    resposta: 'O cheiro de mofo vem da umidade: a peça guardada úmida ou sem ventilação cria fungo, e o cheiro fica cada vez mais difícil de tirar. Não escove nem esfregue a área, para não espalhar o mofo, e leve a peça logo, de preferência em até 24 horas. Depois, guarde limpa e seca, em capa de tecido, nunca de plástico.',
    ancora: 'm-mofo', assunto: 'cheiro de mofo',
    chamada: 'Peça com cheiro de mofo? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['jaquetas', 'mofo-pena'], ['roupa-de-cama', 'toalha-mofo'], ['edredom', 'mofo'], ['peles', 'cheiro-guardado'], ['carrinho', 'cheiro-guardado']],
    secoes: [
      { h2: 'De onde vem o cheiro de mofo?', html: `<p>Da umidade. Na umidade de Florianópolis, o mofo aparece em peças guardadas sem ventilação, e o cheiro fica preso onde a água demora a sair:</p>
<ul>
<li>na toalha guardada úmida, o fungo se espalha pela felpa, e o cheiro fica cada vez mais difícil de tirar;</li>
<li>no edredom, a umidade fica presa no enchimento;</li>
<li>na jaqueta de pena, o recheio que fica úmido mofa por dentro dos gomos;</li>
<li>no carrinho de bebê, a umidade fica presa nas espumas depois de meses parado.</li>
</ul>` },
      { h2: 'O que fazer com a peça com cheiro de mofo?', html: `<ol>
<li>Não escove nem esfregue a área, para não espalhar o mofo.</li>
<li>Não guarde a peça de novo úmida nem em capa plástica fechada.</li>
<li>Não pendure a jaqueta de pena molhada no varal esperando secar sozinha: o recheio demora a secar e mofa.</li>
<li>Leve a peça logo, de preferência em até 24 horas.</li>
</ol>
<p>Os guias da Dedicada recomendam estes prazos:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada tira o cheiro de mofo?', html: `<ul>
<li><strong>Couro:</strong> wet cleaning, secagem natural e hidratação removem o mofo e os cheiros fortes na maioria das vezes. No couro claro, pode ficar uma mancha avermelhada, violeta ou esverdeada.</li>
<li><strong>Edredom:</strong> remoção manual de manchas e lavagem em máquinas industriais; o de pena, quando vai para a água, fica de 2 a 3 horas na secadora, até as penas secarem por completo.</li>
<li><strong>Toalhas:</strong> ciclo de enxoval da Seitz, sempre em água, com duplo alvejamento.</li>
</ul>
{{FALA}}` },
      { h2: 'Como evitar que o cheiro volte?', html: `<ul>
<li>Guarde as peças limpas e secas, em armário arejado e em capa de tecido, nunca de plástico.</li>
<li>Seque a toalha por completo antes de guardar e use pouco amaciante.</li>
<li>Lave os casacos antes de guardar, no fim do inverno.</li>
<li>Guarde o carrinho seco, em lugar ventilado.</li>
</ul>` }
    ],
    perguntas: [
      ['Cheiro de mofo sai na lavagem?', 'Quanto antes a peça é lavada, maior a chance de sair. Na toalha guardada úmida, o cheiro fica cada vez mais difícil de tirar; no couro, o wet cleaning com secagem natural e hidratação remove o mofo e os cheiros fortes na maioria das vezes.'],
      ['Por que o cheiro de mofo volta depois de lavar?', 'Porque a peça volta a ficar úmida. Edredom guardado sem secar por dentro cria mofo, e toalha guardada úmida pega cheiro de mofo. Seque tudo por completo antes de guardar.'],
      ['Como evitar mofo nas roupas em Florianópolis?', 'Guarde as peças limpas e secas, em armário arejado e em capa de tecido, nunca de plástico. Mofo é o problema que mais chega à Dedicada em veludo, couro, peles e pelúcias, e o ideal é tratar quanto antes, de preferência em até 24 horas.']
    ],
    guias: ['roupa-de-cama', 'edredom', 'jaquetas', 'couro'],
    mudou: [
      'Saíram "de forma definitiva", "a solução definitiva", "a única forma 100% eficaz" e "eliminar o cheiro de mofo".',
      'O título mudou de "Como tirar cheiro de mofo da roupa de forma definitiva?" para "Cheiro de mofo na roupa: de onde vem e como tirar?". O endereço, que tem "definitiva", não muda, para não perder a posição no Google.',
      'Entraram de onde vem o cheiro em cada peça, o passo a passo, a urgência dos guias, como a Dedicada trata, como guardar, a fala aprovada do Jorge e o botão para o Diagnóstico de Manchas, já na mancha de mofo.'
    ]
  },
  {
    slug: 'como-remover-manchas-amareladas-e-de-mofo-das-roupas',
    tituloAntigo: 'Como remover manchas amareladas e de mofo das roupas – sem danificar o tecido',
    titulo: 'Roupa amarelada ou com mancha de mofo: tem jeito?',
    seoTitulo: 'Roupa Amarelada ou com Mancha de Mofo: Tem Jeito?',
    meta: 'Colarinho, lençol ou edredom amarelado? Nada de água sanitária, que deixa o amarelado mais forte. Veja o que fazer com o amarelado e com as manchas de mofo.',
    assina: 'liliane', falaDe: 'edredom',
    resposta: 'Não use água sanitária: ela deixa o amarelado mais forte e enfraquece a fibra. Nas peças brancas, use alvejante à base de oxigênio, se a etiqueta permitir, ou leve a peça. O amarelado não tem urgência, mas o mofo tem: leve a peça com mofo quanto antes, de preferência em até 24 horas.',
    ancora: 'm-amarelado', assunto: 'roupa amarelada',
    chamada: 'Peça amarelada ou com mofo? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['camisas', 'colarinho'], ['roupa-de-cama', 'lencol-amarelado'], ['edredom', 'amarelado'], ['linho', 'amarelado-suor'], ['jaquetas', 'nylon-amarelado'], ['tenis', 'sola-amarelada']],
    secoes: [
      { h2: 'Por que a roupa amarela?', html: `<p>O amarelado vem do suor e da oleosidade da pele, que se acumulam no tecido e oxidam com o tempo, e do tempo guardado. Passar a ferro uma camisa usada, sem lavar, fixa o amarelado a cada repasse. No nylon claro, o sol e o cloro também amarelam, segundo a ANEL.</p>
<p>Os guias da Dedicada trazem o amarelado nestas peças:</p>
{{TABELA}}` },
      { h2: 'O que fazer com a peça amarelada?', html: `<ol>
<li>Não use água sanitária: o amarelado fica mais forte e a fibra enfraquece; no poliéster, o cloro também amarela.</li>
<li>Nas peças brancas, use alvejante à base de oxigênio, se a etiqueta permitir.</li>
<li>No colarinho, molhe a área, aplique detergente, esfregue com escova macia e lave com o alvejante à base de oxigênio, se a etiqueta permitir. Só passe a ferro depois de a mancha sair.</li>
<li>Lave antes de guardar e não repasse a camisa usada sem lavar.</li>
</ol>` },
      { h2: 'E a mancha de mofo?', html: `<p>O mofo é mais urgente que o amarelado. Não escove nem esfregue a área, para não espalhar o mofo, e leve a peça logo, de preferência em até 24 horas. No couro escuro, a marca do mofo geralmente sai; no couro claro, pode deixar marca avermelhada, violeta ou esverdeada. Para não voltar, guarde as peças limpas e secas, em armário arejado e em capa de tecido, nunca de plástico.</p>` },
      { h2: 'Como a Dedicada trata o amarelado?', html: `<ul>
<li><strong>Camisas:</strong> colarinho e punhos escovados à mão com branqueador óptico e o programa de alta sujidade da Seitz; se o amarelado for forte e com gordura, lavagem a seco antes e uma pasta que age de um dia para o outro.</li>
<li><strong>Edredons claros:</strong> duplo alvejamento sem cloro.</li>
<li><strong>Linho:</strong> peças brancas ou amareladas recebem alvejamento sem cloro.</li>
<li><strong>Tênis:</strong> o branqueamento faz parte da lavagem; parte do amarelado da sola vem da oxidação da borracha e pode não voltar por completo.</li>
</ul>
{{FALA}}` }
    ],
    perguntas: [
      ['Como tirar o amarelado do colarinho da camisa?', 'Com escovação e alvejante à base de oxigênio, nunca com água sanitária. Molhe a área, aplique detergente, esfregue com escova macia e lave com o alvejante, se a etiqueta permitir. Só passe a ferro depois de a mancha sair. Na Dedicada, colarinho e punhos são escovados à mão com branqueador óptico, e a camisa vai para o programa de alta sujidade da Seitz. Se o amarelado for forte e com gordura, a camisa vai antes para a lavagem a seco e recebe uma pasta que age de um dia para o outro.'],
      ['Como tirar o amarelado do edredom branco?', 'Com alvejante à base de oxigênio, nunca com água sanitária: o cloro amarela o poliéster e pode mudar a cor de bordados. Na Dedicada, os edredons claros passam por um ciclo de duplo alvejamento sem cloro.'],
      ['Roupa amarelada volta a ficar branca?', 'Depende da peça e da causa. Na Dedicada, peças brancas ou amareladas recebem alvejamento sem cloro, mas parte do amarelado, como o da sola do tênis, pode não voltar por completo. Mande uma foto pelo WhatsApp para a equipe avaliar.']
    ],
    guias: ['camisas', 'roupa-de-cama', 'edredom', 'linho'],
    mudou: [
      'Saíram "os melhores produtos do mundo", "a mais moderna tecnologia italiana" e "eliminam o amarelado e o mofo".',
      'Entraram de onde vem o amarelado, a urgência de cada peça, o que fazer, o que muda com o mofo, como a Dedicada trata cada peça, a fala aprovada da Liliane e o botão para o Diagnóstico de Manchas, já no amarelado.'
    ]
  },
  {
    slug: 'por-que-suas-roupas-desbotam-e-como-evitar-isso',
    tituloAntigo: 'Por que suas roupas desbotam e como evitar isso?',
    titulo: 'Por que as roupas desbotam e como evitar?',
    seoTitulo: 'Por Que as Roupas Desbotam e Como Evitar',
    meta: 'Jeans que solta cor, linho que muda de cor, mancha clara de cloro: veja por que as roupas desbotam e o que fazer para evitar, segundo os guias da Dedicada.',
    assina: 'alejandro', falaDe: 'jeans',
    resposta: 'As roupas desbotam com água quente, atrito, cloro e álcool. No jeans, o corante fica na superfície do fio e sai um pouco a cada lavagem. Para evitar, lave as coloridas em água fria, do avesso, sem lotar a máquina e sem água sanitária. A mancha clara de cloro ou de álcool costuma não voltar.',
    ancora: 'm-desbotou', assunto: 'roupa desbotada',
    chamada: 'Sua peça desbotou ou manchou de cor? Escolha a peça no Diagnóstico de Manchas',
    tabela: [['camisas', 'cor-outra-peca'], ['jeans', 'desbote'], ['linho', 'mudanca-cor'], ['linho', 'area-clara']],
    secoes: [
      { h2: 'Por que as roupas desbotam?', html: `<ul>
<li><strong>Água quente:</strong> nas peças coloridas, ela acelera o desbotamento.</li>
<li><strong>Atrito:</strong> no jeans, o índigo tinge só a superfície do fio de algodão, e um pouco dele sai a cada lavagem e a cada atrito.</li>
<li><strong>Cloro e álcool:</strong> atacam o corante; no jeans e na sarja coloridos, o alvejante com cloro deixa manchas claras que não voltam.</li>
<li><strong>Água no tecido errado:</strong> segundo a ANEL, o linho tingido pode mudar de cor na água.</li>
<li><strong>Mancha esfregada:</strong> no linho, a mancha esfregada deixa uma área clara ou marcada, que não tem conserto na lavagem.</li>
</ul>` },
      { h2: 'Como evitar que a roupa desbote?', html: `<ol>
<li>Lave as coloridas em água fria, na temperatura que a etiqueta permite.</li>
<li>Lave o jeans do avesso, em água fria, longe das roupas claras e sem lotar a máquina.</li>
<li>Não use água sanitária nas peças coloridas; nas brancas, prefira alvejante à base de oxigênio.</li>
<li>Se a etiqueta tiver a tina com X, leve a peça para lavar a seco.</li>
<li>Não misture peças de cor forte com as brancas: o algodão absorve o corante solto com facilidade.</li>
</ol>` },
      { h2: 'E quando a cor passa de uma peça para outra?', html: `<p>É o caso mais urgente: leve a peça em menos de 24 horas e não seque, porque o calor da secadora fixa o corante de vez. Quanto antes o tratamento, maior a chance de reverter. Lavar jeans escuro novo com roupas claras faz a cor passar para as outras peças.</p>
<p>Nos guias da Dedicada:</p>
{{TABELA}}` },
      { h2: 'Como a Dedicada lava as peças coloridas?', html: `<p>Jeans e sarja são lavados em água fria, no wet cleaning, no programa da Seitz para peças coloridas, em que a água não passa de 30 °C; quando a peça permite, a seco, sem água nenhuma.</p>
{{FALA}}` }
    ],
    perguntas: [
      ['Roupa desbotada volta à cor?', 'Em geral, não: as manchas claras de cloro e de álcool costumam não voltar, e a mudança de cor do linho tingido não tem conserto na lavagem. Por isso vale prevenir.'],
      ['Como lavar calça jeans sem desbotar?', 'Do avesso, em água fria, longe das roupas claras e sem lotar a máquina. Na Dedicada, jeans e sarja são lavados em água fria, no wet cleaning, ou a seco, sem água nenhuma, quando a peça permite.'],
      ['O veludo com áreas mais claras está desbotado?', 'Nem sempre. O aspecto rajado do veludo vem da luz refletindo no pelo desalinhado; não é mancha nem desbote, e alinhar o pelo resolve.']
    ],
    guias: ['jeans', 'camisas', 'linho', 'veludo'],
    mudou: [
      'Saíram "garantir o melhor cuidado" e "sempre impecáveis".',
      'Saiu a receita "sal ou vinagre branco na primeira lavagem", que os guias não confirmam.',
      'Entraram as causas do desbote tiradas dos guias, como evitar, o caso da cor que passa de uma peça para outra, a fala aprovada do Alejandro e o botão para o Diagnóstico de Manchas, já em "desbotou".'
    ]
  },
  {
    slug: 'remocao-manual-de-bolinhas-e-pelos-de-roupas',
    tituloAntigo: 'Remoção manual de bolinhas e pelos de roupas',
    titulo: 'Bolinhas e pelos na roupa: como tirar sem estragar?',
    seoTitulo: 'Bolinhas e Pelos na Roupa: Como Tirar Sem Estragar',
    meta: 'Suéter, casaco de lã ou camisa com bolinhas? Não puxe com a mão nem com lâmina, que furam a malha. Veja como a Dedicada tira pelos e bolinhas.',
    assina: 'jorge', falaDe: 'la',
    resposta: 'Não puxe as bolinhas com a mão nem com lâmina de barbear: elas podem furar ou abrir a malha. Na Dedicada, os pelos e as bolinhas são tirados à mão e com máquina própria, depois da lavagem. Na manta de poliéster do edredom, as bolinhas vêm do desgaste natural e não têm conserto.',
    ancora: 'm-bolinhas', assunto: 'bolinhas na roupa',
    chamada: 'Sua peça está com bolinhas? Escolha a peça no Diagnóstico de Manchas e veja o que fazer',
    tabela: [['la', 'bolinhas'], ['camisas', 'bolinhas'], ['edredom', 'manta-bolinhas']],
    secoes: [
      { h2: 'Por que a roupa fica com bolinhas?', html: `<p>Pelo desgaste do fio com o uso, mais comum em misturas com poliéster e acrílico. Nos guias da Dedicada:</p>
{{TABELA}}` },
      { h2: 'O que fazer com as bolinhas?', html: `<ol>
<li>Não puxe as bolinhas com a mão nem com lâmina: pode furar ou abrir a malha.</li>
<li>Não lave a lã na máquina de casa, nem no ciclo delicado: a agitação com água morna ou quente feltra a fibra, e a peça encolhe sem volta.</li>
<li>Guarde a lã sempre limpa e seca, em local ventilado.</li>
<li>Leve a peça: os pelos e as bolinhas são tirados à mão e com máquina própria, depois da lavagem.</li>
</ol>` },
      { h2: 'Como a Dedicada tira as bolinhas?', html: `<p>Casaco de lã batida e suéter vão para a lavagem a seco; as peças que pedem água vão para o wet cleaning, no programa da Seitz para lã, a 28 °C, por 25 minutos e com pouca ação mecânica. Depois da lavagem, os pelos e as bolinhas são tirados à mão e com máquina própria. O agasalho de lã fica pronto em 2 dias, a partir de R$ 49,00.</p>
{{FALA}}` }
    ],
    perguntas: [
      ['Como tirar bolinhas da roupa de lã?', 'Sem puxar com a mão e sem lâmina de barbear, que podem furar a malha. Na Dedicada, os pelos e as bolinhas são removidos à mão e com máquina própria, depois da lavagem.'],
      ['Edredom com bolinhas na manta tem jeito?', 'Não: na manta de poliéster, as bolinhas vêm do desgaste natural com o uso e as lavagens, e não têm solução na lavagem.'],
      ['Camisa com bolinhas tem jeito?', 'As bolinhas vêm do desgaste do fio, comum nas misturas com poliéster. Leve a camisa ou mande uma foto pelo WhatsApp para a equipe avaliar.']
    ],
    guias: ['la', 'camisas', 'edredom'],
    mudou: [
      'Saiu "serviço exclusivo".',
      '"Processo totalmente artesanal e manual" virou o que o guia de lã diz: os pelos e as bolinhas são tirados à mão e com máquina própria, depois da lavagem.',
      'Entraram de onde vêm as bolinhas, o que fazer, o processo da lã com prazo e preço, a fala aprovada do Jorge e o botão para o Diagnóstico de Manchas, já em bolinhas.'
    ]
  },
  {
    slug: 'minha-roupa-manchou-a-lavanderia-consegue-recuperar',
    tituloAntigo: 'Minha roupa manchou: a lavanderia consegue recuperar?',
    titulo: 'Minha roupa manchou: a lavanderia consegue recuperar?',
    seoTitulo: 'Minha Roupa Manchou: a Lavanderia Consegue Recuperar?',
    meta: 'Muitas manchas saem quando são tratadas antes da lavagem, com o produto certo para cada tipo. Veja o que fazer em casa, o que pode não sair e como levar.',
    assina: 'jorge', falaDe: null,
    resposta: 'Muitas vezes, sim, quando a mancha é tratada antes da lavagem, com o tira-manchas certo para o tipo dela. Mas nem tudo sai: alguns danos, como a mancha clara de cloro e o encolhimento, não se desfazem na lavagem. Até levar, não esfregue, não use água quente nem produto caseiro, e leve a peça quanto antes.',
    ancora: '', assunto: 'roupa manchada',
    chamada: 'Use o Diagnóstico de Manchas: escreva a mancha e a peça, como “vinho na camisa”, e veja o que fazer',
    tabela: [['seda', 'vinho-tinto'], ['couro', 'mofo'], ['camisas', 'cor-outra-peca'], ['jeans', 'graxa']],
    secoes: [
      { h2: 'Por que a mancha não sai na lavagem comum?', html: `<p>Porque cada mancha tem uma química: gordura, proteína e tanino não saem com o mesmo produto. Na Dedicada, cada família de mancha tem o seu tira-manchas da Seitz, o V1, o V2 ou o V3, e cada mancha é tratada na sua vez, antes da lavagem. Água quente, ferro e produto caseiro podem fixar a mancha antes do tratamento certo.</p>` },
      { h2: 'O que fazer até levar a peça?', html: `<ol>
<li>Tire o excesso encostando um pano limpo, sem esfregar: o atrito espalha a mancha e pode tirar a cor.</li>
<li>Não use água quente: ela fixa manchas de café, chá e vinho, e o calor fixa manchas de sangue, suor e comida.</li>
<li>Não passe ferro, secador de cabelo nem secadora antes de a mancha sair.</li>
<li>Evite tira-manchas caseiro, álcool e água sanitária: em seda, couro e jeans colorido, o dano costuma ser pior que a mancha.</li>
<li>Ao entregar, conte o que é a mancha, quando aconteceu e se já tentou tirar em casa.</li>
</ol>` },
      { h2: 'Quais manchas são mais urgentes?', html: `<p>Depende da peça. Alguns exemplos dos guias da Dedicada:</p>
{{TABELA}}
<p>A lista completa, peça por peça, está no <a href="https://dedicadalavanderia.com.br/diagnostico-de-manchas/">Diagnóstico de Manchas</a>.</p>` },
      { h2: 'O que pode não sair na lavagem?', html: `<p>Alguns danos não se desfazem na lavagem: a mancha clara de cloro ou de álcool, o encolhimento, a feltragem da lã, os riscos brancos do jeans lavado com pouca água e o enrugamento do couro pelo calor. Nesses casos, o que resta é evitar da próxima vez.</p>
<p>Na dúvida, mande uma foto da peça pelo WhatsApp antes de trazer: a Dedicada avalia peças por foto.</p>` }
    ],
    perguntas: [
      ['Toda mancha sai?', 'Nem sempre. Algumas saem por completo; outras melhoram, mas deixam marca, como o vinho no couro; e alguns danos, como a mancha clara de cloro, não se desfazem na lavagem.'],
      ['Mancha antiga ainda tem jeito?', 'Leve a peça assim mesmo e conte há quanto tempo a mancha está nela e o que já foi tentado: a equipe avalia e diz o que dá para fazer. O calor fixa a mancha, então a que já passou por água quente ou ferro é mais difícil de sair.'],
      ['Como saber que tipo de mancha é?', 'Use o Diagnóstico de Manchas: escreva o que aconteceu, como “vinho na camisa branca”, ou escolha a peça e o problema. Se não souber o que é, escolha “Não sei o que é a mancha” ou mande uma foto pelo WhatsApp.']
    ],
    guias: ['camisas', 'seda', 'couro', 'jeans'],
    mudou: [
      'Saíram "os melhores produtos" e "utilizamos os melhores produtos para lavanderias do mundo".',
      'Os produtos V1, V2 e V3 continuam, agora com a explicação dos guias: cada família de mancha tem o seu tira-manchas.',
      'Entraram o que fazer até levar, exemplos de urgência dos guias, o que pode não sair na lavagem e o botão para o Diagnóstico de Manchas.'
    ]
  },
  {
    slug: 'como-lavar-vestidos-e-pecas-em-rayon-dedicada-lavanderia',
    tituloAntigo: 'Lavagem de roupas em rayon: como lavar corretamente rayon (raiom)?',
    titulo: 'Como lavar roupa de rayon (raiom) sem estragar?',
    seoTitulo: 'Como Lavar Roupa de Rayon (Raiom) Sem Estragar',
    meta: 'O rayon fica frágil quando molhado. Veja como lavar vestidos e blusas de rayon sem esfregar nem torcer, e o que fazer quando a peça mancha.',
    assina: 'alejandro', falaDe: null,
    resposta: 'O rayon, ou raiom, fica frágil quando está molhado: segundo a ANEL, a viscose, o tipo mais comum de rayon, perde boa parte da resistência na água. Não esfregue nem torça a peça molhada, siga a etiqueta e, na dúvida, use água fria e não use secadora nem água sanitária. Com mancha, tire só o excesso com um pano e leve a peça.',
    ancora: 'viscose', assunto: 'roupa de rayon',
    chamada: 'Sua peça de rayon manchou? Veja o que fazer no Diagnóstico de Manchas',
    tabela: [],
    secoes: [
      { h2: 'Por que o rayon pede cuidado?', html: `<p>Porque a viscose, o tipo mais comum de rayon, perde boa parte da resistência quando está molhada, segundo a ANEL. Molhada, a peça fica frágil, e esfregar ou torcer pode deformar o tecido.</p>` },
      { h2: 'Como lavar roupa de rayon em casa?', html: `<ol>
<li>Siga a etiqueta: ela diz se a peça aceita água ou só lavagem a seco.</li>
<li>Na dúvida, use água fria, não esfregue e não use secadora nem água sanitária.</li>
<li>Não esfregue nem torça a peça molhada.</li>
<li>Com mancha, tire só o excesso encostando um pano limpo e leve a peça antes de lavar.</li>
</ol>` },
      { h2: 'Como a Dedicada lava o rayon?', html: `<p>Conforme a etiqueta: lavagem a seco, em percloroetileno, ou em água, com produtos Seitz. As manchas são tratadas antes da lavagem, com o tira-manchas da Seitz próprio da família de cada uma (V1, V2 ou V3).</p>
<p>O rayon ainda não tem guia próprio em Cuidados por Tecido. Para saber o prazo e o preço da sua peça, mande uma foto dela e da etiqueta pelo WhatsApp: a Dedicada avalia peças por foto.</p>` }
    ],
    perguntas: [
      ['Rayon e viscose são a mesma coisa?', 'A viscose é o tipo mais comum de rayon, e os cuidados são os mesmos: a peça fica frágil quando está molhada.'],
      ['Rayon encolhe?', 'Água quente e secadora são as causas mais comuns de encolhimento. No rayon, siga a etiqueta e, na dúvida, use água fria e não use secadora.'],
      ['Quanto custa lavar uma peça de rayon?', 'Depende da peça: mande uma foto pelo WhatsApp e peça o orçamento. Na Dedicada, a maioria das peças fica pronta em 2 dias.']
    ],
    guias: [],
    mudou: [
      'Saiu "garantindo que suas roupas fiquem limpas, macias e com o caimento perfeito".',
      'Saiu "passar em baixa temperatura, sempre do avesso", que os guias não confirmam.',
      'Entraram a nota da ANEL sobre a viscose molhada, como lavar em casa, como a Dedicada lava conforme a etiqueta e o botão para o Diagnóstico de Manchas, já em viscose e malha fria.'
    ]
  }
];
