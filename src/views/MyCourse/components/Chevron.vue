<template>
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
       :width="size" :height="size"
       viewBox="0 0 226 226"
       style=" fill:#000000;">
    <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"
       stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
       font-size="none"  style="mix-blend-mode: normal">
      <path d="M0,226v-226h226v226z" fill="none"></path>
      <g :fill="fill">
        <path
            d="M29.79492,76.14258l-10.15234,10.15234l88.28125,88.28125l5.07617,4.85547l5.07617,-4.85547l88.28125,-88.28125l-10.15234,-10.15234l-83.20508,83.20508z"></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      default: () => 25
    },
    fill: {
      default: () => {
        return "#055174"
      }
    }
  }
}
</script>