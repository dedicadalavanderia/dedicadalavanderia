// Testa o protótipo no Chromium: banco, regras de texto, links, JSON-LD, todos os caminhos
// da ferramenta a 375 px e a 1280 px, voltar do navegador, link direto e teclado.
// Uso: node ferramentas/montar-prototipo.mjs && node ferramentas/testar.mjs
// Sai com código 1 se houver ERRO. AVISO não reprova, mas precisa ser resolvido antes de publicar.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const capturas = join(pasta, 'capturas');
mkdirSync(capturas, { recursive: true });

async function carregarPlaywright() {
  try { return await import('playwright'); } catch { /* tenta a instalação global */ }
  const global = execSync('npm root -g').toString().trim();
  return createRequire(join(global, 'x.js'))('playwright');
}
const { chromium } = await carregarPlaywright();

const erros = [];
const avisos = [];
const erro = (m) => erros.push(m);
const aviso = (m) => avisos.push(m);

// Palavras que não podem aparecer (regras do projeto).
const PROIBIDAS = [
  /\búnic[oa]s?\b/i, /\bo melhor\b/i, /\ba melhor\b/i, /\bexclusiv/i, /100\s?%/, /toda (a )?(região de )?florian[oó]polis/i,
  /qualquer região/i, /garant(imos|ido|ia)/i, /\bmais de 500\b/i, /prolonga a vida/i, /nossa equipe técnica/i
];
// Processos e números que saíram dos guias por não serem confirmados (ver LEIA-ME).
const RETIRADOS = [
  /capilaridade/i, /\b\d{2}\s?% de recupera/i, /tanino/i, /prensagem úmida/i, /enzim/i, /teflon/i, /re-?pigmenta/i,
  /fixador(es)? de cor/i, /congel/i, /esferas/i, /re-?impermeabiliza/i, /ferrugem/i, /redutor(es)? de corante/i,
  /vaporiza/i, /prancha de agulhas/i, /oxi-?sanitiza/i, /fuligem/i, /ozônio/i, /bactericida/i, /suportes? de secagem/i,
  /hidrocarboneto/i, /duas ou três lavagens por ano/i
];

function checarTexto(origem, texto) {
  for (const r of PROIBIDAS) { const m = texto.match(r); if (m) erro(`${origem}: termo proibido "${m[0]}"`); }
  for (const r of RETIRADOS) { const m = texto.match(r); if (m) aviso(`${origem}: termo de processo retirado dos guias "${m[0]}" (conferir)`); }
}

const url = pathToFileURL(join(pasta, 'prototipo.html')).href;
const navegador = await chromium.launch();

async function abrir(largura, altura, hash = '') {
  const contexto = await navegador.newContext({ viewport: { width: largura, height: altura }, reducedMotion: 'reduce' });
  const pagina = await contexto.newPage();
  pagina.on('pageerror', (e) => erro(`Erro de JavaScript (${largura}px): ${e.message}`));
  pagina.on('console', (m) => { if (m.type() === 'error') erro(`Console (${largura}px): ${m.text()}`); });
  await pagina.goto(url + hash);
  await pagina.waitForSelector('#dm-app[data-js="ok"]');
  return { contexto, pagina };
}

async function semRolagemLateral(pagina, onde) {
  const r = await pagina.evaluate(() => ({ largura: document.documentElement.scrollWidth, janela: window.innerWidth }));
  if (r.largura > r.janela) erro(`${onde}: rolagem horizontal (${r.largura}px > ${r.janela}px)`);
}
const passo = (pagina) => pagina.$eval('#dm-app', (el) => el.getAttribute('data-passo'));
const titulo = (pagina) => pagina.$eval('#dm-app .dm-titulo', (el) => el.textContent);

