// Monta pagina-3165.html e prototipo.html a partir de fonte/pagina.html e do banco em
// diagnostico-manchas.js. As tabelas estáticas (urgência, famílias, o que não sai) e as
// perguntas frequentes saem daqui, para a página e a ferramenta nunca se contradizerem.
// Uso: node ferramentas/montar.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => readFileSync(join(pasta, f), 'utf8');

// Carrega o banco sem navegador.
const caixa = { window: {} };
vm.runInNewContext(ler('diagnostico-manchas.js'), caixa);
const D = caixa.window.DM_DIAGNOSTICO;
const { erros } = D.validar();
if (erros.length) { console.error('Banco com erros:\n- ' + erros.join('\n- ')); process.exit(1); }

const ASSINA = 'jorge'; // Proposta; ver perguntas-para-o-dono.md
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const minuscula = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const pecasEmOrdem = D.GRUPOS.flatMap((g) => D.PECAS.filter((p) => p.grupo === g.id));
const pecasComGuia = pecasEmOrdem.filter((p) => !p.semGuia);
const link = (p) => `<a href="${esc(p.guia)}">${esc(p.nome)}</a>`;
const NUMEROS = {
  N_PECAS: D.PECAS.length,
  N_GUIAS: pecasComGuia.length,
  N_PROBLEMAS: D.PECAS.reduce((n, p) => n + p.problemas.length, 0),
  N_MANCHAS: D.MANCHAS.length
};

// 1. Manchas mais urgentes por peça
function tabelaUrgencia() {
  const linhas = pecasComGuia.map((p) => {
    const ordenados = D.problemasOrdenados(p);
    const ordem = D.NIVEIS[ordenados[0].nivel].ordem;
    const topo = ordenados.filter((pr) => D.NIVEIS[pr.nivel].ordem === ordem);
    const textos = [...new Set(topo.map((pr) => pr.urgencia))];
    let nomes, urg;
    if (textos.length === 1) {
      nomes = esc(topo.map((pr, i) => (i ? minuscula(pr.nome) : pr.nome)).join('; '));
      urg = esc(textos[0]);
    } else { // prazos diferentes: cada problema com o seu
      nomes = '<ul>' + topo.map((pr) => `<li>${esc(pr.nome)}, ${esc(minuscula(pr.urgencia))}</li>`).join('') + '</ul>';
      urg = esc(D.NIVEIS[topo[0].nivel].rotulo);
    }
    return `<tr><th scope="row">${link(p)}</th><td data-rotulo="Mais urgente">${nomes}</td><td data-rotulo="Urgência">${urg}</td></tr>`;
  });
  return `<table class="dm-tabela"><thead><tr><th scope="col">Peça</th><th scope="col">Mais urgente</th><th scope="col">Urgência</th></tr></thead><tbody>\n${linhas.join('\n')}\n</tbody></table>`;
}

// 2. Famílias de manchas
function tabelaFamilias() {
  const linhas = ['gordura', 'proteina', 'tanino'].map((id) => {
    const f = D.FAMILIAS[id];
    const ex = f.exemplos.charAt(0).toUpperCase() + f.exemplos.slice(1);
    return `<tr><th scope="row">${esc(f.nome)}</th><td data-rotulo="Exemplos">${esc(ex)}</td></tr>`;
  });
  return `<table class="dm-tabela"><thead><tr><th scope="col">Família de mancha</th><th scope="col">Exemplos</th></tr></thead><tbody>\n${linhas.join('\n')}\n</tbody></table>`;
}

// 3. O que não sai na lavagem
function tabelaSemSolucao() {
  const linhas = pecasComGuia.map((p) => {
    const itens = p.problemas.filter((pr) => pr.nivel === 'sem_solucao' || pr.nivel === 'dificil');
    if (!itens.length) return null;
    const lis = itens.map((pr) => `<li><strong>${esc(pr.nome)}</strong>${pr.nivel === 'dificil' ? ' (' + esc(minuscula(pr.urgencia)) + ')' : ''}: ${esc(minuscula(pr.acontece))}</li>`).join('');
    return `<tr><th scope="row">${link(p)}</th><td><ul>${lis}</ul></td></tr>`;
  }).filter(Boolean);
  return `<table class="dm-tabela"><thead><tr><th scope="col">Peça</th><th scope="col">O que não se desfaz na lavagem</th></tr></thead><tbody>\n${linhas.join('\n')}\n</tbody></table>`;
}

