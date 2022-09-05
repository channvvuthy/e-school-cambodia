<template>
  <div class="flex justify-between items-center cursor-pointer" @click="onPay">
    <img :src="logo" class="w-20 rounded-md"/>
    <div class="flex-1 ml-5 text-left flex justify-start flex-col items-start">
      <div class="text-base font-semibold">{{ name }}</div>
      <div class="text-center text-sm mt-2">{{ company }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentOption",
  props: {
    name: {
      required: true,
      default: function () {
        return ""
      }
    },
    logo: {
      required: true,
      default: function () {
        return ""
      }
    },
    company: {
      required: true,
      default: function () {
        return ""
      }
    }
  },
  methods: {
    onPay() {
      this.$emit("onPay")
    }
  }
}
</script>

<style scoped>

</style>