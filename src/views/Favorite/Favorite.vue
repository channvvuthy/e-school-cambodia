<template>
    <div>
       <eHeader :title="title"></eHeader>
       <div class="mt-3">
           <div class="px-5 pt-7 shadow-md" :class="darkMode?`bg-secondary border-t border-b border-button text-textSecondary`:`bg-white text-black`">
                <!-- Tab -->
                <div class="mt-7 px-3">
                    <div class="flex justify-start">
                        <div @click="changeType('video')" class="cursor-pointer  w-12 text-center" :class="type==`video`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{$t('2108')}}</div>
                            <div v-if="type === `video`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"></BorderBottom>
                            </div>
                        </div>
                        <div @click="changeType('book')" class="cursor-pointer ml-20 w-24 text-center" :class="type==`book`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
                            <div class="pb-2">{{$t('2202')}}</div>
                            <div v-if="type === `book`">
                                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"></BorderBottom>
                            </div>
                        </div>
                        
                    </div>
                </div>
           </div>
       </div>
    </div>
</template>

<script>
import eHeader from "./../Video/components/Header.vue"
import BorderBottom from "./../../components/BorderBottom.vue"
import {mapState, mapActions} from "vuex"
export default {
    components:{
        eHeader,
        BorderBottom
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    data(){
        return{
            title: '1109',
            type:'video'
        }
    },
    methods:{
        changeType(type){
            this.showAudio = false
            this.type = type
            let filter = {
                type: this.type
            }
            
            if(this.filter_id != null){
                filter.filter_id = this.filter_id
            }

            
        },
    }

    
}
</script>