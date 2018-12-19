import channel from './channel'

// top: 顶级目录
// change: {type: '', catalog: {}} 发生变更的目录
// 重新生成目录结构
function reGenerateCatalog (top, change) {
  console.log('change', change)
  function _updateSelf (parent) {
    console.log('parent', parent)
    if (parent['id'] === change.catalog.id) {
      parent['label'] = change.catalog.label
      return true
    }
    let children = parent['children']
    if (children) {
      for (let index in children) {
        if (_updateSelf(children[index])) {
          return false
        }
      }
    }
    return false
  }
  function _updateParent (parent) {

  }
  function _delete (parent) {
    console.log('parent', parent)
    if (parent['id'] === change.catalog.id) {
      return true
    }
    let children = parent['children']
    if (children) {
      for (let index in children) {
        if (_delete(children[index])) {
          children.splice(index, 1)
          return false
        }
      }
    }
    return false
  }
  switch (change.type) {
    case 'updateSelf':
      _updateSelf(top)
      break
    case 'updateParent':
      _updateParent(top)
      break
    case 'delete':
      _delete(top)
      break
    default:
  }
}
// 重置全局目录结构
function resetCatalog (store, payload) {
  try {
    const catalogMessager = channel.get('catalogMessager')
    // 从服务端获取catalog.json, catalog.kv.json
    catalogMessager.initCatalog(function (data) {
      // console.log(data)
      const initCatalog = JSON.parse(data)
      store.commit('resetCatalog', {
        catalog: initCatalog.catalog,
        catalogKv: initCatalog.catalogKv
      })
      if (payload && payload.activeCatalog) {
        // 设置当前目录
        activeCatalog(store, {
          catalog: initCatalog.catalog[0]
        })
      }
    })
  } catch (err) {
    console.log('addCatalog error: ' + err.message)
  }
}
// 新建笔记
function addNote (store, payload) {
  try {
    let newNote = {
      label: '无标题笔记',
      content: '',
      isNote: true
    }
    if (payload && payload.catalog) {
      // 关联笔记到目录
      newNote.catalog_id = payload.catalog.id
    }
    const noteMessager = channel.get('noteMessager')
    // 异步操作
    noteMessager.add(JSON.stringify(newNote), function (id) {
      newNote.id = id
      store.commit('addNote', {
        newNote: newNote
      })
      activeNote(store, {
        note: newNote
      })
      // 添加索引
      const searcherMessager = channel.get('searcherMessager')
      searcherMessager.add(JSON.stringify(newNote))
    })
  } catch (err) {
    console.log('addNote error: ' + err.message)
  }
}
// 新建目录
function addCatalog (store, payload) {
  try {
    let newCatalog = {
      label: '新建文件夹'
    }
    let key = '0'
    let activeCatalog = store.state.catalog[0]
    if (payload && payload.catalog) {
      newCatalog.parent_id = payload.catalog.id
      // 设置path
      let path = '/'
      key = store.state.catalogKv[newCatalog.parent_id]
      const keyArr = key.split('-')
      // 读取当前目录结构
      keyArr.slice(1).forEach(index => {
        activeCatalog = activeCatalog.children[index]
        path += activeCatalog.label + '/'
      })
      newCatalog.path = path + newCatalog.label
    }
    const catalogMessager = channel.get('catalogMessager')
    // 异步操作
    catalogMessager.add(JSON.stringify(newCatalog), function (id) {
      newCatalog.id = id
      store.commit('addCatalog', {
        newCatalog: newCatalog
      })
      if (activeCatalog.children == null) {
        activeCatalog.children = []
      }
      activeCatalog.children.push(newCatalog)
      let newPayload = {
        catalog: store.state.catalog,
        catalogKv: store.state.catalogKv
      }
      newPayload.catalogKv[id] = key + '-' + (activeCatalog.children.length - 1)
      catalogMessager.updateCatalog(JSON.stringify(newPayload), function () {
        store.commit('resetCatalog', newPayload)
      })
      // 添加索引
      const searcherMessager = channel.get('searcherMessager')
      searcherMessager.add(JSON.stringify(newCatalog))
    })
  } catch (err) {
    console.log('addCatalog error: ' + err.message)
  }
}
// 更新笔记
function updateNote (store, payload) {
  try {
    if (payload && payload.note) {
      const noteMessager = channel.get('noteMessager')
      noteMessager.update(JSON.stringify(payload.note), function () {
        store.commit('updateNote', payload)
        activeCatalog(store, {
          catalog: store.state.activeCatalog
        })
        // 更新索引
        const searcherMessager = channel.get('searcherMessager')
        searcherMessager.update(JSON.stringify(payload.note))
      })
    }
  } catch (err) {
    console.log('activeCatalog error: ' + err.message)
  }
}
// 更新目录
function updateCatalog (store, payload) {
  try {
    if (payload && payload.catalog) {
      const catalogMessager = channel.get('catalogMessager')
      catalogMessager.update(JSON.stringify(payload.catalog), function () {
        reGenerateCatalog(store.state.catalog[0], {
          type: 'updateSelf',
          catalog: payload.catalog
        })
        let newPayload = {
          catalog: store.state.catalog,
          catalogKv: store.state.catalogKv
        }
        catalogMessager.updateCatalog(JSON.stringify(newPayload), function () {
          store.commit('resetCatalog', newPayload)
          activeCatalog(store, {
            catalog: store.state.activeCatalog
          })
        })
        // 更新索引
        const searcherMessager = channel.get('searcherMessager')
        searcherMessager.update(JSON.stringify(payload.catalog))
      })
    }
  } catch (err) {
    console.log('activeCatalog error: ' + err.message)
  }
}
// 设置当前目录
function activeCatalog (store, payload) {
  try {
    let catalog = {
      id: store.state.catalog[0].id,
      label: store.state.catalog[0].label,
      children: []
    }
    if (payload && payload.catalog && payload.catalog.id) {
      catalog.id = payload.catalog.id
      catalog.label = payload.catalog.label
      const key = store.state.catalogKv[catalog.id]
      const keyArr = key.split('-')
      // 记录当前目录树结构
      let temp = store.state.catalog[0]
      keyArr.slice(1).forEach(index => {
        temp = temp.children[index]
      })
      if (temp.children) {
        temp.children.forEach(element => {
          catalog.children.push({
            id: element.id,
            label: element.label
          })
        })
      }
    }
    const noteMessager = channel.get('noteMessager')
    noteMessager.findAllByCatalogId(catalog.id, function (noteListJson) {
      const noteList = JSON.parse(noteListJson)
      noteList.forEach(element => {
        catalog.children.push({
          id: element.id,
          label: element.title,
          content: element.content,
          isNote: true
        })
      })
      store.commit('activeCatalog', {
        catalog: catalog
      })
    })
  } catch (err) {
    console.log('activeCatalog error: ' + err.message)
  }
}
// 设置当前笔记
function activeNote (store, payload) {
  if (payload && payload.note) {
    store.commit('activeNote', payload)
    // 切换笔记的时候，自动获取焦点
    const textarea = document.getElementsByTagName('textarea')[0]
    textarea && textarea.focus()
  }
}
// 取消设置当前笔记
function deactivateNote (store) {
  store.commit('deactivateNote')
}
// 全文检索
function search (store, payload) {
  if (payload && payload.condition) {
    const searcherMessager = channel.get('searcherMessager')
    searcherMessager.all(payload.condition, function (data) {
      let catalog = {
        id: store.state.catalog[0].id,
        label: store.state.catalog[0].label,
        children: JSON.parse(data)
      }
      catalog.children.forEach(item => {
        item.label = item.title
        delete item.title
      })
      store.commit('activeCatalog', {
        catalog: catalog
      })
      deactivateNote(store)
    })
  }
}
// 删除笔记
function deleteNote (store, payload) {
  if (payload && payload.node) {
    const noteMessager = channel.get('noteMessager')
    noteMessager.delete(JSON.stringify(payload.node), function () {
      store.commit('deleteNode')
      if (store.state.activeNote.id === payload.node.id) {
        // 如果删除的为当前笔记，则取消当前笔记设置
        deactivateNote(store)
      }
      activeCatalog(store, {
        catalog: store.state.activeCatalog
      })
      // 删除索引
      const searcherMessager = channel.get('searcherMessager')
      searcherMessager.delete(JSON.stringify(payload.node))
    })
  }
}
// 删除目录
function deleteCatalog (store, payload) {
  if (payload && payload.node) {
    const catalogMessager = channel.get('catalogMessager')
    catalogMessager.delete(JSON.stringify(payload.node), function () {
      store.commit('deleteNode')
      reGenerateCatalog(store.state.catalog[0], {
        type: 'delete',
        catalog: payload.node
      })
      let newPayload = {
        catalog: store.state.catalog,
        catalogKv: store.state.catalogKv
      }
      delete newPayload.catalogKv[payload.node.id]
      catalogMessager.updateCatalog(JSON.stringify(newPayload), function () {
        store.commit('resetCatalog', newPayload)
        activeCatalog(store, {
          catalog: store.state.activeCatalog
        })
      })
      // 删除索引
      const searcherMessager = channel.get('searcherMessager')
      searcherMessager.delete(JSON.stringify(payload.node))
    })
  }
}
/**
 * 负责api通讯
 */
