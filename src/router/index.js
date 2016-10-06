import Vue from 'vue'
import Router from 'vue-router'

import Hello from '../components/Hello'
import Impress from '../components/Impress'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/impress',
      component: Impress
    }
  ]
})