// ---------- 1. Banco, textos, links e JSON-LD ----------
{
  const { contexto, pagina } = await abrir(375, 740);
  const dados = await pagina.evaluate(() => {
    const d = window.DM_DIAGNOSTICO;
    return { validacao: d.validar(), pecas: d.PECAS };
  });
  dados.validacao.erros.forEach((m) => erro('Banco: ' + m));
  dados.validacao.avisos.forEach((m) => aviso('Banco: ' + m));

  for (const p of dados.pecas) checarTexto(`Banco/${p.id}`, JSON.stringify(p));
  const html = readFileSync(join(pasta, 'pagina-3165.html'), 'utf8');
  const textoPagina = await pagina.$eval('.dm-pagina', (el) => {
    const copia = el.cloneNode(true);
    copia.querySelector('#dm-app')?.remove();
    return copia.textContent;
  });
  checarTexto('Página', textoPagina);

  // Um só H1, e nenhum H2 antes dele.
  const cab = await pagina.evaluate(() => [...document.querySelectorAll('main h1, main h2')].map((h) => h.tagName));
  if (cab.filter((t) => t === 'H1').length !== 1) erro('Página: precisa ter exatamente um H1');
  if (cab[0] !== 'H1') erro('Página: há um H2 antes do H1');

  // Os links dos guias na página batem com o banco.
  const linksPagina = new Set(await pagina.$$eval('.dm-guias a', (as) => as.map((a) => a.href)));
  const linksBanco = new Set(dados.pecas.map((p) => p.guia));
  for (const l of linksBanco) if (!linksPagina.has(l)) erro(`Página: falta o link do guia ${l}`);
  for (const l of linksPagina) if (!linksBanco.has(l)) erro(`Página: link de guia fora do banco ${l}`);
  if (linksPagina.size !== 17) erro(`Página: esperava 17 guias, achei ${linksPagina.size}`);

  // JSON-LD: só ASCII, JSON válido e perguntas iguais às visíveis.
  const blocos = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocos.length) erro('JSON-LD: nenhum bloco');
  for (const b of blocos) {
    if (/[^\x00-\x7f]/.test(b)) erro('JSON-LD: há acento sem \\u (rode ferramentas/escapar-jsonld.mjs)');
    let dadosLd;
    try { dadosLd = JSON.parse(b); } catch (e) { erro('JSON-LD inválido: ' + e.message); continue; }
    checarTexto('JSON-LD', JSON.stringify(dadosLd));
    const faq = (dadosLd['@graph'] || []).find((n) => n['@type'] === 'FAQPage');
    const visiveis = await pagina.$$eval('.dm-perguntas details', (ds) => ds.map((d) => ({
      q: d.querySelector('summary').textContent.trim(), a: d.querySelector('p').textContent.trim()
    })));
    if (!faq) erro('JSON-LD: falta FAQPage');
    else {
      if (faq.mainEntity.length !== visiveis.length) erro('JSON-LD: número de perguntas diferente do visível');
      faq.mainEntity.forEach((q, i) => {
        if (!visiveis[i] || visiveis[i].q !== q.name) erro(`JSON-LD: pergunta ${i + 1} diferente da visível`);
        else if (visiveis[i].a !== q.acceptedAnswer.text) erro(`JSON-LD: resposta ${i + 1} diferente da visível`);
      });
    }
  }
  await semRolagemLateral(pagina, 'Página inteira a 375px');
  await pagina.screenshot({ path: join(capturas, '375-pagina-inteira.png'), fullPage: true });
  await contexto.close();
}

