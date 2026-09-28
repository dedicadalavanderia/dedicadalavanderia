// Monta os posts revisados do blog a partir de blog-revisado/posts.mjs e do banco da ferramenta:
//   blog-revisado/wordpress/<slug>.html  conteúdo para colar no editor de código do post
//   blog-revisado/MUDANCAS.md            título, descrição, assinatura e o que mudou em cada post
//   blog-revisado/previa.html            prévia local (abre no navegador)
// Confere as regras do projeto em cada post e sai com código 1 se houver erro.
// Uso: node ferramentas/montar-blog.mjs [--previa <pasta>]  (a pasta recebe blog.html)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { checarTexto } from './regras.mjs';
import { POSTS } from '../blog-revisado/posts.mjs';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const saida = join(pasta, 'blog-revisado');
mkdirSync(join(saida, 'wordpress'), { recursive: true });

const caixa = { window: {} };
vm.runInNewContext(readFileSync(join(pasta, 'diagnostico-manchas.js'), 'utf8'), caixa);
const D = caixa.window.DM_DIAGNOSTICO;
const SITE = D.SITE;
const WHATS = 'https://wa.me/5548984280639';

const erros = [], avisos = [];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const semTags = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const peca = (id) => D.PECAS.find((p) => p.id === id);
const ascii = (s) => s.replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

function tabela(post) {
  const linhas = post.tabela.map(([pid, prid]) => {
    const p = peca(pid);
    const pr = p && p.problemas.find((x) => x.id === prid);
    if (!pr) { erros.push(`${post.slug}: a tabela cita ${pid}/${prid}, que não existe na ferramenta`); return ''; }
    const problema = pr.nome.charAt(0).toLowerCase() + pr.nome.slice(1);
    return `<tr><td><a href="${esc(p.guia)}">${esc(p.nome)}</a>: ${esc(problema)}</td><td>${esc(pr.urgencia)}</td><td>${esc(pr.acontece)}</td></tr>`;
  });
  return `<table><thead><tr><th>Peça e problema</th><th>Urgência</th><th>O que geralmente acontece</th></tr></thead><tbody>${linhas.join('')}</tbody></table>`;
}

function fala(post) {
  const p = peca(post.falaDe);
  const pessoa = D.PESSOAS[post.assina];
  if (!p || !p.fala) { erros.push(`${post.slug}: a peça ${post.falaDe} não tem fala aprovada`); return ''; }
  if (p.assina !== post.assina) erros.push(`${post.slug}: a fala do guia de ${p.nome} é de ${D.PESSOAS[p.assina].nome}, não de quem assina o post`);
  return `<blockquote><p>“${esc(p.fala)}”</p><p><strong>${esc(pessoa.nome)}</strong>, ${esc(pessoa.papel)} da Dedicada Lavanderia</p></blockquote>`;
}

function jsonLd(post) {
  const url = `${SITE}/${post.slug}/`;
  const dados = {
    '@context': 'https://schema.org', '@type': 'FAQPage', '@id': url + '#perguntas',
    mainEntity: post.perguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  };
  return `<script type="application/ld+json">${ascii(JSON.stringify(dados))}</script>`;
}

