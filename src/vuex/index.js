import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const getters = {
  catalog: state => state.catalog,
  catalogKv: state => state.catalogKv,
  activeCatalog: state => state.activeCatalog,
  activeNote: state => state.activeNote,
  selectedNode: state => state.selectedNode,
  showCatalogMenu: state => state.showCatalogMenu,
  showDeleteDialog: state => state.showDeleteDialog,
  showRenameDialog: state => state.showRenameDialog,
  showChangeCatalogDialog: state => state.showChangeCatalogDialog,
  updateCatalog: state => state.update.catalog
}

const store = new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})

export default store
