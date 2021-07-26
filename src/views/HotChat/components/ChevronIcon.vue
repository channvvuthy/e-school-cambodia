<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"  :height="size" viewBox="0 0 172 172">
        <g :fill="fill" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal">
            <path d="M0,172v-172h172v172z" fill="none"/>
            <g :fill="fill">
            <path d="M86,6.88c-43.65844,0 -79.12,35.46156 -79.12,79.12c0,43.65844 35.46156,79.12 79.12,79.12c43.65844,0 79.12,-35.46156 79.12,-79.12c0,-43.65844 -35.46156,-79.12 -79.12,-79.12zM86,13.76c39.93625,0 72.24,32.30375 72.24,72.24c0,39.93625 -32.30375,72.24 -72.24,72.24c-39.93625,0 -72.24,-32.30375 -72.24,-72.24c0,-39.93625 32.30375,-72.24 72.24,-72.24zM85.57,58.48c-0.76594,0.08063 -1.49156,0.43 -2.0425,0.9675l-34.4,34.4c-1.37062,1.37063 -1.37062,3.57438 0,4.945c1.37063,1.37063 3.57438,1.37063 4.945,0l31.9275,-31.9275l31.9275,31.9275c1.37063,1.37063 3.57438,1.37063 4.945,0c1.37063,-1.37062 1.37063,-3.57437 0,-4.945l-34.4,-34.4c-0.76594,-0.7525 -1.84094,-1.11531 -2.9025,-0.9675z"/>
            </g>
        </g>
    </svg>
</template>
<script>
    export default{
        name: "ChevronIcon",
        props: {
            fill: {
                default: function () {
                    return "#666666"
                }
            },
            size: {
                default: function () {
                    return 22
                }
            }
        }
    }
</script>