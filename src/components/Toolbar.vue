<template>
    <div>
        <el-dropdown placement="bottom" trigger="click" @command="handleCommand" class="newOp">
            <el-button type="primary">
                + 新文档
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="newNote">新建笔记</el-dropdown-item>
                <el-dropdown-item command="newCatalog">新建文件夹</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <catalog :catalog="catalog" :registed-events="['showCatalogMenu', 'handleNodeClick']"></catalog>
    </div>
</template>

<script>
import Catalog from './Catalog'

export default {
  name: 'Toolbar',
  components: {
    catalog: Catalog
  },
  computed: {
    catalog () {
      // 初始化目录
      return this.$store.getters.catalog
    }
  },
  methods: {
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
  .newOp, .newOp > .el-button {
    width: 100%;
  }
</style>
