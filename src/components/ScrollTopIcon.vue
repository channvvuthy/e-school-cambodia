<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" :width="size" :height="size" viewBox="0 0 172 172" style="fill:#000000">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal">
            <path d="M0,172v-172h172v172z" fill="none"/>
            <g :fill="fill">
            <path d="M86,17.79125l-73.66437,73.66438c-1.80063,1.72 -2.52625,4.28656 -1.89469,6.70531c0.63156,2.40531 2.51281,4.28656 4.91813,4.91813c2.41875,0.63156 4.98531,-0.09406 6.70531,-1.89469l63.93562,-63.93563l63.93563,63.93563c1.72,1.80062 4.28656,2.52625 6.70531,1.89469c2.40531,-0.63156 4.28656,-2.51281 4.91813,-4.91813c0.63156,-2.41875 -0.09406,-4.98531 -1.89469,-6.70531zM86,62.51125l-73.66437,73.66438c-1.80063,1.72 -2.52625,4.28656 -1.89469,6.70531c0.63156,2.40531 2.51281,4.28656 4.91813,4.91813c2.41875,0.63156 4.98531,-0.09406 6.70531,-1.89469l63.93562,-63.93563l63.93563,63.93563c1.72,1.80062 4.28656,2.52625 6.70531,1.89469c2.40531,-0.63156 4.28656,-2.51281 4.91813,-4.91813c0.63156,-2.41875 -0.09406,-4.98531 -1.89469,-6.70531z"/>
            </g>
        </g>
    </svg>
</template>
<script>
export default {
    props:{
        size:{
            default:()=>{
                return 32;
            }
        },
        fill:{
            default:()=>{
                return "#000000";
            }
        }
    }
}
</script>