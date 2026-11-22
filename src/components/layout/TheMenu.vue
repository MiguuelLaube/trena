<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { secoes } from '@/data/secoes'
import { useProgressoStore } from '@/stores/progresso'

const progresso = useProgressoStore()
const rota = useRoute()
const aberto = ref(false)

// Fecha o menu sempre que a pessoa navega (senão ele fica cobrindo a página nova)
watch(() => rota.fullPath, () => (aberto.value = false))

function fecharComEsc(evento) {
  if (evento.key === 'Escape') aberto.value = false
}
onMounted(() => window.addEventListener('keydown', fecharComEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', fecharComEsc))
</script>

<template>
  <header class="menu">
    <div class="menu__barra">
      <RouterLink to="/" class="marca" aria-label="Trena — página inicial">
        <span class="marca__fita">TRENA</span>
        <span class="marca__sub">meça antes de cortar</span>
      </RouterLink>

      <!-- No celular, o menu vira este botão. No notebook ele some (ver CSS). -->
      <button
        class="botao menu__botao"
        type="button"
        :aria-expanded="aberto"
        aria-controls="navegacao"
        @click="aberto = !aberto"
      >
        <span class="hamburguer" :class="{ 'hamburguer--x': aberto }" aria-hidden="true"></span>
        {{ aberto ? 'Fechar' : 'Menu' }}
      </button>
    </div>

    <nav id="navegacao" class="menu__nav" :class="{ 'menu__nav--aberto': aberto }" aria-label="Seções do guia">
      <ol class="menu__lista">
        <li>
          <RouterLink to="/" class="menu__link">
            <span class="menu__num">00</span>
            <span>Início</span>
          </RouterLink>
        </li>
        <li v-for="secao in secoes" :key="secao.nome">
          <RouterLink :to="secao.caminho" class="menu__link">
            <span class="menu__num">{{ secao.numero }}</span>
            <span>{{ secao.titulo }}</span>
            <span v-if="progresso.foiVisitada(secao.nome)" class="menu__ok" title="Já visitada">✓</span>
          </RouterLink>
        </li>
      </ol>

      <div class="menu__rodape">
        <p class="menu__progresso-texto">
          Percorrido: <strong>{{ progresso.porcentagem }}%</strong>
        </p>
        <div class="menu__progresso" role="progressbar" :aria-valuenow="progresso.porcentagem" aria-valuemin="0" aria-valuemax="100">
          <span :style="{ width: progresso.porcentagem + '%' }"></span>
        </div>
        <label class="menu__alternar">
          <input type="checkbox" :checked="progresso.indicadorLigado" @change="progresso.alternarIndicador()" />
          Mostrar a trena (largura da tela)
        </label>
      </div>
    </nav>
    <div class="regua" aria-hidden="true"></div>
  </header>
</template>

<style scoped>
/* ---------- Celular (padrão) ---------- */
.menu {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: var(--cor-papel);
}

.menu__barra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--esp-3);
  padding: var(--esp-3) var(--esp-4);
  border-bottom: var(--borda);
}

.marca {
  display: grid;
  text-decoration: none;
  line-height: 1;
}

.marca:hover {
  background: none;
}

.marca__fita {
  justify-self: start;
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: var(--texto-gg);
  letter-spacing: 0.08em;
  padding: 0.1rem 0.6rem 0;
  background-color: var(--cor-trena);
  border: var(--borda);
  transform: rotate(-2deg);
}

.marca__sub {
  margin-top: var(--esp-2);
  font-size: var(--texto-pp);
  color: var(--cor-tinta-suave);
}

.menu__botao {
  box-shadow: none;
}

.hamburguer,
.hamburguer::before,
.hamburguer::after {
  display: block;
  width: 1.125rem;
  height: 0.125rem;
  background-color: currentColor;
  transition: transform 0.2s;
}

.hamburguer {
  position: relative;
}

.hamburguer::before,
.hamburguer::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburguer::before {
  top: -0.375rem;
}

.hamburguer::after {
  top: 0.375rem;
}

.hamburguer--x {
  background-color: transparent;
}

.hamburguer--x::before {
  transform: translateY(0.375rem) rotate(45deg);
}

.hamburguer--x::after {
  transform: translateY(-0.375rem) rotate(-45deg);
}

/* Fechado no celular */
.menu__nav {
  display: none;
  max-height: calc(100dvh - 5rem);
  overflow-y: auto;
  border-bottom: var(--borda);
  background-color: var(--cor-papel);
}

.menu__nav--aberto {
  display: block;
}

.menu__lista {
  list-style: none;
  margin: 0;
  padding: var(--esp-2) 0;
}

.menu__lista li + li {
  margin-top: 0;
}

.menu__link {
  display: flex;
  align-items: baseline;
  gap: var(--esp-3);
  padding: var(--esp-3) var(--esp-4);
  text-decoration: none;
  font-weight: 700;
}

.menu__link.router-link-exact-active {
  background-color: var(--cor-trena);
  box-shadow: inset 0.375rem 0 0 var(--cor-tinta);
}

.menu__num {
  font-family: var(--fonte-codigo);
  font-size: var(--texto-pp);
  color: var(--cor-marca);
}

.menu__ok {
  margin-left: auto;
  color: var(--cor-ok);
}

.menu__rodape {
  padding: var(--esp-3) var(--esp-4) var(--esp-4);
  border-top: 1px dashed var(--cor-tinta-suave);
  font-size: var(--texto-p);
}

.menu__progresso-texto {
  margin-bottom: var(--esp-2);
}

.menu__progresso {
  height: 0.5rem;
  border: var(--borda);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: var(--esp-3);
}

.menu__progresso span {
  display: block;
  height: 100%;
  background-color: var(--cor-marca);
  transition: width 0.4s;
}

.menu__alternar {
  display: flex;
  align-items: center;
  gap: var(--esp-2);
  cursor: pointer;
}

.menu__alternar input {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--cor-marca);
}

/* ---------- Notebook: barra lateral sempre visível ---------- */
@media (min-width: 64rem) {
  .menu {
    top: 0;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    border-right: var(--borda);
  }

  .menu__barra {
    padding: var(--esp-5) var(--esp-4);
  }

  .menu__botao {
    display: none;
  }

  .menu__nav,
  .menu__nav--aberto {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    max-height: none;
    border-bottom: none;
  }

  .regua {
    display: none;
  }
}
</style>
