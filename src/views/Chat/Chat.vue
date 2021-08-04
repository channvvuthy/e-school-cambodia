<template>
    <div class="flex h-screen m-5 text-sm">
        <div class="w-82 h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary`:`bg-white`" @scroll="onScroll">
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
                <div class="flex-1 overflow-y-scroll h-full" ref="feed">
                    <!-- User -->
                    <div class="px-5 pr-14">
                        <div v-for="(message, index) in messages" :key="index">
                            <div :class="auth === message.sender._id?`flex justify-end`:`flex justify-start`">
                                <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${message.sender.photo})`}" v-if="auth !== message.sender._id"></div>
                                <div class="relative rounded-3xl py-5 e-shadow inline-flex items-center px-5 text-black mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-300`:`bg-white`">
                                    <div class="absolute w-4 h-full right-0 top-0 z-50 rounded-full" :class="darkMode?`bg-button`:`bg-white`" style="height:60%;top:20%"></div>
                                    <MessageText :message="message" :isMind="auth === message.sender._id"></MessageText>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="h-40 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary`:`bg-white e-shadow`">
                    <div class="cursor-pointer">
                        <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                    </div>
                    <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" 
                   :disabled="contact.block_by"
                   v-model="message.text"
                   @keyup.enter.exact="onMessage"
                    :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                    <div class="w-14 flex justify-end">
                        <!-- <div class="cursor-pointer h-12 w-12 rounded-full flex items-center justify-center transform rotate-90" :class="darkMode?``:``">
                            <ChevronIcon :fill="darkMode?`#909090`:`#979797`" :size="50"></ChevronIcon>
                        </div> -->
                        <div class="cursor-pointer  rounded-full ml-5 mt-2" :class="busy?'opacity-30':''">
                            <vue-record-audio @result="onResult" @stream="onStream"/>
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
        MessageText
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
            isMember: false,
            isConfirm: false,
            isDisconnect: false,
            isUnblock: false,
            msg: "left_group",
            busy: false,
            audioUrl: "",
            auth: "",
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
        ...mapState('etalk', ['loading','contacts','messages']),
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
        'getContacts','getMessage','getMessages','deleteMember', 'blockUser', 'unblockUser']),
        formatTime(date){
            moment.locale(this.$i18n.locale);
            return moment(date).fromNow();
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
            this.active = index
            this.contact = contact
            this.message.id = this.contact._id
            this.getMessage({
                p: 1,
                id: this.contact._id
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
            form.append("id", this.message.id)
            form.append("reply_id", this.message.reply_id)
            form.append("text", this.message.text)
            form.append("photo", this.message.photo)
            form.append("pdf", this.message.pdf)
            form.append("voice", this.message.voice)
            form.append("duration", this.message.duration)
            this.sendMessage(form).then(() =>{
                this.message.text = ""
                this.scrollToBottom()
            })
            
        },
        onResult(data)
        {
            this.getAudioDuration(data).then(duration => {
                let group_id = this.message.group_id;
                let sound = this.blobToFile(data, `${this.makeID(10)}.wav`)

                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onloadend = () => {
                    let base64String = reader.result;
                    const formData = new FormData();

                    formData.append('group_id', group_id);
                    formData.append('sound', sound);
                    formData.append('duration', duration);

                    this.addChat(formData)
                    this.onMessage(3, base64String)
                    this.scrollToBottom()
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
</style>