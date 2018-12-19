<template>
    <el-tree
    :registed-events="registedEvents"
    :data="catalog"
    :props="defaultProps"
    :empty-text="emptyText"
    :highlight-current="highlightCurrent"
    @node-click="handleNodeClick"
    @node-contextmenu="showCatalogMenu">
    </el-tree>
</template>

<script>
function showCatalogMenu (event, data, node, tree) {
  // console.log(event)
  // console.log(data)
  // console.log(node)
  // console.log(tree)
  // 设置当前操作的节点
  this.$store.dispatch('selectNode', {
    node: data
  })
  let catalogMenu = document.getElementById('catalog-menu')
  catalogMenu.style.left = event.clientX + 'px'
  catalogMenu.style.top = event.clientY + 'px'
  this.$store.dispatch('show', {
    key: 'showCatalogMenu',
    value: true
  })
  catalogMenu.focus()
}
function handelNodeClick (data) {
  try {
    console.log('handelNodeClick: ' + JSON.stringify(data))
    this.$store.dispatch('show', {
      key: 'showCatalogMenu',
      value: false
    })
    if (data.isNote) {
      // 点击对象如果为笔记则切换笔记内容
      this.$store.dispatch('activeNote', {
        note: data
      })
    } else {
      // 清除搜索框的内容
      const searchBox = document.getElementsByClassName('search_box')[0]
      const searchInput = searchBox.getElementsByTagName('input')[0]
      searchInput.value = ''
      // 点击对象如果为目录则进入目录
      this.$store.dispatch('deactivateNote')
      // 当前目录
      let catalog = {
        id: data.id,
        label: data.label,
        children: []
      }
      // 设置当前目录
      this.$store.dispatch('activeCatalog', {
        catalog: catalog
      })
    }
  } catch (err) {
    console.log('handleNodeClick error: ' + err.message)
  }
}
function handelNodeClick2 (data) {
  try {
    console.log('handelNodeClick: ' + JSON.stringify(data))
    this.$store.dispatch('update', {
      key: 'catalog',
      value: data
    })
  } catch (err) {
    console.log('handleNodeClick error: ' + err.message)
  }
}
export default {
  name: 'Catalog',
  props: {
    'catalog': Array,
    'registedEvents': Array
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      emptyText: '',
      highlightCurrent: true
    }
  },
  methods: {
    showCatalogMenu (event, data, node, tree) {
      if (typeof this.registedEvents === 'undefined') {
        return
      }
      if (this.registedEvents.includes('showCatalogMenu')) {
        showCatalogMenu.call(this, event, data, node, tree)
      }
    },
    handleNodeClick (data) {
      if (typeof this.registedEvents === 'undefined') {
        return
      }
      if (this.registedEvents.includes('handleNodeClick')) {
        handelNodeClick.call(this, data)
      }
      if (this.registedEvents.includes('handleNodeClick2')) {
        handelNodeClick2.call(this, data)
      }
    }
  }
}
</script>
