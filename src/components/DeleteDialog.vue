<template>
  <el-dialog title="删除" :visible="show" @close="closeDeleteDialog" width="30%" center>
    <span>您确定执行删除操作？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDeleteDialog">取 消</el-button>
      <el-button type="primary" @click="deleteAndCloseDeleteDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
function closeDeleteDialog () {
  this.$store.dispatch('show', {
    key: 'showDeleteDialog',
    value: false
  })
}
export default {
  name: 'DeleteDialog',
  data () {
    return {}
  },
  props: {
    show: Boolean
  },
  methods: {
    closeDeleteDialog () {
      closeDeleteDialog.call(this)
    },
    deleteAndCloseDeleteDialog () {
      this.$store.dispatch('deleteNode')
      closeDeleteDialog.call(this)
    }
  }
}
</script>
