# Diagnóstico de Manchas, versão 3: protótipo e passagem

Refeito em 28/09/2026 numa sessão na nuvem com acesso ao site.

- **Versão 2:** a estrutura veio de uma pesquisa com ferramentas de manchas de lavanderias e marcas de fora (`pesquisa.html`), e o conteúdo, dos 17 guias de Cuidados por Tecido que estão no ar. O banco antigo não foi reaproveitado.
- **Versão 3:**
  - introdução no topo;
  - busca em linguagem natural ("vinho na camisa branca");
  - mais manchas, danos e peças, a partir das buscas reais do Google, dos guias e do blog;
  - a seção "Mancha por mancha" no HTML, para o Google e as IAs.

**Nada foi publicado no site.** A instalação só acontece com autorização do dono.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `diagnostico-manchas.css` | Substitui o conteúdo do snippet WPCode **3168** (CSS) |
| `diagnostico-manchas.js` | Substitui o conteúdo do snippet WPCode **3164** (JavaScript). O banco fica no topo do arquivo |
| `pagina-3165.html` | Substitui o conteúdo da página **3165** (colar no editor de código). **É gerado**: não edite à mão |
| `fonte/pagina.html` | Modelo da página. As tabelas, os números e as perguntas entram no lugar dos `{{MARCADORES}}` |
| `prototipo.html` + `prototipo-img/` | Para testar fora do site: abra `prototipo.html` no navegador |
| `pesquisa.html` | A pesquisa, o que cada referência mudou na ferramenta, SEO e GEO (rodadas 1 e 2) |
| `auditoria-banco-antigo.md` | O banco antigo (516 situações) e tudo o que ele trazia contra as regras |
| `auditoria-combinacoes.md` | A revisão de todas as combinações de peça e mancha contra os guias: o que foi corrigido e o que ficou |
| `auditoria-blog.md` | Os 31 posts do blog sobre manchas e tecidos: 6 ligados na ferramenta e 25 para revisar |
| `perguntas-para-o-dono.md` | O que precisa de resposta antes de publicar |
| `referencias/` | O que foi baixado: página atual, banco antigo, guias em texto, posts do blog, buscas do Google e páginas de referência |
| `capturas/` | Telas geradas pelo teste |
| `ferramentas/montar.mjs` | Gera `pagina-3165.html` e `prototipo.html` a partir do banco e do modelo |
| `ferramentas/testar.mjs` | Testa tudo no Chromium |
| `ferramentas/cobertura.mjs` | Mede quanto a busca entende das buscas reais do Google |
| `ferramentas/auditar-textos.mjs` | Junta todas as frases que a ferramenta pode mostrar e compara com os guias |
| `ferramentas/regras.mjs` | As regras de texto do projeto, usadas no teste da ferramenta e nos posts |
| `blog-revisado/` + `ferramentas/montar-blog.mjs` | Revisão dos posts do blog: textos, conteúdo pronto para o WordPress, o que mudou e prévia (ver `blog-revisado/LEIA-ME.md`) |

## Como a ferramenta funciona agora

### Três passos fixos

1 Peça → 2 Problema → 3 O que fazer. Os passos feitos viram botões para voltar, o voltar do navegador funciona, e cada resultado tem endereço próprio (`#seda/vinho-tinto`).

### Passo 1: a peça

- **Busca em linguagem natural.** A pessoa escreve do jeito que fala: "camisa com vinho", "manchei minha blusa de vinho", "caiu café no terno" ou "água sanitária na calça jeans". A busca:
  - acha a mancha, a peça e a cor;
  - aceita plural, falta de acento e um erro de digitação ("vihno");
  - mostra o que entendeu ("Entendi mancha: vinho · peça: blusa");
  - abre a primeira sugestão com Enter.
- **Palavras que não dizem o tecido** ("blusa", "vestido", "calça", "saia", "casaco", "toalha"...) mostram as peças possíveis. Por exemplo, "blusa" com vinho oferece algodão, seda, linho, viscose, poliéster e lã, cada uma com a urgência dela.
- **A cor da peça** ("camisa branca") já vem marcada no resultado e vai na mensagem do WhatsApp.
- **22 cartões com foto:**
  - os 17 guias, com as fotos dos cards da página central;
  - 5 peças sem guia próprio: viscose e malha fria; poliéster e roupa de academia; roupa de bebê e infantil; toalhas de mesa e guardanapos; outra peça ou tecido. As fotos foram recortadas das imagens dos posts do blog da Dedicada, só a parte da foto, sem texto nem logo.

### Passo 2: o problema

- A tabela "problemas mais comuns" do guia, do mais urgente ao menos urgente.
- "Outra mancha ou dano?", com as 44 manchas e danos em 5 grupos:
  - gordurosas e sintéticas, orgânicas e proteicas e vegetais e de tanino (as três famílias da Seitz);
  - outras manchas;
  - danos no tecido.
