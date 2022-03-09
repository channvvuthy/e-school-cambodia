<template>
    <div class="flex items-center flex-col justify-center h-screen bg-white text-center font-khmer_os">
        <div class="h-full flex flex-col items-center justify-center">
            <img src="e-school-logo.png" class="w-56">
            <div class="font-black flex text-4xl text-center mt-5 font">
                <div class="text-primary drop-shadow-xl" v-if="knowledge">ចំណេះ</div>
                <div class="mx-5 text-heart" v-if="skill">ជំនាញ</div>
                <div class="text-primary" v-if="income">ចំណូល</div>
            </div>
        </div>
        <div class="flex justify-end  w-full">
            <img src="e-footer.png" class="w-full">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            knowledge: false,
            skill: false,
            income: false
        }
    },
    created(){
        setTimeout(()=>{
            this.knowledge = true
        },1000)
        setTimeout(()=>{
            this.skill = true
        },2000)
        setTimeout(()=>{
            this.income = true
        },3000)
    }
}
</script>
<style>
    .font{
        font-family: "Nokora";
    }
</style>