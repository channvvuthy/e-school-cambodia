<template>
    <span>
        <span v-if="isRead" class="relative">
            <span>&#10003;</span>
            <span class="absolute left-1">&#10003;</span>
        </span>
        <span v-else class="relative">
            <span>&#10003;</span>
        </span>
    </span>
</template>
<script>
export default {
  props: {
    isRead: {
      default: () => {
        return 0
      }
    }
  }
}
</script>