<script setup>
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import BasePergunta from '@/components/guia/BasePergunta.vue'
import BaseFontes from '@/components/guia/BaseFontes.vue'
import LabFlex from '@/components/labs/LabFlex.vue'
import LabGrid from '@/components/labs/LabGrid.vue'

const codigoFlex = `/* FLEXBOX: uma dimensão (uma linha OU uma coluna) */
.barra {
  display: flex;
  justify-content: space-between; /* espalha no eixo principal (horizontal) */
  align-items: center;            /* centraliza no eixo cruzado (vertical) */
  flex-wrap: wrap;                /* se não couber, quebra para a linha de baixo */
  gap: 1rem;                      /* espaço entre os itens (nada de margin!) */
}`

const codigoGrid = `/* GRID: duas dimensões (linhas E colunas ao mesmo tempo) */
.cards {
  display: grid;
  /* "Quantas colunas couberem, cada uma com no mínimo 14rem;
      o que sobrar (1fr) é dividido igualmente."
     min(14rem, 100%) evita estouro em telas com menos de 14rem */
  grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
  gap: 1rem;
}

/* Layout de página: Grid desenha as "áreas" */
.pagina {
  display: grid;
  grid-template-areas:
    "topo"
    "conteudo"
    "rodape";
}

@media (min-width: 64rem) {
  .pagina {
    grid-template-columns: 16rem 1fr;
    grid-template-areas:
      "topo    topo"
      "menu    conteudo"
      "rodape  rodape";
  }
}`

const fontes = [
  { titulo: 'MDN — Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox' },
  { titulo: 'MDN — Grids', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids' },
  { titulo: 'MDN — repeat()', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/repeat' },
  { titulo: 'CSS-Tricks — A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
  { titulo: 'CSS-Tricks — A Complete Guide to CSS Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
]
</script>

<template>
  <SecaoLayout resumo="As duas ferramentas de layout do CSS moderno. A pergunta que decide qual usar: estou organizando uma fila ou uma tabela?">
    <div class="leitura">
      <h2>Uma dimensão ou duas?</h2>
      <p>
        <strong>Flexbox</strong> organiza itens em <strong>uma direção só</strong>: uma fila (linha) ou uma pilha
        (coluna). É perfeito para menus, barras de botões, centralizar algo, alinhar um ícone com um texto.
      </p>
      <p>
        <strong>Grid</strong> organiza em <strong>duas direções ao mesmo tempo</strong>: linhas e colunas, como uma
        tabela. É perfeito para galerias de cards e para o layout da página inteira (menu, conteúdo, rodapé).
      </p>
      <p>Regra prática: se você está alinhando coisas <em>em fila</em>, Flexbox. Se está montando uma <em>grade</em>, Grid. E pode (deve!) usar os dois juntos: um Grid de cards onde cada card usa Flexbox por dentro.</p>

      <h3>As propriedades que mais aparecem</h3>
      <ul>
        <li><code>justify-content</code> — distribui os itens no <strong>eixo principal</strong> (no flex com <code>row</code>, é o horizontal).</li>
        <li><code>align-items</code> — alinha no <strong>eixo cruzado</strong> (o outro eixo).</li>
        <li><code>flex-wrap: wrap</code> — deixa os itens quebrarem de linha em vez de espremerem. Essencial no celular.</li>
        <li><code>gap</code> — espaço entre os itens, no Flex e no Grid. Substitui as gambiarras com <code>margin</code>.</li>
      </ul>

      <h3>O truque do <code>repeat(auto-fit, minmax())</code></h3>
      <p>
        É uma linha de CSS que faz o Grid ser responsivo <strong>sem nenhuma media query</strong>. O
        <code>minmax(14rem, 1fr)</code> diz que cada coluna tem no mínimo 14rem e no máximo uma fatia igual do espaço.
        O <code>auto-fit</code> diz "coloque quantas colunas couberem". Quando o contêiner encolhe e não cabem mais N
        colunas de 14rem, o Grid passa a usar N−1, sozinho.
      </p>
    </div>

    <BaseCodigo :codigo="codigoFlex" titulo="flexbox.css" />
    <LabFlex />

    <BaseCodigo :codigo="codigoGrid" titulo="grid.css" />
    <LabGrid />

    <BasePergunta
      numero="3"
      pergunta="Um contêiner usa grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)) e gap: 1rem. A partir de qual largura do contêiner, em px, os cards deixam de ficar em 1 coluna e passam para 2? Considere 1rem = 16px e mostre a conta."
    >
      <p>Primeiro, converter tudo para px:</p>
      <ul>
        <li>Largura mínima de cada coluna: 14rem × 16px = <strong>224px</strong></li>
        <li>gap entre colunas: 1rem × 16px = <strong>16px</strong></li>
      </ul>
      <p>
        Para caberem 2 colunas, o contêiner precisa ter espaço para as duas colunas mínimas <strong>e</strong> para 1
        gap entre elas (com N colunas existem N−1 gaps):
      </p>
      <p class="conta">2 × 224 + 1 × 16 = 448 + 16 = <strong>464px</strong></p>
      <p>
        <strong>Resposta: a partir de 464px</strong> de largura do contêiner (a área interna, sem contar o padding dele)
        os cards passam para 2 colunas. Com 463px ou menos, fica 1 coluna. Confira na Régua do Grid acima: mínimo 14rem,
        gap 1rem, arraste até 464px. Bônus: 3 colunas a partir de 3 × 224 + 2 × 16 = 704px.
      </p>
    </BasePergunta>

    <BaseFontes :fontes="fontes" />
  </SecaoLayout>
</template>

<style scoped>
.conta {
  font-family: var(--fonte-codigo);
  font-size: var(--texto-g);
  padding: var(--esp-3);
  background-color: var(--cor-papel);
  border: var(--borda);
  border-radius: var(--raio);
  overflow-wrap: anywhere;
}
</style>
