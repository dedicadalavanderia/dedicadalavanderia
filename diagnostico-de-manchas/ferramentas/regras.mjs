// Regras de texto do projeto, usadas no teste da ferramenta e no gerador dos posts do blog.

// Palavras e números que não podem aparecer.
export const PROIBIDAS = [
  /\búnic[oa]s?\b/i, /\bo melhor\b/i, /\ba melhor\b/i, /\bos melhores\b/i, /\bas melhores\b/i, /\bexclusiv/i,
  /toda (a )?(região de )?florian[oó]polis/i, /qualquer região/i, /garant(imos|ido|ia)/i, /\bmais de 500\b/i,
  /prolonga a vida/i, /nossa equipe técnica/i, /definitiv/i, /para sempre/i, /\belimina/i
];
// Percentuais permitidos: só os confirmados.
export const PERCENTUAIS_OK = [/acréscimo de 50%/g, /cerca de 80%/g];
// Processos que saíram dos guias por não serem confirmados (ver LEIA-ME).
export const RETIRADOS = [
  /capilaridade/i, /de recupera[çc][aã]o/i, /removedor(es)? ácidos?/i, /prensagem úmida/i, /enzim/i, /teflon/i, /re-?pigmenta/i,
  /fixador(es)? de cor/i, /congel/i, /esferas/i, /re-?impermeabiliza/i, /removedor de ferrugem/i, /redutor(es)? de corante/i,
  /vaporiza/i, /prancha de agulhas/i, /oxi-?sanitiza/i, /fuligem/i, /ozônio/i, /bactericida/i, /suportes? de secagem/i,
  /hidrocarboneto/i, /duas ou três lavagens por ano/i
];
// Receitas caseiras: os guias pedem para não usar produto caseiro.
export const CASEIRAS = [/vinagre/i, /bicarbonato/i, /\blim[aã]o\b/i, /água oxigenada/i];

// Devolve { erros, avisos } do texto.
export function checarTexto(origem, texto) {
  const erros = [], avisos = [];
  // Endereços não contam: o de um post antigo pode ter "definitiva" e não muda, para não perder o Google.
  texto = texto.replace(/https?:\/\/\S+/g, ' ').replace(/(^|[\s"'[,(])\/[\w\-/#.]+/g, '$1 ');
  for (const r of PROIBIDAS) { const m = texto.match(r); if (m) erros.push(`${origem}: termo proibido "${m[0]}"`); }
  let semOk = texto;
  for (const r of PERCENTUAIS_OK) semOk = semOk.replace(r, '');
  const pct = semOk.match(/\d+\s?%/);
  if (pct) erros.push(`${origem}: percentual sem fonte confirmada "${pct[0]}"`);
  for (const r of RETIRADOS) { const m = texto.match(r); if (m) avisos.push(`${origem}: termo de processo retirado dos guias "${m[0]}" (conferir)`); }
  for (const r of CASEIRAS) { const m = texto.match(r); if (m) avisos.push(`${origem}: receita caseira "${m[0]}" (conferir)`); }
  return { erros, avisos };
}
