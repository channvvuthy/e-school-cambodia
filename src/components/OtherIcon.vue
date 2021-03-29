<template>
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
         width="24" height="24"
         viewBox="0 0 172 172"
         style="fill:#000000;">
        <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"
           stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none"
           font-size="none" text-anchor="none" style="mix-blend-mode: normal">
            <path d="M0,172v-172h172v172z" fill="none"></path>
            <g :fill="fill">
                <path d="M17.2,13.76c-1.89978,0.00019 -3.43981,1.54022 -3.44,3.44v137.6c0.00019,1.89978 1.54022,3.43981 3.44,3.44h137.6c1.89978,-0.00019 3.43981,-1.54022 3.44,-3.44v-137.6c-0.00019,-1.89978 -1.54022,-3.43981 -3.44,-3.44zM20.64,20.64h61.92v61.92h-61.92zM89.44,20.64h61.92v61.92h-61.92zM20.64,89.44h61.92v61.92h-61.92zM89.44,89.44h61.92v61.92h-61.92z"></path>
            </g>
        </g>
    </svg>
</template>

<script>
    export default{
        name: "OtherIcon",
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