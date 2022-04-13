<template>
  <button
      class="bg-primary rounded-lg flex items-center justify-center text-sm font-black text-white outline-none py-1 px-5">
    {{$t('1126')}}
  </button>
</template>

<script>
export default {
  created() {
    this.$router.push({
      name: "home"
    })
  }
}
</script>
