<template>
    <div class="fixed w-full h-full justify-center items-center z-50 left-0 top-0 bg-black bg-opacity-95 flex">
        <div :class="darkMode?`bg-secondary text-gray-300`:``" class="w-96 rounded-md">
            <div class="flex justify-between px-4 items-center" :class="darkMode?`border-b border-black`:``">
                <div class="h-12 flex items-center">
                    Select Chat
                </div>
                <div class="cursor-pointer" @click="closeAdminMember">
                    <CloseIcon :width="20" :fill="darkMode?`#909090`:`#000000`"/>
                </div>
            </div>
            <div class="flex items-center justify-center h-40 w-full pb-14" v-if="loading">
                <div class="loader"></div>
            </div>
            <div v-else>
                <div class="overflow-y-scroll" style="height:28rem;" @scroll="onScroll">
                    <div v-for="(member, index) in admin" :key="index" class="flex items-center py-3 px-4 cursor-pointer" @click="selectedChat(member)">
                        <div>
                            <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3" :style="{backgroundImage:`url(${member.photo})`}"></div>
                        </div>
                        <div>
                            <div class="text-sm fon-medium" :class="darkMode?`text-gray-300`:``">
                                <div class="flex">
                                    <div>
                                        {{member.name}}
                                    </div>
                                    <div v-if="member.type===0" class="h-4 w-4 rounded-full ml-3 flex items-center justify-center" :class="darkMode?`bg-youtube text-gray-500`:`bg-gray-400 text-gray-200`">
                                       <span style="font-size:10px;">&#10003;</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                {{member.last == undefined?$t('ticket') + ' ' + member.ticket:cutString(member.last.message, 20)}}
                            </div>
                        </div>
                        <div class="flex flex-1 justify-end items-end h-full">
                            <div>
                                <div class="flex justify-center" v-if="member.unread">
                                    <div class="h-4 w-4 rounded-full flex items-center justify-center text-xs" :class="darkMode?`bg-white text-black`:`bg-heart text-white`">{{member.unread}}</div>
                                </div>
                                <div class="text-xs mt-1 whitespace-nowrap" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                    {{member.last == undefined?$t('unread') + ' ' + member.unread:getDay(member.last.date)}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from "vuex"
import CloseIcon from "./../../../components/CloseIcon.vue"
import helper from "./../../../helper/helper"
import moment from "moment"
export default {
    components:{
        CloseIcon,
    },
    data(){
        return{
            loading: false,
            page: 1,
            enableScroll: true
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('etalk', ['admin'])
    },
    methods:{
        ...mapActions('etalk', ['getAdminContact']),
        closeAdminMember(){
            this.$emit("closeAdminMember")
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        getDay(oldDate){
            if (helper.numDay(oldDate, moment().format()) === 0) {
                return moment(oldDate).format('h:mm A')
            } else {
                return moment(oldDate).format('DD-MM-YYYY')
            }
        },
        selectedChat(member){
            this.$emit("selectedChat", member)
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}){
            if (scrollTop + clientHeight >= scrollHeight) {
                this.page ++ 
                let payload = {}
                payload.p = this.page
                if(this.enableScroll){
                    this.getAdminContact(payload).then(response =>{
                        if(response.data.data.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
    },
    created(){
        this.enableScroll = true
        this.page = 1
        this.loading = true

        this.getAdminContact({
            p: this.page
        }).then(()=>{
            this.loading = false
        })
    }
}
</script>