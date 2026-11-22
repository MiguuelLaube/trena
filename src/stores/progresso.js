import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { secoes } from '@/data/secoes'

const CHAVE = 'trena:progresso'

// localStorage pode falhar (aba anônima, Safari bloqueado...). Por isso o try/catch.
function lerSalvo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? {}
  } catch {
    return {}
  }
}

/*
  Store do Pinia com o estado que precisa ser compartilhado entre telas:
  - quais seções a pessoa já visitou (o menu mostra um ✓)
  - se o desafio foi resolvido
  - se a "trena" (indicador de largura) está ligada
  - a escala de fonte simulada no laboratório de unidades
*/
export const useProgressoStore = defineStore('progresso', () => {
  const salvo = lerSalvo()

  const visitadas = ref(salvo.visitadas ?? [])
  const desafioResolvido = ref(salvo.desafioResolvido ?? false)
  const indicadorLigado = ref(salvo.indicadorLigado ?? true)

  // Não salvamos a escala de fonte: ao recarregar, o site volta ao normal.
  const escalaFonte = ref(100)

  const totalSecoes = secoes.length
  const porcentagem = computed(() =>
    Math.round((visitadas.value.filter((n) => secoes.some((s) => s.nome === n)).length / totalSecoes) * 100),
  )

  function marcarVisitada(nome) {
    if (nome && !visitadas.value.includes(nome)) visitadas.value.push(nome)
  }

  function foiVisitada(nome) {
    return visitadas.value.includes(nome)
  }

  function alternarIndicador() {
    indicadorLigado.value = !indicadorLigado.value
  }

  function resolverDesafio() {
    desafioResolvido.value = true
  }

  // Muda o font-size do <html> — exatamente o que acontece quando alguém
  // aumenta a fonte padrão nas configurações do navegador.
  function definirEscalaFonte(porcento) {
    escalaFonte.value = porcento
    document.documentElement.style.fontSize = porcento === 100 ? '' : `${porcento}%`
  }

  watch(
    [visitadas, desafioResolvido, indicadorLigado],
    () => {
      try {
        localStorage.setItem(
          CHAVE,
          JSON.stringify({
            visitadas: visitadas.value,
            desafioResolvido: desafioResolvido.value,
            indicadorLigado: indicadorLigado.value,
          }),
        )
      } catch {
        /* sem armazenamento, segue a vida */
      }
    },
    { deep: true },
  )

  return {
    visitadas,
    desafioResolvido,
    indicadorLigado,
    escalaFonte,
    porcentagem,
    marcarVisitada,
    foiVisitada,
    alternarIndicador,
    resolverDesafio,
    definirEscalaFonte,
  }
})
