<template>
  <div class="editor_box">
    <!-- <el-input :value="note.title"></el-input> -->
    <el-input v-show="note.isNote" autofocus="true" type="textarea" v-model="content" @input="handleChange"></el-input>
  </div>
</template>

<script>
let clock = (function () {
  let timeout = null
  return function (content) {
    clearTimeout(timeout)
    let note = {...this.$store.getters.activeNote}
    timeout = setTimeout(() => {
      try {
        console.log('handleChange: ' + content)
        note.content = content
        this.$store.dispatch('updateNote', {
          note: note
        })
        // 重载当前目录
        const activeCatalog = this.$store.getters.activeCatalog
        let catalog = {
          id: activeCatalog.id,
          label: activeCatalog.label,
          children: []
        }
        // 设置当前目录
        this.$store.dispatch('activeCatalog', {
          catalog: catalog
        })
      } catch (err) {
        console.log('handleChange error: ' + err.message)
      }
    }, 1000 * 1)
  }
})()
export default {
  name: 'Editor',
  props: {
    note: Object
  },
  computed: {
    content: {
      get: function () {
        return this.note.content
      },
      set: function (newValue) {
        this.note.content = newValue
      }
    }
  },
  methods: {
    handleChange: function (content) {
      clock.call(this, content)
    }
  }
}
</script>

<style>
  .editor_box, .editor_box > .el-textarea, .editor_box > .el-textarea > textarea {
    height: 100%;
  }
  .editor_box > .el-textarea > textarea {
    resize: none;
  }
</style>
