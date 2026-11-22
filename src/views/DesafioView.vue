<script setup>
import { ref, computed } from 'vue'
import SecaoLayout from '@/components/guia/SecaoLayout.vue'
import { useProgressoStore } from '@/stores/progresso'

const progresso = useProgressoStore()

const RESPOSTA = 608 // 3 × (12 × 16) + 2 × 16
const palpite = ref('')
const tentativas = ref(0)
const retorno = ref(null) // 'certo' | 'perto' | 'errado'

const dicas = [
  'Abra a seção 03 (Flexbox e Grid) e procure o laboratório “Régua do Grid”.',
  'Coloque o mínimo em 12rem e o gap em 1rem. Arraste a largura bem devagar e observe o contador de colunas.',
  'Com N colunas existem N − 1 gaps. Converta rem para px com 1rem = 16px.',
]
const dicasVisiveis = computed(() => dicas.slice(0, Math.min(tentativas.value, dicas.length)))

function conferir() {
  const numero = Number(String(palpite.value).replace(',', '.').replace(/px/i, '').trim())
  if (Number.isNaN(numero) || palpite.value === '') return
  tentativas.value++
  if (numero === RESPOSTA) {
    retorno.value = 'certo'
    progresso.resolverDesafio()
  } else if (Math.abs(numero - RESPOSTA) <= 32) {
    retorno.value = 'perto'
  } else {
    retorno.value = 'errado'
  }
}
</script>

<template>
  <SecaoLayout resumo="Uma pergunta criada pela dupla que só dá para responder usando o próprio guia. Pegue a sua trena.">
    <section class="desafio" aria-labelledby="pergunta-desafio">
      <p class="etiqueta">A pergunta</p>
      <h2 id="pergunta-desafio" class="desafio__pergunta">
        No laboratório <em>“Régua do Grid”</em> da seção 03, mude o <strong>mínimo de cada card para 12rem</strong> e
        deixe o <strong>gap em 1rem</strong>, com a fonte do navegador no padrão. Qual é a <strong>menor largura do
        contêiner, em px,</strong> em que aparecem <strong>3 colunas</strong>?
      </h2>

      <form class="desafio__form" @submit.prevent="conferir">
        <label class="campo">
          Sua resposta (em px)
          <input v-model="palpite" type="text" inputmode="numeric" placeholder="ex.: 500" autocomplete="off" />
        </label>
        <button type="submit" class="botao">Conferir medida</button>
      </form>

      <div aria-live="polite">
        <p v-if="retorno === 'certo' || progresso.desafioResolvido" class="desafio__retorno desafio__retorno--certo">
          <strong>Medida exata! 🎯</strong> 12rem = 192px. Para 3 colunas: 3 × 192 + 2 × 16 = 576 + 32 = <strong>608px</strong>.
          Com 607px ainda são 2 colunas.
        </p>
        <p v-else-if="retorno === 'perto'" class="desafio__retorno desafio__retorno--perto">
          <strong>Quase!</strong> Você está a menos de 32px. Confira quantos gaps existem entre 3 colunas.
        </p>
        <p v-else-if="retorno === 'errado'" class="desafio__retorno desafio__retorno--errado">
          <strong>Ainda não.</strong> Meça de novo — veja as dicas abaixo.
        </p>
      </div>

      <div v-if="dicasVisiveis.length && retorno !== 'certo'" class="desafio__dicas">
        <h3>Dicas</h3>
        <ol>
          <li v-for="d in dicasVisiveis" :key="d">{{ d }}</li>
        </ol>
      </div>

      <RouterLink to="/flexbox-e-grid" class="botao botao--claro desafio__link">Abrir a Régua do Grid →</RouterLink>
    </section>
  </SecaoLayout>
</template>

<style scoped>
.desafio {
  max-width: var(--largura-texto);
  padding: var(--esp-5) var(--esp-4);
  border: var(--borda);
  border-radius: var(--raio);
  background-color: #fffdf6;
  box-shadow: var(--sombra);
}

.desafio__pergunta {
  margin-top: var(--esp-3);
  font-family: var(--fonte-texto);
  font-weight: 400;
  font-size: var(--texto-g);
  line-height: 1.45;
}

.desafio__form {
  display: grid;
  gap: var(--esp-3);
  margin: var(--esp-5) 0 var(--esp-4);
}

.desafio__retorno {
  padding: var(--esp-3) var(--esp-4);
  border-left: 0.375rem solid;
  border-radius: var(--raio);
}

.desafio__retorno--certo {
  background-color: var(--cor-ok-clara);
  border-color: var(--cor-ok);
}

.desafio__retorno--perto {
  background-color: var(--cor-trena-clara);
  border-color: var(--cor-trena);
}

.desafio__retorno--errado {
  background-color: var(--cor-erro-clara);
  border-color: var(--cor-marca);
}

.desafio__dicas h3 {
  margin-top: var(--esp-4);
}

.desafio__link {
  margin-top: var(--esp-3);
  text-decoration: none;
}

@media (min-width: 40rem) {
  .desafio {
    padding: var(--esp-6);
  }

  .desafio__form {
    grid-template-columns: 1fr auto;
    align-items: end;
  }
}
</style>
