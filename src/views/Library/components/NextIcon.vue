<template>
  <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
    <g :fill="fill">
      <path d="M2 24l18-12-18-12v24zm19-24v24h1v-24h-1zm-2.803 12l-15.197 10.132v-20.263l15.197 10.131z"/>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    size: {
      default: () => {
        return 24
      }
    },
    fill: {
      default: () => {
        return "#ffffff"
      }
    }
  }
}
</script>