# Passagem para o Claude do desktop: colocar no ar o Diagnóstico de Manchas e o blog revisado

Preparado em 29/09/2026, numa sessão na nuvem, para a Dedicada Lavanderia (Florianópolis). Site: https://dedicadalavanderia.com.br (WordPress).

## Leia antes de começar

**O que foi feito.** Tudo foi feito e testado fora do site. Nada foi publicado ainda.

- A Ferramenta de Diagnóstico de Manchas foi refeita.
- A página 3165 foi gerada de novo.
- As 23 miniaturas dos cartões estão prontas.
- 18 posts do blog foram revisados, e há 7 redirecionamentos para fazer.
- Todas as perguntas ao dono foram respondidas.

O histórico completo está em `REGISTRO-DE-MUDANCAS.md`.

**Onde estão os arquivos.** Repositório `dedicadalavanderia/dedicadalavanderia`, branch `claude/diagnostico-manchas-tool-bqkdk4`, pasta `diagnostico-de-manchas/`. Há duas formas de pegar os arquivos:

- clonar o branch: `git clone -b claude/diagnostico-manchas-tool-bqkdk4 https://github.com/dedicadalavanderia/dedicadalavanderia.git`;
- ou usar o arquivo `diagnostico-de-manchas-instalacao.zip`, que o dono vai anexar. Ele traz os mesmos arquivos de instalação.

Os caminhos abaixo partem da pasta `diagnostico-de-manchas/`.

**Como entrar no site.** Pelo painel do WordPress, no navegador, com o dono logado: https://dedicadalavanderia.com.br/wp-admin/

- A API REST do site ignora senhas de aplicativo e responde 401. Por isso, não use a API.
- Nunca peça senha nem token no chat.

**Regras de trabalho**

1. **Cópia antes de trocar.** Antes de trocar qualquer coisa, guarde uma cópia do que está no ar (etapa 0).
2. **Cole os arquivos como estão.** Não reescreva textos:
   - Cada frase foi conferida com os guias e com as regras do projeto.
   - O conteúdo não tem linhas em branco de propósito: o WordPress transforma linha em branco em parágrafo.
3. **Não mude endereços.** Os slugs dos posts e da página continuam os mesmos.
4. **Confirme com o dono** antes de salvar cada etapa que muda o site.
5. **Se algo não bater, pare e pergunte ao dono.** Isso vale quando a tela, o nome de um campo ou o conteúdo atual está diferente do que este documento descreve.

**Regras do projeto, caso precise escrever algo.** Escreva o mínimo.

- Só fatos confirmados.
- Nada de "único", "o melhor", "exclusivo" ou "garantia".
- Nada de percentuais sem fonte.
- A coleta é em "26 bairros da Ilha e do Continente, em dias fixos", nunca "toda Florianópolis".
- Português do Brasil.

## Arquivos que você vai usar

| Arquivo | Para onde vai |
|---|---|
| `diagnostico-manchas.css` | Snippet WPCode **3168** (CSS) |
| `diagnostico-manchas.js` | Snippet WPCode **3164** (JavaScript) |
| `pagina-3165.html` | Conteúdo da página **3165**, "Diagnóstico de Manchas", no editor de código |
| `prototipo-img/dm-*.webp` (23 arquivos) | Biblioteca de mídia |
| `blog-revisado/wordpress/<endereço>.html` (18 arquivos) | Conteúdo de cada post revisado |
| `blog-revisado/MUDANCAS.md` | Para cada post: título novo, título e descrição para o Google e o que mudou. No fim, a lista dos 7 redirecionamentos |
| `prototipo.html` | Prévia local da ferramenta: abra no navegador para ver como deve ficar |
| `blog-revisado/previa.html` | Prévia local dos posts |

## Etapa 0: cópias de segurança

Crie uma pasta `backups/` e guarde nela:

1. O conteúdo dos snippets 3168 e 3164.
   - No painel, vá em WPCode, depois Code Snippets, e abra cada snippet.
   - Copie todo o código para `backups/snippet-3168.css` e `backups/snippet-3164.js`.
   - O WPCode não guarda revisões, então esta cópia é a única volta.
2. O conteúdo da página 3165.
   - Abra https://dedicadalavanderia.com.br/wp-admin/post.php?post=3165&action=edit, depois o menu ⋮ e o "Editor de código".
   - Copie tudo para `backups/pagina-3165.html`.
3. Antes de trocar cada post (etapa 3), o conteúdo dele: `backups/posts/<endereço>.html`.

## Etapa 1: miniaturas dos cartões

