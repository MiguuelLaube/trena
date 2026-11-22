<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'
import { useProgressoStore } from '@/stores/progresso'

const progresso = useProgressoStore()

const valor = ref(1.5)
const unidade = ref('rem')
const fontePai = ref(20) // px — base do em e do ch
const larguraPai = ref(300) // px — base do %

const unidades = ['px', 'rem', 'em', '%', 'vw', 'vh', 'dvh', 'ch']
const verticais = ['vh', 'dvh']

const resultado = ref(0)
const fonteRaiz = ref(16)
const sonda = ref(null)

/*
  Em vez de fazer a conta "na mão", a gente pede para o PRÓPRIO navegador:
  aplicamos o valor num elemento escondido e medimos com getBoundingClientRect().
  Assim o resultado é exatamente o que o CSS faria.
*/
async function medir() {
  await nextTick()
  const el = sonda.value
  if (!el) return
  const css = `${valor.value}${unidade.value}`
  const vertical = verticais.includes(unidade.value)
  el.style.width = vertical ? '0' : css
  el.style.height = vertical ? css : '0'
  const caixa = el.getBoundingClientRect()
  resultado.value = Math.round((vertical ? caixa.height : caixa.width) * 100) / 100
  fonteRaiz.value = parseFloat(getComputedStyle(document.documentElement).fontSize)
}

const explicacoes = {
  px: 'px é absoluto: 1px de CSS é sempre 1px de CSS, não importa a fonte escolhida pela pessoa.',
  rem: 'rem = "root em": multiplica pela fonte do <html> (a raiz).',
  em: 'em multiplica pela fonte do PRÓPRIO elemento (que normalmente vem do pai).',
  '%': 'Em width, % é relativo à largura do elemento pai.',
  vw: '1vw = 1% da largura da janela (viewport).',
  vh: '1vh = 1% da altura da janela no tamanho "grande" (com as barras do navegador recolhidas).',
  dvh: '1dvh = 1% da altura dinâmica: muda quando a barra de endereço do celular aparece ou some.',
  ch: '1ch = largura do caractere "0" na fonte atual. Ótimo para limitar linhas de texto.',
}

watch([valor, unidade, fontePai, larguraPai, () => progresso.escalaFonte], medir)
onMounted(() => {
  medir()
  window.addEventListener('resize', medir, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', medir))

function mudarEscala(evento) {
  progresso.definirEscalaFonte(Number(evento.target.value))
}
</script>

<template>
  <BaseLab
    titulo="Conversor de unidades → px"
    instrucao="Escolha um valor e uma unidade. O navegador mede de verdade e mostra quantos px aquilo vira agora."
  >
    <div class="conv">
      <div class="conv__linha">
        <label class="campo">
          Valor
          <input v-model.number="valor" type="number" step="0.25" min="0" inputmode="decimal" />
        </label>
        <label class="campo">
          Unidade
          <select v-model="unidade">
            <option v-for="u in unidades" :key="u" :value="u">{{ u }}</option>
          </select>
        </label>
      </div>

      <div class="conv__linha">
        <label class="campo">
          Fonte do elemento pai (px) — usada por em e ch
          <input v-model.number="fontePai" type="number" min="8" max="64" />
        </label>
        <label class="campo">
          Largura do elemento pai (px) — usada por %
          <input v-model.number="larguraPai" type="number" min="50" max="2000" />
        </label>
      </div>

      <p class="conv__resultado" aria-live="polite">
        <span class="conv__css">{{ valor }}{{ unidade }}</span>
        <span aria-hidden="true">=</span>
        <span class="conv__px">{{ resultado }}px</span>
      </p>
      <p class="conv__explica">{{ explicacoes[unidade] }}</p>
      <div class="conv__barra" aria-hidden="true">
        <span :style="{ width: `min(${resultado}px, 100%)` }"></span>
      </div>

      <!-- Sonda invisível onde a medição acontece -->
      <div class="conv__contexto" :style="{ fontSize: fontePai + 'px', width: larguraPai + 'px' }" aria-hidden="true">
        <div ref="sonda" class="conv__sonda"></div>
      </div>
    </div>

    <hr class="conv__divisor" />

    <h4 class="conv__subtitulo">px × rem: aumente a fonte do navegador</h4>
    <p class="conv__explica">
      Este controle faz o mesmo que a configuração "Tamanho da fonte" do navegador: muda o <code>font-size</code> do
      <code>&lt;html&gt;</code>. Repare que o guia INTEIRO cresce (ele é todo em rem)... menos a primeira caixa abaixo.
    </p>
    <label class="campo">
      Fonte padrão do navegador: {{ progresso.escalaFonte }}% ({{ fonteRaiz }}px)
      <input type="range" min="75" max="200" step="25" :value="progresso.escalaFonte" @input="mudarEscala" />
    </label>
    <div class="conv__comparar">
      <p class="conv__caixa conv__caixa--px">font-size: 16px<br /><small>não obedece a pessoa</small></p>
      <p class="conv__caixa conv__caixa--rem">font-size: 1rem<br /><small>cresce junto</small></p>
    </div>
    <button v-if="progresso.escalaFonte !== 100" type="button" class="botao botao--claro" @click="progresso.definirEscalaFonte(100)">
      Voltar ao normal (100%)
    </button>
  </BaseLab>
</template>

<style scoped>
.conv__linha {
  display: grid;
  gap: var(--esp-3);
  margin-bottom: var(--esp-3);
}

.conv__resultado {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--esp-3);
  margin: var(--esp-5) 0 var(--esp-2);
  font-family: var(--fonte-codigo);
  font-weight: 600;
  font-size: var(--texto-gg);
}

.conv__px {
  background-color: var(--cor-trena);
  border: var(--borda);
  padding: 0 var(--esp-2);
}

.conv__explica {
  font-size: var(--texto-p);
}

.conv__barra {
  height: 1.25rem;
  background-color: var(--cor-papel-2);
  border: 1px solid var(--cor-tinta-suave);
  overflow: hidden;
}

.conv__barra span {
  display: block;
  height: 100%;
  background-color: var(--cor-marca);
  transition: width 0.2s;
}

.conv__contexto {
  position: absolute;
  left: 0;
  top: 0;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  max-width: none;
}

.conv__sonda {
  position: absolute;
}

.conv {
  position: relative;
  overflow: hidden; /* a sonda nunca empurra a página para o lado */
}

.conv__divisor {
  border: none;
  border-top: 1px dashed var(--cor-tinta-suave);
  margin: var(--esp-5) 0;
}

.conv__subtitulo {
  margin-top: 0;
  font-size: var(--texto-g);
}

.conv__comparar {
  display: grid;
  gap: var(--esp-3);
  margin: var(--esp-4) 0;
}

.conv__caixa {
  margin: 0;
  padding: var(--esp-3);
  border: var(--borda);
  border-radius: var(--raio);
  line-height: 1.3;
}

.conv__caixa small {
  font-size: 0.75em;
  color: var(--cor-tinta-suave);
}

.conv__caixa--px {
  /* px de propósito: é a demonstração do problema */
  font-size: 16px;
  background-color: var(--cor-erro-clara);
}

.conv__caixa--rem {
  font-size: 1rem;
  background-color: var(--cor-ok-clara);
}

@container lab (min-width: 32rem) {
  .conv__linha,
  .conv__comparar {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
