// Testa o protótipo no Chromium: banco, regras de texto, links, JSON-LD, todos os caminhos
// da ferramenta a 375 px (e alguns a 1280 px), busca, perguntas do WhatsApp, âncoras,
// voltar do navegador, link direto e teclado. Gera as telas em capturas/.
// Uso: node ferramentas/montar.mjs && node ferramentas/testar.mjs
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

// Palavras e números que não podem aparecer (regras do projeto).
const PROIBIDAS = [
  /\búnic[oa]s?\b/i, /\bo melhor\b/i, /\ba melhor\b/i, /\bexclusiv/i, /toda (a )?(região de )?florian[oó]polis/i,
  /qualquer região/i, /garant(imos|ido|ia)/i, /\bmais de 500\b/i, /prolonga a vida/i, /nossa equipe técnica/i
];
// Percentuais permitidos: só os confirmados.
const PERCENTUAIS_OK = [/acréscimo de 50%/g, /cerca de 80%/g];
// Processos que saíram dos guias por não serem confirmados (ver LEIA-ME).
const RETIRADOS = [
  /capilaridade/i, /de recupera[çc][aã]o/i, /removedor(es)? ácidos?/i, /prensagem úmida/i, /enzim/i, /teflon/i, /re-?pigmenta/i,
  /fixador(es)? de cor/i, /congel/i, /esferas/i, /re-?impermeabiliza/i, /removedor de ferrugem/i, /redutor(es)? de corante/i,
  /vaporiza/i, /prancha de agulhas/i, /oxi-?sanitiza/i, /fuligem/i, /ozônio/i, /bactericida/i, /suportes? de secagem/i,
  /hidrocarboneto/i, /duas ou três lavagens por ano/i
];

