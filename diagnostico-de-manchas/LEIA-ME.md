# Diagnóstico de Manchas: protótipo e passagem para a sessão do computador

Feito em 28/09/2026, numa sessão na nuvem **sem acesso ao site** (a rede bloqueou dedicadalavanderia.com.br). A estrutura está pronta e testada. O conteúdo de cada mancha ainda precisa ser conferido com as tabelas dos 17 guias e com o banco antigo, que já foram baixados na sessão do computador.

**Nada foi publicado no site.** A instalação só acontece com autorização do dono.

## Arquivos

| Arquivo | Para onde vai |
|---|---|
| `diagnostico-manchas.css` | Substitui o conteúdo do snippet WPCode **3168** (CSS) |
| `diagnostico-manchas.js` | Substitui o conteúdo do snippet WPCode **3164** (JavaScript). O banco fica no topo do arquivo |
| `pagina-3165.html` | Substitui o conteúdo da página **3165** (colar no editor de código). Já traz os dois shortcodes no lugar certo |
| `prototipo.html` | Só para testar fora do site: abra no navegador. É gerado a partir de `pagina-3165.html` |
| `perguntas-para-o-dono.md` | O que precisa de resposta do dono antes de publicar |
| `capturas/` | Telas a 375 px e a 1280 px, geradas pelo teste |
| `ferramentas/montar-prototipo.mjs` | Gera `prototipo.html` de novo depois de mudar a página |
| `ferramentas/escapar-jsonld.mjs` | Reescreve os acentos do JSON-LD como `\uXXXX` (o filtro do servidor estraga os acentos) |
| `ferramentas/testar.mjs` | Testa tudo no Chromium (ver "Como testar") |

## O que muda na página

| Problema da página atual | Como ficou |
|---|---|
| H2 antes do H1 e dois títulos concorrendo | Um só H1: "Diagnóstico de manchas: o que fazer antes de lavar?". A ferramenta não tem título próprio; cada passo tem uma pergunta |
| Navegação sem ordem e seleção estranha | Três passos fixos e numerados: **1 Peça → 2 Problema → 3 O que fazer**. Uma pergunta por tela; os passos feitos viram botões para voltar; o botão voltar do navegador funciona; cada resultado tem link próprio (ex.: `#seda/vinho-tinto`) para mandar pelo WhatsApp |
| Informação dispersa | Resposta rápida e assinatura no topo; a ferramenta; depois só cinco seções curtas: guias por peça, regras para qualquer mancha, o que pode não sair, perguntas frequentes e onde levar |
| Nenhum link para os 17 guias | Cada resultado leva ao guia da peça, e a seção "Qual é o guia da sua peça?" lista os 17 (links que o Google segue, mesmo sem JavaScript) |
| Sem assinatura | "Revisado por Jorge Isaac Mazza" (proposta, a confirmar) e, no resultado, a fala aprovada de quem assina o guia |
| "Mais de 500 combinações reais" | Saiu |
| Trevil "prolonga a vida útil em até 70%" | Saiu com os Casos reais. A fala das camisas usa a forma aprovada: "segundo o fabricante, reduz em cerca de 80% o atrito do ferro" |
| Regras de ouro e etiqueta repetidas | Viraram cinco regras curtas com link para Cuidados por Tecido; a imagem dos símbolos saiu |
| "Nunca coloque em água… lã, seda e cashmere" | Agora diz que a regra é para casa, e que na lavanderia a seda com sombra de bebida vai à água fria e a lã pode ir ao wet cleaning para lã |
| "Quando não garantimos 100%" | Virou "O que pode não sair na lavagem?", só com casos confirmados (lã feltrada, marca de ferro no veludo, poliuretano descascando, peles antigas, blackout) |
| "Por que Florianópolis tem tanto mofo" | Virou a pergunta frequente já publicada na página central |

O app agora monta em `<div id="dm-app">` (antes era `#app`). O CSS só afeta `.dm-pagina` e `.dm-app`.

## Como o banco novo funciona

O banco está organizado pelos **17 guias**, nos mesmos grupos da página central, e não pelas 21 categorias do banco antigo. Assim, cada resultado leva a um guia.

- `PECAS[]`: `id`, `grupo`, `nome`, `exemplos`, `guia` (endereço), `urlConfirmada`, `maquina` (pode ir na máquina de casa?), `processo` (como a Dedicada lava), `prazo`, `preco`, `expresso` (`sim` | `nao` | `consultar`), `fala` (`{autor, texto, conferir?}`) e `problemas[]`.
- `problemas[]`: `id`, `nome`, `urgencia`, `prazo` (opcional, ex.: "de preferência em até 24 horas"), `fazer[]`, `evitar[]`, `naDedicada` (o que é específico desse problema; `null` quando o processo da peça já basta) e `origem`.
- `urgencia`: `urgente` (Mais urgente), `logo` (Leve logo), `avaliar` (Precisa de avaliação), `prevenir` (Como evitar) e `sem_volta` (Não tem volta). Na lista, os problemas aparecem do mais urgente para o menos urgente.
- `origem`: `briefing` quer dizer que o item foi montado só com os fatos do briefing e do Plano. Depois de conferido com a tabela do guia, passa a `guia`.
- As frases que se repetem (pano sem esfregar, água quente, mofo em 24 horas…) ficam em `F`, no topo, com o texto já aprovado.

Hoje o banco tem 17 peças e 44 problemas, todos com `origem: 'briefing'`. O antigo tinha 516 situações. O campo `diagnostico` do banco antigo ("fácil", "médio"…) **saiu**, porque as chances de remoção nunca foram confirmadas.

