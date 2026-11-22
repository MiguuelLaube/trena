<script setup>
defineProps({
  // Lista de { titulo, url, nota? }
  fontes: { type: Array, required: true },
})
</script>

<template>
  <section class="fontes" aria-label="Fontes consultadas">
    <h2>Fontes consultadas</h2>
    <ol>
      <li v-for="fonte in fontes" :key="fonte.url">
        <a :href="fonte.url" target="_blank" rel="noopener">{{ fonte.titulo }}</a>
        <span v-if="fonte.nota" class="fontes__nota"> — {{ fonte.nota }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.fontes {
  max-width: var(--largura-texto);
  margin-top: var(--esp-7);
  padding-top: var(--esp-4);
  border-top: var(--borda);
  font-size: var(--texto-p);
}

.fontes h2 {
  margin-top: 0;
  font-size: var(--texto-g);
}

.fontes ol {
  padding-left: var(--esp-5);
}

.fontes a {
  overflow-wrap: anywhere;
}

.fontes__nota {
  color: var(--cor-tinta-suave);
}
</style>
