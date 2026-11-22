<script setup>
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import BasePergunta from '@/components/guia/BasePergunta.vue'
import BaseFontes from '@/components/guia/BaseFontes.vue'
import LabVForKey from '@/components/labs/LabVForKey.vue'
import LabWebVitals from '@/components/labs/LabWebVitals.vue'

const arvore = `src/
├── assets/            # CSS global: tokens.css (variáveis) e base.css
├── components/
│   ├── layout/        # peças únicas da página → prefixo "The"
│   │   ├── TheMenu.vue
│   │   └── TheTrenaIndicador.vue
│   ├── guia/          # peças reutilizáveis "burras" → prefixo "Base"
│   │   ├── BaseCodigo.vue
│   │   └── BaseLab.vue
│   └── labs/          # um componente por laboratório
│       └── LabGrid.vue
├── composables/       # lógica reaproveitável (useJanela, useTamanhoElemento)
├── data/              # dados fixos (lista de seções)
├── router/            # rotas — cada tela carregada sob demanda
├── services/          # conversa com APIs (fetch fica aqui, não no componente)
├── stores/            # estado global com Pinia
└── views/             # uma tela por rota → sufixo "View"`

// (montamos a tag em pedaços para o parser do .vue não confundir com o <script> real)
const TAG = 'script'
const codigoProps = `<${TAG} setup>
// Props TIPADAS: se alguém passar o tipo errado, o Vue avisa no console
const props = defineProps({
  animal: { type: Object, required: true },
  destaque: { type: Boolean, default: false },
})

// Eventos declarados: quem lê o componente sabe o que ele "fala" para o pai
const emit = defineEmits(['remover'])
</${TAG}>

<template>
  <li :class="{ destaque }">
    {{ animal.nome }}
    <button @click="emit('remover', animal.id)">Remover</button>
  </li>
</template>

<!-- No componente pai: -->
<!-- :key com um ID ÚNICO e ESTÁVEL (nunca o índice!) -->
<CardAnimal
  v-for="animal in animais"
  :key="animal.id"
  :animal="animal"
  @remover="removerAnimal"
/>`

const codigoTokens = `/* tokens.css — o "dicionário" visual do projeto */
:root {
  --cor-trena: #f2c230;
  --cor-tinta: #1d1b16;
  --esp-4: 1rem;
  --raio: 0.375rem;
}

/* Em qualquer componente: nada de cor "solta" */
.botao {
  background-color: var(--cor-trena);
  padding: var(--esp-4);
  border-radius: var(--raio);
}`

const codigoRotas = `// router/index.js
import HomeView from '@/views/HomeView.vue' // a home vem junto (é a 1ª tela)

const routes = [
  { path: '/', component: HomeView },
  // () => import(...) = carregamento SOB DEMANDA:
  // o Vite gera um .js separado, baixado só quando a rota é aberta
  { path: '/imagens', component: () => import('@/views/ImagensView.vue') },
  { path: '/desafio', component: () => import('@/views/DesafioView.vue') },
]`

const fontes = [
  { titulo: 'Vue.js — Style Guide (nomes de componentes, props)', url: 'https://vuejs.org/style-guide/' },
  {
    titulo: 'Vue.js — List Rendering: Maintaining State with key',
    url: 'https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key',
  },
  { titulo: 'Vue.js — Props', url: 'https://vuejs.org/guide/components/props.html' },
  { titulo: 'Vue Router — Lazy Loading Routes', url: 'https://router.vuejs.org/guide/advanced/lazy-loading.html' },
  { titulo: 'web.dev — Web Vitals', url: 'https://web.dev/articles/vitals' },
  {
    titulo: 'MDN — Using CSS custom properties (variables)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
  },
]
</script>