1. **Envie as 23 fotos.** Em Mídia, "Adicionar nova", envie os 23 arquivos `prototipo-img/dm-*.webp`. Não envie `liliane.webp`, `jorge.webp` e `alejandro.webp`: as fotos de quem assina já estão no site.
2. **Confira o endereço de uma foto.** Abra uma delas, por exemplo `dm-seda.webp`, e veja a pasta no endereço.
   - O WordPress guarda cada arquivo na pasta do mês do envio: `/wp-content/uploads/2026/09/` em setembro e `/wp-content/uploads/2026/10/` em outubro.
   - **Se a pasta não for `2026/09`,** abra `diagnostico-manchas.js` e mude só a linha que começa com `var FOTOS` (perto da linha 46). Não mude a linha seguinte, `var UPLOADS`: é a pasta das fotos de quem assina, que continuam em `2026/09`.

     ```js
     var FOTOS = CONFIG.fotos || SITE + '/wp-content/uploads/2026/10/';
     ```
   - **Se o WordPress renomeou os arquivos** (por exemplo, `dm-seda-1.webp`), pare e fale com o dono. Isso quer dizer que já havia fotos com o mesmo nome.
3. **Confira as fotos de quem assina.** Estes 3 endereços devem abrir:
   - https://dedicadalavanderia.com.br/wp-content/uploads/2026/09/liliane-sella-mazza-dedicada-lavanderia.webp
   - https://dedicadalavanderia.com.br/wp-content/uploads/2026/09/jorge-isaac-mazza-dedicada-lavanderia.webp
   - https://dedicadalavanderia.com.br/wp-content/uploads/2026/09/alejandro-david-mazza-dedicada-lavanderia.webp

## Etapa 2: ferramenta e página 3165

A página chama os snippets pelos shortcodes `[wpcode id="3168"]` e `[wpcode id="3164"]`, que já vêm em `pagina-3165.html`.

1. **Snippet 3168 (CSS).**
   - Troque todo o código pelo de `diagnostico-manchas.css`.
   - Mantenha o tipo do snippet (CSS), o modo de inserção (shortcode) e o snippet ativo.
   - Salve.
2. **Snippet 3164 (JavaScript).**
   - Troque todo o código pelo de `diagnostico-manchas.js`, já com a linha `var FOTOS` acertada, se foi preciso.
   - Mantenha o tipo JavaScript e o modo de inserção (shortcode).
   - Se o snippet for do tipo HTML, e não JavaScript, envolva o código em `<script>` e `</script>`.
   - Salve.
3. **Página 3165.**
   - No editor de código da página, troque todo o conteúdo pelo de `pagina-3165.html`, sem mudar nada.
   - Atualize.
   - Não mude o endereço: https://dedicadalavanderia.com.br/diagnostico-de-manchas/
4. **Plugin de SEO (Yoast), na página 3165.**
   - Título: continua "Diagnóstico de Manchas: o Que Fazer Antes de Lavar".
   - Descrição: "Escreva a mancha e a peça, como vinho na camisa, e veja o que fazer em casa, o que evitar e como a Dedicada trata. Florianópolis."