- Nas peças sem guia, os grupos já aparecem abertos.
- A opção "Não sei o que é a mancha" e o convite para mandar foto.

### Passo 3: o que fazer

- A urgência escrita no guia, o que geralmente acontece e o cuidado próprio da mancha.
- O que fazer agora e o que não fazer.
- A nota do tecido, com fonte, nas peças sem guia.
- Se a peça pode ir na máquina de casa.
- Como a Dedicada trata, com prazo, preço, expresso e a fala do guia.
- "Conte para a equipe":
  - Quando aconteceu?
  - Já tentou tirar em casa?
  - Cor da peça?

  As respostas entram na mensagem pronta do WhatsApp, uma por linha, com o link do resultado que a pessoa viu. Por exemplo:

  ```
  Olá! Vim do Diagnóstico de Manchas do site.

  Peça: Linho
  Problema: Vinho, café ou chá
  Cor da peça: branca
  Quando aconteceu: hoje
  Já tentei tirar em casa.
  Resultado que vi: https://dedicadalavanderia.com.br/diagnostico-de-manchas/#linho/vinho-cafe-cha

  Posso mandar uma foto?
  ```
- "Leia também", com os posts do blog aprovados.

### Todas as combinações têm resposta

As 22 peças × 44 manchas e danos dão 968 combinações, e todas têm resultado. Quando a mancha está na tabela do guia, o resultado é o do guia. Quando não está, ele é montado pela família da mancha, com o que o guia da peça manda evitar.

### Página

1. Um só H1, a assinatura e uma resposta rápida de cerca de 40 palavras.
2. A introdução "Como usar o diagnóstico?", em três passos curtos.
3. A ferramenta.
4. As seções estáticas, geradas do mesmo banco:
   - manchas mais urgentes por peça;
   - as três famílias de manchas;
   - **mancha por mancha** (novo): uma tabela por família, com o cuidado de cada mancha e as peças em que ela é mais urgente;
   - regras para qualquer mancha;
   - o que não sai na lavagem;
   - 9 perguntas frequentes (3 novas: cor de outra peça, água sanitária e desodorante);
   - endereços e dias de coleta;
   - "De onde vêm as orientações?": o que o diagnóstico cobre, com os números gerados do banco, quem orienta (família, desde 2003, de 300 a 400 peças por dia, equipe com média de 17 anos de experiência) e as fontes. Esses fatos estão na página central e ajudam o Google e as IAs a saber quem responde.

### Medição

Aprovada pelo dono em 29/09: os eventos `dm_peca`, `dm_resultado`, `dm_whatsapp` e `dm_busca` vão para o Google Analytics do site (GT-NBXFRXVL). Não há nenhum dado pessoal.

### O que a Dedicada não lava

Resposta do dono em 29/09: bolsas, camurça, sofás e estofados, colchões e tapetes médios e grandes. Quando a busca encontra um desses itens, mostra um aviso no lugar das sugestões, com o link para a roupa de cama quando for o caso (capas e mantas de sofá e protetor de colchão, a Dedicada lava). A lista fica em `NAO_LAVA`, na parte da busca do JS. Mochila, boné e tapete pequeno vão para "Outra peça ou tecido".

## Banco (topo de `diagnostico-manchas.js`)

- **`FAMILIAS`:** as 5 famílias, cada uma com o seu "primeiro cuidado".
- **`BLOG`:** os 6 posts ligados. Para ligar outro, revise o post (`auditoria-blog.md`), inclua-o aqui e ponha a chave `leia` na mancha ou na peça.
- **`MANCHAS`:** 44 manchas e danos, cada uma com:
  - `sinonimos`: o que a busca reconhece;
  - `dica`: o cuidado próprio da mancha, tirado dos guias;
  - `leia`: o post do blog.
- **`PECAS`:**
  - Nas 17 peças com guia, os fatos vêm do guia e há a tabela `problemas`.
  - Nas 5 peças sem guia (`semGuia: true`), vão só a `nota` do tecido, com fonte, e o processo geral. Qualquer mancha é tratada pela família dela.
- **`problemas`:** uma linha da tabela do guia cada.
  - `urgencia` e `acontece` são as colunas do guia, sem mudar nada.
  - `manchas` liga a busca e as famílias ao problema certo. Por exemplo, "encolheu" na lã leva à feltragem.
- **`GENERICAS` e `CORES`** (na busca): as palavras que não dizem o tecido e as cores da peça.

Para mudar um texto, altere o banco e rode `node ferramentas/montar.mjs`. A página é gerada de novo, com as tabelas, os números da introdução e o JSON-LD atualizados.

## Como testar

```
node ferramentas/montar.mjs
node ferramentas/testar.mjs
node ferramentas/cobertura.mjs
```

O teste faz estas checagens:

