<script setup>
import { computed, ref } from 'vue'

// Props tipadas: o Vue avisa no console se alguém passar o tipo errado
const props = defineProps({
  codigo: { type: String, required: true },
  linguagem: { type: String, default: 'css' },
  titulo: { type: String, default: '' },
})

const copiado = ref(false)

// Escapa o HTML e pinta os comentários de outra cor.
// (O código é nosso, então usar v-html aqui é seguro.)
const codigoFormatado = computed(() => {
  const escapado = props.codigo
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escapado.replace(
    /(\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;|(?:^|(?<=\s))\/\/.*$)/gm,
    '<span class="comentario">$1</span>',
  )
})

async function copiar() {
  try {
    await navigator.clipboard.writeText(props.codigo.trim())
    copiado.value = true
    setTimeout(() => (copiado.value = false), 1500)
  } catch {
    copiado.value = false
  }
}
</script>

<template>
  <figure class="codigo">
    <figcaption class="codigo__topo">
      <span class="codigo__titulo">{{ titulo || linguagem.toUpperCase() }}</span>
      <button type="button" class="codigo__copiar" @click="copiar">
        {{ copiado ? 'Copiado!' : 'Copiar' }}
      </button>
    </figcaption>
    <!-- tabindex="0" deixa rolar o código pelo teclado quando a linha é comprida -->
    <pre tabindex="0"><code v-html="codigoFormatado"></code></pre>
  </figure>
</template>

<style scoped>
.codigo {
  margin: var(--esp-4) 0 var(--esp-5);
  max-width: var(--largura-texto);
  border: var(--borda);
  border-radius: var(--raio);
  background-color: var(--cor-codigo-fundo);
  overflow: hidden;
}

.codigo__topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--esp-2);
  padding: var(--esp-1) var(--esp-1) var(--esp-1) var(--esp-3);
  background-color: var(--cor-trena);
  border-bottom: var(--borda);
  font-family: var(--fonte-codigo);
  font-size: var(--texto-pp);
  font-weight: 600;
}

.codigo__titulo {
  min-width: 0;
  overflow-wrap: anywhere;
}

.codigo__copiar {
  flex-shrink: 0;
  font: inherit;
  padding: var(--esp-1) var(--esp-3);
  min-height: 2rem;
  background: var(--cor-papel);
  border: var(--borda);
  border-radius: 0.25rem;
  cursor: pointer;
}

pre {
  margin: 0;
  padding: var(--esp-4);
  /* A rolagem fica DENTRO do bloco: a página nunca rola para o lado */
  overflow-x: auto;
  font-size: var(--texto-pp);
  line-height: 1.65;
}

code {
  font-family: var(--fonte-codigo);
  font-size: inherit;
  background: none;
  padding: 0;
  color: var(--cor-codigo-texto);
  overflow-wrap: normal;
}

code :deep(.comentario) {
  color: var(--cor-codigo-comentario);
  font-style: italic;
}

@media (min-width: 40rem) {
  pre {
    font-size: var(--texto-p);
  }
}
</style>
