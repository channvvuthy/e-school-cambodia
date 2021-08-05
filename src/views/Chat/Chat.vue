<template>
    <div class="flex h-screen m-5 text-sm">
        <div class="w-96 h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary`:`bg-white`" @scroll="onScroll">
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
                <input type="text" v-model="searchQuery" class="w-full rounded-md h-10 focus:outline-none pl-3"
                @keyup.enter="searchContact"
                :class="darkMode?`bg-youtube text-gray-300`:`bg-softGray`" :placeholder="$t('1001')">
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
                    <div class="flex items-center py-3 px-4 cursor-pointer" v-for="(contact, index) in contacts" :key="index" 
                    @click="selectedContact(contact, index)"
                    :class="darkMode?`border-b border-black ${active === index ?`bg-button`:``}`:`border-b ${active === index?`bg-blue-100`:``}`">
                        <div>
                            <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3" :style="{backgroundImage:`url(${contact.photo})`}"></div>
                        </div>
                        <div>
                            <div class="text-sm fon-medium" :class="darkMode?`text-gray-300`:``">
                                <div class="flex">
                                    <div>
                                        {{contact.name}}
                                    </div>
                                    <div v-if="contact.type===0" class="h-4 w-4 rounded-full ml-3 flex items-center justify-center" :class="darkMode?`bg-youtube text-gray-500`:`bg-gray-400 text-gray-200`">
                                       <span style="font-size:10px;">&#10003;</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">{{cutString(contact.last.message, 20)}}</div>
                        </div>
                        <div class="flex flex-1 justify-end items-end h-full">
                            <div>
                                <div class="flex justify-center" v-if="contact.unread">
                                    <div class="h-4 w-4 rounded-full flex items-center justify-center text-xs" :class="darkMode?`bg-white text-black`:`bg-heart text-white`">{{contact.unread}}</div>
                                </div>
                                <div class="text-xs mt-1" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                    {{getDay(contact.last.date)}}
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
                <div class="h-12 w-12 rounded-full shadow bg-cover bg-gray-300 mr-3 flex items-center justify-center" :style="{backgroundImage:`url(${contact.photo})`}" @click="contactPhoto()" :class="contact.type === 0?``:`cursor-pointer`">
                    <div class="loading" v-if="settingImage"></div>
                </div>
                <input type="file" ref="contactPhoto" class="hidden" @change="changeContactPhoto">
                <div>
                    <div class="font-semibold">
                        {{contact.name}}
                    </div>
                    <div class="text-xs text-gray-500">
                        {{$t('online')}}
                    </div>
                </div>
                <div class="flex-1 flex flex-col items-end cursor-pointer" @click="() => {this.chatOption = true;}">
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                </div>
                <!-- eTalk option -->
                <div :class="darkMode?`bg-button`:`bg-white`" class="rounded-md overflow-hidden e-shadow absolute right-5 top-20 z-50 cursor-pointer" v-if="chatOption">
                     <template v-if="contact.type === 0">
                            <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                                <span v-if="contact.is_mute" @click="deleteMuteContact">{{$t('unmute')}}</span>
                                <span v-else @click="mute">{{$t('mute')}}</span>
                            </div>
                     </template>
                      <template v-if="contact.type === 1">
                            <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" 
                            v-if="!contact.block_by"
                            @click="() => {this.isDisconnect = true}">
                                {{$t('block')}}
                            </div>
                            <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`"
                            v-else
                             @click="() => {this.isUnblock = true}">
                                {{$t('unblock')}}
                            </div>
                            <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                                <span v-if="contact.is_mute" @click="deleteMuteContact">{{$t('unmute')}}</span>
                                <span v-else @click="mute">{{$t('mute')}}</span>
                            </div>
                     </template>
                    <template v-if="contact.type === 2">
                        <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`">
                            <span v-if="contact.is_mute" @click="deleteMuteContact">{{$t('unmute_group')}}</span>
                            <span v-else @click="mute">{{$t('mute_group')}}</span>
                        </div>
                        <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="() => {this.isRename = true; this.chatOption = false;}">
                            {{$t('rename_group')}}
                        </div>
                        <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="leftGroupConfrim()">
                            <span>{{$t('leave_group')}}</span>
                        </div>
                        <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="() => {this.$router.push({name: 'add-member', params:{contact}})}">
                            {{$t('add_member')}}
                        </div>
                        <div class="px-8 h-12 flex items-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="() => {this.isMember = true; this.chatOption = false}">
                            {{$t('member')}}
                        </div>
                    </template>
                    
                   
                </div>
                
            </div>
            <div class="flex-1 h-full flex flex-col pb-36 py-5">
                <div class="flex-1 overflow-y-scroll h-full" ref="feed" @scroll="getMoreMessage"> 
                   
                    <div class="flex items-center justify-center" v-if="loadingMessage ">
                        <div :class="darkMode?`lds-ring`:`lds-ring-dark`">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <!-- User -->
                    <ul class="px-5 pr-14" id="box">
                        <li v-for="(message, index) in messages" :key="index" :id="message._id">
                            <!-- Text message -->
                            <template v-if="message.content.type === 1">
                                <div :class="auth === message.sender._id?`flex justify-end`:`flex justify-start`">
                                    <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${message.sender.photo})`}" v-if="auth !== message.sender._id"></div>
                                    <div class="flex items-center mr-5" v-if="auth === message.sender._id">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                    <div class="relative rounded-3xl py-5 e-shadow inline-flex items-center px-5 text-black mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-300`:`bg-white`">
                                        <MessageText :message="message" :isMind="auth === message.sender._id"></MessageText>
                                    </div>
                                    <div class="flex items-center ml-5" v-if="auth !== message.sender._id">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <!-- Audio -->
                            <template v-if="message.content.type === 4">
                                <div :class="auth === message.sender._id?`flex justify-end`:`flex justify-start`">
                                    <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${message.sender.photo})`}" v-if="auth !== message.sender._id"></div>
                                    <div>
                                        <div class="flex items-center" v-if="auth === message.sender._id">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                        <div class="relative rounded-3xl py-5 inline-flex items-center text-black max-w-sm">
                                            <audio controls class="focus:outline-none"
                                                controlsList="nodownload">
                                                <source :src="message.content.file.url" type="audio/wav">
                                                Your browser does not support the <code>audio</code>
                                                element.
                                            </audio>
                                        </div>
                                        <div class="flex items-center" v-if="auth !== message.sender._id">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <!-- Photo -->
                            <template v-if="message.content.type === 3">
                                <div :class="auth === message.sender._id?`flex justify-end`:`flex justify-start`">
                                    <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${message.sender.photo})`}" v-if="auth !== message.sender._id"></div>
                                    <div>
                                        <div class="flex items-center" v-if="auth === message.sender._id">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                        <div class="relative rounded-3xl py-5 inline-flex items-center text-black max-w-sm">
                                           <img class="max-w-xs rounded-md" :src="message.content.file.url"/>
                                        </div>
                                        <div class="flex items-center" v-if="auth !== message.sender._id">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </li>
                    </ul>
                </div>
                <div class="h-24 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary`:`bg-white e-shadow`">
                    <div class="cursor-pointer" @click="() => {this.$refs.file.click()}">
                        <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                    </div>
                    <input type="file" ref="file" class="hidden" accept="application/pdf, image/*" @change="onSelectFile">
                    <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" 
                   :disabled="contact.block_by"
                   v-model="message.text"
                   @keyup.enter.exact="onMessage"
                    :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                    <div class="w-14 flex justify-end">
                        <div class="cursor-pointer  rounded-full ml-5 mt-2" :class="busy?'opacity-30':''">
                            <vue-record-audio @result="onResult" @stream="onStream"/>
                        </div>
                    </div>
                </div>
                <!-- Preview -->
                <div class="w-full h-full fixed top-0 left-0 bg-black z-50 flex items-center justify-center bg-opacity-90" v-if="isPreview">
                    <div class="w-96 rounded-lg flex flex-col justify-between" :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow`">
                        <div class="py-4 px-5 relative">
                            {{$t('preview')}}
                            <div class="absolute right-3 top-3 cursor-pointer" @click="() => {this.isPreview = false}">
                                <CloseIcon :width="18" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                            </div>
                        </div>
                        <div class="border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                        <div class="h-5"></div>
                        <div class="flex items-center justify-center">
                            <img :src="imgUrl" v-if="type === 1">
                            <div v-else class="flex items-center">
                                <PdfIcon :size="100" :fill="darkMode?`#909090`:`#0f3c7a`"></PdfIcon>
                                <div class="ml-3 text-lg">{{this.file.name}}</div>
                            </div>
                        </div>
                        <div class="h-5"></div>
                        <div class="flex justify-end px-5">
                            <button class="bg-primary h-11 text-white w-40 rounded-md mb-5 focus:outline-none relative" @click="sendFile()">
                                <div class="flex items-center absolute -top-1 justify-center w-full text-center" v-if="sending">
                                    <div class="loader"></div>
                                </div>
                                <span v-else>{{$t('send_message')}}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Rename v-if="isRename" @cancelRename="() => {this.isRename = false}" :group="contact"></Rename>
        <Member v-if="isMember" @closeMember="() => {this.isMember = false}" :contact="contact" @adminLeft="adminLeft"></Member>
        <BuyMsg v-if="isConfirm" @cancelModal="() => {this.isConfirm = false}" :msg="msg" @yes="leaveGroup()"></BuyMsg>
        <BuyMsg v-if="isDisconnect" @cancelModal="() => {this.isDisconnect = false}" :msg="`block_contact`" @yes="disconnect()"></BuyMsg>
        <BuyMsg v-if="isUnblock" @cancelModal="() => {this.isUnblock = false}" :msg="`unblock_contact`" @yes="unblock()"></BuyMsg>
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import Vue from "vue"
import SearchIcon from "./../../components/SearchIcon.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import ImageIcon from "./components/LinkIcon.vue"
import ChevronIcon from "./../HotChat/components/ChevronIcon.vue"
import helper from "./../../helper/helper"
import config from "./../../config"
import getBlobDuration from 'get-blob-duration'
import moment from "moment"
import Rename from "./components/Rename.vue"
import Member from "./components/Member.vue"
import BuyMsg from "./../Component/BuyMsg.vue"
import VueRecord from '@codekraft-studio/vue-record'
import MessageText from "./components/Text.vue"
import VueSocketIO from 'vue-socket.io'
Vue.use(VueRecord)
Vue.use(new VueSocketIO({
    connection: config.urlSocket
}));
export default {
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
    },
    components:{
        SearchIcon,
        ImageIcon,
        ChevronIcon,
        Rename,
        Member,
        BuyMsg,
        MessageText,
        CloseIcon,
        PdfIcon
    },
    data(){
        return{
            active: 0,
            contact: {},
            searchQuery: "",
            eTalkOption: false,
            chatOption: false,
            isRename: false,
            photo: "",
            settingImage: false,
            enableScroll: true,
            page: 1,
            chatPage: 1,
            isMember: false,
            isConfirm: false,
            isDisconnect: false,
            isUnblock: false,
            msg: "left_group",
            busy: false,
            audioUrl: "",
            auth: "",
            loadingMessage: false,
            isPreview: false,
            imgUrl: "",
            pdfUrl: "",
            file:"",
            type: 1,
            message: {
                id: "",
                reply_id: "",
                text: "",
                photo: "",
                pdf: "",
                voice: "",
                duration: ""
            }
            
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('etalk', ['loading','contacts','messages','sending']),
        contactActive:{
            get(){
                return this.$store.state.etalk.active
            },
            set(value){
                return value
            }
        },
    },
    methods:{
        ...mapActions('etalk', ['getContact', 'setPhoto', 'muteContact', 'deleteMute', 'getAdminMessage', 
        'sendMessage',
        'getContacts','getMessage','deleteMember', 'blockUser', 'unblockUser']),
        getDay(oldDate){
            if (helper.numDay(oldDate, moment().format()) === 0) {
                return moment(oldDate).format('h:mm A')
            } else {
                return moment(oldDate).format('DD-MM-YYYY')
            }
        },
        sendFile(){
            if(this.type === 1){
                this.message.photo = this.file
            }else{
                this.message.pdf = this.file
            }
            this.onMessage()
        },
        getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        },
        onSelectFile(event){
            this.isPreview = true
            var input = event.target;
                this.file = event.target.files[0] 
                if(this.getExtension(this.file.name) === "pdf"){
                    this.type = 2
                }else{
                    this.type = 1
                }
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.imgUrl = e.target.result
                    }
                    reader.readAsDataURL(input.files[0]);
                }
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        unblock(){
            let payload = {
                id: this.contact._id
            }
            this.unblockUser(payload).then(()=>{
                this.contact.block_by = false
                this.isUnblock = false
            })
        },
        disconnect(){
            let form = new FormData()
            form.append("id", this.contact._id)
            this.blockUser(form).then(() =>{
               this.isDisconnect = false
               this.contact.block_by = this.stProfile._id
            })
        },
        leftGroupConfrim(){
            this.isConfirm = true
        },
        leaveGroup(){
            let payload = {
                id: this.contact._id
            }
            this.deleteMember(payload).then(() =>{
                this.active = 0
                this.isConfirm = false
                this.chatOption = false
                this.init()
            })
        },
        selectedContact(contact, index){
            this.enableScroll = true
            this.chatPage = 1
            this.active = index
            this.contact = contact
            this.message.id = this.contact._id
            this.getMessage({
                p: 1,
                id: this.contact._id
            }).then(() => {
                this.scrollToBottom()
            })
            
        },
        scrollToBottom()
        {
            let interval = setInterval(() => {
                try {
                    this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight
                    this.pageOffsetTop = 1
                } catch (err) {
                    return err
                }
            }, 50)

            setTimeout(() => {
                clearInterval(interval)
            }, 500)
        },
        goTo(page){
            this.$router.push({
                name: page,
            })
        },
        mute(){
            let form = new FormData()
            form.append("id", this.contact._id)


            this.muteContact(form).then(() =>{
                this.contact.is_mute = 1
            })
        },
        deleteMuteContact(){
            this.deleteMute({id: this.contact._id}).then(() =>{
                this.contact.is_mute = 0
            })
        },
        contactPhoto(){
             if(this.contact.type === 0){
                return;
            }
            this.$refs.contactPhoto.click()
        },
        receiveAdminMessage(){
            this.getMessage({
                id: this.contact._id
            })
        },
        changeContactPhoto(event){
           
            const file = event.target.files[0];
            this.photo = file
            let form = new FormData();
            form.append("id", this.contact._id)
            form.append("photo", this.photo)

            this.settingImage = true
            this.setPhoto(form).then(() =>{
                this.contact.photo = URL.createObjectURL(file);
                this.settingImage = false
            })
        },
        searchContact(){ 
            let payload = {
                s: this.searchQuery
            }
            this.getContact(payload)
        },
        adminLeft(){
            this.active = 0
            this.isMember = false
            this.init()
        },
        getMoreMessage({target: {scrollTop}}){
            if(scrollTop === 0){
                this.loadingMessage = true
                this.chatPage ++
                let payload = {}

                payload.p = this.chatPage
                payload.id = this.contact._id
                
                this.getMessage(payload).then((response) =>{
                   if(response.data.data.length){
                       this.scrollToTop()
                   }
                   this.loadingMessage = false
                })
                
            }
        },
        scrollToTop()
        {
            setTimeout(() => {
                 this.$refs.feed.scrollTop =  100
            }, 100)
        },

        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                this.page ++ 
                let payload = {}
                if(this.searchQuery){
                    payload.s = this.searchQuery
                }
                payload.p = this.page
              
                if(this.enableScroll){
                    this.getContacts(payload).then(res =>{
                        if(res.data.data.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },   
        init(){
            this.getContact({}).then(() =>{
                if(this.contacts.length !== 'undefined'){
                    if(this.contactActive){
                        for(let i = 0; i < this.contacts.length; i ++){
                            if(this.contactActive === this.contacts[i]._id){
                                this.active = i;
                            }
                        }
                    }
                    this.contact = this.contacts[this.active]
                    this.message.id = this.contact._id
                    this.getMessage({
                        p: 1,
                        id: this.contact._id
                    }).then(() => {
                        this.scrollToBottom()
                    })
                }else{
                    this.contact =  {
                        name: "",
                        photo: ""
                    }
                }
            })
        } ,
        getAudioDuration(blob){
            return new Promise(resolve => {
                resolve(getBlobDuration(blob))
            })

        },
        onMessage(){
            let form = new FormData()
            if(!this.message.text.trim() && !this.message.voice && !this.message.photo && !this.message.pdf){
                return;
            }
            form.append("id", this.message.id)
            form.append("reply_id", this.message.reply_id)
            form.append("text", this.message.text)
            form.append("photo", this.message.photo)
            form.append("pdf", this.message.pdf)
            form.append("voice", this.message.voice)
            form.append("duration", this.message.duration)
            this.sendMessage(form).then(() =>{
                this.message.text = ""
                this.message.photo = ""
                this.message.voice = ""
                this.message.pdf = ""
                this.isPreview = false
                this.scrollToBottom()
            })
            
        },
        blobToFile(theBlob, fileName){
            return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: "audio/mpeg"})
        },
        makeID() {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < charactersLength; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        onResult(data)
        {
            this.getAudioDuration(data).then(duration => {
                let sound = this.blobToFile(data, `${this.makeID()}.wav`)

                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onloadend = () => {
                    this.message.voice = sound
                    this.message.duration = duration
                    this.onMessage()
                    
                }


            })
        },
        onStream(){
            this.audioUrl = ""
        },
        

    },
   
    created(){
        this.init()
        this.auth = this.stProfile._id
    }
}
</script>
<style>
    .loading {
        border: 2px solid #eee;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        animation: spin 1s linear infinite;
        border-top: 2px solid rgba(255, 255, 255, 0.2);
        border-right: 2px solid rgba(255, 255, 255, 0.2);
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
    .vue-audio-recorder {
        background-color: #00a0e4 !important;;
        width: 55px !important;
        height: 55px !important;
    }

    .vue-audio-recorder:hover {
        background-color: #0f3c7a !important;
    }
    .lds-ring, .lds-ring-dark {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 44px;
        height: 44px;
        margin: 8px;
        border: 4px solid #fff;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
    }
    .lds-ring-dark {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }
    .lds-ring-dark div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 44px;
        height: 44px;
        margin: 8px;
        border: 4px solid #0f3c7a;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #0f3c7a transparent transparent transparent;
    }
    .lds-ring div:nth-child(1), .lds-ring-dark div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2), .lds-ring-dark div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3), .lds-ring-dark div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    textarea {
        resize: none;
    }

</style>