5. **Limpe o cache** do site e do plugin de cache, se houver.
6. **Teste no celular (375 px) e no computador:**
   - [ ] A página abre com um só título principal, a assinatura do Jorge e a introdução "Como usar o diagnóstico?".
   - [ ] Os 23 cartões aparecem com foto.
   - [ ] "vinho na camisa branca" na busca mostra a sugestão. O Enter abre o resultado com a cor "Branca" marcada.
   - [ ] "bolsa de couro" mostra o aviso de que a Dedicada não lava bolsas.
   - [ ] O endereço `#seda/vinho-tinto` mostra o resultado com a fala e a foto da Liliane.
   - [ ] O botão do WhatsApp abre `wa.me/5548984280639` com a mensagem já escrita, com o link do resultado.
   - [ ] O endereço `#mesa/m-vinho` mostra: 4 dias, "Toalha de mesa a partir de R$ 69,00; guardanapo, R$ 13,00" e "Não tem serviço expresso".
   - [ ] Não há rolagem para o lado no celular, e o console do navegador não mostra erros.
   - [ ] No código-fonte da página (Ctrl+U, não o inspetor), aparecem as tabelas "Mancha por mancha" e o bloco `application/ld+json`.
   - [ ] O teste de pesquisa aprimorada do Google (https://search.google.com/test/rich-results) lê as perguntas frequentes.

   **Se algo quebrar,** volte as cópias da etapa 0 e avise o dono.

## Etapa 3: os 18 posts revisados

A lista está em `blog-revisado/MUDANCAS.md`, na ordem em que os posts aparecem lá.

**Comece pelo post de vinho e mostre ao dono antes de seguir.** Para cada post:

1. **Abra o post no editor.** Abra o endereço público e clique em "Editar post", ou procure em Posts pelo título atual.
2. **Guarde uma cópia** do conteúdo atual, no editor de código.
3. **Troque o conteúdo** pelo de `blog-revisado/wordpress/<endereço>.html`, no editor de código, sem mudar nada.
   - O conteúdo termina com um bloco `<script type="application/ld+json">`, com as perguntas frequentes.
   - Se o editor tirar esse bloco ao salvar, coloque-o num bloco "HTML personalizado".
4. **Troque o título do post** pelo "Título novo do post". **Não mexa no endereço (slug).**
5. **No Yoast,** troque o título e a descrição pelos de `MUDANCAS.md`.
6. **Mantenha a imagem destacada e a categoria.**
7. **Nas tags,** tire qualquer uma com "melhor", "exclusivo", "garantia" ou "definitivo", como "melhor lavanderia do Brasil". `MUDANCAS.md` aponta os posts em que isso aparece.
8. **Atualize, limpe o cache e confira no celular.**

Os 18 posts:

| Endereço | Assunto |
|---|---|
| /removemos-manchas-de-vinho-dedicada-lavanderia/ | Vinho |
| /como-lavar-roupa-com-xixi/ | Xixi |
| /como-remover-mancha-de-cafe-de-suas-roupas-de-forma-segura/ | Café |
| /como-remover-manchas-de-graxa-das-roupas-de-forma-segura/ | Graxa |
| /lavagem-de-roupas-com-manchas-de-terra/ | Terra e barro |
| /como-tirar-manchas-de-ferrugem-das-roupas/ | Ferrugem |
| /remocao-de-manchas-de-remedios-das-roupas/ | Remédio |
| /retirada-de-manchas-de-comida-molhos-bebidas-e-sucos/ | Comida, molho e suco |
| /como-tirar-cheiro-de-mofo-da-roupa-de-forma-definitiva/ | Cheiro de mofo |
| /como-remover-manchas-amareladas-e-de-mofo-das-roupas/ | Amarelado e mancha de mofo |
| /por-que-suas-roupas-desbotam-e-como-evitar-isso/ | Desbote |
| /remocao-manual-de-bolinhas-e-pelos-de-roupas/ | Bolinhas e pelos |
| /minha-roupa-manchou-a-lavanderia-consegue-recuperar/ | "Minha roupa manchou" |
| /como-lavar-vestidos-e-pecas-em-rayon-dedicada-lavanderia/ | Rayon |
| /lavagem-de-toalhas-de-mesa-em-florianopolis/ | Toalhas de mesa |
| /lavagem-de-guardanapos/ | Guardanapos |
| /lavagem-de-fardas-higiene-e-imagem-em-cada-detalhe/ | Fardas |
| /lavagem-de-roupas-de-bebe-o-que-pode-e-o-que-evitar/ | Roupa de bebê e infantil |

## Etapa 4: os 7 redirecionamentos (301)

Faça depois de publicar os posts de destino.

1. Vá em Ferramentas, depois Redirection, e "Adicionar novo".
2. Para cada linha, preencha o endereço de origem, o de destino e o tipo 301.

| De | Para |
|---|---|
| /como-remover-cheiro-de-urina-da-roupa-pets-e-criancas/ | /como-lavar-roupa-com-xixi/ |
| /lavagem-de-roupas-com-urina-em-florianopolis/ | /como-lavar-roupa-com-xixi/ |
| /como-remover-manchas-de-shoyu-das-roupas/ | /retirada-de-manchas-de-comida-molhos-bebidas-e-sucos/ |
| /removemos-manchas-de-chocolate-das-suas-roupas-favoritas/ | /retirada-de-manchas-de-comida-molhos-bebidas-e-sucos/ |
| /como-remover-manchas-de-gordura-das-roupas-de-forma-segura/ | /como-remover-manchas-de-gordura-das-roupas-descubra-a-solucao-definitiva/ |
| /lavagem-de-roupas-com-manchas-de-maquiagem/ | /remocao-de-manchas-de-maquiagem/ |
| /como-lavar-roupas-de-recem-nascido-guia-para-pais-e-maes/ | /lavagem-de-roupas-de-bebe-o-que-pode-e-o-que-evitar/ |

Teste cada endereço de origem numa janela anônima: ele deve levar ao destino.

- Não apague os posts antigos.
- Se o redirecionamento não funcionar com o post antigo publicado, passe o post antigo para rascunho e teste de novo.

## Etapa 5: acertos nos guias que já estão no ar

Estes acertos seguem as respostas do dono de 28 e 29/09. Em cada página, troque o texto visível. Se a mesma frase estiver no bloco `application/ld+json`, troque lá também, com os acentos em `\uXXXX`. As versões prontas estão abaixo.

### 1. Cetim e organza (/cuidados-cetim-organza/): de Hydret para V1, V2 e V3

O dono chama os tira-manchas da Seitz de V1, V2 e V3.

- **Frase:** "Na Dedicada, cada família de mancha tem o seu tira-manchas, da linha Hydret da Seitz." vira "Na Dedicada, cada família de mancha tem o seu tira-manchas da Seitz: o V1, o V2 ou o V3."
- **Tabela:** "Hydret 1", "Hydret 2" e "Hydret 3" viram "V1", "V2" e "V3".

**Antes de salvar, pergunte ao dono se o Hydret 1 é o V1, o 2 é o V2 e o 3 é o V3.** Se ele não souber ou disser que não, troque a coluna inteira por "V1, V2 ou V3", sem ligar cada família a um número.

### 2. Expresso

Resposta do dono em 29/09: tudo tem expresso, menos lençóis, vestidos, toalhas de mesa e guardanapos.

| Página | Frase de hoje | Frase nova |
|---|---|---|
| /cuidados-seda/ (2 vezes: "Prazo e preço" e a pergunta frequente) | Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. | Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%, menos para vestidos. |
| /cuidados-linho/ (2 vezes) | Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. | Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%, menos para vestidos. |
| /cuidados-roupa-de-cama/ (2 vezes) | Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. | Lençóis não têm serviço expresso; toalhas, mantas e capas têm, no mesmo dia ou no seguinte, com acréscimo de 50%. |
| /cuidados-cetim-organza/ ("Prazo e preço") | Vestidos de festa e finos: 5 dias, ou no mesmo dia ou no seguinte pelo serviço expresso, com acréscimo de 50%. | Vestidos de festa e finos: 5 dias. Vestidos não têm serviço expresso. |
| /cuidados-cetim-organza/ (pergunta frequente) | Para vestido de festa, há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%. | Vestidos não têm serviço expresso. |
| /cuidados-por-tecido/ (pergunta "Quanto tempo a lavanderia leva e quanto custa?") | Há serviço expresso para a maioria das peças, no mesmo dia ou no seguinte, com acréscimo de 50%; couro e tênis não têm expresso. | Há serviço expresso para a maioria das peças, no mesmo dia ou no seguinte, com acréscimo de 50%; couro, tênis, vestidos, lençóis, toalhas de mesa e guardanapos não têm expresso. |

As mesmas frases, com os acentos em `\uXXXX`, para o bloco `application/ld+json`:

- `Há serviço expresso, no mesmo dia ou no seguinte, com acréscimo de 50%, menos para vestidos.`
- `Lençóis não têm serviço expresso; toalhas, mantas e capas têm, no mesmo dia ou no seguinte, com acréscimo de 50%.`
- `Vestidos não têm serviço expresso.`
- `Há serviço expresso para a maioria das peças, no mesmo dia ou no seguinte, com acréscimo de 50%; couro, tênis, vestidos, lençóis, toalhas de mesa e guardanapos não têm expresso.`

Antes de salvar, confira o texto de hoje na página: ele foi lido do site em 28/09 e pode ter mudado. Se não bater, pergunte ao dono.

### 3. Links para os posts de urina (opcional)

A página central e os guias de pelúcias e de algodão têm links para os posts de urina que agora redirecionam. O redirecionamento resolve, mas o ideal é trocar esses links por `/como-lavar-roupa-com-xixi/`.

## Etapa 6: ligar os posts revisados na ferramenta

Faça só depois de publicar os 18 posts. A ligação já está pronta no JS, mas desligada.

1. **Ligue a chave.** Em `diagnostico-manchas.js`, na linha com `var POSTS_REVISADOS_NO_AR`, troque para:

   ```js
   var POSTS_REVISADOS_NO_AR = true;
   ```
2. **Troque o código do snippet 3164 de novo,** com a linha `var FOTOS` acertada, se foi preciso.
3. **Limpe o cache e confira os resultados:**
   - `#mesa/m-vinho` mostra em "Leia também" os posts de vinho, de toalhas de mesa e de guardanapos.
   - `#bebe/m-xixi` mostra os posts de xixi e de roupa de bebê.

Se o Node estiver disponível, `node ferramentas/testar.mjs` testa a ferramenta inteira antes de colar (precisa do Playwright).

## Depois de tudo

1. No Google Search Console, peça a indexação da página do diagnóstico e dos 18 posts.
2. Acompanhe o relatório de pesquisa aprimorada (perguntas frequentes) e o de IA generativa.
3. Os eventos `dm_peca`, `dm_resultado`, `dm_whatsapp` e `dm_busca` vão para o Google Analytics do site. Confira no relatório em tempo real.
4. Conte ao dono o que foi feito, etapa por etapa. Diga também o que ficou pendente, se algo ficou.
