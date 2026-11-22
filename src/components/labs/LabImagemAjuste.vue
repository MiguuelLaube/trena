<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'

const proporcao = ref('1 / 1')
const ajuste = ref('cover')
const proporcoes = ['16 / 9', '4 / 3', '1 / 1', '3 / 4']
const ajustes = ['fill', 'contain', 'cover', 'none', 'scale-down']

const explica = {
  fill: 'Estica a imagem para preencher a caixa. Distorce!',
  contain: 'A imagem inteira cabe na caixa. Pode sobrar faixa vazia.',
  cover: 'Preenche a caixa sem distorcer. Corta o que sobrar (o mais usado em cards).',
  none: 'Mostra no tamanho original, sem redimensionar. Geralmente corta muito.',
  'scale-down': 'Escolhe o menor entre none e contain.',
}

// ---- srcset: qual arquivo o navegador escolheu? ----
const imgSrcset = ref(null)
const escolhido = ref('')
const dpr = ref(1)
const larguraJanela = ref(0)

function atualizarEscolha() {
  dpr.value = window.devicePixelRatio
  larguraJanela.value = window.innerWidth
  const atual = imgSrcset.value?.currentSrc
  if (atual) escolhido.value = atual.split('/').pop()
}
onMounted(() => {
  atualizarEscolha()
  window.addEventListener('resize', atualizarEscolha, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', atualizarEscolha))
</script>

<template>
  <BaseLab
    ancora="ajuste"
    titulo="aspect-ratio, object-fit e srcset"
    instrucao="Troque a proporção da caixa e o object-fit. Depois veja qual arquivo o srcset escolheu para a sua tela."
  >
    <div class="ajuste">
      <div class="ajuste__controles">
        <label class="campo">
          aspect-ratio da caixa
          <select v-model="proporcao">
            <option v-for="p in proporcoes" :key="p">{{ p }}</option>
          </select>
        </label>
        <label class="campo">
          object-fit
          <select v-model="ajuste">
            <option v-for="a in ajustes" :key="a">{{ a }}</option>
          </select>
        </label>
        <p class="ajuste__explica">{{ explica[ajuste] }}</p>
      </div>
      <div class="ajuste__moldura">
        <img
          src="/img/cidade-800.jpg"
          width="800"
          height="500"
          alt="Ilustração de prédios coloridos com um sol amarelo"
          loading="lazy"
          class="ajuste__img"
          :style="{ aspectRatio: proporcao, objectFit: ajuste }"
        />
      </div>
    </div>

    <hr class="ajuste__divisor" />

    <h4 class="ajuste__subtitulo">srcset: o navegador escolhe o arquivo</h4>
    <img
      ref="imgSrcset"
      class="ajuste__srcset"
      src="/img/cidade-800.jpg"
      srcset="/img/cidade-480.jpg 480w, /img/cidade-800.jpg 800w, /img/cidade-1200.jpg 1200w"
      sizes="(min-width: 64rem) 40rem, 100vw"
      width="1200"
      height="750"
      alt="A mesma ilustração em três tamanhos; o número na imagem mostra qual arquivo foi baixado"
      loading="lazy"
      decoding="async"
      @load="atualizarEscolha"
    />
    <p class="ajuste__explica" aria-live="polite">
      Janela: <span class="saida">{{ larguraJanela }}px</span> · densidade de pixels (DPR):
      <span class="saida">{{ dpr }}</span> · arquivo baixado: <span class="saida">{{ escolhido || '…' }}</span>
    </p>
    <p class="ajuste__explica">
      Abra no celular e no computador: o número escrito na imagem muda. Um celular com DPR 3 e 390px de largura
      precisa de ~1170 pixels reais, por isso pode baixar a de 1200w.
    </p>
  </BaseLab>
</template>

<style scoped>
.ajuste {
  display: grid;
  gap: var(--esp-4);
}

.ajuste__controles {
  display: grid;
  gap: var(--esp-3);
  align-content: start;
}

.ajuste__moldura {
  display: grid;
  place-items: center;
  padding: var(--esp-3);
  background-color: var(--cor-papel-2);
  background-image: repeating-linear-gradient(45deg, transparent 0 0.5rem, var(--cor-papel-3) 0.5rem 1rem);
  border: 1px dashed var(--cor-tinta-suave);
}

.ajuste__img {
  display: block;
  width: min(100%, 18rem);
  height: auto;
  background-color: var(--cor-papel);
  outline: var(--borda);
}

.ajuste__explica {
  font-size: var(--texto-p);
  margin-bottom: var(--esp-2);
}

.ajuste__divisor {
  border: none;
  border-top: 1px dashed var(--cor-tinta-suave);
  margin: var(--esp-5) 0;
}

.ajuste__subtitulo {
  margin-top: 0;
  font-size: var(--texto-g);
}

.ajuste__srcset {
  display: block;
  width: 100%;
  max-width: 40rem;
  height: auto;
  margin-bottom: var(--esp-3);
  border: var(--borda);
}

@container lab (min-width: 34rem) {
  .ajuste {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
