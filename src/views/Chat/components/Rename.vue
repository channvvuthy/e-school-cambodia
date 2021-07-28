<template>
    <div class="flex items-center justify-center items-center fixed left-0 top-0 h-full w-full z-50 bg-black bg-opacity-90">
        <div class="w-1/3" :class="darkMode?`bg-secondary rounded-lg`:`bg-white e-shadow rounded-lg`">
            <div class="flex items-center justify-center py-4 relative border-b" :class="darkMode?`border-button text-gray-300`:``">
                <div class="font-semibold text-base">{{$t('change_group_name')}}</div>
                <div class="absolute right-4 top-4 cursor-pointer" @click="cancelRename()">
                    <CloseIcon :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                </div>
            </div>
            <div class="p-5">
                <input type="text" v-model="name.name" class="h-10 rounded-md focus:outline-none w-full pl-3" :class="darkMode?`bg-button text-gray-300`:`bg-softGray`">
            </div>
            <div class="flex justify-end items-center mb-5 px-5">
                <button class="focus:outline-none px-3 py-2 rounded" :class="darkMode?`bg-button text-gray-300`:`bg-gray-500 text-white`" @click="cancelRename()">
                    {{$t('1011')}}
                </button>
                <button :disabled="loading" class="focus:outline-none px-3 py-2 rounded ml-4 bg-primary text-white" @click="rename()" :class="loading?`opacity-30`:``">
                    {{$t('save_change')}}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import CloseIcon from "./../../../components/CloseIcon.vue"
import helper from "./../../../helper/helper"
export default {
    props:{
        group:{
            default: () => {
                return{
                    name: "Group Name"
                }
            }
        }
    },
    components:{
        CloseIcon
    },
    data(){
        return{
            loading: false
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        name:{
            get(){
                return this.group
            },
            set(value){
                return value
            }
            
        }
    },
    methods:{
        ...mapActions('etalk', ['renameGroup']),
        cancelRename(){
            this.$emit("cancelRename")
        },
        rename(){
           let payload = {
               name: this.name.name,
               id: this.name._id
           }
           if(!payload.name.trim()){
               helper.errorMessage("please_enter_group_name")
               return
           }
           
           this.loading = true
           this.renameGroup(payload).then(() => {
               this.loading = false
               this.cancelRename()
           })
          
        }
    }
}
</script>