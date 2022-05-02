<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" :width="width" :height="height" viewBox="0 0 172 172" style=" fill:#000000;">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
            <path d="M0,172v-172h172v172z" fill="none"></path>
            <g :fill="fill">
                <path d="M116.45833,9.63021l-64.5,71.66667l-4.25521,4.70313l4.25521,4.70313l64.5,71.66667l10.75,-9.40625l-60.24479,-66.96354l60.24479,-66.96354z"></path>
            </g>
        </g>
    </svg>
</template>
<script>
    export default{
        name: "BackIcon",
        props: {
            width: {
                type: Number,
                default: function () {
                    return 24;
                }
            },
            height: {
                type: Number,
                default: function () {
                    return 24;
                }
            },
            fill:{
                default:() =>{
                    return "#000000"
                }
            }
        }
    }
</script>