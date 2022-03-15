<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
    <g :fill="fill">
      <path d="M21 12l-18 12v-24z"/>
    </g>
  </svg>

</template>

<script>
export default {
  name: "Next",
  props: {
    size: {
      default: () => 22
    },
    fill: {
      default: () => "#000"
    }
  }
}
</script>
