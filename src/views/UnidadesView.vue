<script setup>
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import BasePergunta from '@/components/guia/BasePergunta.vue'
import BaseFontes from '@/components/guia/BaseFontes.vue'
import LabUnidades from '@/components/labs/LabUnidades.vue'

const tabela = [
  { u: 'px', tipo: 'absoluta', base: 'nada — é fixo', uso: 'bordas finas (1px, 2px), sombras. Evite para fontes.' },
  { u: 'rem', tipo: 'relativa', base: 'fonte do <html> (raiz)', uso: 'fontes e espaçamentos. A unidade "padrão" do projeto.' },
  { u: 'em', tipo: 'relativa', base: 'fonte do próprio elemento', uso: 'padding de botão que cresce junto com o texto do botão.' },
  { u: '%', tipo: 'relativa', base: 'o elemento pai', uso: 'larguras fluidas (width: 50%), max-width: 100%.' },
  { u: 'fr', tipo: 'relativa', base: 'espaço que SOBRA no grid', uso: 'colunas do CSS Grid (1fr 2fr).' },
  { u: 'vw', tipo: 'relativa', base: '1% da largura da janela', uso: 'tamanhos que acompanham a tela (com clamp).' },
  { u: 'vh', tipo: 'relativa', base: '1% da altura "grande" da janela', uso: 'cuidado no celular: a barra do navegador cobre parte.' },
  { u: 'dvh', tipo: 'relativa', base: '1% da altura visível AGORA', uso: 'seções de tela cheia no celular (min-height: 100dvh).' },
  { u: 'ch', tipo: 'relativa', base: 'largura do caractere "0"', uso: 'limitar linhas de leitura (max-width: 65ch).' },
]

const codigo = `:root {
  /* tokens em rem: crescem se a pessoa aumentar a fonte */
  --espaco: 1rem;
  --texto-titulo: clamp(2rem, 1.5rem + 3vw, 3.5rem); /* rem + vw */
}

.botao {
  font-size: 1.125rem;
  padding: 0.5em 1em;   /* em: o "colchão" acompanha a fonte DO BOTÃO */
  border: 2px solid;    /* px: borda fininha não precisa crescer */
}

.artigo {
  max-width: 65ch;      /* ~65 caracteres por linha: leitura confortável */
}

.capa {
  min-height: 100dvh;   /* tela cheia de verdade, mesmo com a barra do celular */
}

.layout {
  display: grid;
  grid-template-columns: 1fr 3fr; /* fr: divide o espaço que sobra */
}

.metade {
  width: 50%;           /* %: metade do PAI */
}`

const fontes = [
  {
    titulo: 'MDN — CSS values and units',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units',
  },
  { titulo: 'MDN — <length> (lista de unidades)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/length' },
  { titulo: 'web.dev — The large, small, and dynamic viewport units', url: 'https://web.dev/blog/viewport-units' },
  {
    titulo: 'W3C — WCAG 2.2, critério 1.4.4 (Redimensionar texto)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html',
  },
  { titulo: 'Josh W. Comeau — The Surprising Truth About Pixels and Accessibility', url: 'https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/' },
]
</script>

