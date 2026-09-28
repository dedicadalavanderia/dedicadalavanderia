// Reescreve os blocos JSON-LD de um arquivo HTML com os acentos como \uXXXX,
// porque um filtro do servidor da Dedicada estraga os acentos.
// Uso: node ferramentas/escapar-jsonld.mjs pagina-3165.html
// Pode rodar quantas vezes quiser: o resultado é sempre o mesmo.
import { readFileSync, writeFileSync } from 'node:fs';

const arquivo = process.argv[2];
if (!arquivo) { console.error('Informe o arquivo HTML.'); process.exit(1); }

const html = readFileSync(arquivo, 'utf8');
let blocos = 0;
const saida = html.replace(
  /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
  (_, abre, json, fecha) => {
    const dados = JSON.parse(json); // falha aqui se o JSON estiver quebrado
    blocos++;
    const texto = JSON.stringify(dados, null, 2)
      .replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
    return abre + '\n' + texto + '\n' + fecha;
  }
);
writeFileSync(arquivo, saida);
console.log(`${arquivo}: ${blocos} bloco(s) JSON-LD com acentos escapados.`);