// Conteúdo do post para o editor de código do WordPress: sem linhas em branco (o WordPress
// transformaria em parágrafos) e sem classes da ferramenta (o CSS dela só carrega na página 3165).
function corpo(post, fotoLocal) {
  const pessoa = D.PESSOAS[post.assina];
  const foto = fotoLocal ? `prototipo-img/${post.assina}.webp` : pessoa.foto;
  const msg = encodeURIComponent(`Olá! Vim do post sobre ${D.MANCHAS.find((m) => m.id === post.mancha).nome.toLowerCase()} no blog. Posso mandar uma foto da peça?`);
  const leia = post.guias.map((id) => `<a href="${esc(peca(id).guia)}">Guia de ${esc(peca(id).nome.toLowerCase())}</a>`)
    .concat(`<a href="${SITE}/diagnostico-de-manchas/">Diagnóstico de Manchas</a>`).join(' · ');
  const partes = [
    `<p style="display:flex;align-items:center;gap:12px;font-size:14px"><img src="${esc(foto)}" alt="${esc(pessoa.nome)}" width="48" height="48" style="border-radius:50%;flex:0 0 48px;object-fit:cover"><span>Revisado por <strong>${esc(pessoa.nome)}</strong>, ${esc(pessoa.papel)} da Dedicada Lavanderia · Atualizado em setembro de 2026</span></p>`,
    `<p>${esc(post.resposta)}</p>`,
    `<p style="border:2px solid #111;border-radius:8px;padding:12px 14px"><a href="${SITE}/diagnostico-de-manchas/#m-${post.mancha}"><strong>${esc(post.chamada)} →</strong></a></p>`,
    ...post.secoes.map((s) => `<h2>${esc(s.h2)}</h2>\n${s.html.replace('{{TABELA}}', tabela(post)).replace('{{FALA}}', fala(post))}`),
    `<h2>Perguntas frequentes</h2>`,
    ...post.perguntas.map(([q, a]) => `<h3>${esc(q)}</h3>\n<p>${esc(a)}</p>`),
    `<h2>Onde levar a peça em Florianópolis?</h2>`,
    `<p>Nas lojas da Dedicada no Centro (Rua Germano Wendhausen, 286) e no Santa Mônica (Rua Dr. Agostinho Sielski, 44), de segunda a sexta, das 8h às 18h, sem fechar para o almoço, e aos sábados, das 8h às 13h. Ou pela coleta e entrega grátis, em 26 bairros da Ilha e do Continente, em dias fixos da semana; de outros bairros, é só levar a peça a uma das lojas.</p>`,
    `<p><a href="${WHATS}?text=${msg}"><strong>Falar com a Dedicada pelo WhatsApp: (48) 98428-0639</strong></a></p>`,
    `<p><strong>Leia também:</strong> ${leia}</p>`,
    jsonLd(post)
  ];
  return partes.join('\n');
}

// Conferência de cada post.
for (const post of POSTS) {
  const html = corpo(post, false);
  const texto = [post.titulo, post.seoTitulo, post.meta, semTags(html)].join(' ');
  const r = checarTexto(post.slug, texto);
  erros.push(...r.erros); avisos.push(...r.avisos);
  if (/\n\s*\n/.test(html)) erros.push(`${post.slug}: linha em branco no conteúdo`);
  if (/\{\{[A-Z]+\}\}/.test(html)) erros.push(`${post.slug}: sobrou marcador sem trocar`);
  if (!D.PESSOAS[post.assina]) erros.push(`${post.slug}: quem assina não existe`);
  if (!D.MANCHAS.some((m) => m.id === post.mancha)) erros.push(`${post.slug}: mancha ${post.mancha} não existe na ferramenta`);
  post.guias.forEach((id) => { if (!peca(id) || peca(id).semGuia) erros.push(`${post.slug}: guia ${id} não existe`); });
  const palavras = post.resposta.split(/\s+/).length;
  if (palavras < 30 || palavras > 70) avisos.push(`${post.slug}: resposta curta com ${palavras} palavras (o ideal é de 40 a 60)`);
  if (post.seoTitulo.length > 60) avisos.push(`${post.slug}: título de SEO com ${post.seoTitulo.length} caracteres (máximo 60)`);
  if (post.meta.length > 160) avisos.push(`${post.slug}: descrição com ${post.meta.length} caracteres (máximo 160)`);
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  if (/[^\x00-\x7f]/.test(ld)) erros.push(`${post.slug}: JSON-LD com acento sem \\u`);
  try { JSON.parse(ld); } catch (e) { erros.push(`${post.slug}: JSON-LD inválido`); }
  writeFileSync(join(saida, 'wordpress', post.slug + '.html'), html + '\n');
}

// Lista do que mudou, para quem for publicar.
const md = ['# Posts revisados: o que publicar em cada um', '',
  'Gerado por `node ferramentas/montar-blog.mjs`. Não edite à mão: mude `blog-revisado/posts.mjs` e gere de novo.', ''];
for (const post of POSTS) {
  const pessoa = D.PESSOAS[post.assina];
  md.push(`## ${post.titulo}`, '',
    `- **Endereço (não muda):** ${SITE}/${post.slug}/`,
    `- **Título atual:** ${post.tituloAntigo}`,
    `- **Título novo do post:** ${post.titulo}`,
    `- **Título para o Google (plugin de SEO):** ${post.seoTitulo}`,
    `- **Descrição para o Google:** ${post.meta}`,
    `- **Assina:** ${pessoa.nome}, ${pessoa.papel}`,
    `- **Conteúdo:** \`blog-revisado/wordpress/${post.slug}.html\``, '',
    '**O que mudou:**', '', ...post.mudou.map((m) => `- ${m}`), '');
}
writeFileSync(join(saida, 'MUDANCAS.md'), md.join('\n'));

