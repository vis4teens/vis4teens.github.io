import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.min.css'
import VueLazyload from 'vue-lazyload'
const app = createApp(App)

// 路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
app.use(VueLazyload, {
    loading: require('@/assets/images/loading.gif'), // 加载中的占位图
    error: require('@/assets/images/1.jpg'),    // 错误时的占位图
  }).use(store).use(router).mount('#app')
