<script setup>
import { computed } from 'vue'
import { secoes } from '@/data/secoes'
import { equipe } from '@/data/equipe'
import { useProgressoStore } from '@/stores/progresso'

const progresso = useProgressoStore()

// Atalhos para os laboratórios (útil na apresentação!)
const labs = [
  { nome: 'Celular com e sem a meta viewport', para: '/por-que-importa#lab-viewport' },
  { nome: 'Conversor de unidades → px e px × rem', para: '/unidades#lab-unidades' },
  { nome: 'Painel do Flexbox', para: '/flexbox-e-grid#lab-flex' },
  { nome: 'Régua do Grid (auto-fit + minmax)', para: '/flexbox-e-grid#lab-grid' },
  { nome: 'O texto que pula (CLS)', para: '/imagens#lab-pulo' },
  { nome: 'aspect-ratio, object-fit e srcset', para: '/imagens#lab-ajuste' },
  { nome: 'v-for com e sem :key (+ API)', para: '/boas-praticas-vue#lab-key' },
  { nome: 'Medidor de Core Web Vitals', para: '/boas-praticas-vue#lab-vitals' },
  { nome: 'A trena (indicador de largura) — sempre no canto da tela', para: '/' },
]
const integrantes = computed(() => equipe.filter((p) => p.nome))

const resumos = {
  'por-que': 'A meta viewport, o layout fluido e o mobile-first. Lab: um celular com e sem a meta tag.',
  unidades: 'px, rem, em, %, fr, vw, vh, dvh e ch. Lab: conversor que mede de verdade.',
  'flex-grid': 'Uma dimensão ou duas? Lab: painel do Flexbox e régua do Grid.',
  imagens: 'Imagens que não estouram e não fazem o texto pular. Lab: o texto que pula.',
  'boas-praticas': 'Pastas, nomes, props, :key, tokens e Web Vitals. Lab: v-for sem key.',
  desafio: 'Uma pergunta que só se responde usando o próprio guia.',
}
</script>

<template>
  <div class="inicio">
    <section class="heroi">
      <p class="etiqueta">Guia interativo de responsividade</p>
      <h1 class="heroi__titulo">
        Meça antes<br />
        de <span class="heroi__marca">cortar.</span>
      </h1>
      <p class="heroi__texto">
        Marceneiro bom não corta a madeira no olho: mede com a trena. Aqui é igual. Neste guia você vai
        <strong>medir</strong> páginas em telas de todos os tamanhos e entender por que algumas quebram no celular — e
        como fazer as suas não quebrarem.
      </p>
      <div class="heroi__acoes">
        <RouterLink to="/por-que-importa" class="botao">Começar pela seção 01 →</RouterLink>
        <RouterLink to="/desafio" class="botao botao--claro">Ir direto ao desafio</RouterLink>
      </div>
    </section>

    <section class="como">
      <h2>Como usar</h2>
      <ul class="como__lista">
        <li>
          <span class="como__icone" aria-hidden="true">📏</span>
          <span>Cada seção tem <strong>explicação curta</strong>, <strong>código comentado</strong>, a
            <strong>resposta da pergunta-guia</strong> e as <strong>fontes</strong> que consultamos.</span>
        </li>
        <li>
          <span class="como__icone" aria-hidden="true">🧪</span>
          <span>Os blocos amarelos com o selo <span class="etiqueta">LAB</span> são laboratórios: mexa neles!</span>
        </li>
        <li>
          <span class="como__icone" aria-hidden="true">↔️</span>
          <span>A <strong>trena</strong> no canto da tela mostra a largura da janela e o breakpoint ativo. Redimensione o
            navegador e veja os números mudarem.</span>
        </li>
      </ul>
    </section>

    <section>
      <h2>As seções</h2>
      <ol class="cartoes">
        <li v-for="s in secoes" :key="s.nome">
          <RouterLink :to="s.caminho" class="cartao">
            <span class="cartao__num">{{ s.numero }}</span>
            <span class="cartao__titulo">{{ s.titulo }}</span>
            <span class="cartao__resumo">{{ resumos[s.nome] }}</span>
            <span v-if="progresso.foiVisitada(s.nome)" class="cartao__ok">✓ visitada</span>
          </RouterLink>
        </li>
      </ol>
    </section>

    <section>
      <h2>Os laboratórios</h2>
      <ol class="labs">
        <li v-for="l in labs" :key="l.nome">
          <RouterLink :to="l.para">{{ l.nome }}</RouterLink>
        </li>
      </ol>
    </section>

    <section v-if="integrantes.length" class="equipe">
      <h2>Quem fez</h2>
      <ul>
        <li v-for="p in integrantes" :key="p.nome">
          {{ p.nome }}<span v-if="p.ra"> — RA {{ p.ra }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.inicio {
  max-width: var(--largura-conteudo);
}

.heroi {
  padding-bottom: var(--esp-6);
}

.heroi__titulo {
  margin: var(--esp-4) 0 var(--esp-5);
  font-size: clamp(3rem, 2rem + 6vw, 6.5rem);
  text-transform: uppercase;
  line-height: 0.9;
}

.heroi__marca {
  display: inline-block;
  padding: 0 0.15em;
  background-color: var(--cor-trena);
  border: var(--borda);
  transform: rotate(-1.5deg);
}

.heroi__texto {
  font-size: var(--texto-g);
  max-width: 38rem;
}

.heroi__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-3);
  margin-top: var(--esp-5);
}

.heroi__acoes .botao {
  text-decoration: none;
}

.como__lista {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--esp-3);
  max-width: var(--largura-texto);
}

.como__lista li {
  display: flex;
  gap: var(--esp-3);
  margin: 0;
}

.como__icone {
  flex-shrink: 0;
  font-size: var(--texto-g);
}

.cartoes {
  list-style: none;
  padding: 0;
  display: grid;
  /* min(16rem, 100%): em telas menores que 16rem, o card não estoura */
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
  gap: var(--esp-4);
}

.cartoes li {
  margin: 0;
}

.cartao {
  display: grid;
  gap: var(--esp-2);
  height: 100%;
  padding: var(--esp-4);
  border: var(--borda);
  border-radius: var(--raio);
  background-color: #fffdf6;
  box-shadow: var(--sombra);
  text-decoration: none;
  align-content: start;
  transition: transform 0.15s;
}

.cartao:hover {
  background-color: var(--cor-trena-clara);
  transform: translate(-0.125rem, -0.125rem);
}

.cartao__num {
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: 2.5rem;
  line-height: 1;
  color: var(--cor-trena);
  -webkit-text-stroke: var(--borda-largura) var(--cor-tinta);
}

.cartao__titulo {
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: var(--texto-g);
  text-transform: uppercase;
}

.cartao__resumo {
  font-size: var(--texto-p);
  color: var(--cor-tinta-suave);
}

.cartao__ok {
  font-size: var(--texto-pp);
  font-weight: 700;
  color: var(--cor-ok);
}

.labs {
  padding-left: var(--esp-5);
  max-width: var(--largura-texto);
}

.equipe ul {
  padding-left: var(--esp-5);
}
</style>
