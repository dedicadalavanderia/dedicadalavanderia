# Diagnóstico de Manchas, versão 2: protótipo e passagem

Refeito em 28/09/2026 numa sessão na nuvem com acesso ao site. A estrutura foi desenhada a partir de uma pesquisa com ferramentas de manchas de lavanderias e marcas de fora (`pesquisa.html`). O conteúdo foi tirado dos 17 guias de Cuidados por Tecido que estão no ar, e o banco antigo não foi reaproveitado.

**Nada foi publicado no site.** A instalação só acontece com autorização do dono.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `diagnostico-manchas.css` | Substitui o conteúdo do snippet WPCode **3168** (CSS) |
| `diagnostico-manchas.js` | Substitui o conteúdo do snippet WPCode **3164** (JavaScript). O banco fica no topo do arquivo |
| `pagina-3165.html` | Substitui o conteúdo da página **3165** (colar no editor de código). **É gerado**: não edite à mão |
| `fonte/pagina.html` | Modelo da página. As tabelas e as perguntas entram no lugar dos `{{MARCADORES}}` |
| `prototipo.html` + `prototipo-img/` | Para testar fora do site: abra `prototipo.html` no navegador |
| `pesquisa.html` | A pesquisa, o que cada referência mudou na ferramenta, SEO e GEO |
| `auditoria-banco-antigo.md` | O banco antigo (516 situações) e tudo o que ele trazia contra as regras |
| `perguntas-para-o-dono.md` | O que precisa de resposta antes de publicar |
| `referencias/` | O que foi baixado: página atual, banco antigo, 17 guias em texto e páginas de referência |
| `capturas/` | Telas geradas pelo teste |
| `ferramentas/montar.mjs` | Gera `pagina-3165.html` e `prototipo.html` a partir do banco e do modelo |
| `ferramentas/testar.mjs` | Testa tudo no Chromium |

## Como a ferramenta funciona agora

- **Três passos fixos:** 1 Peça → 2 Problema → 3 O que fazer. Os passos feitos viram botões para voltar, o voltar do navegador funciona, e cada resultado tem endereço próprio (`#seda/vinho-tinto`).
- **Passo 1:**
  - 17 cartões com foto, nos mesmos 5 grupos da página central.
  - Uma busca que entende a mancha e a peça, com sinônimos e sem acento. Exemplos: "vinho no vestido de noiva", "riscos brancos", "mofo".
  - Buscando só a mancha, a pessoa escolhe a peça depois.
- **Passo 2:**
  - A tabela "problemas mais comuns" do guia, do mais urgente ao menos urgente, com selo de urgência.
  - "Outra mancha?", organizada pelas três famílias da Seitz: gordurosas e sintéticas, orgânicas e proteicas, vegetais e de tanino.
  - A opção "Não sei o que é a mancha".
  - O convite para mandar foto pelo WhatsApp.
- **Passo 3:**
  - A urgência escrita no guia e o que geralmente acontece com a peça.
  - O que fazer agora e o que não fazer.
  - Se a peça pode ir na máquina de casa.
  - Como a Dedicada trata: o processo em etapas, prazo, preço e expresso.
  - A fala aprovada de quem assina o guia, com foto.
  - Duas perguntas opcionais que vão na mensagem do WhatsApp: "Quando aconteceu?" e "Já tentou tirar em casa?".
  - O link para o guia da peça.
- **Página:**
  - Um só H1, uma resposta rápida de cerca de 40 palavras e a assinatura.
  - A ferramenta.
  - Seções estáticas geradas do mesmo banco: manchas mais urgentes por peça, as três famílias de manchas, regras para qualquer mancha, o que não sai na lavagem, perguntas frequentes, endereços e dias de coleta, e fontes.
  - As tabelas ficam no HTML, e não no JavaScript, porque as IAs (ChatGPT, Claude, Perplexity) não rodam JavaScript.
