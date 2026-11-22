<script setup>
import { computed } from 'vue'
import { useJanela, breakpointAtivo } from '@/composables/useMedidas'
import { useProgressoStore } from '@/stores/progresso'

// LABORATÓRIO FIXO: a "trena" no canto da tela mostra a largura da janela
// e qual breakpoint (min-width) está valendo agora.
const progresso = useProgressoStore()
const { largura } = useJanela()
const bp = computed(() => breakpointAtivo(largura.value))
</script>

<template>
  <aside v-if="progresso.indicadorLigado" class="trena" aria-live="polite" aria-label="Largura atual da janela">
    <span class="trena__px">{{ largura }}px</span>
    <span class="trena__bp">{{ bp.nome }} · {{ bp.descricao }}</span>
    <span v-if="progresso.escalaFonte !== 100" class="trena__fonte">fonte {{ progresso.escalaFonte }}%</span>
  </aside>
</template>

<style scoped>
.trena {
  position: fixed;
  right: var(--esp-2);
  bottom: var(--esp-2);
  z-index: 30;
  display: grid;
  justify-items: end;
  padding: var(--esp-1) var(--esp-3);
  font-family: var(--fonte-codigo);
  font-size: var(--texto-pp);
  line-height: 1.3;
  color: var(--cor-tinta);
  background-color: var(--cor-trena);
  border: var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
  pointer-events: none; /* não atrapalha cliques embaixo dele */
}

.trena__px {
  font-weight: 600;
  font-size: var(--texto-p);
}

.trena__fonte {
  color: var(--cor-marca);
  font-weight: 600;
}

@media (min-width: 40rem) {
  .trena {
    right: var(--esp-4);
    bottom: var(--esp-4);
  }
}
</style>
