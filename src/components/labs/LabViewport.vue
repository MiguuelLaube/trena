<script setup>
import { computed, ref } from 'vue'
import BaseLab from '@/components/guia/BaseLab.vue'
import BaseMiniatura from '@/components/guia/BaseMiniatura.vue'

// Larguras "de mentira" que o celular usa em cada caso
const LARGURA_CELULAR = 360 // width=device-width num celular comum
const LARGURA_LEGADO = 980 // o que o navegador do celular assume SEM a meta tag

const comMeta = ref(false)
const larguraLayout = computed(() => (comMeta.value ? LARGURA_CELULAR : LARGURA_LEGADO))

// Mesma regra que o CSS do site falso teria: @media (min-width: 640px)
const versaoDesktop = computed(() => larguraLayout.value >= 640)

// Um celular de 360px mostrando uma página de 980px = zoom de ~37%
const zoom = computed(() => Math.round((LARGURA_CELULAR / larguraLayout.value) * 100))
</script>

<template>
  <BaseLab
    ancora="viewport"
    titulo="Celular com e sem a meta viewport"
    instrucao="Ligue e desligue a meta tag e veja como o mesmo site (com as mesmas media queries) aparece no celular."
  >
    <div class="viewport-lab">
      <div class="viewport-lab__controles">
        <label class="chave">
          <input v-model="comMeta" type="checkbox" role="switch" />
          <span class="chave__trilho" aria-hidden="true"></span>
          <span>
            <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>
          </span>
        </label>

        <dl class="viewport-lab__dados">
          <div>
            <dt>Largura usada para montar a página</dt>
            <dd><span class="saida">{{ larguraLayout }}px</span></dd>
          </div>
          <div>
            <dt>Media query <code>(min-width: 640px)</code></dt>
            <dd>
              <span class="saida">{{ versaoDesktop ? 'verdadeira → layout de PC' : 'falsa → layout de celular' }}</span>
            </dd>
          </div>
          <div>
            <dt>Zoom aplicado pelo navegador</dt>
            <dd><span class="saida">{{ zoom }}%</span></dd>
          </div>
        </dl>
        <p class="viewport-lab__dica">
          {{
            comMeta
              ? 'Com a meta tag, 1px de CSS vale 1px "de celular". A página é montada com a largura real do aparelho e as media queries funcionam.'
              : 'Sem a meta tag, o navegador finge ter 980px, monta a versão de PC e encolhe tudo para caber. Resultado: texto minúsculo e zoom com pinça.'
          }}
        </p>
      </div>

      <div class="celular" aria-label="Simulação de tela de celular">
        <div class="celular__tela">
          <BaseMiniatura :largura="comMeta ? LARGURA_CELULAR : LARGURA_LEGADO">
            <!-- O "site" falso: o layout muda conforme a largura usada para montá-lo -->
            <div class="falso" :class="{ 'falso--pc': versaoDesktop }">
              <div class="falso__topo">
                <strong>Padaria do Bairro</strong>
                <span v-if="versaoDesktop" class="falso__links">Início · Cardápio · Encomendas · Contato</span>
                <span v-else class="falso__menu">☰ Menu</span>
              </div>
              <div class="falso__hero">
                <p class="falso__h1">Pão quentinho às 6h</p>
                <p>Faça sua encomenda pelo site e retire sem fila.</p>
                <span class="falso__botao">Encomendar</span>
              </div>
              <div class="falso__cards">
                <div class="falso__card">Francês</div>
                <div class="falso__card">Integral</div>
                <div class="falso__card">Sonho</div>
              </div>
            </div>
          </BaseMiniatura>
        </div>
      </div>
    </div>
  </BaseLab>
</template>

<style scoped>
.viewport-lab {
  display: grid;
  gap: var(--esp-5);
}

.viewport-lab__controles {
  min-width: 0;
}

.chave {
  display: flex;
  align-items: flex-start;
  gap: var(--esp-3);
  cursor: pointer;
  margin-bottom: var(--esp-4);
}

.chave input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.chave__trilho {
  flex-shrink: 0;
  position: relative;
  width: 3.25rem;
  height: 1.75rem;
  border: var(--borda);
  border-radius: 2rem;
  background-color: var(--cor-papel-3);
  transition: background-color 0.2s;
}

.chave__trilho::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: var(--cor-tinta);
  transition: transform 0.2s;
}

.chave input:checked + .chave__trilho {
  background-color: var(--cor-trena);
}

.chave input:checked + .chave__trilho::after {
  transform: translateX(1.5rem);
}

.chave input:focus-visible + .chave__trilho {
  outline: 0.1875rem solid var(--cor-marca);
  outline-offset: 0.125rem;
}

.viewport-lab__dados {
  display: grid;
  gap: var(--esp-3);
  margin: 0 0 var(--esp-4);
}

.viewport-lab__dados dt {
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
}

.viewport-lab__dados dd {
  margin: var(--esp-1) 0 0;
}

.viewport-lab__dica {
  font-size: var(--texto-p);
  margin: 0;
}

/* Moldura do celular */
.celular {
  justify-self: center;
  width: min(100%, 17rem);
  padding: 0.75rem 0.5rem 1.5rem;
  background-color: var(--cor-tinta);
  border-radius: 1.75rem;
}

.celular__tela {
  height: 28rem;
  overflow: hidden;
  background-color: #fff;
  border-radius: 1.125rem;
}

/* ---- Site falso: valores em px DE PROPÓSITO (simula a página dentro do celular) ---- */
.falso {
  font-family: Georgia, serif;
  color: #222;
  font-size: 16px;
  line-height: 1.4;
}

.falso__topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #7a3e1d;
  color: #fff;
}

.falso__links {
  font-size: 15px;
}

.falso__hero {
  padding: 28px 16px;
  background: #f6e7d3;
}

.falso__h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px;
}

.falso__botao {
  display: inline-block;
  margin-top: 8px;
  padding: 10px 18px;
  background: #7a3e1d;
  color: #fff;
  border-radius: 6px;
}

.falso__cards {
  display: grid;
  gap: 12px;
  padding: 16px;
}

.falso__card {
  padding: 40px 12px;
  background: #eee;
  border-radius: 8px;
  text-align: center;
}

.falso--pc .falso__topo {
  padding: 18px 48px;
}

.falso--pc .falso__hero {
  padding: 60px 48px;
}

.falso--pc .falso__h1 {
  font-size: 44px;
}

.falso--pc .falso__cards {
  grid-template-columns: repeat(3, 1fr);
  padding: 32px 48px;
  gap: 24px;
}

@container lab (min-width: 40rem) {
  .viewport-lab {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
}
</style>
