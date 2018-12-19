<template>
  <div @keyup.enter="search">
    <el-input class="search_box" placeholder="    搜索..." v-model="condition"></el-input>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      condition: ''
    }
  },
  methods: {
    search (event) {
      this.$store.dispatch('search', {
        condition: this.condition
      })
    }
  }
}
</script>

<style>
  .search_box > input {
    border-radius: 20px;
  }
</style>
