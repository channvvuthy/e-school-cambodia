<template>

</template>

<script>
export default {
  name: "Logout",
  created() {
    this.$router.push({
      name: "home"
    })
  }
}
</script>

<style scoped>

</style>