<template>
     <div class="flex h-screen m-5 text-sm">
        <!-- Copy text  -->
        <input type="text" id="chat-text" class="absolute" v-model="chatText" style="z-index:-1"/>
        <audio controls  id="message-sound" class="absolute" style="z-index:-1">
            <source src="message.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
         <div class="h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary`:`bg-white`" @scroll="onScroll" style="width:520px;">
            <div class="flex px-4 py-2 items-center justify-between relative" :class="darkMode?`text-gray-300`:`bg-white`">
                <div class="py-3 font-bold flex items-center  w-full" :class="darkMode?``:`text-primary`">
                    <div class="transform rotate-90 cursor-pointer" @click="()=> {this.$router.go(-1)}">
                        <ChevronIcon :fill="darkMode?`#9CA3AF`:`#000`"></ChevronIcon>
                    </div>
                    <div class="flex-1 text-center w-full ">
                        E-TALK
                    </div>
                </div>
            </div>
            <!-- Search -->
            <div class="relative mb-4 px-3">
                <input type="text" class="w-full rounded-md h-10 focus:outline-none pl-3"
                @keyup.enter="searchContact"
                v-model="searchQuery"
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
                    <div class="flex items-center py-3 px-4 cursor-pointer" v-for="(contact, index) in admin" :key="index" 
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
                            <div class="text-xs font-normal" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                {{contact.last == undefined?$t('ticket') + ' ' + contact.ticket:cutString(contact.last.message, 20)}}
                            </div>
                        </div>
                        <div class="flex flex-1 justify-end items-end h-full">
                            <div>
                                <div class="flex justify-center" v-if="contact.unread">
                                    <div class="h-4 w-4 rounded-full flex items-center justify-center text-xs" :class="darkMode?`bg-white text-black`:`bg-heart text-white`">{{contact.unread}}</div>
                                </div>
                                <div class="text-xs mt-1 whitespace-nowrap" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                    {{contact.last == undefined?$t('unread') + ' ' + contact.unread:getDay(contact.last.date)}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <!-- End contact List -->
                </div>
            </div>
        </div>
        <div :class="darkMode?`bg-youtube`:`bg-img-primary`" class="w-full">
                <div class="flex-1 w-full ml-2 h-screen flex flex-col" :class="darkMode?``:`bg-black bg-opacity-10`">
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
                    </div>
                    <!-- Message -->
                    <div class="relative h-screen z-50 pt-3 justify-between flex flex-col pb-36">
                        <ul class="overflow-y-scroll flex-1 px-5"  ref="feed" @scroll="getMoreMessage" style="z-index:999;">
                            <div class="fixed bg-black w-full h-full left-0 top-0 bg-opacity-70 z-50" v-if="replyId" @click="() => {this.replyId = false}"></div>
                            <div class="flex items-center justify-center" v-if="loadingMessage ">
                            <div :class="darkMode?`lds-ring`:`lds-ring-dark`">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <li v-for="(message, index) in messages" :key="index" class="w-full relative" @contextmenu="showReply(message)">
                                <div class="absolute w-full justify-center flex z-50" v-if="replyId._id === message._id">
                                    <Reply 
                                        :contact="contact"
                                        :message="message"
                                        @deleteMessage="dlMessage"
                                        @copy="copy()"
                                        @save="save()"
                                        @reply="reply()">
                                    </Reply>
                                </div>
                                <!-- Text message -->
                                <template v-if="message.content.type === 1">
                                    <div :class="message.is_admin == 1?`flex justify-end`:`flex justify-start`" class="items-center relative">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="message.is_admin == 0">
                                            <div class="h-13 w-13"></div>
                                        </div>
                                        <div class="flex items-center mr-5" v-if="auth === 0">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                                <div class="relative rounded-xl py-3 e-shadow inline-flex items-center px-3 text-black mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-300`:`bg-white`">
                                                    <MessageText :message="message" :isMind="message.is_admin == 1"></MessageText>
                                                </div>
                                            </div>
                                            <div v-else class="relative rounded-xl py-3 e-shadow inline-flex items-center px-3 text-black mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-300`:`bg-white`">
                                                <MessageText :message="message" :isMind="message.is_admin == 1" :isAdmin="message.is_admin"></MessageText>
                                            </div>
                                            
                                        </div>
                                        <div class="flex items-center ml-5" v-if="message.is_admin == 1">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End message text -->
                                <!-- Photo -->
                                <template v-if="message.content.type === 3">
                                    <div :class="message.is_admin == 1?`flex justify-end`:`flex justify-start`"  class="items-center relative">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="message.is_admin == 0"></div>
                                        <div>
                                            <div class="flex items-center" v-if="message.is_admin == 1">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs ml-1">
                                                          {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex flex-col items-start text-black max-w-sm">
                                                <img class="max-w-xs rounded-md mb-2" :src="message.content.file.url"/>
                                                <div :class="darkMode?`text-gray-300`:`text-black`" class="text-semibold" v-if="message.content.text">{{message.content.text}}</div>
                                            </div>
                                            <div class="flex items-center" v-if="auth !== sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End photo -->
                                <!-- Pdf -->
                                <template v-if="message.content.type === 2">
                                    <div :class="message.is_admin == 1?`flex justify-end`:`flex justify-start`"  class="items-center relative mb-3">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="message.is_admin == 0"></div>
                                        <div>
                                            <div class="flex items-center" v-if="message.is_admin == 1">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap mb-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1" ></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex items-center text-black max-w-sm mb-1">
                                                <div :class="darkMode?`bg-button text-gray-300`:`bg-white e-shadow`"
                                                @click="readPdf(message.content.file.url)"
                                                class="cursor-pointer px-5 py-2 rounded-xl text-base flex items-center">
                                                    <div class="mr-2">
                                                        <DocumentIcon :fill="darkMode?`#FFFFFF`:`#000000`"></DocumentIcon>
                                                    </div>
                                                    <div>
                                                        <span v-if="message.content.text">
                                                            {{message.content.text.includes('.pdf')?message.content.text:message.content.text + ".pdf"}}
                                                        </span>
                                                        <span v-else>
                                                            {{message._id}}.pdf
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center" v-if="message.is_admin == 0">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap my-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End pdf -->
                                <!-- Audio -->
                                <template v-if="message.content.type === 4">
                                    <div :class="message.is_admin == 1?`flex justify-end`:`flex justify-start`"  class="items-center relative">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="message.is_admin == 0"></div>
                                        <div>
                                            <div class="flex items-center" v-if="message.is_admin == 1">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap mb-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs ml-1">
                                                       {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex items-center text-black max-w-sm">
                                                <audio controls class="focus:outline-none"
                                                    controlsList="nodownload">
                                                    <source :src="message.content.file.url" type="audio/wav">
                                                    Your browser does not support the <code>audio</code>
                                                    element.
                                                </audio>
                                            </div>
                                            <div class="flex items-center" v-if="auth !== sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs whitespace-nowrap my-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End audio -->
                            </li>
                        </ul>
                        <!-- End message -->
                        <!-- Reply -->
                        <div class="h-24 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary text-gray-300`:`bg-white e-shadow text-primary`" v-if="replyContact">
                            <div class="flex border-l-2 pl-1 mx-10 justify-between w-full items-center" :class="darkMode?`border-gray-400`:`border-primary`">
                                <div>
                                    <div class="underline">
                                        {{replyTo(replyContact)}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs" v-if="replyContact.content.type === 1" >
                                        {{cutString(replyContact.content.text,40)}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs" v-if="replyContact.content.type === 2" >
                                        {{$t('file')}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs mt-1 flex items-center" v-if="replyContact.content.type === 3" >
                                        <img :src="replyContact.content.file.url" class="rounded w-10"/>
                                        <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs ml-2">
                                            {{$t('image_message')}}
                                        </div>
                                    </div> 
                                    <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs" v-if="replyContact.content.type === 4" >
                                        {{$t("voice_message")}}
                                    </div>
                                </div>
                                <div :class="darkMode?`bg-button`:`bg-gray-300`" class="cursor-pointer rounded-full w-7 h-7 flex items-center justify-center" @click="()=> {this.replyContact = ``}">
                                    <CloseIcon :width="20" :fill="darkMode?`#D1D5DB`:`#000`"></CloseIcon>
                                </div>
                            </div>
                        </div>
                        <!-- Textarea -->
                        <div class="h-24 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary`:`bg-white ${replyContact?``:`e-shadow`}`">
                            <div class="cursor-pointer" @click="() => {this.$refs.file.click()}">
                                <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                            </div>
                            <input type="file" ref="file" class="hidden" accept="application/pdf, image/*" @change="onSelectFile">
                            <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" :disabled="contact.block_by"
                                @keydown="enableWatch"
                                name="message"
                                ref="message"
                                v-model="message.text"
                                @keyup.enter.exact="onMessage"
                                :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``">
                            </textarea>
                            <div class="w-14 flex justify-end">
                                <div class="cursor-pointer  rounded-full ml-5 mt-2" :class="busy?'opacity-30':''">
                                    <vue-record-audio @result="onResult" @stream="onStream"/>
                                </div>
                            </div>
                        </div>
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
                <div class="flex items-center justify-center px-3">
                    <img :src="imgUrl" v-if="type === 1" class="rounded-lg">
                    <div v-else class="flex items-center">
                        <PdfIcon :size="80" :fill="darkMode?`#909090`:`#212121`"></PdfIcon>
                        <div class="ml-3 text-lg">{{this.file.name}}</div>
                    </div>
                </div>
                <div class="h-3"></div>
                <div class="border-t" :class="darkMode?`border-button`:`border-gray-200`"></div>
                <div class="h-3"></div>
                <div class="flex justify-start px-3 w-full relative items-center">
                    <input type="text" placeholder="Add a caption..." class="w-full py-2 mb-3 focus:outline-none pl-2" v-model="message.text" 
                    :class="darkMode?`bg-transparent`:``">
                    <div class="flex items-center absolute -top-3 justify-center w-full text-center" v-if="sending">
                        <div class="loader"></div>
                    </div>
                    <button class="transform rotate-45 mr-5 cursor-pointer focus:outline-none relative -top-2" @click="sendFile()" :disabled="sending">
                        <SendMessageIcon :size="30" :fill="darkMode?`#1977f2`:`#3498db`"></SendMessageIcon>
                    </button>
                </div>
            </div>
        </div>
        <!-- Read pdf -->
        <div class="flex justify-center items-center left-0 top-0 fixed bg-black bg-opacity-90 w-full h-full z-50" v-if="isRead">
            <div class="bg-white w-2/5 h-5/6 overflow-y-hidden">
                <div class="flex justify-between items-center p-4" :class="darkMode?`bg-fb`:`bg-primary`">
                    <div class="border border-white cursor-pointer" style="padding:1px;" @click="openFullscreen">
                        <EnlargeIcon :size="16"></EnlargeIcon>
                    </div>
                    <div class="cursor-pointer" @click="() => {this.isRead = false}">
                        <CloseIcon fill="#ffffff" :width="22"></CloseIcon>
                    </div>
                </div>
                <div id="fullScreen" class="h-full overflow-y-scroll pb-10">
                    <SinglePdf :pdfUrl="pdfUrl" :darkMode="darkMode"></SinglePdf>
                </div>

            </div>
        </div>
        <BuyMsg v-if="isDelete" :msg="`remove_message`"  @cancelModal="() => {this.isDelete = false}" @yes="confirmDelete"></BuyMsg>
     </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import Vue from "vue"
import SearchIcon from "./../../components/SearchIcon.vue"
import ChevronIcon from "./../../components/ChevronIcon.vue"
import helper from "./../../helper/helper"
import moment from "moment"
import Reply from "./components/Reply.vue"
import MessageText from "./components/Text.vue"
import ReplyIcon from "./components/ReplyIcon.vue"
import TextReply from "./components/TextReply.vue"
import getBlobDuration from 'get-blob-duration'
import PdfReply from "./components/PdfReply.vue"
import ImageReply from "./components/ImageReply.vue"
import config from "./../../config"
import VoiceReply from "./components/VoiceReply.vue"
import ImageIcon from "./components/LinkIcon.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import VueRecord from '@codekraft-studio/vue-record'
import CloseIcon from "./../../components/CloseIcon.vue"
import SendMessageIcon from "./../../components/SendMessageIcon.vue"
import DocumentIcon from "./../../components/DocumentIcon.vue"
import VueSocketIO from 'vue-socket.io'
import BuyMsg from "./../Component/BuyMsg.vue"
Vue.use(new VueSocketIO({
    connection: config.urlSocket
}));
Vue.use(VueRecord)
export default {
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
    },
    components:{
        SearchIcon,
        ChevronIcon,
        Reply,
        MessageText,
        ReplyIcon,
        TextReply,
        PdfReply,
        ImageReply,
        VoiceReply,
        ImageIcon,
        PdfIcon,
        SendMessageIcon,
        CloseIcon,
        DocumentIcon,
        BuyMsg
    },
    data(){
        return{
            loading: false,
            page: 1,
            active: 0,
            settingImage: false,
            auth: "",
            replyId: "",
            loadingMessage: false,
            mentionList: [],
            busy:false,
            imgUrl: "",
            pdfUrl: "",
            fileUrl:"",
            file:"",
            isPreview: false,
            type: 1,
            chatText: "",
            isRead: false,
            enableScroll: true,
            replyContact:"",
            chatPage: 1,
            searchQuery: "",
            isDelete: false,
            contact:{
                id:"",
                name: "",
                photo: "",
                type: ""

            },
            message: {
                id: "",
                reply_id: "",
                text: "",
                photo: "",
                pdf: "",
                voice: "",
                duration: ""
            },
            sending: false,
            
        }
    },
    
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('etalk', ['admin','messages']),
        ...mapState('auth', ['stProfile']),

    },
    methods:{
        ...mapActions('etalk', ['getAdminContact','getMessage',
        'sendMessage','deleteMessage']),
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                this.page ++ 
                let payload = {}
                payload.p = this.page
              
                if(this.enableScroll){
                    this.getAdminContact(payload).then(res =>{
                        if(res.data.data.length <= 0){
                            this.enableScroll = false
                        }
                    })
                }
            }
        },
        reply(){
            this.replyContact = this.replyId
            this.replyId = false
        },
        copy(){
            this.replyId = false
            this.copyText()
        },
        save(){
             this.replyId = false
             ipcRenderer.send("saveFile", this.fileUrl)
        },
        showReply(message){
            this.chatText = message.content.text
            if(message.content.file != undefined){
                this.fileUrl = message.content.file.url
            }
            this.replyId = message
            
        },
        confirmDelete(){
            this.isDelete = false
            this.deleteMessage({
                id: this.messageId._id,
                type: this.contact.type
            }).then((response) => {
               if(response.data.msg != undefined){
                   helper.errorMessage(response.data.msg)
               }else{
                   this.$store.commit("etalk/removeMessage", this.messageId._id)
               }
            })
        }, 
        replyTo(replyContact){
            if(replyContact.is_admin == 0){
                return replyContact.sender.name
            }
            
            if(replyContact.sender && replyContact.sender._id == this.stProfile._id){
                return this.$i18n.t('you') + " " + this.$i18n.t('reply_to') + " " + this.$i18n.t('yourself')
            }
            return replyContact.sender.name
        },
        copyText() {
            var copyText = document.getElementById("chat-text");
            copyText.select();
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy");
            helper.success("Copied")
        },
        dlMessage(){
            this.isDelete = true
            this.messageId = this.replyId
            this.replyId = ""
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
        searchContact(){ 
            this.loading = true
            let payload = {
                s: this.searchQuery,
                p: 1,
            }
            this.getAdminContact(payload).then(()=>{
                this.loading = false
            })
        },
        getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        },
        sendFile(){
            if(this.type === 1){
                this.message.photo = this.file
            }else{
                this.message.pdf = this.file
                if(!this.message.text){
                    this.message.text = this.file.name
                }
                
            }
           this.onMessage()
        },
        onMessage(){
            let form = new FormData()
            if(!this.message.text.trim() && !this.message.voice && !this.message.photo && !this.message.pdf){
                return;
            }
            form.append("id", this.contact._id)
            if(this.message.text){
                let mentionList = [...new Set(this.mentionList)];
                for (let i = 0; i < mentionList.length; i++) {
                    this.message.text = this.message.text.replace(mentionList[i], "@[" + mentionList[i].substring(1) + "]")
                }
            }
            if(this.replyContact){
                form.append("reply_id", this.replyContact._id)
            }
            form.append("type", this.contact.type)
            form.append("text", this.message.text.trim())
            form.append("photo", this.message.photo)
            form.append("pdf", this.message.pdf)
            form.append("voice", this.message.voice)
            form.append("duration", Math.round(this.message.duration))
            this.sendMessage(form).then(() =>{
                this.message.text = ""
                this.message.photo = ""
                this.message.voice = ""
                this.message.pdf = ""
                this.replyContact = ""
                this.isPreview = false
                this.scrollToBottom()
            })
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
        openFullscreen() {
            var elem = document.getElementById("fullScreen");
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        },
    
        enableWatch(){

        },
        getMoreMessage({target: {scrollTop}}){
            if(scrollTop === 0){
                this.loadingMessage = true
                this.chatPage ++
                let payload = {}

                payload.p = this.chatPage
                payload.id = this.contact._id
                payload.type = this.contact.type
                
                this.getMessage(payload).then((response) =>{
                   if(response.data.data.length){
                       this.scrollToTop()
                   }
                   this.loadingMessage = false
                })
                
            }
        },
        sender(message){
            if(this.contact.type == 0){
                if((message.is_admin == undefined || message.is_admin == 0)){
                    return this.auth
                }
            }

            if(message.sender === undefined ){
                return false
            }

            return message.sender._id
        },
        senderPhoto(message){
            if(message.is_admin == 0){
                return this.contact.photo
            }
            return ""
        },
        getAudioDuration(blob){
            return new Promise(resolve => {
                resolve(getBlobDuration(blob))
            })

        },
        senderName(message){
            if(message.sender != undefined){
                if(message.sender._id == this.stProfile._id){
                    return this.$i18n.t('you')
                }
                return message.sender.name
            }
            return this.$i18n.t('unknown')
          
        },
        replyName(message){
            if(message.is_admin == 0){
                return this.$i18n.t('hime_self')
            }else{
                if(message.sender && message.sender._id == this.stProfile._id){
                    return this.$i18n.t('yourself')
                }
                return this.$i18n.t('admin')
            }
        },
        getDay(oldDate){
            if (helper.numDay(oldDate, moment().format()) === 0) {
                return moment(oldDate).format('h:mm A')
            } else {
                return moment(oldDate).format('DD-MM-YYYY')
            }
        },
        selectedContact(contact, index){
            this.contact = contact
            this.sockets.unsubscribe(`message_${this.contact._id}`);
            this.$store.commit("etalk/selectedAdminContact",contact)
            this.active = index
            this.getMessage({
                p: 1,
                id: this.contact._id,
                type: 10
            }).then(() => {
                this.scrollToBottom()
                this.lisentMessage()
            })
        },
        cutString(text, limit){
            return helper.cutString(text, limit)
        },
        changeContactPhoto(){

        },
        contactPhoto(){

        },
        scrollToBottom(){
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
         paySound(){
            document.getElementById("message-sound").play()
        },
        lisentMessage(){
            this.sockets.subscribe(`message_${this.contact._id}`, (data) => {
                if(this.contact._id === data.room_id){
                    if(data.sender && data.sender._id !== this.auth){
                        if(!this.contact.is_mute){
                            this.paySound()
                        }
                        this.$store.commit("etalk/broadcastMessage",data)
                        this.scrollToBottom()
                    }
                }
            });            
        },
    },
    created(){
        this.auth = this.stProfile._id
        this.loading = true
        this.getAdminContact({
            p: this.page
        }).then(()=>{
            this.contact = this.admin[0]
            this.getMessage({
                p: 1,
                id: this.contact._id,
                type: 10
            }).then(() => {
                this.loading = false
                this.scrollToBottom()
            })
        })
    }
}
</script>