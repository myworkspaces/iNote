import Vue from 'vue'
import Router from 'vue-router'
import Catalog from '@/components/Catalog'
import Editor from '@/components/Editor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:catalog',
      name: 'Catalog',
      component: Catalog,
      children: [
        {
          path: ':note',
          name: 'Editor',
          component: Editor
        }
      ]
    }
  ]
})
