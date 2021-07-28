<template>
    <div class="flex h-screen m-5 text-sm">
        <div class="w-80 h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
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
                    <div class="flex items-center py-3 px-4 cursor-pointer" v-for="(contact, index) in resultQuery" :key="index" 
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
        <div class="flex-1 w-full ml-2 h-screen flex flex-col" :class="darkMode?`bg-youtube text-gray-300`:`${isNext?``:`bg-white`}`">
            <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="px-4 py-3 flex text-sm items-center shadow relative">
                <div class="h-12 flex items-center">
                    <div class="shadow-md px-2 py-1 rounded cursor-pointer" :class="darkMode?`bg-button`:`bg-white`" @click="backTo()">
                        <div class="transform rotate-90">
                            <ChevronIcon :fill="darkMode?`#909090`:`#555`" :size="18"></ChevronIcon>
                        </div>
                    </div>
                    <div class="ml-3">
                        {{$route.params.contact.name}}
                    </div>
                </div>
                <div class="flex-1 w-full text-center text-base">
                    {{$t('add_member')}}
                </div>
                <div class="flex flex-col items-end cursor-pointer" @click="nextPage">
                    <span :class="darkMode?``:`text-primary`">
                        <div v-if="creatingGroup" class="bg-red-300 flex items-center justify-center relative h-full">
                            <div class="loader absolute -top-7 right-5"></div>
                        </div>
                        <span>{{$t('done')}}</span>
                    </span>
                </div>
            </div>
            <div class="m-5">
                <template>
                    <div class="w-11/12 relative">
                        <input type="text" class="focus:outline-none h-11 w-full rounded-md pl-4"
                        :placeholder="$t('search_friend')"
                        :class="darkMode?`bg-button text-gray-300`:`bg-softGray`" v-model="search" @keyup.enter="searchMember">
                        <div class="absolute right-4 top-2">
                            <SearchIcon :fill="darkMode?`#909090`:`#000000`"></SearchIcon>
                        </div>
                    </div>

                    <div v-if="selectedMember.length" class="mt-5">
                        <div>
                            You recently member add : {{selectedMember.length}} Members
                        </div>
                    </div>
                </template>
                <div v-if="loadingMember" class="flex items-center justify-center" :class="darkMode?`text-gray-300`:`text-black`">
                    <div class="loader"></div>
                </div>
                <!-- Group Member -->
                <template v-else>
                    <div class="mt-2 pb-5 h-screen">
                        <div class="pt-5">
                            <span class="text-sm" v-if="locale() === 'en'">{{members.length}} {{$t('member')}}{{members.length > 1?`s`:``}}</span>
                            <span class="text-sm" v-else>{{$t('member')}} {{members.length}} នាក់</span>
                        </div>
                        ​<div>
                            <div v-for="(member, index) in friends.list" :key="index" class="py-3  border-b flex items-center justify-between" :class="darkMode?`border-button`:`border-gray-200`">
                                <div class="flex items-center">
                                    <div class="h-14 w-14 rounded-full bg-cover mr-3 bg-gray-300" :style="{backgroundImage:`url(${member.photo})`}"></div>
                                    <div>
                                        <div>{{member.name}}</div>
                                        <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">{{$t('online')}}</div>
                                    </div>
                                </div>
                                <div class="h-5 w-5 rounded-full flex items-center justify-center relative" :class="darkMode?`bg-pass`:`bg-primary`" >
                                    <label class="absolute cursor-pointer w-full h-full items-center justify-center flex flex-col">
                                        <input type="checkbox"  class="hidden">
                                        <div>
                                            <CheckIcon :fill="darkMode?`#212121`:`#FFFFFF`"></CheckIcon>
                                        </div>
                                    </label>
                                </div>
                               
                            </div>
                        </div> 
                    </div>
                </template>
                <!-- List friend -->
                <!-- <template>
                    <div class="h-screen pb-96 overflow-y-scroll flex flex-col mt-2" @scroll="onScroll">
                        <div v-for="(friend, index) in friends.list" :key="index">
                            <div class="flex items-center justify-between border-b py-3" :class="darkMode?`border-button`:``">
                                <div class="flex items-center">
                                    <div class="h-14 w-14 rounded-full bg-cover bg-gray-300" :style="{backgroundImage:`url(${friend.photo})`}"></div>
                                    <div class="ml-3">
                                        <div>{{friend.name}}</div>
                                        <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">Online</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="h-5 w-5 rounded-full flex items-center justify-center relative" :class="darkMode?`bg-pass`:`bg-primary`" >
                                        <label class="absolute cursor-pointer w-full h-full items-center justify-center flex flex-col">
                                            <input type="checkbox" :value="friend._id" @click="selectMember($event, friend)" class="hidden">
                                            <div v-if="isSelected(friend._id)">
                                                <CheckIcon :fill="darkMode?`#212121`:`#FFFFFF`"></CheckIcon>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template> -->
            </div>
            
        </div>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import SearchIcon from "./../../components/SearchIcon.vue"