// Prévia: os posts como vão ficar, com o que mudou em cada um.
function previa(voltar) {
  const indice = POSTS.map((p) => `<li><a href="#${p.slug}">${esc(p.titulo)}</a></li>`).join('');
  const artigos = POSTS.map((post) => `<section class="post" id="${post.slug}">
<div class="ficha">
<p class="rotulo">Post revisado</p>
<p><strong>Endereço (não muda):</strong> <a href="${SITE}/${post.slug}/">${SITE.replace('https://', '')}/${post.slug}/</a></p>
<p><strong>Título atual:</strong> ${esc(post.tituloAntigo)}</p>
<p><strong>Para o Google:</strong> ${esc(post.seoTitulo)}<br><span class="meta">${esc(post.meta)}</span></p>
<details><summary>O que mudou</summary><ul>${post.mudou.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></details>
</div>
<article>
<h1>${esc(post.titulo)}</h1>
${corpo(post, true)}
</article>
</section>`).join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Posts Revisados</title>
<style>
  /* Prévia no visual claro do site da Dedicada: fundo e cores explícitos. */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #ffffff; color: #1a1a1a; font-family: "Helvetica Neue", Arial, sans-serif; line-height: 1.6; }
  .aviso { background: #d3d3d3; color: #111; font-size: 13px; padding: 8px 16px; text-align: center; }
  .aviso a { color: #111; font-weight: 700; }
  .topo { background: #111; color: #fff; padding: 14px 16px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .pagina { max-width: 760px; margin: 0 auto; padding: 16px 16px 40px; overflow-wrap: break-word; }
  .indice { background: #f3f3f3; border-radius: 8px; padding: 12px 16px 12px 36px; }
  .post { margin: 32px 0 0; padding-top: 24px; border-top: 4px solid #111; }
  .ficha { background: #f3f3f3; border-radius: 8px; padding: 12px 16px; font-size: 14px; }
  .ficha p { margin: 0 0 6px; }
  .ficha .rotulo { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #4a4a4a; font-weight: 700; }
  .ficha .meta { color: #4a4a4a; }
  .ficha summary { cursor: pointer; font-weight: 700; padding: 6px 0; }
  article h1 { font-size: clamp(26px, 6vw, 34px); line-height: 1.2; margin: 24px 0 12px; }
  article h2 { font-size: 22px; line-height: 1.3; margin: 28px 0 10px; }
  article h3 { font-size: 17px; margin: 18px 0 6px; }
  article a { color: #111; }
  article table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 8px 0 12px; }
  article th, article td { text-align: left; vertical-align: top; padding: 8px; border-bottom: 1px solid #bdbdbd; }
  article thead th { border-bottom: 2px solid #111; font-size: 13px; text-transform: uppercase; }
  article blockquote { margin: 16px 0; padding: 4px 0 4px 16px; border-left: 4px solid #111; font-style: italic; }
  article blockquote p:last-child { font-style: normal; font-size: 14px; }
  @media (max-width: 600px) {
    article table, article tbody, article tr, article td { display: block; width: 100%; }
    article thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    article tr { border: 1px solid #bdbdbd; border-radius: 8px; padding: 6px 10px; margin: 0 0 8px; }
    article td { border: 0; padding: 2px 0; }
  }
</style>
</head>
<body>
<div class="aviso">Prévia dos posts revisados. Não é o site publicado.${voltar ? ' <a href="index.html">← Voltar ao protótipo</a>' : ''}</div>
<header class="topo">Dedicada Lavanderia · Blog</header>
<main class="pagina">
<p>Amostra da revisão do blog: ${POSTS.length} posts. Cada um mantém o endereço e o assunto, segue as regras do projeto e usa só fatos dos guias.</p>
<ol class="indice">${indice}</ol>
${artigos}
</main>
</body>
</html>
`;
}
writeFileSync(join(saida, 'previa.html'), previa(false).replaceAll('prototipo-img/', '../prototipo-img/'));
const iPrevia = process.argv.indexOf('--previa');
if (iPrevia > 0 && process.argv[iPrevia + 1]) writeFileSync(join(process.argv[iPrevia + 1], 'blog.html'), previa(true));

console.log(`${POSTS.length} posts montados em blog-revisado/.`);
if (avisos.length) console.log('\nAVISOS:\n- ' + avisos.join('\n- '));
if (erros.length) { console.log('\nERROS:\n- ' + erros.join('\n- ')); process.exit(1); }
console.log('Sem erros.');