- confere o banco (peças, manchas, famílias e blog) e procura termos proibidos, percentuais sem fonte e processos retirados;
- verifica se há um só H1, os 17 guias na tabela, a seção "Mancha por mancha", os números da introdução e o JSON-LD (só ASCII e perguntas iguais às visíveis);
- percorre **os 109 problemas** clicando, a 375 px e sem rolagem horizontal;
- clica em 7 manchas e danos, além de "Não sei o que é", nas 22 peças, num total de 176 resultados;
- abre **as 968 combinações peça × mancha** e confere o resultado e o texto de cada uma;
- testa a busca, com 14 frases, e ainda o Enter, a cor da peça, o dano em peça sem guia, o "Leia também", as perguntas do WhatsApp, as âncoras, o link direto e o teclado.

Resultado em 28/09: **0 erros, 0 avisos**.

A cobertura foi medida com 1.308 buscas reais do autocompletar do Google. Dessas, 915 são sobre roupa e tecido, e a ferramenta dá sugestão para 94% delas. As que faltam não dizem a mancha ("como tirar mancha de roupa branca"). Nesse caso, a ferramenta pede para a pessoa contar o que manchou.

## O que falta para instalar

1. **Respostas do dono** (`perguntas-para-o-dono.md`).
2. **Miniaturas dos cartões.** Suba os 22 arquivos `prototipo-img/dm-*.webp` na biblioteca de mídia. O JS procura as fotos em `/wp-content/uploads/2026/09/`. O WordPress guarda cada arquivo na pasta do mês em que ele foi enviado: enviados a partir de outubro, eles vão para `2026/10/`, e aí é preciso trocar `FOTOS` no topo do JS para essa pasta. Antes de trocar os snippets, abra uma das fotos pelo endereço, para confirmar. Se as fotos não carregarem, os cartões ficam só com o texto, sem quebrar. As fotos de quem assina (Liliane, Jorge e Alejandro) já estão no site, em `2026/09/`.
3. **Instalação, com autorização:**
   1. guarde o conteúdo atual dos snippets 3168 e 3164 e da página 3165;
   2. troque os snippets pelo CSS e pelo JS;
   3. cole `pagina-3165.html` no editor de código da página;
   4. limpe o cache;
   5. teste no celular e no computador.
4. **Título e descrição para o Google** (no plugin de SEO). Título: "Diagnóstico de Manchas: o Que Fazer Antes de Lavar" (o de hoje). Descrição sugerida: "Escreva a mancha e a peça, como vinho na camisa, e veja o que fazer em casa, o que evitar e como a Dedicada trata. Florianópolis."
5. **Depois de publicar:**
   1. confira o código-fonte da página (não o inspetor), para ver se as tabelas estão no HTML;
   2. confira o JSON-LD no teste de pesquisa aprimorada do Google;
   3. acompanhe o relatório de IA generativa do Search Console.

### Instalação pela API (opcional)

`ferramentas/publicar-wp.mjs` envia as miniaturas e troca o conteúdo da página 3165 pela API do WordPress. Antes de trocar, ele guarda uma cópia da página em `backups/`, e sem `--publicar` só mostra o que faria. Ele precisa de uma senha de aplicativo nas variáveis de ambiente `WP_USUARIO` e `WP_SENHA_APP`.

**Em 29/09/2026, o site ignorava senhas de aplicativo:** até um usuário inexistente recebia "você não está logado", sinal de que o cabeçalho de login não chega ao WordPress. A causa provável é a hospedagem (HostGator) ou o plugin Really Simple Security. Enquanto isso não for resolvido, a instalação é feita pelo painel, no navegador. Os snippets WPCode 3168 e 3164 só podem ser trocados pelo painel de qualquer jeito.

O site tem o plugin Redirection, que faz os redirecionamentos 301 dos posts sobre urina (`blog-revisado/LEIA-ME.md`).

## Próxima fase sugerida: o blog

As buscas mais comuns são por mancha ("como tirar mancha de sangue da roupa"), e o blog já tem posts para quase todas. Mas 25 dos 31 posts conferidos trazem "os melhores do mundo", "garantia", "definitivo", percentuais ou receitas caseiras (`auditoria-blog.md`).

Revisar esses posts e ligar cada um ao resultado certo da ferramenta, como `diagnostico-de-manchas/#m-sangue`, rende mais que criar páginas novas. O Google desaconselha páginas feitas em massa para cada variação de busca.

## Regras do projeto (resumo)

- Só fatos confirmados; o que faltar vira pergunta para o dono. Toda fala nova precisa de aprovação.
- Coleta e entrega grátis em 26 bairros da Ilha e do Continente, em dias fixos; de outros bairros, o cliente leva à loja. Nunca "toda Florianópolis".
- Nada de "único", "o melhor", "exclusivo", "100%" ou percentuais sem fonte. Os únicos percentuais são o acréscimo de 50% do expresso e o "cerca de 80%" do manequim Trevil, "segundo o fabricante".
- JSON-LD com acentos em `\uXXXX`. O gerador já faz isso.
- 375 px sem rolagem horizontal. Preto, branco e cinza (#D3D3D3 nas faixas); H2 em caixa alta e centralizado.
