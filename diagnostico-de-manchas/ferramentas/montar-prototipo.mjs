// Monta prototipo.html a partir de pagina-3165.html, trocando os shortcodes do WPCode
// pelo CSS e pelo JS locais. Abra prototipo.html no navegador para testar fora do site.
// Uso: node ferramentas/montar-prototipo.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagina = readFileSync(join(pasta, 'pagina-3165.html'), 'utf8');

for (const sc of ['[wpcode id="3168"]', '[wpcode id="3164"]']) {
  if (!pagina.includes(sc)) throw new Error('Shortcode ausente em pagina-3165.html: ' + sc);
}

const corpo = pagina
  .replace('[wpcode id="3168"]', '<link rel="stylesheet" href="diagnostico-manchas.css">')
  .replace('[wpcode id="3164"]', '<script src="diagnostico-manchas.js"></script>');

const html = `<!doctype html>
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
<div class="prototipo-aviso">Protótipo para teste. Não é a página publicada.</div>
<header class="prototipo-topo">Dedicada Lavanderia</header>
<main>
${corpo}
</main>
<footer class="prototipo-rodape">Dedicada Lavanderia · Centro e Santa Mônica · Florianópolis</footer>
</body>
</html>
`;
writeFileSync(join(pasta, 'prototipo.html'), html);
console.log('prototipo.html montado.');
