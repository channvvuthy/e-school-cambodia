<template>
  <svg  xmlns="http://www.w3.org/2000/svg" :width="size" :height="size"
       viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" :fill="fill" stroke="none">
      <path d="M405 5052 c-139 -42 -241 -113 -309 -217 -78 -117 -111 -268 -87
-397 7 -37 146 -397 339 -880 l327 -818 2222 0 2223 0 -10 25 c-30 80 -98 168
-172 224 -53 39 -4087 1999 -4218 2049 -88 33 -229 40 -315 14z"/>
      <path d="M348 1563 c-180 -450 -331 -842 -337 -871 -34 -164 26 -359 148 -481
110 -110 226 -156 391 -155 88 0 116 5 170 26 50 20 3322 1600 4050 1956 89
44 165 88 196 116 55 48 114 129 139 189 l15 37 -2223 0 -2223 0 -326 -817z"/>
    </g>
  </svg>

</template>
<script>
export default {
  name: "SendMessageIcon",
  props: {
    size: {
      type: Number,
      default: () => {
        return 35;
      }
    },
    fill: {
      default: () => {
        return "#3498db"
      }
    }
  }
}
</script>