// Publica no WordPress, pela API, o que pode ir por ela: as 22 miniaturas e o conteúdo da página 3165.
// Os snippets WPCode 3168 (CSS) e 3164 (JS) não aparecem na API: eles são colados no painel.
//
// Precisa de uma senha de aplicativo do WordPress (Usuários > Perfil > Senhas de aplicativo) nas
// variáveis de ambiente WP_USUARIO e WP_SENHA_APP. Nunca escreva a senha no código nem no chat.
// Sem --publicar, só mostra o que faria (nada muda no site).
//
// Uso:
//   node ferramentas/publicar-wp.mjs --verificar              confere o login e lê a página 3165
//   node ferramentas/publicar-wp.mjs --fotos [--publicar]     envia as miniaturas que faltam
//   node ferramentas/publicar-wp.mjs --pagina [--publicar]    guarda uma cópia da página e troca o conteúdo
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.env.WP_SITE || 'https://dedicadalavanderia.com.br';
const USUARIO = process.env.WP_USUARIO, SENHA = process.env.WP_SENHA_APP;
const PAGINA = 3165;
const publicar = process.argv.includes('--publicar');
const tem = (a) => process.argv.includes(a);

if (!USUARIO || !SENHA) {
  console.error('Faltam WP_USUARIO e WP_SENHA_APP nas variáveis de ambiente.');
  process.exit(1);
}

// curl respeita o proxy do ambiente (o fetch do Node não).
function api(metodo, caminho, { json, arquivo, tipo } = {}) {
  const args = ['-sS', '-m', '120', '-u', `${USUARIO}:${SENHA}`, '-X', metodo, '-w', '\n%{http_code}', `${SITE}/wp-json${caminho}`];
  if (json) args.push('-H', 'Content-Type: application/json', '--data-binary', '@-');
  if (arquivo) args.push('-H', `Content-Type: ${tipo}`, '-H', `Content-Disposition: attachment; filename="${arquivo.split('/').pop()}"`, '--data-binary', `@${arquivo}`);
  const saida = execFileSync('curl', args, { input: json ? JSON.stringify(json) : undefined, maxBuffer: 64 * 1024 * 1024 }).toString();
  const i = saida.lastIndexOf('\n');
  const status = Number(saida.slice(i + 1));
  let corpo = saida.slice(0, i);
  try { corpo = JSON.parse(corpo); } catch { /* texto */ }
  if (status >= 400) throw new Error(`${metodo} ${caminho}: ${status} ${JSON.stringify(corpo).slice(0, 300)}`);
  return corpo;
}

if (tem('--verificar')) {
  const eu = api('GET', '/wp/v2/users/me?context=edit');
  const pode = eu.capabilities || {};
  console.log(`Login: ${eu.name} (${(eu.roles || []).join(', ')})`);
  console.log(`Pode editar páginas: ${!!pode.edit_pages}; enviar arquivos: ${!!pode.upload_files}; HTML sem filtro (JSON-LD): ${!!pode.unfiltered_html}`);
  const p = api('GET', `/wp/v2/pages/${PAGINA}?context=edit`);
  console.log(`Página ${PAGINA}: "${p.title.raw}", ${p.content.raw.length} caracteres, modificada em ${p.modified}`);
}

if (tem('--fotos')) {
  // O JS procura as fotos na pasta de FOTOS; o WordPress grava na pasta do mês do envio.
  const js = readFileSync(join(pasta, 'diagnostico-manchas.js'), 'utf8');
  const pastaFotos = (js.match(/var FOTOS = CONFIG\.fotos \|\| SITE \+ '([^']+)'/) || [])[1];
  const arquivos = readdirSync(join(pasta, 'prototipo-img')).filter((f) => /^dm-.*\.webp$/.test(f));
  for (const f of arquivos) {
    const url = `${SITE}${pastaFotos}${f}`;
    const existe = execFileSync('curl', ['-sS', '-m', '30', '-o', '/dev/null', '-w', '%{http_code}', url]).toString() === '200';
    if (existe) { console.log(`já existe: ${url}`); continue; }
    if (!publicar) { console.log(`enviaria: ${f}`); continue; }
    const m = api('POST', '/wp/v2/media', { arquivo: join(pasta, 'prototipo-img', f), tipo: 'image/webp' });
    const ok = m.source_url === url;
    console.log(`${ok ? 'enviada' : 'ATENÇÃO, pasta diferente'}: ${m.source_url}`);
    if (!ok) console.log(`  O JS procura em ${url}. Ajuste FOTOS no topo do JS para a pasta acima ou renomeie o arquivo.`);
  }
}

if (tem('--pagina')) {
  const novo = readFileSync(join(pasta, 'pagina-3165.html'), 'utf8');
  const atual = api('GET', `/wp/v2/pages/${PAGINA}?context=edit`);
  mkdirSync(join(pasta, 'backups'), { recursive: true });
  const copia = join(pasta, 'backups', `pagina-${PAGINA}-${atual.modified.replace(/[:T]/g, '-')}.html`);
  writeFileSync(copia, atual.content.raw);
  console.log(`Cópia do conteúdo atual: ${copia}`);
  if (!publicar) { console.log(`trocaria o conteúdo da página ${PAGINA} (${atual.content.raw.length} → ${novo.length} caracteres)`); }
  else {
    const r = api('POST', `/wp/v2/pages/${PAGINA}`, { json: { content: novo } });
    if (!/application\/ld\+json/.test(r.content.raw)) console.log('ATENÇÃO: o WordPress tirou o bloco de dados estruturados. O usuário precisa poder salvar HTML sem filtro.');
    console.log(`Página ${PAGINA} atualizada em ${r.modified}. Limpe o cache e confira no celular.`);
  }
}
if (!publicar && (tem('--fotos') || tem('--pagina'))) console.log('\nNada mudou no site. Para publicar de verdade, repita com --publicar.');
