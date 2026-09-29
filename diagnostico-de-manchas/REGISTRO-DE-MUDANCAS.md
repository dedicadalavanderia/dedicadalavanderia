# Registro de mudanças: Diagnóstico de Manchas e blog

Tudo o que foi feito entre 28 e 29/09/2026, a pedido do dono, para entregar ao Claude do desktop e para consulta.

- **Branch:** `claude/diagnostico-manchas-tool-bqkdk4`, no repositório `dedicadalavanderia/dedicadalavanderia`, pasta `diagnostico-de-manchas/`.
- **Prévia:** https://claude.ai/artifact/5oLRA9qHQQFipXnF1yCAfT
- **Nada foi publicado no site.** A instalação segue `LEIA-ME.md`, e a publicação dos posts segue `blog-revisado/LEIA-ME.md`.

## 1. Ferramenta de Diagnóstico de Manchas

Arquivos: `diagnostico-manchas.css` (snippet WPCode 3168) e `diagnostico-manchas.js` (snippet WPCode 3164).

### Antes

- Banco de 516 situações, repetidas em 21 categorias. Na seda, eram 56 opções numa tela só.
- Textos sem confirmação: "100%", percentuais sem fonte e processos que a Dedicada não usa (ozônio, hidrocarboneto, re-pigmentação, tratamento enzimático). Ver `auditoria-banco-antigo.md`.
- JavaScript de 254 KB, invisível para as IAs, sem ligação com os guias e sem assinatura.

### Navegação

- Três passos fixos: 1 Peça → 2 Problema → 3 O que fazer. Os passos feitos viram botões para voltar, e o voltar do navegador funciona.
- Cada resultado tem endereço próprio, como `#seda/vinho-tinto`, e pode ser compartilhado.
- Funciona a 375 px, sem rolagem lateral, e com teclado.

### Conteúdo

- **Os 17 guias de Cuidados por Tecido:** a tabela "problemas mais comuns" de cada guia (109 problemas), com a urgência e o texto do guia, sem mudar nada. Entram também o que fazer e o que evitar, a máquina de casa, o processo, o prazo, o preço, o expresso e a fala aprovada de quem assina.
- **44 manchas e danos, em 5 grupos:**
  - as três famílias da Seitz: gordurosas e sintéticas, orgânicas e proteicas, vegetais e de tanino;
  - outras manchas;
  - danos no tecido: queimado, encolheu, desbotou, bolinhas e cheiro ruim.
- **6 peças sem guia próprio:** viscose e malha fria; poliéster e roupa de academia; roupa de bebê e infantil; toalhas de mesa e guardanapos; fardas e uniformes; outra peça ou tecido.
  - Toalhas de mesa e fardas têm o processo que o dono confirmou em 29/09.
  - As outras têm a nota do tecido, com fonte (ANEL ou guia), e o processo geral.
- **Todas as combinações têm resultado:** são 23 peças × 44 manchas e danos, ou 1.012 combinações. Quando a mancha está na tabela do guia, vale o guia. Quando não está, a resposta vem da família da mancha.

### Busca em linguagem natural

- **Frases:** a busca entende "vinho na camisa branca", "manchei minha blusa de vinho" e "caiu café no terno".
- **Tolerância:** aceita plural, falta de acento e um erro de digitação ("vihno").
- **Peça sem tecido** ("blusa", "vestido", "calça", "saia", "casaco", "toalha", "malha"): a busca oferece as peças possíveis.
- **Cor da peça:** reconhecida na busca, já vem marcada no resultado e vai na mensagem do WhatsApp.
- **"Entendi":** uma linha mostra o que a busca entendeu, e o Enter abre a primeira sugestão.
- **O que a Dedicada não lava** (bolsa, camurça, sofá e estofado, colchão, tapete médio e grande): aviso no lugar das sugestões. Para capas e mantas de sofá e protetor de colchão, que a Dedicada lava, o aviso tem link para roupa de cama.
- **Cobertura:** a busca dá sugestão para 94% das 915 buscas reais do Google sobre roupa e tecido (`ferramentas/cobertura.mjs`).

### Resultado

- **Topo:** urgência do guia, o que acontece e o cuidado próprio da mancha.
- **Instruções:** o que fazer agora e o que não fazer; nas peças sem guia, a nota do tecido.
- **Dedicada:** máquina de casa e como a Dedicada trata, com processo, prazo, preço, expresso e a fala aprovada.
- **"Conte para a equipe":**
  - Quando aconteceu?
  - Já tentou tirar em casa?
  - Cor da peça?
- **WhatsApp:** mensagem pronta, uma informação por linha, com o link do resultado que a pessoa viu.
- **"Leia também":** só os posts do blog que passam nas regras.

### Revisão de todas as combinações (29/09)

Cada frase possível foi comparada com os guias. Detalhes em `auditoria-combinacoes.md`.

