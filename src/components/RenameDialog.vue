<template>
  <el-dialog title="重命名" :visible="show" @close="closeRenameDialog" width="30%" center>
    <el-form>
      <el-form-item label="重命名为">
        <el-input v-model="newName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeRenameDialog">取 消</el-button>
      <el-button type="primary" @click="updateAndCloseRenameDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
function closeRenameDialog () {
  this.$store.dispatch('show', {
    key: 'showRenameDialog',
    value: false
  })
}

export default {
  name: 'RenameDialog',
  props: {
    show: Boolean
  },
  computed: {
    newName: {
      get: function () {
        return this.$store.getters.selectedNode.label
      },
      set: function (newValue) {
        let selectedNode = this.$store.getters.selectedNode
        selectedNode.label = newValue
      }
    }
  },
  methods: {
    closeRenameDialog () {
      closeRenameDialog.call(this)
    },
    updateAndCloseRenameDialog () {
      console.log('update', this.$store.getters.selectedNode)
      this.$store.dispatch('updateNode', {
        node: this.$store.getters.selectedNode
      })
      closeRenameDialog.call(this)
    }
  }
}
</script>