function checarTexto(origem, texto) {
  for (const r of PROIBIDAS) { const m = texto.match(r); if (m) erro(`${origem}: termo proibido "${m[0]}"`); }
  let semOk = texto;
  for (const r of PERCENTUAIS_OK) semOk = semOk.replace(r, '');
  const pct = semOk.match(/\d+\s?%/);
  if (pct) erro(`${origem}: percentual sem fonte confirmada "${pct[0]}"`);
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
const hrefWhats = (pagina) => pagina.$eval('.dm-btn--whats', (a) => a.href);

// ---------- 1. Banco, textos, links e JSON-LD ----------
let dados;
{
  const { contexto, pagina } = await abrir(375, 740);
  dados = await pagina.evaluate(() => {
    const d = window.DM_DIAGNOSTICO;
    return { validacao: d.validar(), pecas: d.PECAS, manchas: d.MANCHAS };
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

  const cab = await pagina.evaluate(() => [...document.querySelectorAll('main h1, main h2')].map((h) => h.tagName));
  if (cab.filter((t) => t === 'H1').length !== 1) erro('Página: precisa ter exatamente um H1');
  if (cab[0] !== 'H1') erro('Página: há um H2 antes do H1');

  const linksTabela = new Set(await pagina.$$eval('#mais-urgentes .dm-tabela a', (as) => as.map((a) => a.href)));
  const linksBanco = new Set(dados.pecas.map((p) => p.guia));
  for (const l of linksBanco) if (!linksTabela.has(l)) erro(`Página: falta o guia ${l} na tabela de urgência`);
  if (linksTabela.size !== 17) erro(`Página: esperava 17 guias na tabela de urgência, achei ${linksTabela.size}`);

  const blocos = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocos.length) erro('JSON-LD: nenhum bloco');
  for (const b of blocos) {
    if (/[^\x00-\x7f]/.test(b)) erro('JSON-LD: há acento sem \\u');
    let ld;
    try { ld = JSON.parse(b); } catch (e) { erro('JSON-LD inválido: ' + e.message); continue; }
    checarTexto('JSON-LD', JSON.stringify(ld));
    const faq = (ld['@graph'] || []).find((n) => n['@type'] === 'FAQPage');
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
  // Imagens dos cartões carregam.
  const imgs = await pagina.$$eval('.dm-cartao-img', (is) => is.length);
  if (imgs !== 17) erro(`Passo 1: esperava 17 fotos nos cartões, achei ${imgs}`);
  await semRolagemLateral(pagina, 'Página inteira a 375px');
  await pagina.screenshot({ path: join(capturas, '375-pagina-inteira.png'), fullPage: true });
  await contexto.close();
}

// ---------- 2. Todos os problemas de todas as peças, clicando ----------
async function percorrer(largura, altura, todos) {
  const { contexto, pagina } = await abrir(largura, altura);
  let caminhos = 0;
  const pecas = todos ? dados.pecas : dados.pecas.slice(0, 3);
  for (const p of pecas) {
    for (const pr of todos ? p.problemas : p.problemas.slice(0, 1)) {
      if ((await passo(pagina)) !== '1') { erro(`${largura}px: não voltou ao passo 1`); break; }
      await pagina.click(`.dm-cartao:has(.dm-cartao-nome:text-is("${p.nome}"))`);
      if ((await passo(pagina)) !== '2') erro(`${largura}px ${p.id}: não foi ao passo 2`);
      await semRolagemLateral(pagina, `${largura}px ${p.id} passo 2`);
      await pagina.click(`.dm-opcao:has(.dm-opcao-nome:text-is("${pr.nome}"))`);
      if ((await passo(pagina)) !== '3') erro(`${largura}px ${p.id}/${pr.id}: não foi ao passo 3`);
      if (!(await titulo(pagina)).startsWith(pr.nome)) erro(`${largura}px ${p.id}/${pr.id}: título errado`);
      await semRolagemLateral(pagina, `${largura}px ${p.id}/${pr.id} passo 3`);
      if (!(await hrefWhats(pagina)).startsWith('https://wa.me/5548984280639?text=')) erro(`${p.id}/${pr.id}: link do WhatsApp errado`);
      const guia = await pagina.$eval('.dm-acoes--final a:not(.dm-btn--whats)', (a) => a.href);
      if (guia !== p.guia) erro(`${p.id}/${pr.id}: link do guia errado`);
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

// ---------- 3. "Outra mancha" por família e "Não sei o que é", em todas as peças ----------
let familiasTestadas = 0;
{
  const { contexto, pagina } = await abrir(375, 740);
  const amostra = ['Caneta', 'Sangue', 'Café', 'Ferrugem', 'Mofo'];
  for (const p of dados.pecas) {
    for (const nome of amostra.concat(['__desconhecida'])) {
      await pagina.goto(url + '#' + p.id);
      await pagina.waitForSelector('#dm-app[data-passo="2"]');
      if (nome === '__desconhecida') await pagina.click('.dm-opcao--leve');
      else {
        await pagina.click('.dm-outra > summary');
        await pagina.click(`.dm-outra .dm-chip:text-is("${nome}")`);
      }
      if ((await passo(pagina)) !== '3') { erro(`${p.id}: "${nome}" não abriu o resultado`); continue; }
      await semRolagemLateral(pagina, `${p.id} "${nome}"`);
      const txt = await pagina.$eval('.dm-resultado', (el) => el.textContent);
      checarTexto(`Resultado ${p.id}/${nome}`, txt);
      familiasTestadas++;
    }
  }
  await contexto.close();
}

// ---------- 4. Busca, contexto de mancha, perguntas do WhatsApp, âncoras, link direto ----------
{
  const { contexto, pagina } = await abrir(375, 740);
  const casos = [
    ['vinho no vestido de noiva', '#festa-noiva/barra-comida-vinho'],
    ['riscos brancos', '#jeans/riscos-brancos'],
    ['terno', '#alfaiataria'],
    ['mofo', '#m-mofo']
  ];
  for (const [termo, esperado] of casos) {
    await pagina.goto(url);
    await pagina.waitForSelector('#dm-app[data-passo="1"]');
    await pagina.fill('#dm-q', termo);
    const primeiro = await pagina.$eval('.dm-sugestao', (a) => a.getAttribute('href')).catch(() => null);
    if (primeiro !== esperado) erro(`Busca "${termo}": primeira sugestão ${primeiro}, esperado ${esperado}`);
  }
  await pagina.fill('#dm-q', 'vinho');
  await pagina.screenshot({ path: join(capturas, '375-busca-vinho.png') });
  await pagina.fill('#dm-q', 'xyzw');
  if (!(await pagina.$('.dm-sugestao-vazia'))) erro('Busca sem resultado: falta a mensagem');

  // Mancha escolhida pela busca, depois a peça.
  await pagina.goto(url + '#m-mofo');
  await pagina.waitForSelector('.dm-contexto');
  await pagina.click('.dm-cartao:has(.dm-cartao-nome:text-is("Couro"))');
  if (!(await titulo(pagina)).startsWith('Mofo')) erro('Contexto de mancha: Mofo + Couro não abriu o resultado de mofo');
  if (!(await pagina.evaluate(() => location.hash)).startsWith('#couro/mofo')) erro('Contexto de mancha: endereço não foi para #couro/mofo');

  // Perguntas do WhatsApp entram na mensagem.
  await pagina.click('.dm-pergunta .dm-chip:text-is("Hoje")');
  await pagina.click('.dm-pergunta .dm-chip:text-is("Sim")');
  const msg = decodeURIComponent(await hrefWhats(pagina));
  if (!msg.includes('Quando aconteceu: hoje') || !msg.includes('Já tentei tirar em casa')) erro('WhatsApp: as respostas não entraram na mensagem');

  // Âncora da página não derruba o resultado.
  await pagina.click('.dm-coleta a');
  if ((await passo(pagina)) !== '3') erro('Âncora "#onde-levar": a ferramenta saiu do resultado');

  // Link direto com mancha que tem problema próprio vira o endereço do problema.
  await pagina.goto(url + '#seda/m-vinho');
  await pagina.waitForSelector('#dm-app[data-passo="3"]');
  if ((await pagina.evaluate(() => location.hash)) !== '#seda/vinho-tinto') erro('Link direto #seda/m-vinho não virou #seda/vinho-tinto');
  await pagina.screenshot({ path: join(capturas, '375-passo3-seda-vinho.png') });
  await pagina.screenshot({ path: join(capturas, '375-passo3-seda-vinho-inteiro.png'), fullPage: true });

  await pagina.goto(url + '#seda/m-caneta');
  await pagina.waitForSelector('#dm-app[data-passo="3"]');
  await pagina.$eval('#dm-app', (el) => el.scrollIntoView());
  await pagina.screenshot({ path: join(capturas, '375-passo3-caneta-seda.png'), fullPage: true });

  // Endereço inválido vindo de um resultado volta ao passo 1.
  await pagina.goto(url + '#nao-existe/xyz');
  if ((await passo(pagina)) !== '1') erro('Endereço inválido não voltou ao passo 1');
  await contexto.close();
}
{
  // Página aberta direto numa âncora: passo 1, sem pular para a ferramenta.
  const { contexto, pagina } = await abrir(375, 740, '#onde-levar');
  if ((await passo(pagina)) !== '1') erro('Abrir com #onde-levar deveria mostrar o passo 1');
  const topo = await pagina.$eval('#onde-levar', (el) => Math.round(el.getBoundingClientRect().top));
  if (Math.abs(topo) > 200) erro(`Abrir com #onde-levar deveria rolar até a seção (topo em ${topo}px)`);
  await contexto.close();
}

// ---------- 5. Teclado e capturas ----------
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
  await pagina.click('.dm-outra > summary');
  await pagina.screenshot({ path: join(capturas, '375-passo2-seda-outra-mancha.png'), fullPage: true });
  await contexto.close();
}
{
  const { contexto, pagina } = await abrir(1280, 900, '#carrinho/vomito-leite');
  await pagina.$eval('#dm-app', (el) => el.scrollIntoView());
  await pagina.screenshot({ path: join(capturas, '1280-passo3-carrinho-vomito.png') });
  await pagina.goto(url);
  await pagina.waitForSelector('#dm-app[data-js="ok"]');
  await pagina.screenshot({ path: join(capturas, '1280-pagina-inteira.png'), fullPage: true });
  await contexto.close();
}

await navegador.close();

const totalProblemas = dados.pecas.reduce((n, p) => n + p.problemas.length, 0);
console.log(`Caminhos testados: ${caminhos375} de ${totalProblemas} problemas a 375 px, ${caminhos1280} a 1280 px, ${familiasTestadas} manchas por família.`);
console.log(`\nAVISOS (${avisos.length}) — resolver antes de publicar:`);
avisos.forEach((m) => console.log('  - ' + m));
console.log(`\nERROS (${erros.length}):`);
erros.forEach((m) => console.log('  - ' + m));
console.log(erros.length ? '\nREPROVADO' : '\nAPROVADO (sem erros)');
process.exit(erros.length ? 1 : 0);
