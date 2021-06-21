<template>
  <div>
    <el-button type="info" @click="logout">exit</el-button>
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>
<style lang="scss" scoped>
</style>