<template>
  <div tabindex="1" @blur="onBlur" @focus="onFocus">
    <el-card body-style="padding: 0px;" v-show="show" class="box-card">
      <div class="text item">
        <el-popover
          placement="right-start"
          trigger="hover"
          :visible-arrow="visibleArrow">
          <div>
            <div class="text item"><el-button @click="handleCommand('newNote')">新建文件</el-button></div>
            <div class="text item"><el-button @click="handleCommand('newCatalog')">新建文件夹</el-button></div>
          </div>
          <el-button slot="reference">
            <i class="el-icon-circle-plus-outline"></i>
            <span>新文档</span>
            <i class="el-icon-caret-right"></i>
          </el-button>
        </el-popover>
      </div>
      <div v-show="showMenu" @click="showRenameDialog" class="text item"><el-button :plain="plain">重命名</el-button></div>
      <div v-show="showMenu && isNote" @click="showChangeCatalogDialog" class="text item"><el-button :plain="plain">移动到</el-button></div>
      <div v-show="showMenu" @click="showDeleteDialog" class="text item"><el-button :plain="plain">删除</el-button></div>
    </el-card>
  </div>
</template>

<script>
let timeout = null
function closeCatalogMenu () {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    this.$store.dispatch('show', {
      key: 'showCatalogMenu',
      value: false
    })
  }, 500)
}
export default {
  name: 'CatalogMenu',
  data () {
    return {
      plain: false,
      visibleArrow: false
    }
  },
  props: {
    show: Boolean
  },
  computed: {
    showMenu: function () {
      const selectedNode = this.$store.getters.selectedNode
      if (selectedNode.id && selectedNode.id !== this.$store.getters.catalog[0].id) {
        return true
      }
      return false
    },
    isNote: function () {
      const selectedNode = this.$store.getters.selectedNode
      return selectedNode.isNote
    }
  },
  methods: {
    onBlur (event) {
      closeCatalogMenu.call(this)
    },
    onFocus (event) {
      clearTimeout(timeout)
    },
    showRenameDialog (event) {
      this.$store.dispatch('show', {
        key: 'showRenameDialog',
        value: true
      })
    },
    showChangeCatalogDialog (event) {
      this.$store.dispatch('show', {
        key: 'showChangeCatalogDialog',
        value: true
      })
    },
    showDeleteDialog (event) {
      this.$store.dispatch('show', {
        key: 'showDeleteDialog',
        value: true
      })
    },
    handleCommand: function (command) {
      let catalog = this.$store.getters.activeCatalog
      if (command === 'newNote') {
        // 创建笔记
        this.$store.dispatch('addNote', {
          catalog: catalog
        })
      }
      if (command === 'newCatalog') {
        // 创建目录
        this.$store.dispatch('addCatalog', {
          catalog: catalog
        })
      }
    }
  }
}
</script>

<style>
 #catalog-menu:focus {
   outline: 0px;
 }
 .el-card__header {
   padding: 10px 20px;
 }
 .el-popover {
   min-width: auto;
   padding: 0px;
 }
 .item {
   margin: 0px -4px;
 }
 .item > button {
   width: 100%;
   border: 0px;
 }
</style>