const actions = {
  // 初始化数据
  initData (store) {
    resetCatalog(store, {
      activeCatalog: true
    })
  },
  // 重置全局目录结构
  resetCatalog (store) {
    resetCatalog(store)
  },
  // 新建笔记
  addNote (store, payload) {
    addNote(store, payload)
  },
  // 新建目录
  addCatalog (store, payload) {
    addCatalog(store, payload)
  },
  // 更新笔记
  updateNote (store, payload) {
    updateNote(store, payload)
  },
  // 更新目录，需要更新全局目录结构
  updateCatalog (store, payload) {
    updateCatalog(store, payload)
  },
  // 设置当前目录
  activeCatalog (store, payload) {
    activeCatalog(store, payload)
  },
  // 设置当前笔记
  activeNote (store, payload) {
    activeNote(store, payload)
  },
  // 取消设置当前笔记
  deactivateNote (store) {
    deactivateNote(store)
  },
  // 全文检索
  search (store, payload) {
    search(store, payload)
  },
  // 设置弹窗显示/隐藏
  show (store, payload) {
    if (payload && payload.key) {
      store.commit('show', payload)
    }
  },
  // 选中节点
  selectNode (store, payload) {
    if (payload && payload.node) {
      store.commit('selectNode', payload)
    }
  },
  // 删除节点
  deleteNode (store) {
    const node = store.state.selectedNode
    if (node.id != null) {
      if (node.isNote) {
        deleteNote(store, {node: node})
      } else {
        deleteCatalog(store, {node: node})
      }
    }
  },
  // 更新节点
  updateNode (store, payload) {
    if (payload && payload.node && payload.node.id != null) {
      const node = payload.node
      if (node.isNote) {
        updateNote(store, {note: node})
      } else {
        updateCatalog(store, {catalog: node})
      }
    }
  },
  // 设置更新对象
  update (store, payload) {
    if (payload && payload.key) {
      store.commit('update', payload)
    }
  }
}

export default actions
