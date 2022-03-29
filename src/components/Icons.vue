<template>
  <div>
    <component
        :is="componentAsProp"
        :fill="fill"
        :size="size"/>
  </div>
</template>

<script>
export default {
  name: "Icons",
  props: {
    componentAsProp: {
      required: true
    },
    fill: {
      default: () => "#000"
    },
    size: {
      default: () => 24
    }
  }
}
</script>