import helper from "./../../helper/helper"
import moment from "moment"
import CheckIcon from "./../../components/CheckIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
export default {
    components:{
        SearchIcon,
        ChevronIcon,
        CheckIcon
    },
    data(){
        return{
            active: null,
            contact: {},
            searchQuery: "",
            eTalkOption: false,
            chatOption: false,
            page: 1,
            enableScroll: true,
            selectedMember: [],
        
            search: "",
            loadingFriend: false,
            isNext: false,
            defaultBackground: "e-school-logo.png",
            groupName:"",
            photo: "",
            creatingGroup: false,
            loadingMember: false
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('etalk', ['loading', 'contacts', 'members']),
        ...mapState('network', ['friends']),
        // search
        resultQuery(){
            if(this.searchQuery){
                return this.contacts.contact.filter((item)=>{
                    return this.searchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                })
            }else{
                return this.contacts.contact;
            }
        },

    },
    methods:{
        ...mapActions('etalk', ['getContact','getMember']),
        ...mapActions('network', ['getFriend']),
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
            this.$store.commit("etalk/setActive", contact._id)
            this.$router.push({name: "chat"})
        },
        goTo(page){
            this.$router.push({
                name: page,
            }).catch(err => {return  err})
        },
        
        selectMember(event, friend){
            let member = {
                id: friend._id,
                name: friend.name,
                photo: friend.photo
            }
            if(event.target.checked){
                this.selectedMember.push(member)
            }else{
               this.selectedMember = this.selectedMember.filter(item => item.id !== friend._id)
            }
        },
        isSelected(id){
            for(let i = 0; i < this.selectedMember.length; i ++){
                if(id == this.selectedMember[i].id){
                    return true;
                }
            }
            return false
        },
        searchMember(){
            this.getFriend({
                id: this.stProfile._id,
                s: this.search
            })
        },

        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1) ) {
                let payload = {}
                this.page ++ 

                payload.p = this.page

                if(this.search){
                    payload.s = this.search
                }

                if(this.enableScroll){
                    this.getFriend(payload).then(res =>{
                        if(res.data.data.list.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
        onSelectedPhoto(event){
            const file = event.target.files[0];
            this.photo = file
            this.defaultBackground = URL.createObjectURL(file);
        },
        backTo(){
            this.$router.push({name:"chat"})
        },
        nextPage(){

        },
        locale(){
            return this.$i18n.locale
        }      

    },
    created(){
       
        this.getContact().then(() =>{
            if(this.contacts.contact.length !== 'undefined' ){
                for(let i = 0; i < this.contacts.contact.length; i ++){
                    if(this.$route.params.contact._id === this.contacts.contact[i]._id){
                        this.active = i
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
        this.loadingMember = true
        this.getMember({
            id: this.$route.params.contact._id
        }).then(() => {
            this.loadingMember = false
        })
         this.loadingFriend = true
        this.getFriend({
            id: this.stProfile._id
        }).then(() => {
            this.loadingFriend = false
        })

    }
}
</script>