<script setup>
import TheMenu from '@/components/layout/TheMenu.vue'
import TheRodape from '@/components/layout/TheRodape.vue'
import TheTrenaIndicador from '@/components/layout/TheTrenaIndicador.vue'
</script>

<template>
  <a class="pular" href="#conteudo">Pular para o conteúdo</a>
  <div class="moldura">
    <TheMenu />
    <div class="moldura__principal">
      <main id="conteudo" tabindex="-1">
        <RouterView />
      </main>
      <TheRodape />
    </div>
  </div>
  <TheTrenaIndicador />
</template>

<style scoped>
.pular {
  position: absolute;
  left: var(--esp-2);
  top: -10rem;
  z-index: 100;
  padding: var(--esp-2) var(--esp-4);
  background: var(--cor-trena);
  border: var(--borda);
}

.pular:focus {
  top: var(--esp-2);
}

/* Celular: tudo em uma coluna, menu no topo */
.moldura {
  display: grid;
  min-height: 100dvh;
}

.moldura__principal {
  display: flex;
  flex-direction: column;
  min-width: 0; /* sem isso, filhos largos (código) estouram o grid */
}

main {
  flex: 1;
  padding: var(--esp-5) var(--esp-4) var(--esp-8);
  outline: none;
}

@media (min-width: 40rem) {
  main {
    padding-inline: var(--esp-6);
  }
}

/* Notebook: menu vira barra lateral fixa */
@media (min-width: 64rem) {
  .moldura {
    grid-template-columns: var(--largura-menu) minmax(0, 1fr);
  }

  main {
    padding: var(--esp-7) var(--esp-7) var(--esp-8);
  }
}
</style>
