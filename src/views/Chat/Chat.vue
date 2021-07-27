<template>
    <div class="flex h-screen m-5 text-sm">
        <div class="w-80 h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary`:`bg-white`">
            <div class="flex px-4 py-2 items-center justify-between relative" :class="darkMode?`text-gray-300`:`bg-white`">
                <div class="py-3 font-bold" :class="darkMode?``:`text-primary`">E-TALK</div>
                <div class="cursor-pointer" @click="() => {this.eTalkOption = true;}">
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                
                </div>
                <!-- eTalk option -->
                <div :class="darkMode?`bg-button`:`bg-white`" class="rounded-md overflow-hidden e-shadow absolute right-5 top-14 cursor-pointer" v-if="eTalkOption" style="z-index:55">
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                        {{$t('connect_friend')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="goTo(`create-group`)" id="group">
                        {{$t('create_group')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                        {{$t('need_support')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center" :class="darkMode?`border-youtube`:`border-gray-400`">
                        {{$t('mute_all')}}
                    </div>
                   
                </div>
                <!-- Overlay -->
                <div class="fixed w-full h-full left-0 top-0 z-50" v-if="eTalkOption || chatOption" @click="() => {this.eTalkOption = false; this.chatOption = false}"></div>
                
            </div>
            <!-- Search -->
            <div class="relative mb-4 px-3">
                <input type="text" v-on:keyup.enter="searchFilter" v-model="searchQuery" class="w-full rounded-md h-10 focus:outline-none pl-3" :class="darkMode?`bg-youtube text-gray-300`:`bg-softGray`" :placeholder="$t('1001')">
                <div class="absolute right-6 top-2">
                    <SearchIcon :fill="darkMode?`#909090`:`#000`"></SearchIcon>
                </div>
            </div>
            <!-- List -->
            <div class="flex flex-col">
                <div class="h-full flex items-center justify-center" :class="darkMode?`text-white`:``" v-if="loading">
                    <div class="loader"></div>
                </div>
                <div v-else>
                    <!-- Contact List -->
                    <div class="flex items-center py-3 px-4 cursor-pointer" v-for="(contact, index) in resultQuery.contact" :key="index" 
                    @click="selectedContact(contact, index)"
                    :class="darkMode?`border-b border-black ${active === index ?`bg-button`:``}`:`border-b ${active === index?`bg-blue-100`:``}`">
                        <div>
                            <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3" :style="{backgroundImage:`url(${contact.photo})`}"></div>
                        </div>
                        <div>
                            <div class="text-sm fon-medium" :class="darkMode?`text-gray-300`:``">{{contact.name}}</div>
                            <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">{{cutString(contact.last.message, 30)}}</div>
                        </div>
                        <div class="flex flex-1 justify-end items-end h-full">
                            <div>
                                <div class="flex justify-center" v-if="contact.unread">
                                    <div class="h-4 w-4 rounded-full flex items-center justify-center text-xs" :class="darkMode?`bg-white text-black`:`bg-heart text-white`">{{contact.unread}}</div>
                                </div>
                                <div class="text-xs mt-1" :class="darkMode?`text-gray-500`:``">
                                    {{formatTime(contact.last.date)}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <!-- Contact List -->
                </div>
            </div>
        </div>
        <div class="flex-1 w-full ml-2 h-screen flex flex-col" :class="darkMode?`bg-youtube`:`bg-img-primary`">
            <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="px-4 py-3 flex text-sm items-center shadow relative">
                <div class="h-12 w-12 rounded-full shadow bg-cover bg-gray-300 mr-3" :style="{backgroundImage:`url(${contact.photo})`}"></div>
                <div>
                    <div class="font-semibold">
                        {{contact.name}}
                    </div>
                    <div class="text-xs">
                        Online
                    </div>
                </div>
                <div class="flex-1 flex flex-col items-end cursor-pointer" @click="() => {this.chatOption = true;}">
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                </div>
                <!-- eTalk option -->
                <div :class="darkMode?`bg-button`:`bg-white`" class="rounded-md overflow-hidden e-shadow absolute right-5 top-20 z-50 cursor-pointer" v-if="chatOption">
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                        {{$t('disconnect')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                        {{$t('mute_group')}}
                    </div>
                    
                   
                </div>
                
            </div>
            <div class="flex-1 h-full flex flex-col pb-36 py-5">
                <div class="flex-1 overflow-y-scroll h-full">
                    <!-- User -->
                    <div class="inline-block ml-14 max-w-sm">
                        <div class="relative rounded-3xl py-5 e-shadow flex items-center px-5 text-black mb-5" :class="darkMode?`bg-button text-gray-300`:`bg-white`" v-for="i in 10" :key="i">
                            <div class="chevron absolute bottom-4 w-10 h-10 overflow-hidden" style="left:-2.44rem;">
                                <img :src="darkMode?`chevron-dark.png`:`chevron.png`" class="absolute left-2">
                            </div>
                            <div class="relative">
                                flex-initial to allow a flex item to shrink but not grow, taking into account its initial size:
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-40 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary`:`bg-white e-shadow`">
                    <div class="cursor-pointer">
                        <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                    </div>
                    <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                    <div class="w-14 flex justify-end">
                        <div class="cursor-pointer h-12 w-12 rounded-full flex items-center justify-center transform rotate-90" :class="darkMode?``:``">
                            <ChevronIcon :fill="darkMode?`#909090`:`#979797`" :size="50"></ChevronIcon>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import SearchIcon from "./../../components/SearchIcon.vue"
import ImageIcon from "./components/LinkIcon.vue"
import ChevronIcon from "./../HotChat/components/ChevronIcon.vue"
import helper from "./../../helper/helper"
import moment from "moment"
export default {
    components:{
        SearchIcon,
        ImageIcon,
        ChevronIcon
    },
    data(){
        return{
            active: 0,
            contact: {},
            searchQuery: "",
            eTalkOption: false,
            chatOption: false
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('etalk', ['loading','contacts']),
        contactActive:{
            get(){
                return this.$store.state.etalk.active
            },
            set(value){
                return value
            }
        },
        // search
        resultQuery(){
            if(this.searchQuery){
                return this.contacts.filter((item)=>{
                    return this.searchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                })
            }else{
                return this.contacts;
            }
        },

    },
    methods:{
        ...mapActions('etalk', ['getContact']),
        formatTime(date){
            moment.locale('en');
            return moment(date).format('h:mm A');
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        selectedContact(contact, index){
            this.active = index
            this.contact = contact
        },
        goTo(page){
            this.$router.push({
                name: page,
            })
        }
        

    },
    created(){
        this.getContact().then(() =>{
            if(this.contacts.contact.length !== 'undefined'){
                if(this.contactActive){
                    for(let i = 0; i < this.contacts.contact.length; i ++){
                        if(this.contactActive === this.contacts.contact[i]._id){
                            this.active = i;
                        }
                    }
                }
                this.contact = this.contacts.contact[this.active]
            }else{
                this.contact =  {
                    name: "",
                    photo: ""
                }
            }
        })
    }
}
</script>