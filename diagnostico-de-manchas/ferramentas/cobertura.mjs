// Mede quanto a busca entende das buscas reais do Google (autocompletar coletado em 28/09/2026,
// em referencias/demanda/). Deixa de fora o que não é roupa (pele, parede, piso, doenças...).
// Uso: node ferramentas/cobertura.mjs [--faltas]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const caixa = { window: {} };
vm.runInNewContext(readFileSync(join(pasta, 'diagnostico-manchas.js'), 'utf8'), caixa);
const D = caixa.window.DM_DIAGNOSTICO;

// Os arquivos foram gravados com os acentos quebrados ("cafÃ©"): conserta na leitura.
const consertar = (q) => (/Ã/.test(q) ? Buffer.from(q, 'latin1').toString('utf8') : q);
const ler = (f) => {
  const d = JSON.parse(readFileSync(join(pasta, 'referencias/demanda', f), 'utf8'));
  return (Array.isArray(d) ? d : Object.values(d).flat()).map(consertar);
};
const todas = [...new Set([...ler('autocompletar_manchas.json'), ...ler('autocompletar_tecidos.json')])];
const FORA = /rosto|pele|corpo|espinha|acne|parede|piso|porcelanato|vidro|inox|dente|m[aã]o\b|dedos|olho|olheira|carro|madeira|m[oó]vel|azulejo|rejunte|fog[aã]o|panela|vaso|teto|gesso|dengue|sarampo|catapora|c[aâ]ncer|diabetes|alergia|estresse|ansiedade|hansen|herpes|nascen|melasma|perna|costas|virilha|foliculite|hematoma|cicatriz|queimadura|lente|celular|tela|espelho|m[aá]rmore|granito|cal[cç]ada|telhado|piscina|bitot|koplik|fluorose|forchheimer|gumprecht|infiltra|umidade|geladeira|\bpia\b|box|banheir|carpete|tapete|estofado|colch[aã]o|alum[ií]nio|foto|imagem|livro|lou[cç]a|laminado|lajota|quartzo|[oó]culos|quadro|dermatite|micose|urtic[aá]ria|vitiligo|lupus|leucemia|meningite|rub[eé]ola|insulina|picada|inunda[cç][aã]o|oceano|j[uú]piter|on[cç]a|vaca|rorschach|plasma|janela|instrumenta|hiperpigmenta|lavanderia/i;
const roupa = todas.filter((q) => !FORA.test(q));
const faltas = roupa.filter((q) => !D.buscar(q + ' ').length);
const pct = Math.round((100 * (roupa.length - faltas.length)) / roupa.length);
console.log(`${todas.length} buscas únicas; ${roupa.length} sobre roupa e tecido; ${roupa.length - faltas.length} com sugestão (${pct}%).`);
if (process.argv.includes('--faltas')) faltas.forEach((q) => console.log('  - ' + q));
