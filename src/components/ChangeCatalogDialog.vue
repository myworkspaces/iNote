<template>
  <el-dialog title="移动到" :visible="show" @close="closeChangeCatalogDialog" width="30%" center>
    <el-form>
      <el-form-item label="">
        <el-input :disabled="true" :value="path"></el-input>
      </el-form-item>
      <el-form-item label="">
        <catalog :catalog="catalog" :registed-events="['handleNodeClick2']"></catalog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeChangeCatalogDialog">取 消</el-button>
      <el-button type="primary" @click="updateAndCloseChangeCatalogDialog" :disabled="path === emptyPath">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Catalog from './Catalog'

function closeChangeCatalogDialog () {
  this.$store.dispatch('show', {
    key: 'showChangeCatalogDialog',
    value: false
  })
}

export default {
  name: 'ChangeCatalogDialog',
  components: {
    catalog: Catalog
  },
  data () {
    return {
      emptyPath: '移动到：'
    }
  },
  props: {
    show: Boolean
  },
  computed: {
    catalog: function () {
      return this.$store.getters.catalog
    },
    note: function () {
      return this.$store.getters.activeNote
    },
    path: function () {
      const catalog = this.$store.getters.updateCatalog
      let path = this.emptyPath
      if (typeof catalog !== 'undefined') {
        path += this.$store.getters.catalog[0].label
        if (typeof catalog.path !== 'undefined') {
          path += catalog.path
        }
      }
      return path
    }
  },
  methods: {
    closeChangeCatalogDialog () {
      closeChangeCatalogDialog.call(this)
    },
    updateAndCloseChangeCatalogDialog () {
      console.log('update', this.$store.getters.selectedNode)
      let node = this.$store.getters.selectedNode
      node.catalog_id = this.$store.getters.updateCatalog.id
      this.$store.dispatch('updateNode', {
        node: node
      })
      closeChangeCatalogDialog.call(this)
    }
  }
}
</script>
