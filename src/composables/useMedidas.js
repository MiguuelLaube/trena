import { ref, onMounted, onBeforeUnmount } from 'vue'

// Breakpoints do projeto (mesmos valores do tokens.css), em px com fonte padrão de 16px
export const BREAKPOINTS = [
  { nome: 'lg', min: 1024, descricao: 'notebook' },
  { nome: 'md', min: 640, descricao: 'tablet' },
  { nome: 'base', min: 0, descricao: 'celular' },
]

/** Largura e altura atuais da janela, sempre atualizadas. */
export function useJanela() {
  const largura = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
  const altura = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

  function atualizar() {
    largura.value = window.innerWidth
    altura.value = window.innerHeight
  }

  onMounted(() => {
    atualizar()
    window.addEventListener('resize', atualizar, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('resize', atualizar))

  return { largura, altura }
}

/** Qual breakpoint está ativo para uma largura? Usa a mesma regra do CSS: min-width. */
export function breakpointAtivo(largura) {
  // As media queries em rem usam a fonte PADRÃO do navegador (normalmente 16px)
  return BREAKPOINTS.find((b) => largura >= b.min)
}

/**
 * Observa o tamanho de um elemento com ResizeObserver.
 * Útil nos laboratórios, que precisam saber quanto espaço sobrou na tela.
 */
export function useTamanhoElemento(elementoRef) {
  const largura = ref(0)
  const altura = ref(0)
  let observador

  onMounted(() => {
    observador = new ResizeObserver(([entrada]) => {
      const caixa = entrada.contentBoxSize?.[0]
      largura.value = caixa ? caixa.inlineSize : entrada.contentRect.width
      altura.value = caixa ? caixa.blockSize : entrada.contentRect.height
    })
    if (elementoRef.value) observador.observe(elementoRef.value)
  })
  onBeforeUnmount(() => observador?.disconnect())

  return { largura, altura }
}
