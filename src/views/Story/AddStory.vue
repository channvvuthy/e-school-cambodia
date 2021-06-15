<template>
    <div class="fixed w-full h-full bg-black top-0 left-0 z-50 flex justify-center items-center">
        <div class="rounded-md shadow p-3 w-96 flex flex-col justify-center" style="max-height:90%" :class="darkMode?`bg-secondary`:`bg-white`">
            <div class="flex justify-between items-center">
                <div class="mb-3 font-semibold" :class="darkMode?`text-gray-300`:``">{{$t('preview')}}</div>
                <div class="cursor-pointer relative -top-2" @click="closeAddStory">
                    <CloseIcon :width="20" :fill="darkMode?`#afb0b4`:`#000000`"></CloseIcon>
                </div>
            </div>
            <div class="flex-1 overflow-hidden h-screen">
                <img :src="imgUrl" class="m-auto max-h-full rounded-md">
            </div>
            <div class="flex justify-end mt-4">
                <button class="flex items-center text-sm justify-center rounded h-10 leading-10 cursor-pointer px-5 focus:outline-none shadow" 
                :class="darkMode?`bg-youtube border border-button text-gray-300`:`bg-primary text-white`"
                :disabled="addingStory"
                @click="shareStory">
                    <span>{{$t('share_to_story')}} </span>
                    <div class="loader ml-2" v-if="addingStory"></div>
                </button>
                
            </div>
            
        </div>
    </div>
</template>

<script>
import CloseIcon from "./../../components/CloseIcon.vue"
import {mapState} from "vuex"
export default {
    components:{
        CloseIcon
    },
    computed:{
        ...mapState('auth', ['imgUrl','addingStory']),
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        closeAddStory(){
            this.$emit("closeAddStory")
        },
        shareStory(){
            this.$emit("shareStory")
        }
    }
}
</script>
<style scoped>
    .loader {
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid #3498db;
        width: 15px;
        height: 15px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        }

        /* Safari */
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg);
        }
    }

</style>