<template>
  <SecaoLayout resumo="Responsividade também é organização. Um projeto arrumado é mais fácil de deixar rápido, acessível e sem bugs.">
    <div class="leitura">
      <h2>Estrutura de pastas</h2>
      <p>
        Cada coisa no seu lugar: telas em <code>views/</code>, peças em <code>components/</code>, estado global em
        <code>stores/</code>, chamadas de API em <code>services/</code>. Esta é a estrutura deste próprio guia:
      </p>
    </div>
    <BaseCodigo :codigo="arvore" linguagem="txt" titulo="estrutura do projeto Trena" />

    <div class="leitura">
      <h2>Nomes de componentes</h2>
      <ul>
        <li><strong>PascalCase e sempre com duas palavras ou mais</strong>: <code>CardAnimal.vue</code>, nunca <code>card.vue</code> (evita conflito com tags HTML como <code>&lt;header&gt;</code>).</li>
        <li><strong><code>Base</code></strong> para componentes genéricos reutilizáveis (<code>BaseBotao</code>, <code>BaseCodigo</code>).</li>
        <li><strong><code>The</code></strong> para componentes que aparecem uma vez só (<code>TheMenu</code>, <code>TheRodape</code>).</li>
        <li><strong><code>…View</code></strong> para telas ligadas a uma rota.</li>
      </ul>

      <h2>Props tipadas, eventos e <code>:key</code></h2>
      <p>
        Dados descem do pai para o filho por <strong>props</strong> (com tipo declarado) e o filho avisa o pai com
        <strong>eventos</strong>. Em listas com <code>v-for</code>, o <code>:key</code> dá uma "identidade" a cada item
        para o Vue saber quem é quem quando a lista muda.
      </p>
    </div>
    <BaseCodigo :codigo="codigoProps" linguagem="vue" titulo="CardAnimal.vue + pai" />

    <LabVForKey />

    <div class="leitura">
      <h2>Variáveis CSS como design tokens</h2>
      <p>
        <em>Design tokens</em> são as decisões visuais do projeto (cores, espaçamentos, fontes) guardadas com nome em
        <code>:root</code>. Se a cor principal mudar, muda num lugar só. Também garantem consistência: todo mundo usa o
        mesmo <code>--esp-4</code> em vez de inventar <code>15px</code>, <code>17px</code>…
      </p>
    </div>
    <BaseCodigo :codigo="codigoTokens" titulo="tokens.css" />

    <div class="leitura">
      <h2>Core Web Vitals</h2>
      <p>São três métricas que o Google usa para medir a experiência real de quem usa o site:</p>
      <ul>
        <li><strong>LCP</strong> (Largest Contentful Paint) — <em>carregamento</em>: quanto tempo até o maior elemento visível aparecer. Bom: até 2,5 s.</li>
        <li><strong>INP</strong> (Interaction to Next Paint) — <em>resposta</em>: depois de um clique ou toque, quanto demora para a tela reagir. Bom: até 200 ms.</li>
        <li><strong>CLS</strong> (Cumulative Layout Shift) — <em>estabilidade</em>: o quanto as coisas pulam de lugar. Bom: até 0,1.</li>
      </ul>
    </div>
    <LabWebVitals />

    <div class="leitura">
      <h2>Rotas carregadas sob demanda</h2>
      <p>
        Se todas as telas vierem num único arquivo JavaScript, a primeira visita baixa o site inteiro — e isso piora o
        LCP. Com <code>() =&gt; import()</code>, cada tela vira um arquivo separado, baixado só quando alguém abre a
        rota. Abra o DevTools → aba Network e navegue pelo menu: você vai ver os arquivos <code>.js</code> chegando um
        por um.
      </p>
    </div>
    <BaseCodigo :codigo="codigoRotas" linguagem="js" titulo="router/index.js" />

    <BasePergunta
      numero="5"
      pergunta="Uma lista de animais é exibida com v-for, sem :key, e cada item tem um campo de texto. A pessoa digita algo no campo do segundo animal, e em seguida o primeiro animal é removido da lista. O que pode acontecer com o texto digitado, e por quê?"
    >
      <p>
        <strong>O texto pode "pular" para o animal errado.</strong> Exemplo: lista Capivara, Tamanduá, Arara. A pessoa
        digita "Tatá" no campo do Tamanduá (2º) e a Capivara (1º) é removida. Em vez de "Tatá" continuar ao lado do
        Tamanduá, ele aparece ao lado da <strong>Arara</strong>.
      </p>
      <p>
        Por quê? Sem <code>:key</code>, o Vue não sabe a identidade de cada item; só sabe a <strong>posição</strong>.
        Para ser rápido, ele usa a estratégia de <em>reaproveitar no lugar</em> ("in-place patch"): em vez de apagar o
        1º elemento da tela, ele reaproveita os elementos que já existem e só troca os textos. A lista tinha 3
        <code>&lt;li&gt;</code> e agora tem 2: o 1º recebe o nome "Tamanduá", o 2º recebe "Arara" e o 3º é apagado. Só
        que o que a pessoa digitou não está nos dados do Vue — está guardado <strong>no elemento
        <code>&lt;input&gt;</code></strong> (estado do DOM). E esse input continuou na 2ª posição, que agora mostra a
        Arara.
      </p>
      <p>
        Com <code>:key="animal.id"</code>, cada elemento fica "amarrado" ao seu animal. O Vue entende que quem saiu foi
        a Capivara, remove exatamente o elemento dela e o input do Tamanduá vai junto com ele. Por isso a regra:
        <strong>sempre <code>:key</code> com um ID único e estável</strong> — e não o índice, que tem o mesmo problema.
        Faça o teste no laboratório acima.
      </p>
    </BasePergunta>

    <BaseFontes :fontes="fontes" />
  </SecaoLayout>
</template>
