// Junta todas as frases que a ferramenta pode mostrar (todas as peças × todos os resultados) e
// procura, para cada uma, a frase mais parecida nos guias no ar e na página central
// (referencias/site/txt/). Frases com pouco apoio vão para revisão à mão.
// Uso: node ferramentas/auditar-textos.mjs [--todas]   (grava capturas/auditoria-textos.tsv)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const pasta = join(dirname(fileURLToPath(import.meta.url)), '..');
const caixa = { window: {} };
vm.runInNewContext(readFileSync(join(pasta, 'diagnostico-manchas.js'), 'utf8'), caixa);
const D = caixa.window.DM_DIAGNOSTICO;

// Guias e página central. A página antiga do diagnóstico fica de fora: é o conteúdo que foi trocado.
const dirTxt = join(pasta, 'referencias/site/txt');
const corpus = readdirSync(dirTxt).filter((f) => f.endsWith('.md') && f !== '_diagnostico.md')
  .flatMap((f) => readFileSync(join(dirTxt, f), 'utf8').split(/(?<=[.!?:;])\s+|\n|\|/).map((t) => ({ f, t: t.trim() })))
  .filter((x) => x.t.length > 12);

const PARADAS = new Set('a o as os de da do das dos e em no na nos nas um uma uns umas que se por para com sem ao aos à às mais muito já não é ou como pode podem até antes depois quando sua seu suas seus isso esta este essa esse peça peças'.split(' '));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ');
const raiz = (w) => w.replace(/(oes|aes|ais|eis|s)$/, '').slice(0, 6);
const termos = (s) => [...new Set(norm(s).split(' ').filter((w) => w.length > 2 && !PARADAS.has(w)).map(raiz))];
const indice = corpus.map((c) => ({ ...c, set: new Set(termos(c.t)) }));

function apoio(frase) {
  const t = termos(frase);
  if (!t.length) return { nota: 1, melhor: '' };
  let melhor = { nota: 0, melhor: '', f: '' };
  for (const c of indice) {
    let n = 0;
    for (const w of t) if (c.set.has(w)) n++;
    const nota = n / t.length;
    if (nota > melhor.nota) melhor = { nota, melhor: c.t, f: c.f };
  }
  return melhor;
}

// Todas as frases possíveis, com onde aparecem.
const frases = new Map();
function add(texto, onde) {
  if (!texto) return;
  const k = String(texto).trim();
  if (!frases.has(k)) frases.set(k, new Set());
  frases.get(k).add(onde);
}
for (const p of D.PECAS) {
  const chaves = p.problemas.map((pr) => pr.id).concat(D.MANCHAS.map((m) => 'm-' + m.id), 'm-desconhecida');
  for (const c of chaves) {
    const r = D.resolver(p, c);
    const onde = `${r.tipo === 'problema' ? 'guia' : r.tipo === 'mancha' ? 'família' : 'não sei'}: ${p.id}/${r.chave}`;
    add(r.pr.urgencia, onde); add(r.pr.acontece, onde); add(r.pr.dedicada, onde);
    (r.pr.fazer || []).forEach((t) => add(t, onde));
    (r.pr.evitar || []).forEach((t) => add(t, onde));
  }
  (p.processo || []).forEach((t) => add(t, `processo: ${p.id}`));
  add(p.maquina, `máquina: ${p.id}`); add(p.nota, `nota: ${p.id}`);
}
for (const f of Object.values(D.FAMILIAS)) add(f.primeiro, 'família: primeiro cuidado');
for (const m of D.MANCHAS) add(m.dica, `dica: ${m.id}`);

const linhas = [...frases.entries()].map(([t, onde]) => ({ t, onde: [...onde], ...apoio(t) }))
  .sort((a, b) => a.nota - b.nota);
const limite = process.argv.includes('--todas') ? 1.01 : 0.75;
const tsv = ['nota\tvezes\tfrase\tmais parecida nos guias\tarquivo\texemplo de onde aparece']
  .concat(linhas.filter((l) => l.nota < limite).map((l) => [l.nota.toFixed(2), l.onde.length, l.t, l.melhor, l.f, l.onde[0]].join('\t')));
writeFileSync(join(pasta, 'capturas/auditoria-textos.tsv'), tsv.join('\n') + '\n');
const fracas = linhas.filter((l) => l.nota < 0.75).length;
console.log(`${frases.size} frases diferentes em ${D.PECAS.length} peças; ${fracas} com menos de 75% de apoio nos guias (capturas/auditoria-textos.tsv).`);
