<template>
  <svg id="Editable-line" viewBox="0 0 32 32" xml:space="preserve"
       :height="size"
       xmlns="http://www.w3.org/2000/svg">
  <path d="  M16,7C9.934,7,4.798,10.776,3,16c1.798,5.224,6.934,9,13,9s11.202-3.776,13-9C27.202,10.776,22.066,7,16,7z"
        fill="none" id="XMLID_10_" :stroke="fill" stroke-linecap="round" stroke-linejoin="round"
        stroke-miterlimit="10" stroke-width="1.5"/>
    <circle cx="16" cy="16" fill="none" id="XMLID_12_" r="5" :stroke="fill" stroke-linecap="round"
            stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"/>
</svg>

</template>

<script>
export default {
  name: "Eye",
  props: {
    size: {
      default: () => {
        return 25
      }
    },
    fill: {
      default: () => {
        return "#4A4A4A"
      }
    }
  }
}
</script>