<template>
  <SecaoLayout resumo="Toda medida no CSS tem uma unidade. Escolher a unidade certa é escolher em relação a QUÊ aquela medida vai mudar.">
    <div class="leitura">
      <h2>Absolutas e relativas</h2>
      <p>
        <strong>Unidade absoluta</strong> tem sempre o mesmo tamanho. Na web, a única que usamos é o <code>px</code>.
        <strong>Unidade relativa</strong> é uma conta: "tantas vezes o tamanho de alguma coisa". Se essa coisa muda, a
        medida muda junto — e é exatamente isso que deixa um site flexível.
      </p>
      <p>Pense na pergunta: <em>"isso deveria mudar quando o quê muda?"</em></p>
      <ul>
        <li>Deve acompanhar a fonte que a pessoa escolheu? → <code>rem</code></li>
        <li>Deve acompanhar o texto do próprio componente? → <code>em</code></li>
        <li>Deve acompanhar o pai? → <code>%</code> (ou <code>fr</code> dentro do Grid)</li>
        <li>Deve acompanhar a tela? → <code>vw</code>, <code>dvh</code></li>
        <li>Não deve mudar nunca? → <code>px</code></li>
      </ul>
    </div>

    <h2>Quando usar cada uma</h2>
    <table class="unidades">
      <thead>
        <tr>
          <th scope="col">Unidade</th>
          <th scope="col">Tipo</th>
          <th scope="col">Relativa a…</th>
          <th scope="col">Use para</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in tabela" :key="l.u">
          <th scope="row" data-rotulo="Unidade"><code>{{ l.u }}</code></th>
          <td data-rotulo="Tipo">{{ l.tipo }}</td>
          <td data-rotulo="Relativa a">{{ l.base }}</td>
          <td data-rotulo="Use para">{{ l.uso }}</td>
        </tr>
      </tbody>
    </table>

    <BaseCodigo :codigo="codigo" titulo="unidades.css — cada uma no seu lugar" />

    <LabUnidades />

    <BasePergunta
      numero="2"
      pergunta="Uma pessoa com baixa visão aumenta o tamanho da fonte nas configurações do navegador. O texto definido em px continua do mesmo tamanho, e o definido em rem aumenta. Por que essa diferença acontece?"
    >
      <p>
        Porque <code>px</code> é uma unidade <strong>absoluta</strong>: <code>font-size: 16px</code> quer dizer "16
        pixels, ponto final". O navegador obedece ao autor do site e ignora a preferência da pessoa.
      </p>
      <p>
        Já <code>rem</code> é <strong>relativa à fonte do elemento raiz</strong> (o <code>&lt;html&gt;</code>). E de
        onde vem a fonte do <code>&lt;html&gt;</code>? Justamente da configuração do navegador — que por padrão é 16px.
        Se a pessoa muda para 24px, então <code>1rem</code> passa a valer 24px, e todo texto em rem cresce 50% junto.
        A conta é: <strong>tamanho final = valor em rem × fonte escolhida</strong>.
      </p>
      <p>
        Por isso nunca escreva <code>html { font-size: 16px; }</code> — isso "trava" a raiz em px e desliga a
        preferência da pessoa. Use <code>100%</code> (ou não declare nada). Detalhe: o zoom (Ctrl +) aumenta tudo, até
        px; a diferença aparece na configuração de <em>tamanho da fonte</em>, que muita gente com baixa visão usa para
        não precisar dar zoom em todo site. Teste no laboratório: o guia inteiro cresce, menos a caixa em px.
      </p>
    </BasePergunta>

    <BaseFontes :fontes="fontes" />
  </SecaoLayout>
</template>

<style scoped>
/* Tabela responsiva — CELULAR: cada linha vira um cartão */
.unidades {
  width: 100%;
  max-width: var(--largura-conteudo);
  border-collapse: collapse;
  font-size: var(--texto-p);
}

.unidades thead {
  /* escondido visualmente no celular, mas leitores de tela ainda leem */
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.unidades tr {
  display: block;
  margin-bottom: var(--esp-3);
  padding: var(--esp-3);
  border: var(--borda);
  border-radius: var(--raio);
  background-color: #fffdf6;
}

.unidades th,
.unidades td {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: var(--esp-2);
  padding: var(--esp-1) 0;
  text-align: left;
}

.unidades th[scope='row'] code {
  font-size: var(--texto-g);
  background-color: var(--cor-trena);
}

.unidades [data-rotulo]::before {
  content: attr(data-rotulo);
  font-weight: 700;
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
}

/* A partir de 40rem: volta a ser uma tabela de verdade */
@media (min-width: 40rem) {
  .unidades thead {
    position: static;
    width: auto;
    height: auto;
    clip: auto;
    display: table-header-group;
  }

  .unidades tr {
    display: table-row;
    border: none;
    background: none;
  }

  .unidades th,
  .unidades td {
    display: table-cell;
    padding: var(--esp-2) var(--esp-3);
    border-bottom: 1px solid var(--cor-papel-3);
    vertical-align: top;
  }

  .unidades thead th {
    background-color: var(--cor-tinta);
    color: var(--cor-trena);
    font-family: var(--fonte-titulo);
    font-size: var(--texto-m);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .unidades tbody tr:nth-child(odd) {
    background-color: #fffdf6;
  }

  .unidades [data-rotulo]::before {
    content: none;
  }
}
</style>
