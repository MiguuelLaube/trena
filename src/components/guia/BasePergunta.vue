<script setup>
defineProps({
  numero: { type: [String, Number], required: true },
  pergunta: { type: String, required: true },
})
</script>

<template>
  <section class="pergunta" :aria-labelledby="`pergunta-${numero}`">
    <p class="etiqueta">Pergunta-guia {{ numero }}</p>
    <h2 :id="`pergunta-${numero}`" class="pergunta__texto">{{ pergunta }}</h2>
    <div class="pergunta__resposta">
      <p class="pergunta__rotulo">Nossa resposta</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pergunta {
  margin-top: var(--esp-7);
  max-width: var(--largura-texto);
  padding: var(--esp-5) var(--esp-4);
  background-color: var(--cor-papel-2);
  border: var(--borda);
  border-left-width: 0.5rem;
  border-left-color: var(--cor-marca);
  border-radius: var(--raio);
}

.pergunta__texto {
  margin-top: var(--esp-3);
  font-family: var(--fonte-texto);
  font-size: var(--texto-g);
  font-weight: 700;
  line-height: 1.35;
}

.pergunta__resposta {
  margin-top: var(--esp-4);
  padding-top: var(--esp-4);
  border-top: 1px dashed var(--cor-tinta-suave);
}

.pergunta__resposta :deep(> :last-child) {
  margin-bottom: 0;
}

.pergunta__rotulo {
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: var(--texto-g);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cor-marca);
  margin-bottom: var(--esp-2);
}

@media (min-width: 40rem) {
  .pergunta {
    padding: var(--esp-6);
  }
}
</style>
