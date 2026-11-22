<script setup>
import { ref, onBeforeUnmount } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'

const ATRASO = 2000 // ms — simula uma internet lenta
const IMAGEM = '/img/cidade.jpg'

// Um objeto por painel: sem e com width/height no HTML
const paineis = ref([
  { id: 'sem', titulo: 'SEM width e height', src: '', pulo: null, comMedidas: false },
  { id: 'com', titulo: 'COM width e height', src: '', pulo: null, comMedidas: true },
])
const textos = ref({})
const carregando = ref(false)
let temporizador

function carregar() {
  clearTimeout(temporizador)
  carregando.value = true
  // 1) "Esvazia" as imagens e anota onde o texto está ANTES
  paineis.value.forEach((p) => {
    p.src = ''
    p.pulo = null
  })
  requestAnimationFrame(() => {
    const antes = {}
    paineis.value.forEach((p) => (antes[p.id] = textos.value[p.id]?.offsetTop ?? 0))
    // 2) Depois do atraso, coloca a imagem
    temporizador = setTimeout(() => {
      paineis.value.forEach((p) => (p.src = `${IMAGEM}?t=${Date.now()}`))
      paineis.value.forEach((p) => (p.antes = antes[p.id]))
    }, ATRASO)
  })
}

// 3) Quando a imagem termina de carregar, mede quanto o texto andou
function aoCarregar(painel) {
  requestAnimationFrame(() => {
    const depois = textos.value[painel.id]?.offsetTop ?? 0
    painel.pulo = Math.round(depois - painel.antes)
    if (paineis.value.every((p) => p.pulo !== null)) carregando.value = false
  })
}

onBeforeUnmount(() => clearTimeout(temporizador))
</script>

<template>
  <BaseLab
    titulo="O texto que pula"
    instrucao="Clique no botão: as duas imagens vão demorar 2 segundos para chegar. Fique de olho no parágrafo embaixo de cada uma."
  >
    <button type="button" class="botao" :disabled="carregando" @click="carregar">
      {{ carregando ? 'Carregando devagar…' : 'Carregar com atraso de 2s' }}
    </button>

    <div class="pulo">
      <figure v-for="p in paineis" :key="p.id" class="pulo__painel" :class="`pulo__painel--${p.id}`">
        <figcaption class="pulo__titulo">
          <code v-if="p.comMedidas">&lt;img width="1200" height="750"&gt;</code>
          <code v-else>&lt;img&gt;</code>
          <span>{{ p.titulo }}</span>
        </figcaption>
        <!-- O atributo src só aparece depois do atraso -->
        <img
          class="pulo__img"
          :src="p.src || undefined"
          :alt="p.src ? 'Ilustração de prédios coloridos sobre uma trena' : ''"
          :width="p.comMedidas ? 1200 : undefined"
          :height="p.comMedidas ? 750 : undefined"
          @load="aoCarregar(p)"
        />
        <p :ref="(el) => (textos[p.id] = el)" class="pulo__texto">
          Eu sou o parágrafo que vem depois da imagem. Estava aqui quietinho, sendo lido…
        </p>
        <p class="pulo__medida" aria-live="polite">
          <template v-if="p.pulo === null">Deslocamento do texto: —</template>
          <template v-else>
            O texto andou <strong class="saida">{{ p.pulo }}px</strong>
            {{ p.pulo > 0 ? '→ isso é layout shift (CLS)!' : '→ espaço já estava reservado 👍' }}
          </template>
        </p>
      </figure>
    </div>
  </BaseLab>
</template>

<style scoped>
.pulo {
  display: grid;
  gap: var(--esp-4);
  margin-top: var(--esp-4);
}

.pulo__painel {
  position: relative; /* offsetTop do texto passa a ser medido a partir do PRÓPRIO painel */
  margin: 0;
  padding: var(--esp-3);
  border: var(--borda);
  border-radius: var(--raio);
  background-color: var(--cor-papel);
  min-width: 0;
}

.pulo__painel--sem {
  border-color: var(--cor-marca);
}

.pulo__painel--com {
  border-color: var(--cor-ok);
}

.pulo__titulo {
  display: grid;
  gap: var(--esp-1);
  margin-bottom: var(--esp-3);
  font-weight: 700;
  font-size: var(--texto-p);
}

.pulo__img {
  display: block;
  max-width: 100%;
  height: auto; /* com width/height no HTML, o navegador já sabe a proporção 1200:750 */
  background-color: var(--cor-papel-3);
}

.pulo__texto {
  margin: var(--esp-3) 0;
  padding: var(--esp-2);
  background-color: var(--cor-trena-clara);
  border-left: 0.25rem solid var(--cor-tinta);
}

.pulo__medida {
  margin: 0;
  font-size: var(--texto-p);
}

@container lab (min-width: 36rem) {
  .pulo {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
</style>
