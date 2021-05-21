<template>
    <div class="absolute left-0 top-0 w-full h-full z-50 pt-10" :class="darkMode?`bg-youtube text-gray-300`:`bg-white text-black`">
        <div class="flex justify-center">
            <div>
                <div class="text-base font-semibold text-center">{{$t('2128')}}</div>
                <div class="mt-5 flex justify-center items-center"><SadEmojiIcon :size="55"></SadEmojiIcon></div>
                <div :class="darkMode?`bg-secondary`:`shadow-xl border-t border-gray-100`" class="rounded-xl py-10 px-5 mt-10 w-72 text-center">
                    <div class="font-semibold">{{stProfile.first_name}} {{stProfile.last_name}}</div>
                    <div class="mt-5 font-semibold" style="color:#5aa20a">{{$t('2129')}}</div>
                    <div class="border-b mt-5  border-dashed" :class="darkMode?`border-gray-700`:`border-gray-400`"></div>
                    <div class="mt-5 font-semibold" :style="darkMode?``:{color:`#0b3465`}">{{result.correct}}/{{result.total_quiz}}</div>
                    <button class="rounded-md mt-5 focus:outline-none py-2 px-5 shadow-lg" :class="darkMode?`bg-button text-gray-300`:`bg-primary text-white`">{{$t('2133')}}</button>
                </div>

                <div class="w-72 flex flex-col justify-center items-center mt-8">
                    <button class="focus:outline-none rounded-md mb-5 w-full py-2 flex justify-between items-center px-5 shadow-lg border-t border-gray-100" :class="darkMode?``:`bg-white shadow-md`">
                        <div :class="darkMode?``:`bg-gray-200 w-9 h-9 rounded-full flex justify-center items-center `"><PdfCertIcon :size="20"></PdfCertIcon></div>
                        <div class="flex-1 text-left pl-5">Certificate.pdf</div>
                    </button>
                    <button class="rounded-md w-full focus:outline-none py-2 px-5 shadow-lg" :class="darkMode?`bg-button text-gray-300`:`bg-primary text-white `" @click="exit">{{$t('2132')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>      
import {mapState} from "vuex"
import SadEmojiIcon from "../../../components/SadEmojiIcon.vue"
import PdfCertIcon from "../../../components/PdfCertIcon.vue"

export default {
    props:{
        result:{
            default:()=>{
                return {}
            }
        }
    },
    components:{
        SadEmojiIcon,
        PdfCertIcon
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile'])
    },
    methods:{
        exit(){
            this.$$emit("exit")
        }
    }
}
</script>