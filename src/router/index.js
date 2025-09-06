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
      title: 'VIS4Teens - 数据展示'
    }
  },
  {
    path: '/correlation-matrix',
    name: 'correlation-matrix',
    component: () => import('../views/CorrelationMatrixView.vue'),
    meta: {
      title: 'VIS4Teens - 相关性矩阵'
    }
  },
  {
    path: '/sankey-diagram',
    name: 'sankey-diagram',
    component: () => import('../views/SankeyDiagramView.vue'),
    meta: {
      title: 'VIS4Teens - 桑基图'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
