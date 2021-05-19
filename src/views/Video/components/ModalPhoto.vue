<template>
    <div class="fixed w-full h-full bg-black flex justify-center items-center z-50 bg-opacity-50">
        <div class="w-96 shadow p-6 rounded shadow" :class="darkMode?`bg-youtube`:`bg-white`">
            <img :src="imgUrl"  class="max-h-52 m-auto">
            <div class="relative mt-3">
                <div class="text-primary absolute left-0 top-0 font-semibold" :class="darkMode?`text-gray-300`:`text-black`">{{$t('2112')}}</div>
                <textarea class="border-b border-primary w-full h-10 leading-10 mt-5 focus:outline-none resize-none" v-model="text" :class="darkMode?`bg-transparent border-b border-gray-300 caret-white text-gray-300`:``" ref="text"></textarea>
                <div class="flex justify-end mt-3">
                    <div class="px-3 py-1 font-semibold cursor-pointer" @click="cancel" :class="darkMode?`text-gray-300`:`text-black bg-gray-100`">{{$t('1011')}}</div>
                    <button class="focus:outline-none rounded px-3 py-1 font-semibold ml-5 cursor-pointer flex items-center"  :class="darkMode?`text-white bg-secondary`:`bg-primary text-white`" @click="send" :disabled="loading">
                        <template v-if="loading">
                            <div class="w-1 h-1 rounded-full bg-white ml-1"></div>
                            <div class="w-1 h-1 rounded-full bg-white ml-1"></div>
                            <div class="w-1 h-1 rounded-full bg-white ml-1"></div>
                        </template>
                        <span v-else>{{$t('send')}}</span>
 
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"
    export default{
        name:"ModalPhoto",
        props:{
            imgUrl:{
                default:()=>{
                    return "";
                }
            }
        },
        data(){
            return{
                text:"",
                loading: false
            }
        },
        computed:{
            ...mapState('setting', ['darkMode'])
        },
        methods:{
            cancel(){
                this.$emit("cancel")
            },
            send(){
                this.$emit("send", this.text)
                this.loading = true
            }
        },
        mounted(){
            this.$refs.text.focus()
        }
    }
</script>
<style >
    .caret-white{
        caret-color: #fff;
    }
</style>