// ---------- 2. Todos os caminhos, clicando como uma pessoa ----------
async function percorrer(largura, altura, todos) {
  const { contexto, pagina } = await abrir(largura, altura);
  const pecas = await pagina.evaluate(() => window.DM_DIAGNOSTICO.PECAS.map((p) => ({
    id: p.id, nome: p.nome, guia: p.guia, problemas: p.problemas.map((pr) => ({ id: pr.id, nome: pr.nome }))
  })));
  let caminhos = 0;
  for (const p of todos ? pecas : pecas.slice(0, 3)) {
    for (const pr of todos ? p.problemas : p.problemas.slice(0, 1)) {
      if ((await passo(pagina)) !== '1') { erro(`${largura}px: não voltou ao passo 1`); break; }
      await semRolagemLateral(pagina, `${largura}px passo 1`);
      await pagina.click(`.dm-cartao:has(.dm-cartao-nome:text-is("${p.nome}"))`);
      if ((await passo(pagina)) !== '2') erro(`${largura}px ${p.id}: não foi ao passo 2`);
      await semRolagemLateral(pagina, `${largura}px ${p.id} passo 2`);
      await pagina.click(`.dm-opcao:has(.dm-opcao-nome:text-is("${pr.nome}"))`);
      if ((await passo(pagina)) !== '3') erro(`${largura}px ${p.id}/${pr.id}: não foi ao passo 3`);
      if (!(await titulo(pagina)).startsWith(pr.nome)) erro(`${largura}px ${p.id}/${pr.id}: título errado`);
      await semRolagemLateral(pagina, `${largura}px ${p.id}/${pr.id} passo 3`);
      const hrefs = await pagina.$$eval('.dm-acoes--final a', (as) => as.map((a) => a.href));
      if (!hrefs[0] || !hrefs[0].startsWith('https://wa.me/5548984280639?text=')) erro(`${p.id}/${pr.id}: link do WhatsApp errado`);
      if (hrefs[1] !== p.guia) erro(`${p.id}/${pr.id}: link do guia errado`);
      // Voltar do navegador leva ao passo 2; depois, recomeçar.
      await pagina.goBack();
      if ((await passo(pagina)) !== '2') erro(`${largura}px ${p.id}/${pr.id}: voltar do navegador não levou ao passo 2`);
      await pagina.click('.dm-voltar .dm-link');
      caminhos++;
    }
  }
  await contexto.close();
  return caminhos;
}
const caminhos375 = await percorrer(375, 740, true);
const caminhos1280 = await percorrer(1280, 900, false);

// ---------- 3. Link direto, endereço inválido e teclado ----------
{
  const { contexto, pagina } = await abrir(375, 740, '#seda/vinho-tinto');
  if ((await passo(pagina)) !== '3') erro('Link direto #seda/vinho-tinto não abriu o resultado');
  await pagina.screenshot({ path: join(capturas, '375-passo3-seda-vinho.png'), fullPage: false });
  await pagina.evaluate(() => { document.querySelector('#dm-app').scrollIntoView(); });
  await pagina.screenshot({ path: join(capturas, '375-passo3-seda-vinho-inteiro.png'), fullPage: true });
  await pagina.goto(url + '#nao-existe/xyz');
  await pagina.waitForSelector('#dm-app[data-js="ok"]');
  if ((await passo(pagina)) !== '1') erro('Endereço inválido não voltou ao passo 1');
  await contexto.close();
}
{
  const { contexto, pagina } = await abrir(375, 740);
  await pagina.$eval('#dm-app', (el) => el.scrollIntoView());
  await pagina.screenshot({ path: join(capturas, '375-passo1.png') });
  await pagina.focus('.dm-cartao');
  await pagina.keyboard.press('Enter');
  if ((await passo(pagina)) !== '2') erro('Teclado: Enter no cartão não foi ao passo 2');
  const foco = await pagina.evaluate(() => document.activeElement && document.activeElement.className);
  if (!String(foco).includes('dm-titulo')) erro('Teclado: o foco não foi para o título do passo 2');
  await pagina.screenshot({ path: join(capturas, '375-passo2-seda.png') });
  await contexto.close();
}
{
  const { contexto, pagina } = await abrir(1280, 900, '#carrinho/vomito');
  await pagina.$eval('#dm-app', (el) => el.scrollIntoView());
  await pagina.screenshot({ path: join(capturas, '1280-passo3-carrinho-vomito.png') });
  await pagina.goto(url);
  await pagina.waitForSelector('#dm-app[data-js="ok"]');
  await pagina.screenshot({ path: join(capturas, '1280-pagina-inteira.png'), fullPage: true });
  await contexto.close();
}

await navegador.close();

console.log(`Caminhos testados: ${caminhos375} a 375 px e ${caminhos1280} a 1280 px.`);
console.log(`\nAVISOS (${avisos.length}) — resolver antes de publicar:`);
avisos.forEach((m) => console.log('  - ' + m));
console.log(`\nERROS (${erros.length}):`);
erros.forEach((m) => console.log('  - ' + m));
console.log(erros.length ? '\nREPROVADO' : '\nAPROVADO (sem erros)');
process.exit(erros.length ? 1 : 0);
