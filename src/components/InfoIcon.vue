<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
         width="24" height="24"
         viewBox="0 0 172 172"
         style=" fill:#000000;">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"
           stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
           font-size="none" text-anchor="none" style="mix-blend-mode: normal">
            <path d="M0,172v-172h172v172z" fill="none"></path>
            <g :fill="fill">
                <path d="M84.28,6.88c-10.41406,0 -18.92,8.50594 -18.92,18.92c0,10.41406 8.50594,18.92 18.92,18.92c10.41406,0 18.92,-8.50594 18.92,-18.92c0,-10.41406 -8.50594,-18.92 -18.92,-18.92zM84.28,13.76c6.69188,0 12.04,5.34813 12.04,12.04c0,6.69188 -5.34812,12.04 -12.04,12.04c-6.69187,0 -12.04,-5.34812 -12.04,-12.04c0,-6.69187 5.34813,-12.04 12.04,-12.04zM51.6,55.04c-1.89469,0 -3.44,1.54531 -3.44,3.44v20.64c0,1.89469 1.54531,3.44 3.44,3.44h17.2v55.04h-17.2c-1.89469,0 -3.44,1.54531 -3.44,3.44v20.64c0,1.89469 1.54531,3.44 3.44,3.44h68.8c1.89469,0 3.44,-1.54531 3.44,-3.44v-20.64c0,-1.89469 -1.54531,-3.44 -3.44,-3.44h-17.2v-79.12c0,-1.89469 -1.54531,-3.44 -3.44,-3.44zM55.04,61.92h41.28v79.12c0,1.89469 1.54531,3.44 3.44,3.44h17.2v13.76h-61.92v-13.76h17.2c1.89469,0 3.44,-1.54531 3.44,-3.44v-61.92c0,-1.89469 -1.54531,-3.44 -3.44,-3.44h-17.2z"></path>
            </g>
        </g>
    </svg>
</template>

<script>
    export default{
        name: "InfoIcon",
        props: {
            fill: {
                type: String,
                default: function () {
                    return "#000000"
                }
            }
        }
    }
</script>