- **Carrinho:** "15 a 30 dias" era o prazo do bebê conforto; o carrinho é a cada 1 a 2 meses.
- **Prazos acertados com a urgência do guia:** carrinho com restos de comida, veludo com marca de água, colarinho e desodorante.
- **Dicas trocadas pelas do guia:** colarinho puído (é o cloro), jaqueta com fitas derretidas (à sombra, sem secadora quente nem ferro) e couro encolhido (longe do sol, do ferro e do calor).
- **Resultados por família:** saíram os "erros comuns" do guia que não têm a ver com mancha (graxa de sapato, perfume no vestido, amaciante na jaqueta, mangueira no carrinho).
- **Combinações sem sentido:** a marca de ferro não aparece em tênis, carrinho e pelúcias, e as bolinhas não aparecem em couro, peles e tênis.
- **Água sanitária e danos no tecido:** vão para "Leve para avaliação".
- **Nova conferência:** o teste reprova quando um prazo não bate com a urgência do guia.

### Respostas do dono aplicadas

- **Tira-manchas da Seitz:** chamados de V1, V2 e V3, sem dizer qual é de qual família (pergunta 20).
- **Foto pelo WhatsApp:** confirmado que a Dedicada avalia peças por foto.
- **Google Analytics:** eventos `dm_peca`, `dm_resultado`, `dm_whatsapp` e `dm_busca`, sem dado pessoal.
- **O que não lava:** bolsa, camurça, sofá, colchão e tapete médio e grande. O que lava sem guia próprio: mochila, boné e tapete pequeno.
- **Toalhas de mesa e guardanapos:**
  1. a seco primeiro, para tirar a gordura de comidas;
  2. em água, com a remoção do restante das manchas;
  3. goma e secagem natural;
  4. passadoria à mão e embalagem.
- **Fardas:**
  1. a seco, se forem estilo alfaiataria e tiverem entretela; em água, se não tiverem;
  2. secagem e passadoria;
  3. entrega em cabide, pronta para uso.

## 2. Página 3165

Arquivo gerado: `pagina-3165.html`. O modelo fica em `fonte/pagina.html`, e o gerador é `ferramentas/montar.mjs`.

### Topo

- Um só H1: "Diagnóstico de manchas: o que fazer antes de lavar?".
- Assinatura de Jorge Isaac Mazza, com foto.
- Resposta curta de cerca de 40 palavras.
- Introdução "Como usar o diagnóstico?", em três passos.

### Seções estáticas

As seções saem do mesmo banco da ferramenta e ficam no HTML, para o Google e as IAs:

- manchas mais urgentes por peça;
- famílias de manchas (V1, V2 e V3);
- mancha por mancha (uma tabela por família);
- regras para qualquer mancha;
- o que não sai na lavagem;
- 9 perguntas frequentes com dados estruturados;
- onde levar (endereços, horários e dias da coleta);
- "De onde vêm as orientações?", com os números do banco, a lavanderia de família desde 2003, as 300 a 400 peças por dia, a equipe com média de 17 anos de experiência e as fontes.

### O que saiu

O PDF antigo, os "casos reais", as frases sobre mofo sem confirmação, "mais de 500 combinações", o H2 antes do H1 e as "8 regras de ouro".

## 3. Imagens

- **Pasta:** 23 miniaturas em `prototipo-img/dm-*.webp`, todas em 320×200.
- **17 peças com guia:** as fotos dos cards da página central.
- **6 peças novas:** recortes das imagens dos posts do blog, só a foto, sem texto nem logo, com a peça inteira e sem zoom.
- **Fotos de quem assina:** já estão no site, na pasta `2026/09`.

## 4. Blog

Detalhes em `blog-revisado/MUDANCAS.md`. Os textos ficam em `blog-revisado/posts.mjs`, `posts-lote1.mjs` e `posts-lote2.mjs`, e o gerador é `ferramentas/montar-blog.mjs`.

### Posts revisados (17)

Cada post mantém o endereço e o assunto.

| Grupo | Posts |
|---|---|
| Amostras | Vinho e xixi |
| Lote 1 | Café, graxa, terra, ferrugem, remédio, comida, cheiro de mofo, amarelado e mofo, desbote, bolinhas, "minha roupa manchou" e rayon |
| Lote 2 | Toalhas de mesa, guardanapos e fardas |

Em todos, o formato é o mesmo:
- a assinatura de um dos sócios;
- a resposta curta;
- o botão para a ferramenta;
- o passo a passo;
- a urgência dos guias;
- como a Dedicada trata;
- a fala já aprovada, quando combina com o assunto;
- as perguntas frequentes com dados estruturados;
- os endereços.

Saíram:
- "o melhor" e "os melhores produtos do mundo";
- "exclusivo" e "garantia";
- "definitivo" e "elimina";
- percentuais sem fonte;
- receitas caseiras;
- afirmações não confirmadas, como "dermatologicamente testados", "elimina ácaros e bactérias", "ácido peracético" nas toalhas e "remoção totalmente manual".

Nas tags de alguns posts, é preciso tirar "melhor lavanderia do Brasil".

### Redirecionamentos (7)

A lista completa está em `blog-revisado/MUDANCAS.md`.