- **Medição:** se o dono aprovar, os eventos `dm_peca`, `dm_resultado`, `dm_whatsapp` e `dm_busca` vão para o Google Analytics que já está no site (GT-NBXFRXVL). Não há nenhum dado pessoal.

## Banco (topo de `diagnostico-manchas.js`)

- `PECAS`: os 17 guias. Cada peça tem nome, exemplos (o texto do card da página central), guia, quem assina, fala, máquina de casa, `caseiro` (o que evitar em casa), `processo` (as etapas do guia), prazo, preço e expresso.
- `problemas`: uma linha da tabela do guia cada. `urgencia` e `acontece` são as colunas do guia, sem mudar nada; `nivel` define a ordem e o selo; `manchas` liga a busca e as famílias ao problema certo; `fazer` e `evitar` vêm dos erros comuns e das perguntas frequentes do guia.
- `MANCHAS`: 30 manchas com sinônimos e família. Quando a mancha não está na tabela da peça, o resultado é montado pela família dela, com o que o guia da peça manda evitar.
- Para mudar um texto, altere o banco e rode `node ferramentas/montar.mjs`: a página é gerada de novo, com as tabelas e o JSON-LD atualizados.

## Como testar

```
node ferramentas/montar.mjs
node ferramentas/testar.mjs
```

O teste faz estas checagens:

- confere o banco e procura termos proibidos, percentuais sem fonte e processos retirados;
- verifica se há um só H1;
- confere os 17 guias na tabela e o JSON-LD (só ASCII e perguntas iguais às visíveis);
- percorre **os 109 problemas** clicando, a 375 px e sem rolagem horizontal, e 102 resultados por família;
- testa a busca, o contexto de mancha, as perguntas do WhatsApp, as âncoras, o link direto e o teclado.

Resultado em 28/09: **0 erros, 0 avisos**.

## O que falta para instalar

1. **Respostas do dono** (`perguntas-para-o-dono.md`), principalmente sobre quem assina e sobre as perguntas do WhatsApp.
2. **Miniaturas dos cartões.** Suba os 17 arquivos `prototipo-img/dm-*.webp` na biblioteca de mídia e ajuste `FOTOS` no topo do JS para a pasta onde ficarem. Se as fotos não carregarem, os cartões ficam só com o texto, sem quebrar.
3. **Instalação, com autorização:**
   1. guarde o conteúdo atual dos snippets 3168 e 3164 e da página 3165;
   2. troque os snippets pelo CSS e pelo JS;
   3. cole `pagina-3165.html` no editor de código da página;
   4. limpe o cache;
   5. teste no celular e no computador.
4. **Título e descrição para o Google** (no plugin de SEO). Título: "Diagnóstico de Manchas: o Que Fazer Antes de Lavar" (o de hoje). Descrição sugerida: "Escolha a peça e a mancha e veja o que fazer em casa, o que evitar e como a Dedicada trata, com prazo e preço. Florianópolis."
5. **Depois de publicar:**
   1. confira o código-fonte da página (não o inspetor), para ver se as tabelas estão no HTML;
   2. confira o JSON-LD no teste de pesquisa aprimorada do Google;
   3. acompanhe o relatório de IA generativa do Search Console.

## Regras do projeto (resumo)

- Só fatos confirmados; o que faltar vira pergunta para o dono. Toda fala nova precisa de aprovação.
- Coleta e entrega grátis em 26 bairros da Ilha e do Continente, em dias fixos; de outros bairros, o cliente leva à loja. Nunca "toda Florianópolis".
- Nada de "único", "o melhor", "exclusivo", "100%" ou percentuais sem fonte. Os únicos percentuais são o acréscimo de 50% do expresso e o "cerca de 80%" do manequim Trevil, "segundo o fabricante".
- JSON-LD com acentos em `\uXXXX`. O gerador já faz isso.
- 375 px sem rolagem horizontal. Preto, branco e cinza (#D3D3D3 nas faixas); H2 em caixa alta e centralizado.
