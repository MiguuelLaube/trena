<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'

/*
  Medidor AO VIVO usando a API PerformanceObserver do próprio navegador.
  Os números são aproximados (o Google usa a biblioteca web-vitals, que tem
  regras extras), mas mostram bem a ideia de cada métrica.
*/
const suportadas = typeof PerformanceObserver !== 'undefined' ? PerformanceObserver.supportedEntryTypes ?? [] : []

const lcp = ref(null) // ms
const cls = ref(0) // número sem unidade
const inp = ref(null) // ms (maior interação vista)
const banners = ref([])
const observadores = []

function observar(tipo, aoReceber, extra = {}) {
  if (!suportadas.includes(tipo)) return
  const obs = new PerformanceObserver((lista) => lista.getEntries().forEach(aoReceber))
  obs.observe({ type: tipo, buffered: true, ...extra })
  observadores.push(obs)
}

onMounted(() => {
  observar('largest-contentful-paint', (e) => (lcp.value = Math.round(e.startTime)))
  observar('layout-shift', (e) => {
    // Pulos logo depois de um clique/tecla não contam (a pessoa "pediu" a mudança)
    if (!e.hadRecentInput) cls.value = Math.round((cls.value + e.value) * 1000) / 1000
  })
  observar(
    'event',
    (e) => {
      if (e.interactionId) inp.value = Math.max(inp.value ?? 0, Math.round(e.duration))
    },
    { durationThreshold: 16 },
  )
})
onBeforeUnmount(() => observadores.forEach((o) => o.disconnect()))

const metricas = computed(() => [
  {
    sigla: 'LCP',
    nome: 'Largest Contentful Paint',
    pergunta: 'Quanto tempo até o maior elemento aparecer?',
    valor: lcp.value === null ? null : `${lcp.value} ms`,
    bom: lcp.value !== null && lcp.value <= 2500,
    meta: 'bom: até 2,5 s',
    suportado: suportadas.includes('largest-contentful-paint'),
  },
  {
    sigla: 'INP',
    nome: 'Interaction to Next Paint',
    pergunta: 'Depois de um clique, quanto demora para a tela responder?',
    valor: inp.value === null ? null : `${inp.value} ms`,
    bom: inp.value !== null && inp.value <= 200,
    meta: 'bom: até 200 ms',
    suportado: suportadas.includes('event'),
  },
  {
    sigla: 'CLS',
    nome: 'Cumulative Layout Shift',
    pergunta: 'Quanto as coisas pularam de lugar sozinhas?',
    valor: cls.value.toFixed(3),
    bom: cls.value <= 0.1,
    meta: 'bom: até 0,1',
    suportado: suportadas.includes('layout-shift'),
  },
])

// Trava a thread principal de propósito → INP ruim
function cliqueLento() {
  const fim = performance.now() + 350
  while (performance.now() < fim) {
    /* travando… */
  }
}

// Insere um aviso no topo DEPOIS de 1s (sem input recente → conta no CLS)
function provocarPulo() {
  setTimeout(() => banners.value.unshift(Date.now()), 1000)
}
</script>

<template>
  <BaseLab
    titulo="Medidor de Core Web Vitals (ao vivo)"
    instrucao="Estes números são desta página, agora. Use os botões para piorar o INP e o CLS de propósito."
  >
    <div v-for="b in banners" :key="b" class="vitals__banner">
      📢 Aviso que apareceu do nada e empurrou tudo para baixo!
    </div>

    <div class="vitals__cards">
      <article v-for="m in metricas" :key="m.sigla" class="vitals__card" :class="{ 'vitals__card--ruim': m.valor !== null && !m.bom }">
        <p class="vitals__sigla">{{ m.sigla }}</p>
        <p class="vitals__nome">{{ m.nome }}</p>
        <p class="vitals__valor">
          <template v-if="!m.suportado">não suportado neste navegador</template>
          <template v-else>{{ m.valor ?? 'interaja…' }}</template>
        </p>
        <p class="vitals__pergunta">{{ m.pergunta }}</p>
        <p class="vitals__meta">{{ m.meta }}</p>
      </article>
    </div>

    <div class="vitals__acoes">
      <button type="button" class="botao botao--claro" @click="() => {}">Clique rápido</button>
      <button type="button" class="botao" @click="cliqueLento">Clique lento (trava 350 ms)</button>
      <button type="button" class="botao" @click="provocarPulo">Provocar um pulo em 1s</button>
    </div>
    <p class="vitals__nota">
      O LCP é medido no primeiro carregamento da página (recarregue com F5 para ver o valor desta seção). As métricas
      funcionam melhor no Chrome/Edge.
    </p>
  </BaseLab>
</template>

<style scoped>
.vitals__banner {
  margin-bottom: var(--esp-3);
  padding: var(--esp-3);
  background-color: var(--cor-marca);
  color: #fff;
  font-weight: 700;
  border-radius: var(--raio);
}

.vitals__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: var(--esp-3);
}

.vitals__card {
  padding: var(--esp-3) var(--esp-4);
  border: var(--borda);
  border-top: 0.5rem solid var(--cor-ok);
  border-radius: var(--raio);
  background-color: var(--cor-papel);
}

.vitals__card--ruim {
  border-top-color: var(--cor-marca);
  background-color: var(--cor-erro-clara);
}

.vitals__card p {
  margin: 0;
}

.vitals__sigla {
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: var(--texto-gg);
  line-height: 1;
}

.vitals__nome,
.vitals__meta {
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
}

.vitals__valor {
  margin: var(--esp-2) 0 !important;
  font-family: var(--fonte-codigo);
  font-weight: 600;
  font-size: var(--texto-g);
}

.vitals__pergunta {
  font-size: var(--texto-p);
  margin-bottom: var(--esp-1) !important;
}

.vitals__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-3);
  margin: var(--esp-4) 0 var(--esp-2);
}

.vitals__nota {
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
  margin: 0;
}
</style>
