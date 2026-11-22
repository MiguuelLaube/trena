<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  instrucao: { type: String, default: '' },
  // âncora para linkar direto no lab (ex.: /imagens#lab-pulo)
  ancora: { type: String, default: '' },
})

const id = computed(() => (props.ancora ? `lab-${props.ancora}` : undefined))
</script>

<template>
  <section :id="id" class="lab">
    <header class="lab__topo">
      <span class="lab__selo" aria-hidden="true">LAB</span>
      <div>
        <h3 class="lab__titulo">{{ titulo }}</h3>
        <p v-if="instrucao" class="lab__instrucao">{{ instrucao }}</p>
      </div>
    </header>
    <div class="lab__corpo">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.lab {
  margin: var(--esp-6) 0;
  max-width: var(--largura-conteudo);
  scroll-margin-top: 6rem; /* não fica escondido atrás do menu fixo */
  border: var(--borda);
  border-radius: var(--raio);
  background-color: #fffdf6;
  box-shadow: var(--sombra);
  /* Contêiner com nome: os labs podem usar container queries se quiserem */
  container: lab / inline-size;
}

.lab__topo {
  display: flex;
  gap: var(--esp-3);
  align-items: flex-start;
  padding: var(--esp-3) var(--esp-4);
  background-color: var(--cor-trena);
  border-bottom: var(--borda);
}

.lab__selo {
  flex-shrink: 0;
  font-family: var(--fonte-codigo);
  font-weight: 600;
  font-size: var(--texto-pp);
  padding: 0.2rem 0.45rem;
  background: var(--cor-tinta);
  color: var(--cor-trena);
  border-radius: 0.25rem;
  margin-top: 0.15rem;
}

.lab__titulo {
  margin: 0;
  font-size: var(--texto-g);
}

.lab__instrucao {
  margin: var(--esp-1) 0 0;
  font-size: var(--texto-p);
}

.lab__corpo {
  padding: var(--esp-4);
}

@media (min-width: 40rem) {
  .lab__corpo {
    padding: var(--esp-5);
  }
}
</style>
