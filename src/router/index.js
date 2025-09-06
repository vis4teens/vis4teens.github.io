import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/data-display'
  },
  {
    path: '/data-display',
    name: 'data-display',
    component: () => import('../views/DataDisplayView.vue'),
    meta: {
      title: 'VIS4Teens - DataDisplay'
    }
  },
  {
    path: '/correlation-matrix',
    name: 'correlation-matrix',
    component: () => import('../views/CorrelationMatrixView.vue'),
    meta: {
      title: 'VIS4Teens - CorrelationMatrix'
    }
  },
  {
    path: '/sankey-diagram',
    name: 'sankey-diagram',
    component: () => import('../views/SankeyDiagramView.vue'),
    meta: {
      title: 'VIS4Teens - SankeyDiagramView'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
