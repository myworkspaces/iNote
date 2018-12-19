import Vue from 'vue'

const mutations = {
  // 重置全局目录结构
  resetCatalog (state, payload) {
    console.log('resetCatalog: ' + JSON.stringify(payload))
    if (payload && payload.catalog) {
      // 浅拷贝
      state.catalog = [...payload.catalog]
    }
    if (payload && payload.catalogKv) {
      state.catalogKv = {...payload.catalogKv}
    }
  },
  // 新建笔记
  addNote (state, payload) {
    console.log('addNote: ' + JSON.stringify(payload))
    if (payload && payload.newNote) {
      state.activeCatalog.children.push({...payload.newNote})
    }
  },
  // 新建目录
  addCatalog (state, payload) {
    console.log('addCatalog: ' + JSON.stringify(payload))
    if (payload && payload.newCatalog) {
      state.activeCatalog.children.push({...payload.newCatalog})
    }
  },
  // 更新笔记
  updateNote (state, payload) {
    console.log('updateNote: ' + JSON.stringify(payload))
    if (payload && payload.note) {
      state.activeNote = {...payload.note}
    }
  },
  // 设置当前目录
  activeCatalog (state, payload) {
    console.log('activeCatalog: ' + JSON.stringify(payload))
    if (payload && payload.catalog) {
      // 深拷贝
      state.activeCatalog = JSON.parse(JSON.stringify(payload.catalog))
    }
  },
  // 设置当前笔记
  activeNote (state, payload) {
    console.log('activeNote: ' + JSON.stringify(payload))
    if (payload && payload.note) {
      state.activeNote = {...payload.note}
    }
  },
  // 取消设置当前笔记
  deactivateNote (state) {
    state.activeNote = {}
  },
  // 设置弹窗显示/隐藏
  show (state, payload) {
    if (payload && payload.key) {
      state[payload.key] = payload.value
      // Vue.set(state, payload.key, payload.value)
      console.log('show:', payload.key, payload.value)
    }
  },
  selectNode (state, payload) {
    if (payload && payload.node) {
      state.selectedNode = payload.node
    }
  },
  deleteNode (state) {
    state.selectedNode = {}
  },
  // 设置更新对象
  update (state, payload) {
    if (payload && payload.key) {
      Vue.set(state.update, payload.key, payload.value)
      console.log('update:', payload.key, payload.value)
    }
  }
}

export default mutations
