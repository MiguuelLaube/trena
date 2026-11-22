<script setup>
import { ref, computed } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'
import BaseCodigo from '@/components/guia/BaseCodigo.vue'

const direcao = ref('row')
const justify = ref('flex-start')
const align = ref('stretch')
const wrap = ref('nowrap')
const gap = ref(0.5)
const quantidade = ref(4)

const opcoes = {
  direcao: ['row', 'column'],
  justify: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  align: ['stretch', 'flex-start', 'center', 'flex-end'],
  wrap: ['nowrap', 'wrap'],
}

// Itens com alturas diferentes deixam o align-items bem visível
const alturas = [3, 4.5, 2.5, 5, 3.5, 4, 2.75, 4.25]

const css = computed(
  () => `.caixa {
  display: flex;
  flex-direction: ${direcao.value};   /* eixo principal */
  justify-content: ${justify.value}; /* distribui no eixo principal */
  align-items: ${align.value};       /* alinha no eixo cruzado */
  flex-wrap: ${wrap.value};          /* pode quebrar linha? */
  gap: ${gap.value}rem;              /* espaço entre itens */
}`,
)
</script>

<template>
  <BaseLab
    ancora="flex"
    titulo="Painel do Flexbox"
    instrucao="Mude as propriedades e veja os itens se reorganizarem. O CSS gerado aparece embaixo."
  >
    <div class="flex-lab__controles">
      <label class="campo">
        flex-direction
        <select v-model="direcao">
          <option v-for="o in opcoes.direcao" :key="o">{{ o }}</option>
        </select>
      </label>
      <label class="campo">
        justify-content
        <select v-model="justify">
          <option v-for="o in opcoes.justify" :key="o">{{ o }}</option>
        </select>
      </label>
      <label class="campo">
        align-items
        <select v-model="align">
          <option v-for="o in opcoes.align" :key="o">{{ o }}</option>
        </select>
      </label>
      <label class="campo">
        flex-wrap
        <select v-model="wrap">
          <option v-for="o in opcoes.wrap" :key="o">{{ o }}</option>
        </select>
      </label>
      <label class="campo">
        gap: {{ gap }}rem
        <input v-model.number="gap" type="range" min="0" max="2" step="0.25" />
      </label>
      <label class="campo">
        Itens: {{ quantidade }}
        <input v-model.number="quantidade" type="range" min="2" max="8" step="1" />
      </label>
    </div>

    <div
      class="flex-lab__palco"
      :style="{
        flexDirection: direcao,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        gap: gap + 'rem',
      }"
    >
      <div
        v-for="n in quantidade"
        :key="n"
        class="flex-lab__item"
        :style="{ minHeight: align === 'stretch' ? null : alturas[n - 1] + 'rem' }"
      >
        {{ n }}
      </div>
    </div>

    <BaseCodigo :codigo="css" titulo="CSS gerado" />
  </BaseLab>
</template>

<style scoped>
.flex-lab__controles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: var(--esp-3);
  margin-bottom: var(--esp-4);
}

.flex-lab__palco {
  display: flex;
  min-height: 14rem;
  padding: var(--esp-2);
  background-color: var(--cor-papel-2);
  background-image:
    linear-gradient(var(--cor-papel-3) 1px, transparent 1px),
    linear-gradient(90deg, var(--cor-papel-3) 1px, transparent 1px);
  background-size: 1rem 1rem;
  border: var(--borda);
  border-radius: var(--raio);
  overflow: hidden;
}

.flex-lab__item {
  display: grid;
  place-items: center;
  width: 3.5rem;
  min-width: 2rem;
  padding: var(--esp-2);
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: var(--texto-g);
  background-color: var(--cor-trena);
  border: var(--borda);
  border-radius: var(--raio);
}

.flex-lab__item:nth-child(even) {
  background-color: #fffdf6;
}
</style>