// 4. Mancha por mancha: cada família com o primeiro cuidado, o cuidado próprio de cada mancha
// e as peças em que ela é mais urgente segundo os guias. Fica no HTML para Google e IAs lerem.
function manchaPorMancha() {
  return ['gordura', 'proteina', 'tanino', 'outras', 'dano'].map((fid) => {
    const f = D.FAMILIAS[fid];
    const ms = D.MANCHAS.filter((m) => m.familia === fid);
    const linhas = ms.map((m) => {
      const onde = pecasComGuia.map((p) => ({ p, pr: D.problemaDaMancha(p, m.id) })).filter((x) => x.pr)
        .sort((a, b) => D.NIVEIS[a.pr.nivel].ordem - D.NIVEIS[b.pr.nivel].ordem);
      const mostrar = onde.slice(0, 4).map((x) => `${link(x.p)}: ${esc(minuscula(x.pr.urgencia))}`);
      if (onde.length > 4) mostrar.push(`e mais ${onde.length - 4} peças`);
      const leia = m.leia && D.BLOG[m.leia] ? ` Leia também: <a href="${esc(D.SITE + D.BLOG[m.leia][0])}">${esc(D.BLOG[m.leia][1])}</a>.` : '';
      const cuidado = (m.dica ? esc(m.dica) : 'Siga o primeiro cuidado.') + leia;
      const guias = mostrar.length ? mostrar.join('; ') : 'Em qualquer peça, leve quanto antes.';
      return `<tr><th scope="row">${esc(m.nome)}</th><td data-rotulo="Cuidado">${cuidado}</td><td data-rotulo="Nos guias">${guias}</td></tr>`;
    });
    const intro = f.primeiro ? `<p class="dm-mais-txt"><strong>Primeiro cuidado:</strong> ${esc(f.primeiro)}</p>\n` : '';
    return `<details class="dm-mais"><summary>${esc(f.nome)} (${ms.length})</summary>\n${intro}<table class="dm-tabela"><thead><tr><th scope="col">${fid === 'dano' ? 'Dano' : 'Mancha'}</th><th scope="col">Cuidado</th><th scope="col">Nos guias</th></tr></thead><tbody>\n${linhas.join('\n')}\n</tbody></table>\n</details>`;
  }).join('\n');
}

