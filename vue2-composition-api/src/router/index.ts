import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'setup',
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/setup.vue')
  },
  {
    path: '/setup-render',
    name: 'setup-render',
    component: () => import(/* webpackChunkName: "setup-render" */ '../views/setup-render.vue')
  },
  {
    path: '/setup-render2',
    name: 'setup-render2',
    component: () => import(/* webpackChunkName: "setup-render2" */ '../views/setup-render2.vue')
  },
  {
    path: '/setup-render3',
    name: 'setup-render3',
    component: () => import(/* webpackChunkName: "setup-render3" */ '../views/setup-render3.vue')
  },
  {
    path: '/setup-tsx',
    name: 'setup-tsx',
    component: () => import(/* webpackChunkName: "setup-tsx" */ '../views/setup-tsx')
  },
  {
    path: '/res-api',
    name: 'res-api',
    component: () => import(/* webpackChunkName: "res-api" */ '../views/res-api.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
