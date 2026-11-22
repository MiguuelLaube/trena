<script setup>
import { computed, ref } from 'vue'
import { useTamanhoElemento } from '@/composables/useMedidas'

/*
  Mostra o conteúdo do slot montado numa largura FIXA (em px) e,
  se não couber na tela, encolhe tudo com transform: scale().
  Assim dá para simular "um contêiner de 900px" num celular de 360px
  sem criar rolagem horizontal.
*/
const props = defineProps({
  largura: { type: Number, required: true },
})

const caixa = ref(null)
const interno = ref(null)
const { largura: disponivel } = useTamanhoElemento(caixa)
const { altura: alturaInterna } = useTamanhoElemento(interno)

const escala = computed(() => (disponivel.value ? Math.min(1, disponivel.value / props.largura) : 1))

defineExpose({ escala })
</script>

<template>
  <div ref="caixa" class="miniatura" :style="{ height: alturaInterna * escala + 'px' }">
    <div
      ref="interno"
      class="miniatura__interno"
      :style="{ width: largura + 'px', transform: `scale(${escala})` }"
    >
      <slot :escala="escala" />
    </div>
  </div>
</template>

<style scoped>
.miniatura {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.miniatura__interno {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}
</style>
