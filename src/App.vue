<template>
  <div id="container" @contextmenu.prevent="showContextMenu">
    <el-container>
      <el-aside width="200px" class="toolbar">
        <toolbar></toolbar>
      </el-aside>
      <el-container>
        <el-aside width="200px">
          <search></search>
          <catalog :catalog="catalog" :registed-events="['showCatalogMenu', 'handleNodeClick']"></catalog>
        </el-aside>
        <el-main class="editor">
          <editor :note="note"></editor>
        </el-main>
      </el-container>
    </el-container>
    <!-- 弹窗 -->
    <catalog-menu id="catalog-menu" class="diy-dialog" :show="showCatalogMenu"></catalog-menu>
    <delete-dialog id="delete-dialog" class="diy-dialog" :show="showDeleteDialog"></delete-dialog>
    <rename-dialog id="rename-dialog" class="diy-dialog" :show="showRenameDialog"></rename-dialog>
    <change-catalog-dialog id="change-catalog-dialog" class="diy-dialog" :show="showChangeCatalogDialog"></change-catalog-dialog>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Search from './components/Search'
import Catalog from './components/Catalog'
import Editor from './components/Editor'
// 弹窗
import CatalogMenu from './components/CatalogMenu'
import DeleteDialog from './components/DeleteDialog'
import RenameDialog from './components/RenameDialog'
import ChangeCatalogDialog from './components/ChangeCatalogDialog'

function showContextMenu () {
  // console.log(event)
}

export default {
  name: 'App',
  components: {
    'toolbar': Toolbar,
    'search': Search,
    'catalog': Catalog,
    'editor': Editor,
    'catalog-menu': CatalogMenu,
    'delete-dialog': DeleteDialog,
    'rename-dialog': RenameDialog,
    'change-catalog-dialog': ChangeCatalogDialog
  },
  computed: {
    catalog () {
      // 初始化目录
      return this.$store.getters.activeCatalog.children
    },
    note () {
      // 当前笔记
      return this.$store.getters.activeNote
    },
    showCatalogMenu () {
      return this.$store.getters.showCatalogMenu
    },
    showDeleteDialog () {
      return this.$store.getters.showDeleteDialog
    },
    showRenameDialog () {
      return this.$store.getters.showRenameDialog
    },
    showChangeCatalogDialog () {
      return this.$store.getters.showChangeCatalogDialog
    }
  },
  beforeMount: function () {
    this.$store.dispatch('initData')
  },
  methods: {
    showContextMenu (event) {
      showContextMenu.call(this)
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
  #container {
    height: 100%;
    position: relative;
  }
  .el-container:first-child {
    padding-top: 20px;
    height: 100%;
  }
  .toolbar {
    padding: 0px 20px;
  }
  .editor {
    padding-top: 0px;
  }
  #catalog-menu {
    position: absolute;
  }
</style>
