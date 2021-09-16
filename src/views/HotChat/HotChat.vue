<template>
    <div class="h-screen">
        <input type="text" id="chat-text" class="absolute" v-model="chatText" style="z-index:-1"/>
        <audio controls  id="message-sound" class="absolute" style="z-index:-1">
            <source src="message.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <div :class="darkMode?`bg-dark text-gray-300 bg-cover`:`bg-light-mode bg-cover`" class="rounded-xl bg-repeat m-5 h-full flex flex-col">
            <div class="flex items-center px-5 py-3 rounded-t-xl e-shadow" :class="darkMode?`bg-secondary`:`bg-white`">
                <div class="rounded-full h-16 w-16 bg-gray-300 bg-cover bg-no-repeat" 
                style="background-image:url('e-school-logo.png');background-size:70% 70%;background-position:center center"></div>
                <div class="flex flex-col ml-3">
                    <div>
                        {{$t('eschool')}}
                    </div>
                    <div class="text-xs" :class="darkMode?``:`text-gray-600`">{{$t('official_page')}}</div>
                </div>
            </div>
            <div class="px-5 flex-1 h-screen">
                <div class="flex items-center justify-center w-full my-5">
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`" @click="openLink(messanger)">
                        <div class="mr-3">
                            <MessagerIcon></MessagerIcon>
                        </div>
                        <div>
                            {{ $t('messenger') }}
                        </div>
                    </div>
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`" @click="openLink(telegram)">
                        <div class="mr-3">
                            <TelegramIcon></TelegramIcon>
                        </div>
                        <div>
                            {{ $t('telegram') }}
                        </div>
                    </div>
                    <div class="flex items-center rounded-xl w-40 justify-center h-13 mr-5 shadow-lg cursor-pointer" :class="darkMode?`bg-button`:`bg-primary text-white`"  @click="openLink(video)">
                        <div class="mr-3">
                            <VideoIcon></VideoIcon>
                        </div>
                        <div>
                            {{ $t('video') }}
                        </div>
                    </div>
                </div>
                <div class="mt-10 h-full" style="position:relative;z-index:1">
                    <div class="relative h-screen z-50 pt-3 justify-between flex flex-col">
                        <ul class="overflow-y-scroll flex-1 px-5 pb-100"  ref="feed" @scroll="getMoreMessage" style="z-index:999;">
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
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`" class="items-center mb-1">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap uppercase">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`" class="items-center">
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                                <div class="relative rounded-xl py-3 e-shadow inline-flex items-center px-3 mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-100`:`bg-white text-black`">
                                                    <MessageText :message="message" :isMind="message.is_admin == 0"></MessageText>
                                                </div>
                                            </div>
                                            <div v-else class="relative rounded-xl py-3 e-shadow inline-flex items-center px-3 mb-5 max-w-sm" :class="darkMode?`bg-button text-gray-100`:`bg-white text-black`">
                                                <MessageText :message="message" :isMind="message.is_admin == 0"></MessageText>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End message text -->
                                <!-- Photo -->
                                <template v-if="message.content.type === 3">
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`" class="items-center mb-1">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap uppercase">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`"  class="items-center relative">
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                          {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex flex-col items-start text-gray-600 max-w-sm">
                                                <img class="max-w-xs rounded-md mb-2" :src="message.content.file.url"/>
                                                <div :class="darkMode?`text-gray-300`:`text-black`" class="text-semibold" v-if="message.content.text">{{message.content.text}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- End photo -->
                                <!-- Pdf -->
                                <template v-if="message.content.type === 2">
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`"  class="items-center">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap mb-1">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`"  class="items-center relative mb-3">
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1" ></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex items-center text-gray-600 max-w-sm mb-1">
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
                                        </div>
                                    </div>
                                </template>
                                <!-- End pdf -->
                                <!-- Audio -->
                                <template v-if="message.content.type === 4">
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`"  class="items-center">
                                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap mb-1">
                                            {{getDay(message.date)}}
                                        </div>
                                    </div>
                                    <div :class="message.is_admin?`flex justify-start`:`flex justify-end`"  class="items-center relative">
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#9CA3AF`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                       {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex items-center text-gray-600 max-w-sm">
                                                <audio controls class="focus:outline-none"
                                                    controlsList="nodownload">
                                                    <source :src="message.content.file.url" type="audio/wav">
                                                    Your browser does not support the <code>audio</code>
                                                    element.
                                                </audio>
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
                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 1" >
                                        {{cutString(replyContact.content.text,40)}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 2" >
                                        {{$t('file')}}
                                    </div>
                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs mt-1 flex items-center" v-if="replyContact.content.type === 3" >
                                        <img :src="replyContact.content.file.url" class="rounded w-10"/>
                                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-2">
                                            {{$t('image_message')}}
                                        </div>
                                    </div> 
                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 4" >
                                        {{$t("voice_message")}}
                                    </div>
                                </div>
                                <div :class="darkMode?`bg-button`:`bg-gray-300`" class="cursor-pointer rounded-full w-7 h-7 flex items-center justify-center" @click="()=> {this.replyContact = ``}">
                                    <CloseIcon :width="20" :fill="darkMode?`#D1D5DB`:`#000`"></CloseIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Reply -->
            <div class="h-24 flex items-center px-5 relative z-50" :class="darkMode?`bg-secondary text-gray-300`:`bg-white e-shadow text-primary`" v-if="replyContact">
                <div class="flex border-l-2 pl-1 mx-10 justify-between w-full items-center" :class="darkMode?`border-gray-400`:`border-primary`">
                    <div>
                        <div class="underline">
                            {{replyTo(replyContact)}}
                        </div>
                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 1" >
                            {{cutString(replyContact.content.text,40)}}
                        </div>
                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 2" >
                            {{$t('file')}}
                        </div>
                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs mt-1 flex items-center" v-if="replyContact.content.type === 3" >
                            <img :src="replyContact.content.file.url" class="rounded w-10"/>
                            <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-2">
                                {{$t('image_message')}}
                            </div>
                        </div> 
                        <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 4" >
                            {{$t("voice_message")}}
                        </div>
                    </div>
                    <div :class="darkMode?`bg-button`:`bg-gray-300`" class="cursor-pointer rounded-full w-7 h-7 flex items-center justify-center" @click="()=> {this.replyContact = ``}">
                        <CloseIcon :width="20" :fill="darkMode?`#D1D5DB`:`#000`"></CloseIcon>
                    </div>
                </div>
            </div>
            <div class="flex h-24 items-center mb-36 px-5" :class="darkMode?`bg-secondary`:`bg-white e-shadow`" style="position:relative;z-index:10">
                <div class="cursor-pointer" @click="() => {this.$refs.file.click()}">
                    <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                </div>
                <input type="file" ref="file" class="hidden" accept="application/pdf, image/*" @change="onSelectFile">
                <textarea class="w-full h-14 border-2 text-gray-600 rounded-full focus:outline-none mx-5 py-4 px-5" 
                :placeholder="$t(`2112`)" 
                v-model="message.text"
                @keyup.enter.exact="onMessage"
                :class="darkMode?`bg-youtube border-transparent text-gray-300`:``"></textarea>
                <div class="w-14 flex justify-end">
                    <div class="cursor-pointer  rounded-full ml-5 mt-2">
                        <!-- <vue-record-audio @result="onResult" @stream="onStream"/> -->
                        <VueRecord class="record" @result="onResult">
                            <div class="w-13 h-13 rounded-full flex items-center justify-center" :class="darkMode?`bg-youtube`:`bg-primary`">
                                <mic-icon :size="28" :fill="darkMode?`#9CA3AF`:`#FFFFFF`"></mic-icon>
                            </div>
                            <template slot="isInitiating">
                                Voice
                            </template>
                            <template slot="isRecording">
                                <div class="w-13 h-13 rounded-full flex items-center justify-center pulse">
                                    <mic-icon :size="28" :fill="darkMode?`#FFFFFF`:`FFFFFF`"></mic-icon>
                                </div>
                            </template>
                            <template slot="isCreating">
                                <div class="w-13 h-13 rounded-full flex items-center justify-center pulse">
                                    <mic-icon :size="28" :fill="darkMode?`#FFFFFF`:`#FFFFFF`"></mic-icon>
                                </div>
                            </template>
                        </VueRecord>
                    </div>
                </div>
            </div>
        </div>
        <!-- Register if no account -->
        <div class="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-90" v-if="isInfo">
            <div class="w-96 rounded-md text-sm" :class="darkMode?`bg-secondary text-gray-600`:`bg-white e-shadow`">
                <div class="h-14 px-4 flex items-center justify-between">
                    <div class="text-lg flext-1 text-center w-full">
                        {{$t('please_enter_your_info')}}
                    </div>
                    <div class="cursor-pointer" @click="() => {this.isInfo = false}">
                        <CloseIcon :width="20" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                    </div>
                </div>
                <div class="border-t" :class="darkMode?`border-youtube`:``"></div>
                <div class="px-5 mt-4">
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        ref="firstName"
                         v-model="user.first_name" :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2013')">
                    </div>
                    <div class="h-3"></div>
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        ref="lastName"
                         v-model="user.last_name"  :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2014')">
                    </div>
                    <div class="h-3"></div>
                    <div>
                        <input type="text" class="h-12 rounded-md w-full focus:outline-none placeholder-gray-500"
                        @keypress="isNumber($event)" 
                        ref="phone"
                         v-model="user.phone" :class="darkMode?`bg-youtube pl-3`:``" :placeholder="$t('2009')">
                    </div>
                    <div class="h-4"></div>
                    <div class="flex justify-end items-center">
                        <button class="focus:outline-none bg-primary px-14 h-12 rounded-md relative" :disabled="loading" @click="onSubmit">
                            <div class="absoloute" v-if="loading">
                                <div class="loader -mt-7"></div>
                            </div>
                             <span v-else>{{$t('submit')}}</span>
                        </button>
                    </div>
                     <div class="h-4"></div>
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
                    <img :src="imgUrl" v-if="type === 1" class="rounded">
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
import Vue from "vue"
import eHeader from "../Video/components/Header.vue"
import MessagerIcon from "./components/MessagerIcon.vue"
import TelegramIcon from "./components/TelegramIcon.vue"
import ImageIcon from "./../Chat/components/LinkIcon.vue"
import ChevronIcon from "./components/ChevronIcon.vue"
import VideoIcon from "./components/VideoIcon.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import MessageText from "./../Chat/components/Text.vue"
import ImageReply from "./../Chat/components/ImageReply.vue"
import ReplyIcon from "./../Chat/components/ReplyIcon.vue"
import VoiceReply from "./../Chat/components/VoiceReply.vue"
import PdfIcon from "./../../components/PdfIcon.vue"
import TextReply from "./../Chat/components/TextReply.vue"
import SendMessageIcon from "./../../components/SendMessageIcon.vue"
import Reply from "./../Chat/components/Reply.vue"
import {mapState,mapActions} from "vuex"
import VueSocketIO from 'vue-socket.io'
import helper from "./../../helper/helper"
import config from "./../../config"
import DocumentIcon from "./../../components/DocumentIcon.vue"
import EnlargeIcon from "./../../components/EnlargeIcon.vue"
import moment from "moment"
import getBlobDuration from 'get-blob-duration'
import SinglePdf from "./../Component/SinglePdf.vue"
import VueRecord from "@loquiry/vue-record-audio"
import MicIcon from "./components/MicIcon.vue"
import BuyMsg from "./../Component/BuyMsg.vue"
const { ipcRenderer } = require('electron')
Vue.use(new VueSocketIO({
    connection: config.urlSocket
}));
export default {
    components:{
        eHeader,
        MessagerIcon,
        TelegramIcon,
        VideoIcon,
        ImageIcon,
        ChevronIcon,
        CloseIcon,
        MessageText,
        ReplyIcon,
        VoiceReply,
        TextReply,
        Reply,
        SendMessageIcon,
        DocumentIcon,
        EnlargeIcon,
        SinglePdf,
        MicIcon,
        VueRecord,
        PdfIcon,
        ImageReply,
        BuyMsg
    },
    data(){
        return{
            auth: "",
            authId:"",
            isInfo: false,
            loading: false,
            password: "",
            loadingMessage: false,
            replyId: "",
            type: 1,
            replyContact:"",
            mentionList: [],
            chatPage: 1,
            isPreview: false,
            imgUrl: "",
            sending: false,
            isRead: false,
            pdfUrl:"",
            messanger:"https://www.facebook.com/eschoolcambodia",
            telegram:"https://t.me/eschool_community",
            video:"https://www.youtube.com/channel/UCXAVs_YRUwsnx5I-Toy-7Dg",
            room_id: "",
            chatText:"",
            isDelete: false,
            message: {
                id: "",
                reply_id: "",
                text: "",
                photo: "",
                pdf: "",
                voice: "",
                duration: ""
            },
            user:{
                first_name: "",
                last_name: "",
                phone: "",
                app_version: "",
                device_os: "",
                device_name:"",
                device_id:""
            },
            contact:{
                id:"",
                name: "",
                photo: "",
                type: ""

            },
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('auth', ['stProfile']),
        ...mapState('etalk', ['messages'])
    },
    methods:{
        ...mapActions('etalk', ['getMessage', 'hotChat','sendMessage','deleteMessage']),
        ...mapActions('auth', ['getStudentProfile', 'getToken']),
        isNumber(evt){
            return helper.isNumber(evt)
        },
        onStream(){
            this.audioUrl = ""
        },
        blobToFile(theBlob, fileName){
            return new File([theBlob], fileName, {lastModified: new Date().getTime(), type: "audio/mpeg"})
        },
        getAudioDuration(blob){
            return new Promise(resolve => {
                resolve(getBlobDuration(blob))
            })

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
        readPdf(pdf){
            this.pdfUrl = pdf
            this.isRead = true
        },
        onMessage(){
            let form = new FormData()
            if(!this.message.text.trim() && !this.message.voice && !this.message.photo && !this.message.pdf){
                return;
            }
            form.append("id", this.stProfile._id)
            if(this.message.text){
                let mentionList = [...new Set(this.mentionList)];
                for (let i = 0; i < mentionList.length; i++) {
                    this.message.text = this.message.text.replace(mentionList[i], "@[" + mentionList[i].substring(1) + "]")
                }
            }
            if(this.replyContact){
                form.append("reply_id", this.replyContact._id)
            }
            form.append("type", 0)
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
        makeID() {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < charactersLength; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        onResult(blob){
            let data = blob.blob
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
        cutString(text, limit){
            return helper.cutString(text, limit)
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
        reply(){
            this.replyContact = this.replyId
            this.replyId = false
        },
        copyText() {
            var copyText = document.getElementById("chat-text");
            copyText.select();
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy");
            helper.success("Copied")
        },
        copy(){
            this.replyId = false
            this.copyText()
        },
        save(){
             this.replyId = false
             ipcRenderer.send("saveFile", this.fileUrl)
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
        getDay(oldDate){
            if (helper.numDay(oldDate, moment().format()) === 0) {
                return moment(oldDate).format('h:mm A')
            } else {
                if(moment(oldDate).format('YYYY') === moment().format('YYYY')){
                    if(moment(oldDate).format('MMM') == moment().format('MMM')){
                        return moment(oldDate).format('ddd h:mm A')
                    }
                    return moment(oldDate).format('MMM DD, h:mm A')
                }else{
                    return moment(oldDate).format('MMM DD YYYY')
                }
                
            }
        },
        senderPhoto(message){
            return "e-school-logo.png"
        },
        getMoreMessage({target: {scrollTop}}){
            if(scrollTop === 0){
                this.loadingMessage = true
                this.chatPage ++
                let payload = {}

                payload.p = this.chatPage
                payload.id = this.stProfile._id
                payload.type = 10
                
                this.getMessage(payload).then((response) =>{
                   if(response.data.data.length){
                       this.scrollToTop()
                   }
                   this.loadingMessage = false
                   
                })
                
            }
        },
        paySound(){
            document.getElementById("message-sound").play()
        },
        lisentMessage(){
            this.sockets.subscribe(`message_${this.room_id}`, (data) => {
                if(this.room_id === data.room_id){
                    if(data.sender._id !== this.stProfile._id){
                        if(!this.contact.is_mute){
                            this.paySound()
                        }
                        this.$store.commit("etalk/broadcastMessage",data)
                        this.scrollToBottom()
                    }
                }
            });
            
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
        senderName(message){
            if(message.sender != undefined){
                if(message.sender._id == this.stProfile._id){
                    return this.$i18n.t('you')
                }
                return this.$i18n.t('admin')
            }
            return this.$i18n.t('unknown')
          
        },
        replyName(message){
            try{
                if(message.reply.sender._id != this.authId){
                    return this.$i18n.t('themselves')
                }else{
                    if(this.authId== message.sender._id){
                        return this.$i18n.t('yourself')
                    }
                    if(message.reply.sender._id == this.authId){
                        return this.$i18n.t('you')
                    }
                    return this.$i18n.t('themselves')
                    
                }
            }catch(err){
                return  this.$i18n.t('admin')
            }
        },
        showReply(message){
            this.chatText = message.content.text
            if(message.content.file != undefined){
                this.fileUrl = message.content.file.url
            }
            this.replyId = message
            
        },
        dlMessage(){
            this.isDelete = true
            this.messageId = this.replyId
            this.replyId = ""
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
        onSubmit(){
            if(!this.user.first_name.trim()){
                helper.errorMessage('please_enter_first_name')
                this.$refs.firstName.focus()
                return;
            }
            if(!this.user.last_name.trim()){
                helper.errorMessage('please_enter_last_name')
                this.$refs.lastName.focus()
                return;
            }
            if(!this.user.phone.trim()){
                helper.errorMessage('please_enter_phone_number')
                this.$refs.phone.focus()
                return;
            }
            this.user.device_id = helper.deviceId
            this.user.device_os = helper.deviceOs
            this.user.device_name = helper.deviceName
            this.user.app_version = config.appVersion
            this.loading = true
            this.hotChat(this.user).then(response =>{
                this.loading = false
                if(response.data.msg != undefined){
                    if(response.data.msg == 4105){
                        this.$router.push('/login')
                    }else{
                        helper.errorMessage(response.data.msg)
                        return;
                    }
                }else{
                    this.isInfo = false
                    localStorage.setItem('stProfile', JSON.stringify(response.data.data.user));
                    this.getStudentProfile(response.data.data.user)
                    this.getToken(response.data.data.user.token)
                    this.$store.commit('auth/receivingToken', response.data.data.user.token)
                    this.$store.commit("setting/toggleSidebar", false)
                    localStorage.setItem('token', response.data.data.user.token)
                    this.$store.commit('etalk/getMessage',response.data.data)
                   
                }               
            })
        },
        openLink(link){
            ipcRenderer.send('openLink', link)
        },
        
        chat(){
            if(!this.auth){
                this.isInfo = true
            }else{
                this.$router.push('chat')
            }
        },
    },
    mounted(){
        document.querySelector('.needsInitiation').click();
        try{
            if(this.auth){
                this.authId = this.stProfile._id
                let payload = {
                    p: 1,
                    id: this.stProfile._id,
                    type: 0
                }
                this.getMessage(payload).then((response)=>{
                    this.room_id = response.data.data.room._id
                    this.lisentMessage()
                    this.scrollToBottom()
                })
            }else{
                this.isInfo = true
            }
        }catch(err){}
    },
    created(){

        if(localStorage.getItem('token') != undefined && localStorage.getItem('token') != null){
            this.auth = localStorage.getItem('token')
        }
    }
}
</script>
<style>
    .sender{
        background-size: 85% 85%;
        background-position: center center;
        background-repeat: no-repeat;
    }
    .vue-audio-recorder {
        background-color: #00a0e4 !important;;
        width: 55px !important;
        height: 55px !important;
    }

    .vue-audio-recorder:hover {
        background-color: #055174 !important;
    }  
    .pulse {
        border-radius: 50%;
        background: #1977f2;
        cursor: pointer;
        box-shadow: 0 0 0 rgba(11, 184, 214, 0.4);
        animation: pulse 2s infinite;
    }
       
    .record{
        outline:none;
    }
    @-webkit-keyframes pulse {
    0% {
        -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
    }
    70% {
        -webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
    }
    100% {
        -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
    }
    }
    @keyframes pulse {
    0% {
        -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
        box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
    }
    70% {
        -moz-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
        box-shadow: 0 0 0 10px rgba(204,169,44, 0);
    }
    100% {
        -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
        box-shadow: 0 0 0 0 rgba(204,169,44, 0);
    }
    }
</style>