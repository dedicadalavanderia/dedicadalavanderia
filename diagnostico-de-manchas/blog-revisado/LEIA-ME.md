# Revisão dos posts do blog

Os 31 posts sobre manchas e tecidos foram conferidos em `../auditoria-blog.md`. Os 6 que passam nas regras já aparecem em "Leia também" na ferramenta. Os outros 25 estão sendo revisados aqui. O dono aprovou a revisão em 28/09/2026.

**Nada foi publicado no site.** A publicação é feita depois, com autorização.

## O que a revisão muda

Cada post **mantém o endereço e o assunto**, para não perder a posição que já tem no Google. O que muda:

1. **Sai o que vai contra as regras:** "o melhor", "os melhores produtos do mundo", "exclusivo", "garantia", "definitivo", "elimina", percentuais sem fonte, receitas caseiras (vinagre, bicarbonato, limão) e "toda Florianópolis".
2. **Os fatos vêm dos guias:** a urgência de cada tecido sai do mesmo banco da ferramenta, e o processo, o prazo e o preço saem dos 17 guias. A coleta é sempre "26 bairros da Ilha e do Continente, em dias fixos".
3. **A estrutura é pensada para o Google e para as IAs:**
   - resposta curta no começo;
   - títulos em forma de pergunta;
   - passo a passo;
   - tabela de urgência;
   - como a Dedicada trata;
   - perguntas frequentes com dados estruturados;
   - endereços.
4. **Assinatura de um dos três sócios**, com foto. Entra a fala já aprovada do guia de quem assina; nenhuma fala nova entra sem aprovação.
5. **Botão para a ferramenta**, já na mancha do post (por exemplo, `diagnostico-de-manchas/#m-vinho`), e links para os guias.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `posts.mjs` | Os textos de cada post (a fonte). Para mudar um post, mude aqui |
| `wordpress/<endereço>.html` | O conteúdo pronto para colar no editor de código do post. **É gerado** |
| `MUDANCAS.md` | Para cada post: endereço, título novo, título e descrição para o Google, quem assina e o que mudou. **É gerado** |
| `previa.html` | Prévia local dos posts revisados |

Para gerar tudo de novo e conferir as regras:

```
node ferramentas/montar-blog.mjs
```

## Como publicar cada post (com autorização)

1. Guarde o conteúdo atual do post.
2. No editor do post, abra o editor de código e troque o conteúdo pelo de `wordpress/<endereço>.html`.
3. Troque o título do post pelo "título novo" de `MUDANCAS.md`. **Não mexa no endereço (slug).**
4. No plugin de SEO, troque o título e a descrição pelos de `MUDANCAS.md`.
5. Mantenha a imagem destacada.
6. Publique, limpe o cache e confira no celular.
7. Depois de publicado, inclua o post em `BLOG` no topo de `diagnostico-manchas.js`, com a chave `leia` na mancha. Assim ele passa a aparecer em "Leia também" na ferramenta.

O conteúdo tem um bloco de dados estruturados (`<script type="application/ld+json">`) com as perguntas frequentes. Se o editor tirar o bloco ao salvar, use um bloco de HTML personalizado para ele.

## Situação

| Post | Situação |
|---|---|
| Removemos manchas de vinho | Amostra pronta, aguardando aprovação do formato |
| Roupa com cheiro de xixi | Amostra pronta, aguardando aprovação do formato |
| Os outros 23 de `../auditoria-blog.md` | Depois da aprovação das amostras |

## Três posts sobre o mesmo assunto

Três posts tratam de urina e competem entre si no Google:

- "Como lavar roupa com xixi";
- "Como remover cheiro de urina da roupa (pets e crianças)";
- "Lavagem de roupas com urina em Florianópolis".

A sugestão é revisar só o primeiro e redirecionar os outros dois para ele (redirecionamento 301). Se preferir manter os três, cada um precisa de um ângulo próprio: por exemplo, um só para pets. Essa decisão é do dono (pergunta 19).
