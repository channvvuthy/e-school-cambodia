<template>
  <svg  xmlns="http://www.w3.org/2000/svg" :width="size" :height="size"
       viewBox="0 0 395.000000 510.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,510.000000) scale(0.100000,-0.100000)" :fill="fill" stroke="none">
      <path d="M250 5082 c-81 -40 -150 -143 -176 -265 -20 -92 -20 -4422 0 -4514
28 -130 95 -226 191 -273 41 -20 65 -24 135 -24 96 0 162 17 262 68 104 52
2992 2032 3059 2096 67 65 131 161 156 233 27 78 24 253 -5 328 -31 78 -76
144 -147 214 -42 43 -477 346 -1484 1035 -783 536 -1456 995 -1495 1019 -39
25 -100 57 -136 72 -60 26 -75 28 -195 29 -103 0 -137 -4 -165 -18z"/>
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
