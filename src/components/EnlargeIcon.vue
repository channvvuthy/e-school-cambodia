<template>
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
       :width="size" :height="size"
       viewBox="0 0 172 172"
       style=" fill:#ffffff;">
    <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"
       stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
       font-size="none" text-anchor="none" style="mix-blend-mode: normal">
      <path d="M0,172v-172h172v172z" fill="none"></path>
      <g fill="#ffffff">
        <path
            d="M101.1575,17.2c-3.80281,0.17469 -6.73219,3.39969 -6.5575,7.2025c0.17469,3.80281 3.39969,6.73219 7.2025,6.5575h29.5625l-100.405,100.405v-29.5625c0.02688,-1.86781 -0.69875,-3.655 -2.01562,-4.97187c-1.31688,-1.31688 -3.10406,-2.0425 -4.97188,-2.01563c-3.80281,0.05375 -6.82625,3.18469 -6.7725,6.9875v52.9975h52.9975c2.48594,0.04031 4.78375,-1.26312 6.03344,-3.41312c1.26313,-2.13656 1.26313,-4.79719 0,-6.93375c-1.24969,-2.15 -3.5475,-3.45344 -6.03344,-3.41313h-29.5625l100.405,-100.405v29.5625c-0.04031,2.48594 1.26313,4.78375 3.41313,6.03344c2.13656,1.26313 4.79719,1.26313 6.93375,0c2.15,-1.24969 3.45344,-3.5475 3.41312,-6.03344v-52.9975h-52.9975c-0.215,-0.01344 -0.43,-0.01344 -0.645,0z"></path>
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
    }
  }
}
</script>