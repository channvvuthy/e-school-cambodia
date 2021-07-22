<template>
    <div>
        <eHeader></eHeader>
        <div class="flex mt-5 px-5">
            <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                    <div class="w-36 h-36 rounded-full bg-gray-300"></div>
                </div>
                <div class="w-full bg-red-100 bg-cover h-40" style="background-image:url('cover.jpg');background-repeat:no-repeat;background-position:0px -5px;">
                
                </div>
                <div class="bg-white h-36 pt-14">
                    <div class="text-primary text-base pt-5 text-center">Bernd Pfefferberg</div>
                    <div class="text-center">
                        Grade 12
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3 ml-5 w-full">
                <div v-for="(j, index) in 6" :key="index" class="shadow-md rounded-xl bg-white">
                    {{j}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
export default {
    components:{
        eHeader
    }
}
</script>