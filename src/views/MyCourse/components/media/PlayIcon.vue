<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <g fill="#FFFFFF">
            <path d="M3 22v-20l18 10-18 10z"/>
        </g>
    </svg>

</template>
<script>
    export default{
        name: "PlayIcon",
        props:{
            fill:{
                defafult:()=>{
                    return "#ffffff"
                }
            }
        }
    }
</script>