<template>
    <div class="w-full" :class="bg" :style="{height:`${h}px`}"></div>
</template>
<script>
export default {
    props:{
        bg:{
            default:() =>{
                return 'bg-primary'
            }
        },
        h:{
            default:() =>{
                return '3'
            }
        }
    }
}
</script>