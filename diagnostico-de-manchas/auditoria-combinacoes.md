# Revisão de todas as combinações da ferramenta

Feita em 28/09/2026, a pedido do dono: conferir se alguma combinação de peça e mancha sugere algo fora das operações reais da Dedicada, sofisticado demais ou inventado.

## Como foi feita

1. **Todos os resultados possíveis.** São 22 peças; cada uma tem os problemas do seu guia, as 44 manchas e danos e a opção "Não sei o que é". Isso dá 1.099 resultados, com 515 frases diferentes antes da revisão (506 depois): o que fazer, o que não fazer, o que acontece, a urgência, o processo, a máquina de casa e as notas.
2. **Comparação com os guias.** Cada frase foi comparada com o texto dos 17 guias de Cuidados por Tecido e da página central que estão no ar (`referencias/site/txt/`).
3. **Leitura à mão.** As 176 frases com menos de 75% de semelhança foram lidas uma a uma. A maioria é frase dos guias escrita de outro jeito, como "Esfregar: o atrito espalha a mancha e pode tirar a cor.", que está na página.
4. **Conferência dos prazos.** Nos 109 problemas, o prazo do "o que fazer" (24 horas, 48 horas ou menos de 24 horas) foi comparado com a urgência escrita no guia.

Para repetir a revisão: `node ferramentas/auditar-textos.mjs`. O resultado sai em `capturas/auditoria-textos.tsv`.

## O que estava errado e foi corrigido

| Onde | Como estava | Como ficou | Por quê |
|---|---|---|---|
| Carrinho de bebê: terra e poeira | "Com uso frequente, lave a cada 15 a 30 dias" | O carrinho a cada 1 a 2 meses com uso frequente, e o bebê conforto a cada 15 a 30 dias | No guia, 15 a 30 dias é para o bebê conforto |
| Carrinho de bebê: restos de comida | "Leve a peça em até 48 horas" | "Leve o carrinho para lavar." | O guia diz só "Média", sem prazo |
| Veludo: marca de água | "Leve a peça logo para avaliação" | Leve em até 24 horas | O guia diz "Urgente (24h)" |
| Camisas: colarinho e desodorante | Sem prazo para levar | Leve em até 48 horas | O guia diz "Média urgência (48h)" |
| Camisas: colarinho e punho puídos | "Evite repassar a camisa usada e o ferro forte nas bordas" | Não use água sanitária no colarinho: o cloro enfraquece a fibra, e o colarinho fica puído antes do resto da camisa | A dica anterior era do colarinho amarelado; a do guia para puídos é o cloro |
| Jaquetas: fitas derretidas | "Secadora só se a etiqueta permitir, e em temperatura baixa" | Seque à sombra, no cabide, sem secadora quente nem ferro | É o que o guia de jaquetas diz |
| Couro: encolhido pelo calor | "Guarde o couro pendurado" | Mantenha o couro longe do sol forte, do ferro e de fontes de calor | Guardar pendurado não evita o calor |
| Resultados por família de mancha | Herdavam todos os "erros comuns" do guia da peça, mesmo sem relação com a mancha | Ficou só o que vale para uma mancha | Veja a lista abaixo |
| Marca de ferro ou queimado | "Da próxima vez, passe a vapor ou com um pano por cima", em qualquer peça | Dica geral, e a opção não aparece em tênis, carrinho e pelúcias | Não se passa ferro em tênis nem em carrinho |
| Bolinhas e pelos | Aparecia em couro, peles e tênis | Não aparece nessas peças | Não faz sentido nelas |
| Lama ou terra | "Não coloque na máquina com outras roupas" | "Não misture a peça com outras roupas" | A frase anterior sugeria máquina de casa para seda, couro e vestido de noiva |
| Água sanitária e danos no tecido | "Leve quanto antes… antes de a mancha sair" | "Leve para avaliação" | O cloro tira a cor e não sai; não é uma mancha para correr |

Estes "erros comuns" continuam nos guias, mas saíram dos resultados de mancha:

- **Couro:** graxa de sapato para disfarçar esfolados.
- **Vestido de festa:** borrifar perfume com o vestido já vestido.
- **Jaquetas:** amaciante comum.
- **Carrinho:** mangueira na estrutura.
- **Peles:** perfume ou desodorante direto na peça.
- **Roupa de bebê:** "água quente em leite, xixi ou vômito", que aparecia até na mancha de maquiagem.
- **Linhas de secadora repetidas:** saíram, porque "ferro, secador de cabelo ou secadora antes de a mancha sair" já cobre.

## O que parecia sofisticado, mas está nos guias

Estes itens ficaram, porque são operações reais descritas nos guias:

- ácido peracético contra percevejos;
- lavadora só para peças de pets, nas duas lojas;
- Odorsorb nas fantasias de mascote;
- os programas da Seitz com temperatura e tempo (seda a 16 °C, lã a 28 °C, cortinas a 30 °C e 40 °C);
- o branqueador óptico no colarinho;
- o manequim da Trevil;
- a pasta que age de um dia para o outro nas axilas.

As instruções para fazer em casa também são dos guias. Por exemplo, a escovação do colarinho com detergente e alvejante à base de oxigênio vem do guia de algodão.

## O que não está nos guias

- **Foto pelo WhatsApp:** é o único convite frequente que não está em nenhum guia ("mande uma foto da peça e da etiqueta pelo WhatsApp"). O dono confirmou em 29/09 que a Dedicada avalia peças por foto.
- **Peças sem guia próprio:** o processo das peças sem guia (viscose, poliéster e academia e outra peça) é o geral, aprovado pelo dono em 29/09 (pergunta 13). Roupa de bebê e infantil, toalhas de mesa e fardas ganharam, em 29/09, o processo, o prazo e o preço que o dono confirmou.

Esta revisão foi feita com 22 peças. A peça "Fardas e uniformes", que entrou depois, também passa pelo teste das combinações.

## Proteções que ficaram

- **Conferência de prazos:** a conferência do banco (`validar`) agora reprova quando o prazo do "o que fazer" não bate com a urgência do guia.
- **Combinações sem sentido:** o campo `nao` de cada mancha tira dos botões e da busca as combinações que não fazem sentido. Se alguém procurar "bolinhas no casaco de couro", a busca oferece a peça.
