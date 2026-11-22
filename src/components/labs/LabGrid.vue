<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'
import BaseMiniatura from '@/components/guia/BaseMiniatura.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'
import { useProgressoStore } from '@/stores/progresso'

const progresso = useProgressoStore()

const largura = ref(420) // largura do contêiner, em px
const minimoRem = ref(14) // o valor dentro do minmax()
const gapRem = ref(1)
const quantidade = ref(6)

const grade = ref(null)
const colunasReais = ref(1)
const fonteRaiz = ref(16)

// Conta de quantas colunas cabem: N·min + (N−1)·gap ≤ largura
const minimoPx = computed(() => minimoRem.value * fonteRaiz.value)
const gapPx = computed(() => gapRem.value * fonteRaiz.value)
const limiar = (n) => n * minimoPx.value + (n - 1) * gapPx.value
const proximos = computed(() => [2, 3, 4].map((n) => ({ n, px: limiar(n) })))

let observador
async function contarColunas() {
  await nextTick()
  fonteRaiz.value = parseFloat(getComputedStyle(document.documentElement).fontSize)
  if (!grade.value) return
  // Perguntamos ao navegador quantas colunas ele REALMENTE montou
  const colunas = getComputedStyle(grade.value).gridTemplateColumns.split(' ').filter(Boolean)
  colunasReais.value = colunas.length
}

watch([largura, minimoRem, gapRem, quantidade, () => progresso.escalaFonte], contarColunas)
onMounted(() => {
  contarColunas()
  observador = new ResizeObserver(contarColunas)
  if (grade.value) observador.observe(grade.value)
})
onBeforeUnmount(() => observador?.disconnect())

const cssGerado = computed(
  () => `.cards {
  display: grid;
  /* cada card tem no mínimo ${minimoRem.value}rem (${minimoPx.value}px)
     e divide o que sobrar (1fr) */
  grid-template-columns: repeat(auto-fit, minmax(${minimoRem.value}rem, 1fr));
  gap: ${gapRem.value}rem; /* ${gapPx.value}px */
}`,
)
</script>

<template>
  <BaseLab
    titulo="Régua do Grid: auto-fit + minmax()"
    instrucao="Arraste a largura do contêiner e descubra em que ponto os cards mudam de coluna. Nenhuma media query envolvida!"
  >
    <div class="grid-lab__controles">
      <label class="campo grid-lab__largura">
        Largura do contêiner: <span class="saida">{{ largura }}px</span>
        <input v-model.number="largura" type="range" min="240" max="1200" step="1" />
      </label>
      <label class="campo">
        Mínimo de cada card
        <select v-model.number="minimoRem">
          <option v-for="v in [8, 10, 12, 14, 16, 20]" :key="v" :value="v">{{ v }}rem</option>
        </select>
      </label>
      <label class="campo">
        gap
        <select v-model.number="gapRem">
          <option v-for="v in [0, 0.5, 1, 1.5, 2]" :key="v" :value="v">{{ v }}rem</option>
        </select>
      </label>
      <label class="campo">
        Cards
        <select v-model.number="quantidade">
          <option v-for="v in [3, 4, 6, 8]" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
    </div>

    <p class="grid-lab__placar" aria-live="polite">
      Colunas agora: <strong class="saida">{{ colunasReais }}</strong>
    </p>

    <ul class="grid-lab__limiares">
      <li v-for="p in proximos" :key="p.n" :class="{ atingido: largura >= p.px }">
        {{ p.n }} colunas a partir de <strong>{{ p.px }}px</strong>
        <small>({{ p.n }} × {{ minimoPx }} + {{ p.n - 1 }} × {{ gapPx }})</small>
      </li>
    </ul>

    <div class="grid-lab__palco">
      <BaseMiniatura :largura="largura">
        <div class="grid-lab__regua" aria-hidden="true"></div>
        <div
          ref="grade"
          class="grid-lab__grade"
          :style="{
            gridTemplateColumns: `repeat(auto-fit, minmax(${minimoRem}rem, 1fr))`,
            gap: `${gapRem}rem`,
          }"
        >
          <div v-for="n in quantidade" :key="n" class="grid-lab__card">Card {{ n }}</div>
        </div>
      </BaseMiniatura>
    </div>
    <p class="grid-lab__nota">
      Se o contêiner for mais largo que a sua tela, ele aparece encolhido (com <code>transform: scale</code>) — as medidas
      continuam as mesmas.
    </p>
    <BaseCodigo :codigo="cssGerado" titulo="CSS deste grid" />
  </BaseLab>
</template>

<style scoped>
.grid-lab__controles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--esp-3);
}

.grid-lab__largura {
  grid-column: 1 / -1;
}

.grid-lab__placar {
  margin: var(--esp-4) 0 var(--esp-2);
  font-size: var(--texto-g);
}

.grid-lab__limiares {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--esp-4);
  font-size: var(--texto-p);
}

.grid-lab__limiares li {
  padding-left: 1.5rem;
  position: relative;
}

.grid-lab__limiares li::before {
  content: '○';
  position: absolute;
  left: 0;
}

.grid-lab__limiares li.atingido::before {
  content: '●';
  color: var(--cor-marca);
}

.grid-lab__limiares small {
  color: var(--cor-tinta-suave);
}

.grid-lab__palco {
  padding: var(--esp-2);
  background-color: var(--cor-papel-2);
  border: 1px dashed var(--cor-tinta-suave);
}

.grid-lab__regua {
  height: 10px;
  background-color: var(--cor-trena);
  background-image: linear-gradient(90deg, var(--cor-tinta) 1px, transparent 1px);
  background-size: 50px 100%;
  border: 1px solid var(--cor-tinta);
  margin-bottom: 6px;
}

.grid-lab__grade {
  display: grid;
  outline: 2px solid var(--cor-marca);
}

.grid-lab__card {
  min-height: 4.5rem;
  display: grid;
  place-items: center;
  font-weight: 700;
  background-color: #fffdf6;
  border: var(--borda);
  border-radius: var(--raio);
}

.grid-lab__nota {
  margin: var(--esp-2) 0 0;
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
}
</style>