| Assunto | Redirecionamento |
|---|---|
| Urina | 2 posts vão para "Como lavar roupa com xixi" |
| Shoyu e chocolate | Vão para o post de comida |
| Gordura, maquiagem e roupa de bebê | Um de cada par vai para o outro |

### Situação dos outros posts

- **Continuam como estão:** os 6 que já passavam nas regras. Eles aparecem em "Leia também" na ferramenta.
- **Espera resposta:** "Lavagem de roupas de bebê: o que pode e o que evitar?" (pergunta 24).

## 5. Documentos e ferramentas de apoio

| Arquivo | Para que serve |
|---|---|
| `LEIA-ME.md` | Como a ferramenta funciona e o passo a passo da instalação |
| `perguntas-para-o-dono.md` | Respondidas e em aberto |
| `pesquisa.html` | A pesquisa internacional, a demanda do Google e as decisões de SEO e GEO |
| `auditoria-banco-antigo.md`, `auditoria-blog.md`, `auditoria-combinacoes.md` | As três auditorias |
| `ferramentas/testar.mjs` | Teste completo no navegador: problemas, combinações, busca, WhatsApp e regras de texto |
| `ferramentas/regras.mjs` | As regras de texto, usadas no teste da ferramenta e nos posts |
| `ferramentas/auditar-textos.mjs` | Compara cada frase da ferramenta com os guias |
| `ferramentas/cobertura.mjs` | Mede a busca com as buscas reais do Google |
| `ferramentas/publicar-wp.mjs` | Publicação pela API do WordPress. Em 29/09, o site ignorava senhas de aplicativo, então a instalação é pelo painel |

## 6. Decisões do dono

| Data | Decisão |
|---|---|
| 28/09 | Jorge Isaac Mazza assina a página |
| 28/09 | Fotos dos cartões aprovadas; as 5 novas foram refeitas sem zoom |
| 28/09 | O bloco "Conte para a equipe" foi aprovado |
| 28/09 | Os tira-manchas se chamam V1, V2 e V3 |
| 28/09 | Revisar os posts do blog; o conteúdo pode mudar |
| 28/09 | Os posts sobre urina viram um só |
| 29/09 | A Dedicada avalia peças por foto pelo WhatsApp |
| 29/09 | Pode medir no Google Analytics, sem dados pessoais |
| 29/09 | O que lava e o que não lava fora dos guias |
| 29/09 | O conteúdo antigo pode sair da página |
| 29/09 | Shoyu, chocolate e os pares repetidos são redirecionados |
| 29/09 | Processo de toalhas de mesa, guardanapos e fardas |

## 7. O que ainda falta

- **Perguntas em aberto** (`perguntas-para-o-dono.md`). Nenhuma impede a instalação:
  - 2: falas no resultado;
  - 5: expresso em algumas peças;
  - 13: processo geral das peças sem guia;
  - 15: prazo e preço de toalhas, guardanapos e fardas;
  - 17: as 3 perguntas frequentes novas;
  - 20: qual V é de qual família;
  - 21: formato dos posts;
  - 24: processo da roupa de bebê.
- **Instalação da ferramenta**, pelo painel do WordPress, com autorização (`LEIA-ME.md`):
  1. cópia do que está no ar;
  2. envio das 23 miniaturas;
  3. troca dos snippets 3168 e 3164;
  4. troca da página 3165;
  5. título e descrição no plugin de SEO;
  6. teste no celular e no computador.
- **Publicação dos posts** (`blog-revisado/LEIA-ME.md`): conteúdo, título, título e descrição de SEO, tags, e depois os redirecionamentos no plugin Redirection.
- **Depois de publicar:** trocar "Hydret 1, 2 e 3" por V1, V2 e V3 no guia de cetim e organza, que está no ar, e incluir os posts revisados em "Leia também" na ferramenta.

## 8. Histórico

| Commit | Data | O que foi |
|---|---|---|
| 2e226e2 | 28/09 | Protótipo da nova ferramenta (versão 1) |
| c5526a8 | 28/09 | Versão 2: pesquisa internacional e conteúdo dos 17 guias |
| aa2d22b | 28/09 | Versão 3: busca em linguagem natural, 44 manchas e danos, peças sem guia |
| 50fb95d | 28/09 | Fotos das peças novas, mensagem do WhatsApp e revisão |
| 842daad | 28/09 | Fotos sem zoom e respostas do dono |
| 3a7b5f0 | 28/09 | Blog: amostras de vinho e xixi |
| 8ec99e5 | 28/09 | Revisão de todas as combinações contra os guias; V1, V2 e V3 |
| ef2d379 | 29/09 | Instalação: pasta do mês das miniaturas |
| 7f9eb1f | 29/09 | Script de publicação pela API e nota sobre o login |
| 300e9b4 | 29/09 | Respostas do dono: foto, Analytics, o que não lava e conteúdo antigo |
| 9a76e3a | 29/09 | Blog: lote 1 (12 posts) |
| (este) | 29/09 | Fardas e uniformes, processo das toalhas de mesa, blog lote 2, redirecionamentos e este registro |
