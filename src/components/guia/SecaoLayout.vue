<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { secoes } from '@/data/secoes'

defineProps({
  resumo: { type: String, default: '' },
})

const rota = useRoute()
const indice = computed(() => secoes.findIndex((s) => s.nome === rota.name))
const atual = computed(() => secoes[indice.value])
const anterior = computed(() => secoes[indice.value - 1])
const proxima = computed(() => secoes[indice.value + 1])
</script>

<template>
  <article class="secao">
    <header class="secao__topo">
      <p class="secao__numero" aria-hidden="true">{{ atual?.numero }}</p>
      <div>
        <p class="etiqueta">Seção {{ atual?.numero }} de {{ secoes.length }}</p>
        <h1 class="secao__titulo">{{ atual?.titulo }}</h1>
        <p v-if="resumo" class="secao__resumo">{{ resumo }}</p>
      </div>
    </header>

    <slot />

    <nav class="secao__nav" aria-label="Navegação entre seções">
      <RouterLink v-if="anterior" :to="anterior.caminho" class="secao__vizinha">
        <span class="secao__dir">← Anterior</span>
        <span>{{ anterior.titulo }}</span>
      </RouterLink>
      <RouterLink v-else to="/" class="secao__vizinha">
        <span class="secao__dir">← Voltar</span>
        <span>Início</span>
      </RouterLink>
      <RouterLink v-if="proxima" :to="proxima.caminho" class="secao__vizinha secao__vizinha--prox">
        <span class="secao__dir">Próxima →</span>
        <span>{{ proxima.titulo }}</span>
      </RouterLink>
    </nav>
  </article>
</template>

<style scoped>
.secao__topo {
  display: grid;
  gap: var(--esp-2);
  margin-bottom: var(--esp-6);
  max-width: var(--largura-conteudo);
}

.secao__numero {
  margin: 0;
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: 4.5rem;
  line-height: 0.8;
  color: var(--cor-trena);
  -webkit-text-stroke: var(--borda-largura) var(--cor-tinta);
}

.secao__titulo {
  margin-top: var(--esp-3);
  font-size: var(--texto-titulo);
  text-transform: uppercase;
}

.secao__resumo {
  font-size: var(--texto-g);
  color: var(--cor-tinta-suave);
  max-width: var(--largura-texto);
  margin-bottom: 0;
}

.secao :deep(.leitura) > p,
.secao :deep(.leitura) > ul,
.secao :deep(.leitura) > ol {
  max-width: var(--largura-texto);
}

.secao__nav {
  display: grid;
  gap: var(--esp-3);
  margin-top: var(--esp-8);
  max-width: var(--largura-conteudo);
}

.secao__vizinha {
  display: grid;
  gap: var(--esp-1);
  padding: var(--esp-3) var(--esp-4);
  border: var(--borda);
  border-radius: var(--raio);
  text-decoration: none;
  font-weight: 700;
  background-color: var(--cor-papel);
}

.secao__vizinha:hover {
  background-color: var(--cor-trena);
}

.secao__dir {
  font-family: var(--fonte-codigo);
  font-size: var(--texto-pp);
  color: var(--cor-marca);
}

@media (min-width: 40rem) {
  .secao__topo {
    grid-template-columns: auto 1fr;
    gap: var(--esp-5);
    align-items: start;
  }

  .secao__numero {
    font-size: 7rem;
  }

  .secao__nav {
    grid-template-columns: 1fr 1fr;
  }

  .secao__vizinha--prox {
    grid-column: 2;
    text-align: right;
  }
}
</style>
