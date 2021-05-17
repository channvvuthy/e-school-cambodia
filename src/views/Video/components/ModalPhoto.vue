<template>
    <div class="fixed w-full h-full bg-black flex justify-center items-center z-50 bg-opacity-50">
        <div class="w-96 bg-white shadow p-6 rounded shadow">
            <img :src="imgUrl"  class="max-h-52 m-auto">
            <div class="relative mt-3">
                <div class="text-primary absolute left-0 top-0 font-semibold">{{$t('2112')}}</div>
                <textarea class="border-b border-primary w-full h-10 leading-10 mt-5 focus:outline-none resize-none" v-model="text"></textarea>
                <div class="flex justify-end mt-3">
                    <div class="bg-gray-100 text-black px-3 py-1 font-semibold cursor-pointer" @click="cancel">{{$t('1011')}}</div>
                    <button class="bg-primary text-white rounded px-3 py-1 font-semibold ml-5 cursor-pointer"  :class="loading?`bg-opacity-50`:``" @click="send" :disabled="loading">{{$t('send')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
        methods:{
            cancel(){
                this.$emit("cancel")
            },
            send(){
                this.$emit("send", this.text)
                this.loading = true
            }
        }
    }
</script>
