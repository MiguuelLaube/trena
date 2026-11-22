<script setup>
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import BasePergunta from '@/components/guia/BasePergunta.vue'
import BaseFontes from '@/components/guia/BaseFontes.vue'
import LabImagemPulo from '@/components/labs/LabImagemPulo.vue'
import LabImagemAjuste from '@/components/labs/LabImagemAjuste.vue'

const codigoCss = `/* Regra de ouro: a imagem nunca fica maior que o pai */
img {
  max-width: 100%;  /* encolhe se o pai for menor que ela */
  height: auto;     /* mantém a proporção ao encolher */
  display: block;   /* tira o espacinho fantasma embaixo */
}

/* Card com foto sempre quadrada, sem distorcer */
.card__foto {
  width: 100%;
  aspect-ratio: 1 / 1;  /* a CAIXA é quadrada */
  object-fit: cover;    /* a FOTO preenche e corta as sobras */
}`

const codigoHtml = `<!-- 1) Imagem do topo (provável LCP): SEM lazy, com prioridade -->
<img
  src="/img/capa.jpg"
  width="1200" height="750"
  alt="Fachada da padaria"
  fetchpriority="high"
>

<!-- 2) Imagem lá embaixo: lazy, só baixa quando estiver chegando perto -->
<img
  src="/img/cidade-800.jpg"
  srcset="/img/cidade-480.jpg 480w,
          /img/cidade-800.jpg 800w,
          /img/cidade-1200.jpg 1200w"
  sizes="(min-width: 64rem) 40rem, 100vw"
  width="1200" height="750"
  alt="Prédios coloridos sobre uma trena"
  loading="lazy"
  decoding="async"
>
<!-- srcset: "tenho estes arquivos, com estas larguras"
     sizes:  "no notebook a imagem ocupa 40rem; no celular, a tela toda"
     O navegador faz a conta (inclusive com a densidade da tela) e baixa um só. -->`

const fontes = [
  { titulo: 'web.dev — Cumulative Layout Shift (CLS)', url: 'https://web.dev/articles/cls' },
  { titulo: 'web.dev — Optimize Cumulative Layout Shift', url: 'https://web.dev/articles/optimize-cls' },
  { titulo: 'web.dev — Browser-level image lazy loading', url: 'https://web.dev/articles/browser-level-image-lazy-loading' },
  {
    titulo: 'MDN — Responsive images (srcset e sizes)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images',
  },
  { titulo: 'MDN — object-fit', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit' },
  { titulo: 'MDN — aspect-ratio', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio' },
]
</script>

<template>
  <SecaoLayout resumo="Imagem é o que mais pesa e o que mais quebra layout. Cinco atributos e duas propriedades resolvem quase tudo.">
    <div class="leitura">
      <h2>O kit básico</h2>
      <ul>
        <li>
          <strong><code>max-width: 100%</code> + <code>height: auto</code></strong> — a imagem encolhe para caber no
          pai e não distorce. Sem isso, uma foto de 1200px estoura a tela do celular.
        </li>
        <li>
          <strong><code>width</code> e <code>height</code> no HTML</strong> — não é para "fixar" o tamanho (o CSS acima
          continua mandando). Serve para o navegador saber a <em>proporção</em> antes de baixar e reservar o espaço.
        </li>
        <li>
          <strong><code>loading="lazy"</code></strong> — só baixa a imagem quando ela está chegando perto da tela.
          Economiza internet. <strong>Quando NÃO usar:</strong> na imagem principal do topo (a que aparece sem rolar).
          Ela provavelmente é o LCP da página; lazy nela atrasa justamente o que a pessoa vê primeiro.
        </li>
        <li>
          <strong><code>aspect-ratio</code></strong> — define a proporção de uma caixa (16/9, 1/1…). Ótimo para cards
          que precisam ter todos o mesmo formato.
        </li>
        <li>
          <strong><code>object-fit</code></strong> — diz como a foto se encaixa numa caixa de outra proporção.
          <code>cover</code> preenche e corta; <code>contain</code> mostra inteira.
        </li>
        <li>
          <strong><code>srcset</code> + <code>sizes</code></strong> — você oferece vários tamanhos do mesmo arquivo e
          o navegador baixa o mais adequado. Celular não precisa baixar a foto de 2000px.
        </li>
      </ul>
    </div>

    <BaseCodigo :codigo="codigoCss" titulo="imagens.css" />
    <LabImagemPulo />

    <BaseCodigo :codigo="codigoHtml" linguagem="html" titulo="imagens.html — topo vs. lá embaixo" />
    <LabImagemAjuste />

    <BasePergunta
      numero="4"
      pergunta="Ao abrir uma página, o texto aparece primeiro. Quando a imagem termina de carregar, ela empurra o texto para baixo. Por que isso acontece quando a imagem não tem width e height no HTML? Qual métrica do Google mede esse problema?"
    >
      <p>
        O navegador monta a página enquanto os arquivos ainda estão chegando. O HTML e o texto são leves e chegam logo;
        a imagem é pesada e demora. Se a tag <code>&lt;img&gt;</code> não tem <code>width</code> e
        <code>height</code>, o navegador <strong>não sabe o tamanho dela</strong> antes de baixar — então reserva
        <strong>altura zero</strong> e desenha o texto logo embaixo.
      </p>
      <p>
        Quando a imagem chega, ele finalmente descobre a altura, abre espaço para ela e <strong>empurra todo o resto
        para baixo</strong>. É aí que você perde a linha que estava lendo ou clica no botão errado.
      </p>
      <p>
        Com <code>width="1200" height="750"</code>, o navegador calcula a proporção (1200:750) na hora, e junto com
        <code>max-width: 100%; height: auto</code> já reserva a altura certa para a largura disponível. A imagem chega e
        ocupa um espaço que já era dela: nada pula. (Também vale usar <code>aspect-ratio</code> no CSS.)
      </p>
      <p>
        A métrica do Google que mede isso é o <strong>CLS — Cumulative Layout Shift</strong> (mudança cumulativa de
        layout), uma das Core Web Vitals. Ela soma o quanto os elementos se mexeram sem a pessoa ter pedido. Bom: até
        <strong>0,1</strong>.
      </p>
    </BasePergunta>

    <BaseFontes :fontes="fontes" />
  </SecaoLayout>
</template>
