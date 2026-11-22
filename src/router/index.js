import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { secoes } from '@/data/secoes'
import { useProgressoStore } from '@/stores/progresso'

// Cada seção é carregada SOB DEMANDA: o "() => import()" faz o Vite gerar
// um arquivo .js separado, que só é baixado quando a pessoa abre aquela rota.
const telas = {
  'por-que': () => import('@/views/PorQueView.vue'),
  unidades: () => import('@/views/UnidadesView.vue'),
  'flex-grid': () => import('@/views/FlexGridView.vue'),
  imagens: () => import('@/views/ImagensView.vue'),
  'boas-praticas': () => import('@/views/BoasPraticasView.vue'),
  desafio: () => import('@/views/DesafioView.vue'),
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // A home vem no pacote principal: é a primeira coisa que todo mundo vê
    { path: '/', name: 'inicio', component: HomeView, meta: { titulo: 'Início' } },
    ...secoes.map((s) => ({
      path: s.caminho,
      name: s.nome,
      component: telas[s.nome],
      meta: { titulo: s.titulo, numero: s.numero },
    })),
    { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: () => import('@/views/NaoEncontradaView.vue') },
  ],
  // Ao trocar de página, volta pro topo (ou para a âncora, se tiver)
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo
    if (to.hash) return { el: to.hash, top: 80 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.titulo ?? 'Página'} · Trena`
  useProgressoStore().marcarVisitada(to.name)
})

export default router