// 5. Perguntas frequentes (quatro delas já estão publicadas na página central)
const PERGUNTAS = [
  ['O que fazer logo depois que a roupa mancha?',
    'Tire o excesso encostando um pano limpo, sem esfregar, e não use água quente, que fixa manchas de café, chá e vinho. Não passe ferro nem secador antes de a mancha sair, e leve a peça quanto antes: as mais urgentes, como vinho tinto na seda e mofo no couro, pedem cuidado em menos de 24 horas.'],
  ['Por que não usar água sanitária nas manchas?',
    'Porque o cloro costuma piorar: deixa o amarelado do colarinho mais forte, escurece a mancha de ferrugem, enfraquece a fibra do linho, ataca o corante do couro e deixa manchas claras no jeans colorido. Na Dedicada, o alvejamento é sempre à base de oxigênio, nunca cloro.'],
  ['Quais tecidos não podem ir na máquina de lavar?',
    'Na máquina de casa, não vão seda, lã, ternos e blazers, couro, peles, tênis e vestidos de festa e de noiva. Edredons de casal ou king não cabem direito, e a estrutura do carrinho de bebê não vai à máquina. Linho, veludo, jaquetas, pelúcias pequenas e cortinas leves só quando a etiqueta permite água, e com cuidado.'],
  ['Como evitar mofo nas roupas em Florianópolis?',
    'Guarde as peças limpas e secas, em armário arejado e em capa de tecido, nunca de plástico. Mofo é o problema que mais chega à Dedicada em veludo, couro, peles e pelúcias, e o ideal é tratar quanto antes, de preferência em até 24 horas.'],
  ['Quanto tempo a lavanderia leva e quanto custa?',
    'Na Dedicada, a maioria das peças fica pronta em 2 dias; lençóis, tênis e pelúcias, em 3; cortinas, em 3 a 4; roupa de bebê, toalhas de mesa e guardanapos, em 4; vestidos finos e fantasias, em cerca de 5; couro, em 5 a 7; e vestido de noiva, peles e carrinho de bebê, em 7. Veludo, conforme a peça. Camisa a partir de R$ 23,90 e terno a partir de R$ 91,00. Há serviço expresso para a maioria das peças, no mesmo dia ou no seguinte, com acréscimo de 50%; não têm expresso couro, tênis, vestidos, lençóis, toalhas de mesa e guardanapos.'],
  ['Minha roupa manchou com a cor de outra peça. Tem jeito?',
    'Quanto antes o tratamento, maior a chance de reverter. O algodão absorve o corante solto com facilidade, e a secadora fixa a mancha: não seque a peça e leve em menos de 24 horas. Para não repetir, não misture peças de cor forte com as brancas.'],
  ['A mancha clara de água sanitária sai?',
    'Em peça colorida, geralmente não: o cloro tira o corante, e as manchas claras que ele deixa no jeans e na sarja coloridos não voltam. Em peça branca, o cloro enfraquece a fibra e, segundo a ANEL, amarela o poliéster e a poliamida. Na dúvida, mande uma foto pelo WhatsApp antes de trazer a peça.'],
  ['Como tirar mancha de desodorante?',
    'Trate antes de passar a ferro, porque o calor fixa a mancha. Esfregue a axila com detergente e escova macia e lave com alvejante à base de oxigênio, se a etiqueta permitir. Marca antiga, que já endureceu o tecido, pede tratamento profissional. Na Dedicada, quando as axilas estão muito amareladas e com gordura, a camisa vai antes para a lavagem a seco, e as axilas recebem a mesma pasta do colarinho, que age de um dia para o outro.'],
  ['Vocês buscam as roupas em casa?',
    'Sim. A coleta e a entrega são grátis, sem taxa, em 26 bairros da Ilha e do Continente, em dias fixos da semana. De outros bairros, é só levar as peças a uma das lojas, no Centro ou no Santa Mônica.']
];
const perguntasHtml = () => PERGUNTAS.map(([q, a]) => `<details><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join('\n');

// 6. Dados estruturados, com acentos em \uXXXX (o filtro do servidor estraga os acentos)
function jsonLd() {
  const url = 'https://dedicadalavanderia.com.br/diagnostico-de-manchas/';
  const pessoa = D.PESSOAS[ASSINA];
  const dados = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url + '#pagina', url,
        name: 'Diagnóstico de Manchas: o Que Fazer Antes de Lavar',
        description: 'Escolha a peça e o problema e veja o que fazer em casa, o que evitar e como a Dedicada Lavanderia trata cada mancha, com prazo e preço.',
        inLanguage: 'pt-BR',
        isPartOf: { '@type': 'WebSite', url: 'https://dedicadalavanderia.com.br/', name: 'Dedicada Lavanderia' },
        breadcrumb: { '@id': url + '#trilha' },
        reviewedBy: { '@id': url + '#revisor' },
        lastReviewed: '2026-09-28', dateModified: '2026-09-28',
        about: ['remoção de manchas', 'cuidados com tecidos', 'lavanderia em Florianópolis']
      },
      {
        '@type': 'Person', '@id': url + '#revisor', name: pessoa.nome,
        jobTitle: pessoa.papel.charAt(0).toUpperCase() + pessoa.papel.slice(1), image: pessoa.foto,
        worksFor: { '@type': 'LocalBusiness', name: 'Dedicada Lavanderia', url: 'https://dedicadalavanderia.com.br/', foundingDate: '2003' }
      },
      {
        '@type': 'BreadcrumbList', '@id': url + '#trilha',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://dedicadalavanderia.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Cuidados por Tecido', item: 'https://dedicadalavanderia.com.br/cuidados-por-tecido/' },
          { '@type': 'ListItem', position: 3, name: 'Diagnóstico de Manchas', item: url }
        ]
      },
      {
        '@type': 'FAQPage', '@id': url + '#perguntas',
        mainEntity: PERGUNTAS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
      }
    ]
  };
  const texto = JSON.stringify(dados, null, 2).replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  return `<script type="application/ld+json">\n${texto}\n</script>`;
}

const pessoa = D.PESSOAS[ASSINA];
const pagina = ler('fonte/pagina.html')
  .replaceAll('{{FOTO_ASSINA}}', esc(pessoa.foto))
  .replaceAll('{{NOME_ASSINA}}', esc(pessoa.nome))
  .replaceAll('{{PAPEL_ASSINA}}', esc(pessoa.papel))
  .replace('{{TABELA_URGENCIA}}', tabelaUrgencia())
  .replace('{{TABELA_FAMILIAS}}', tabelaFamilias())
  .replace('{{TABELA_SEM_SOLUCAO}}', tabelaSemSolucao())
  .replace('{{PERGUNTAS}}', perguntasHtml())
  .replace('{{MANCHA_POR_MANCHA}}', manchaPorMancha())
  .replace(/\{\{(N_[A-Z]+)\}\}/g, (m, k) => String(NUMEROS[k] ?? m))
  .replace('{{JSONLD}}', jsonLd());
if (/\{\{[A-Z_]+\}\}/.test(pagina)) throw new Error('Sobrou marcador sem trocar em fonte/pagina.html');
if (/\n\s*\n/.test(pagina.trim())) throw new Error('Linha em branco na página: o WordPress transformaria em parágrafo');
writeFileSync(join(pasta, 'pagina-3165.html'), pagina);

// Protótipo: a mesma página, com o CSS e o JS locais e as fotos da pasta prototipo-img/.
const fotosLocais = { fotos: 'prototipo-img/', fotoLiliane: 'prototipo-img/liliane.webp', fotoJorge: 'prototipo-img/jorge.webp', fotoAlejandro: 'prototipo-img/alejandro.webp' };
const corpo = pagina
  .replace('[wpcode id="3168"]', '<link rel="stylesheet" href="diagnostico-manchas.css">')
  .replace('[wpcode id="3164"]', `<script>window.DM_CONFIG = ${JSON.stringify(fotosLocais)};</script>\n<script src="diagnostico-manchas.js"></script>`)
  .replace(esc(pessoa.foto), fotosLocais['foto' + ASSINA.charAt(0).toUpperCase() + ASSINA.slice(1)]);
writeFileSync(join(pasta, 'prototipo.html'), `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagnóstico de Manchas (protótipo)</title>
<style>
  /* Só do protótipo: imita o cabeçalho e o rodapé do site. Não vai para o WordPress. */
  body { margin: 0; background: #fff; font-family: "Helvetica Neue", Arial, sans-serif; }
  .prototipo-aviso { background: #d3d3d3; color: #111; text-align: center; font-size: 13px; padding: 6px 16px; }
  .prototipo-topo { background: #111; color: #fff; padding: 14px 16px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .prototipo-rodape { background: #111; color: #d3d3d3; padding: 20px 16px; font-size: 13px; text-align: center; margin-top: 40px; }
</style>
</head>
<body>
<div class="prototipo-aviso">Protótipo para avaliação. Não é a página publicada.</div>
<header class="prototipo-topo">Dedicada Lavanderia</header>
<main>
${corpo}
</main>
<footer class="prototipo-rodape">Dedicada Lavanderia · Centro e Santa Mônica · Florianópolis</footer>
</body>
</html>
`);
// Página da prévia publicada no claude.ai (sem <html>/<head>, que a plataforma acrescenta).
// Só é gerada quando se passa a pasta de saída: node ferramentas/montar.mjs --previa <pasta>
const iPrevia = process.argv.indexOf('--previa');
if (iPrevia > 0 && process.argv[iPrevia + 1]) {
  const saida = process.argv[iPrevia + 1];
  writeFileSync(join(saida, 'index.html'), `<title>Diagnóstico de Manchas</title>
<style>
  /* Prévia: fundo e cores explícitos, no visual claro do site da Dedicada. */
  body { margin: 0; background: #ffffff; color: #111111; font-family: "Helvetica Neue", Arial, sans-serif; }
  .previa-aviso { background: #d3d3d3; color: #111111; font-size: 13px; padding: 8px 16px; display: flex; flex-wrap: wrap; gap: 4px 12px; justify-content: center; text-align: center; }
  .previa-aviso a { color: #111111; font-weight: 700; }
  .previa-topo { background: #111111; color: #ffffff; padding: 14px 16px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .previa-rodape { background: #111111; color: #d3d3d3; padding: 20px 16px; font-size: 13px; text-align: center; margin-top: 40px; }
</style>
<div class="previa-aviso"><span>Protótipo para avaliação. Não é a página publicada.</span><a href="pesquisa.html">Ver a pesquisa e as decisões</a><a href="blog.html">Ver os posts revisados do blog</a></div>
<header class="previa-topo">Dedicada Lavanderia</header>
<main>
${corpo}
</main>
<footer class="previa-rodape">Dedicada Lavanderia · Centro e Santa Mônica · Florianópolis</footer>
`);
  console.log('Prévia montada em ' + saida);
}
console.log(`pagina-3165.html e prototipo.html montados (${D.PECAS.length} peças, ${D.PECAS.reduce((n, p) => n + p.problemas.length, 0)} problemas, ${D.MANCHAS.length} manchas).`);