## O que a sessão do computador precisa fazer

1. **Endereços dos guias.** Seis foram deduzidos e estão com `urlConfirmada: false`: seda, festa e noiva, veludo, lã, couro e jeans. Confira os endereços nos cards da página central e corrija no JS e na lista de `pagina-3165.html`. O teste avisa se as duas listas não baterem.
2. **Problemas de cada guia.** Para cada guia, abra a tabela "problemas mais comuns":
   - inclua os problemas que faltam;
   - use a urgência da tabela;
   - troque `fazer` e `evitar` pelo texto aprovado do guia (erros comuns e perguntas frequentes);
   - mude `origem` para `'guia'`.
3. **Banco antigo (516 situações).** Leve para as 17 peças só o que os guias ou os fatos confirmados sustentam, sem repetir problemas. Anote em `MUDANCAS.md` (crie o arquivo) o que saiu e o que foi corrigido, com o motivo. O que a auditoria já achou:
   - promessas de "100%";
   - percentuais da apostila de couro;
   - processos que a Dedicada não confirmou (ozônio, hidrocarboneto, re-pigmentação e os listados em "Termos barrados", abaixo);
   - conselhos que contradizem os guias.
4. **Falas.** Copie dos guias no ar as falas aprovadas de peles, edredom, cortinas, pelúcias e carrinho, que estão como `fala: null`. Confirme também o autor da fala da lã e o prazo do couro (perguntas 2 e 4 do dono).
5. **Foto de quem assina.** Troque o círculo com as iniciais (`.dm-iniciais`) pela mesma `<img>` com descrição usada nos outros guias. As fotos estão na biblioteca de mídia.
6. **Endereços das lojas.** Em "Onde levar a peça?", copie os endereços do Centro e do Santa Mônica do bloco de atendimento local dos guias.
7. **Teste.** Rode os comandos de "Como testar". Só publique com 0 erros e sem avisos de `origem`, de endereço ou de fala.
8. **Aprovação do dono.** Mostre `prototipo.html` e as perguntas; ajuste o que ele pedir.
9. **Instalação** (só com autorização):
   1. guarde o conteúdo atual dos snippets 3168 e 3164 e da página 3165;
   2. troque os snippets e o conteúdo da página;
   3. limpe o cache;
   4. teste no celular e no computador;
   5. veja se o menu e os links internos continuam apontando para `/diagnostico-de-manchas/`.

## Como testar

```
node ferramentas/escapar-jsonld.mjs pagina-3165.html   # só se mexer no JSON-LD
node ferramentas/montar-prototipo.mjs
node ferramentas/testar.mjs
```

O teste usa o Playwright e faz estas checagens:

- confere o banco (campos, ids repetidos, urgências);
- procura termos proibidos e processos retirados;
- verifica se há um só H1 e nenhum H2 antes dele;
- compara os 17 links da página com o banco;
- confere o JSON-LD: só ASCII, JSON válido e as mesmas perguntas visíveis na página;
- percorre **todos** os caminhos peça → problema → resultado a 375 px, clicando, e confere que não há rolagem horizontal, que os links do WhatsApp e do guia estão certos e que o voltar do navegador funciona;
- testa o link direto, um endereço inválido e o teclado (Enter e foco).

Resultado em 28/09: **44 caminhos, 0 erros**, 57 avisos (os itens 1, 2 e 4 acima).

## Termos barrados

- **Erro** (reprova o teste): único, o melhor, a melhor, exclusivo, 100%, "toda Florianópolis", "qualquer região", garantimos/garantia, "mais de 500", "prolonga a vida", "nossa equipe técnica".
- **Aviso** (processos que saíram dos guias por não terem sido confirmados): capilaridade, "% de recuperação", tanino, prensagem úmida, enzimático, teflon, re-pigmentação, fixador de cor, congelamento, esferas, re-impermeabilização, ferrugem, redutor de corante, vaporização, prancha de agulhas, oxi-sanitização, fuligem, ozônio, bactericida, suportes de secagem, hidrocarboneto, "duas ou três lavagens por ano".

## Divergências encontradas no Plano

- **Couro:** o briefing e as páginas dizem 5 a 7 dias; a tabela de prazos do Plano e a fala aprovada do Alejandro dizem 6 a 7.
- **Linho:** o quadro de rodízio põe o linho com o Jorge, mas a página foi assinada pela Liliane, com fala nova aprovada em 28/09. O banco segue a página (Liliane).
- **Lã, ternos e jaquetas:** no quadro de falas aprovadas, estavam com a Liliane ou com o Alejandro; as páginas foram assinadas pelo Jorge. Nas páginas de ternos e jaquetas, o Plano diz "assinada pelo Jorge com a fala aprovada"; na de lã, não diz nada sobre a fala.

## Regras do projeto (resumo)

- Só fatos confirmados; o que faltar vira pergunta para o dono. Toda fala nova precisa de aprovação.
- Coleta e entrega grátis em 26 bairros da Ilha e do Continente, em dias fixos; de outros bairros, o cliente leva à loja (Centro ou Santa Mônica). Nunca "toda Florianópolis".
- Português do Brasil, frases diretas e títulos em forma de pergunta.
- Celular a 375 px sem rolagem horizontal. Preto, branco e cinza (#D3D3D3 nas faixas); H2 em caixa alta e centralizado.
- WhatsApp: https://wa.me/5548984280639
