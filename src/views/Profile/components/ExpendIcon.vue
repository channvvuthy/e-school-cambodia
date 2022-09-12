<template>
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" :height="size"
       xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 213.333 213.333"
       style="enable-background:new 0 0 213.333 213.333" xml:space="preserve">
        <g :fill="fill">
            <g>
            <polygon points="0,53.333 106.667,160 213.333,53.333 		"/>
            </g>
        </g>
    </svg>
</template>
<script>
export default {
  props: {
    size: {
      default: () => {
        return 20
      }
    },
    fill: {
      default: () => {
        return "#000000"
      }
    }
  }
}
</script>