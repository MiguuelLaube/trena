<script setup>
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import BasePergunta from '@/components/guia/BasePergunta.vue'
import BaseFontes from '@/components/guia/BaseFontes.vue'
import LabViewport from '@/components/labs/LabViewport.vue'

const codigoHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <!-- width=device-width → a página é montada com a largura REAL do aparelho
       initial-scale=1     → começa sem zoom (100%) -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meu site</title>
</head>`

const codigoCss = `/* 1) Fora de media query = CELULAR (mobile-first) */
.cards {
  display: grid;
  gap: 1rem;              /* um card embaixo do outro */
}

/* 2) Telas a partir de 640px (40rem): duas colunas */
@media (min-width: 40rem) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

/* 3) A partir de 1024px (64rem): três colunas */
@media (min-width: 64rem) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}`

const fontes = [
  {
    titulo: 'MDN — <meta name="viewport">',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag',
    nota: 'a largura padrão de ~980px e o que cada parâmetro faz',
  },
  {
    titulo: 'MDN — Viewport concepts (layout viewport e visual viewport)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts',
  },
  { titulo: 'web.dev — Responsive web design basics', url: 'https://web.dev/articles/responsive-web-design-basics' },
  {
    titulo: 'MDN — Using media queries',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries',
  },
]
</script>

<template>
  <SecaoLayout resumo="Seu site vai ser aberto num celular de 360px, num notebook de 1366px e numa TV. Ele precisa funcionar em todos — com o MESMO HTML.">
    <div class="leitura">
      <h2>O que é um site responsivo</h2>
      <p>
        Site responsivo é aquele que <strong>se ajusta ao espaço que tem</strong>. Não existe "versão mobile" separada: é
        o mesmo HTML, e o CSS reorganiza as coisas conforme a largura da tela. No celular, um card embaixo do outro; no
        notebook, três lado a lado.
      </p>
      <p>
        Isso importa porque a maior parte das pessoas acessa a internet pelo celular. Se o site quebra lá, com rolagem
        para o lado e texto minúsculo, a pessoa simplesmente desiste. E o Google também leva a experiência no celular em
        conta na hora de mostrar seu site nas buscas.
      </p>

      <h3>Os três ingredientes</h3>
      <ol>
        <li><strong>A meta tag viewport</strong>: avisa o celular para usar a largura real da tela.</li>
        <li>
          <strong>Layout fluido</strong>: larguras em <code>%</code>, <code>fr</code>, Flexbox e Grid em vez de
          "<code>width: 1200px</code>".
        </li>
        <li><strong>Media queries</strong>: regras de CSS que só valem a partir de certa largura.</li>
      </ol>

      <h3>Mobile-first: começar pelo pequeno</h3>
      <p>
        No mobile-first, o CSS "solto" (fora de qualquer <code>@media</code>) é o do celular. Depois, com
        <code>@media (min-width: ...)</code>, a gente <em>acrescenta</em> coisas para telas maiores. É mais fácil
        adicionar colunas do que tirar, e o celular — que costuma ter internet e processador mais fracos — lê menos regras.
      </p>
    </div>

    <BaseCodigo :codigo="codigoHtml" linguagem="html" titulo="index.html — a linha que não pode faltar" />
    <BaseCodigo :codigo="codigoCss" titulo="cards.css — mobile-first com min-width" />

    <LabViewport />

    <BasePergunta
      numero="1"
      pergunta="Um site tem media queries bem escritas, mas não tem a meta tag viewport. No celular, ele aparece como a versão de computador, só que minúscula. Por que isso acontece, e o que a meta viewport muda?"
    >
      <p>
        Quando os smartphones surgiram, quase nenhum site era feito para eles. Para não "quebrar" a internet, os
        navegadores de celular passaram a <strong>fingir que a tela tem cerca de 980px de largura</strong> (a chamada
        <em>layout viewport</em>). A página é montada nessa largura de computador e depois <strong>encolhida com
        zoom</strong> para caber nos ~360px reais. Por isso tudo aparece minúsculo.
      </p>
      <p>
        E as media queries? Elas são calculadas em cima desses 980px falsos. Uma regra como
        <code>@media (min-width: 640px)</code> é verdadeira, então o navegador aplica o layout de computador — as
        media queries estão certas, mas estão "medindo" a tela errada.
      </p>
      <p>
        A tag <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> desliga esse
        fingimento: <code>width=device-width</code> faz a layout viewport ter a largura real do aparelho (em pixels CSS)
        e <code>initial-scale=1</code> abre sem zoom. Agora a página é montada com ~360px, as media queries enxergam a
        largura verdadeira e o layout de celular aparece. Teste no laboratório acima: sem a tag, o zoom fica em ~37%.
      </p>
    </BasePergunta>

    <BaseFontes :fontes="fontes" />
  </SecaoLayout>
</template>
