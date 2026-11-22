<script setup>
import { ref } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'
import { buscarRacasDeCachorro } from '@/services/animaisApi'

const INICIAIS = ['Capivara', 'Tamanduá', 'Arara-azul', 'Onça-pintada']
let proximoId = 1
const criar = (nomes) => nomes.map((nome) => ({ id: proximoId++, nome }))

// Duas listas independentes com os mesmos animais
const semKey = ref(criar(INICIAIS))
const comKey = ref(criar(INICIAIS))
const versao = ref(0) // muda para recriar os <input> do zero ao reiniciar

const status = ref('ocioso') // 'ocioso' | 'carregando' | 'erro'

function removerPrimeiro() {
  semKey.value.shift()
  comKey.value.shift()
}

function reiniciar(nomes = INICIAIS) {
  semKey.value = criar(nomes)
  comKey.value = criar(nomes)
  versao.value++
}

async function trocarPorApi() {
  status.value = 'carregando'
  try {
    const nomes = await buscarRacasDeCachorro(4)
    reiniciar(nomes)
    status.value = 'ocioso'
  } catch {
    status.value = 'erro'
  }
}
</script>

<template>
  <BaseLab
    titulo="v-for com e sem :key"
    instrucao="1) Digite algo no campo do 2º animal nas DUAS listas. 2) Clique em “Remover o 1º animal”. 3) Veja onde o seu texto foi parar."
  >
    <div class="key-lab__acoes">
      <button type="button" class="botao" :disabled="!semKey.length" @click="removerPrimeiro">Remover o 1º animal</button>
      <button type="button" class="botao botao--claro" @click="reiniciar()">Reiniciar</button>
      <button type="button" class="botao botao--claro" :disabled="status === 'carregando'" @click="trocarPorApi">
        {{ status === 'carregando' ? 'Buscando…' : 'Trocar por cães da API' }}
      </button>
    </div>
    <p v-if="status === 'erro'" class="key-lab__erro" role="alert">
      Não deu para falar com a API agora (sem internet?). O laboratório continua funcionando com os animais locais.
    </p>

    <div :key="versao" class="key-lab__listas">
      <section class="key-lab__lista key-lab__lista--ruim">
        <h4><code>v-for</code> SEM <code>:key</code></h4>
        <ol>
          <!-- eslint-disable-next-line vue/require-v-for-key -- erro proposital para o laboratório -->
          <li v-for="animal in semKey">
            <span class="key-lab__nome">{{ animal.nome }}</span>
            <!-- campo "solto" (sem v-model): o texto vive só no DOM -->
            <input type="text" :aria-label="`Apelido para ${animal.nome} (lista sem key)`" placeholder="apelido…" />
          </li>
        </ol>
      </section>

      <section class="key-lab__lista key-lab__lista--boa">
        <h4><code>v-for</code> COM <code>:key="animal.id"</code></h4>
        <ol>
          <li v-for="animal in comKey" :key="animal.id">
            <span class="key-lab__nome">{{ animal.nome }}</span>
            <input type="text" :aria-label="`Apelido para ${animal.nome} (lista com key)`" placeholder="apelido…" />
          </li>
        </ol>
      </section>
    </div>
  </BaseLab>
</template>

<style scoped>
.key-lab__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-3);
  margin-bottom: var(--esp-4);
}

.key-lab__erro {
  padding: var(--esp-2) var(--esp-3);
  background-color: var(--cor-erro-clara);
  border-left: 0.25rem solid var(--cor-marca);
  font-size: var(--texto-p);
}

.key-lab__listas {
  display: grid;
  gap: var(--esp-4);
}

.key-lab__lista {
  padding: var(--esp-3);
  border: var(--borda);
  border-radius: var(--raio);
  min-width: 0;
}

.key-lab__lista--ruim {
  background-color: var(--cor-erro-clara);
}

.key-lab__lista--boa {
  background-color: var(--cor-ok-clara);
}

.key-lab__lista h4 {
  margin: 0 0 var(--esp-3);
  font-family: var(--fonte-texto);
  font-size: var(--texto-p);
}

.key-lab__lista ol {
  margin: 0;
  padding-left: var(--esp-5);
}

.key-lab__lista li {
  margin-top: var(--esp-2);
}

.key-lab__nome {
  display: block;
  font-weight: 700;
  font-size: var(--texto-p);
}

.key-lab__lista input {
  width: 100%;
  min-width: 0;
  min-height: 2.5rem;
  padding: var(--esp-1) var(--esp-2);
  font: inherit;
  border: var(--borda);
  border-radius: var(--raio);
  background-color: #fffdf6;
}

@container lab (min-width: 34rem) {
  .key-lab__listas {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
