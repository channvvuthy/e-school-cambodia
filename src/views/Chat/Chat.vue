<template>
    <div class="flex h-screen m-5 text-sm">
        <!-- Copy text  -->
        <input type="text" id="chat-text" class="absolute" v-model="chatText" style="z-index:-1"/>
        <input type="text" id="share"  class="absolute focus:outline-none" :value="share" style="z-index:-1">
        <audio controls  id="message-sound" class="absolute" style="z-index:-1">
            <source src="message.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <div class="h-full overflow-y-scroll pb-40" :class="darkMode?`bg-secondary`:`bg-white`" @scroll="onScroll" style="width:520px;">
            <div class="flex px-4 py-2 items-center justify-between relative" :class="darkMode?`text-gray-300`:`bg-white`">
                <div class="py-3 font-bold" :class="darkMode?``:`text-primary`">E-TALK</div>
                <div class="cursor-pointer" @click="() => {this.eTalkOption = true;}">
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                    <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-400`:`bg-primary`"></div>
                
                </div>
                <!-- eTalk option -->
                <div :class="darkMode?`bg-button`:`bg-white`" class="rounded-md overflow-hidden e-shadow absolute right-5 top-14 cursor-pointer" v-if="eTalkOption" style="z-index:55">
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="goTo('network')">
                        {{$t('connect_friend')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="goTo(`create-group`)" id="group">
                        {{$t('create_group')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center border-b" :class="darkMode?`border-youtube`:`border-gray-200`" @click="goTo('hot-chat')">
                        {{$t('need_support')}}
                    </div>
                    <div class="px-8 h-12 flex items-center justify-center" :class="darkMode?`border-youtube`:`border-gray-400`" @click="muteAll()">
                        {{$t(muteLabel)}}
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
                            <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-3 bg-center" :style="{backgroundImage:`url(${contact.photo})`}"></div>
                        </div>
                        <div>
                            <div class="text-sm fon-medium" :class="darkMode?`text-gray-300`:``">
                                <div class="flex">
                                    <div>
                                        {{contact.name}}
                                    </div>
                                    <div v-if="contact.type===0" class="notification h-4 w-4 rounded-full ml-3 flex items-center justify-center" :class="darkMode?`bg-youtube text-gray-500`:`bg-gray-400 text-gray-200`">
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
                                    <div class="notification h-4 w-4 rounded-full flex items-center justify-center text-xs" :class="darkMode?`bg-white text-black`:`bg-heart text-white`">{{contact.unread}}</div>
                                </div>
                                <div class="text-xs mt-1 whitespace-nowrap" :class="darkMode?`text-gray-500`:`text-gray-400`">
                                    {{contact.last == undefined?$t('unread') + ' ' + contact.unread:getDay(contact.last.date)}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <!-- Contact List -->
                </div>
            </div>
        </div>
        <div class="w-full">
            <div class="flex-1 w-full ml-2 h-screen flex flex-col bg-cover" :class="darkMode?`bg-dark`:`bg-light-mode`">
                <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="px-4 py-3 flex text-sm items-center shadow relative">
                    <div class="h-12 w-12 rounded-full shadow bg-cover bg-gray-300 mr-3 flex items-center justify-center bg-center" :style="{backgroundImage:`url(${contact.photo})`}" @click="contactPhoto()" :class="(contact.type === 0 || this.contact.type === 1 )?``:`cursor-pointer`">
                        <div class="loading" v-if="settingImage"></div>
                    </div>
                    <input type="file" ref="contactPhoto" class="hidden" @change="changeContactPhoto">
                    <div>
                        <div class="font-semibold">
                            {{contact.name?contact.name:$t('unknown')}}
                        </div>
                        <div class="text-xs text-gray-500">
                            <template v-if="lastSeen">
                                {{$t('last_seen')}} <timeago :datetime="lastSeen" locale="en" :auto-update="60"></timeago>
                            </template>
                            <template v-else>
                                {{$t('online')}}
                            </template>
                        </div>
                    </div>
                    <div class="flex-1 flex flex-col items-end cursor-pointer" @click="() => {this.chatOption = true;}" v-if="contact.type">
                        <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                        <div class="w-1 h-1 rounded-full mb-1" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                        <div class="w-1 h-1 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
                    </div>
                    <!-- eTalk option -->
                    <div :class="darkMode?`bg-button`:`bg-white`" class="z-50 rounded-md overflow-hidden e-shadow absolute right-5 top-20 z-50 cursor-pointer" v-if="chatOption">
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
                            <div class="px-8 h-12 flex items-center border-b relative" :class="darkMode?`border-youtube`:`border-gray-200`" @click="shareLink">
                                {{$t('copy_link')}}
                                
                            </div>
                        </template>
                    </div>
                </div>
                <div class="flex-1 h-full flex flex-col pb-36 py-5">
                    <div class="h-full flex items-center justify-center flex-col" :class="darkMode?`text-gray-400`:`text-primary`" v-if="!isSelectedContact">
                        <BoubleIcon :size="100" :fill="darkMode?`#9CA3AF`:`#055174`"></BoubleIcon>
                        <div class="text-lg">
                            {{ $t('please_select_contact_to_chat') }}
                        </div>
                    </div>
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
                        <ul class="px-5 pr-14 pb-20" id="box relative">
                            <li v-for="(message, index) in messages" :key="index" :id="message._id"  @contextmenu="showReply(message)" class="relative">
                                <div class="absolute w-full justify-center flex " 
                                    v-if="replyId._id === message._id" style="z-index:100;">
                                    <Reply 
                                        :contact="contact"
                                        :message="message"
                                        @deleteMessage="dlMessage"
                                        @copy="copy()"
                                        @save="save()"
                                        @reply="reply()">
                                    </Reply>
                                </div>
                                <!--  Message text -->
                                <template v-if="(message.content.type === 1 || message.content.type === 0)">
                                    <div :class="auth === sender(message)?`flex ${message.content.type?`justify-end` :`justify-center`}`:`flex ${message.content.type?`justify-start` :`justify-center`}`" class="items-center relative">
                                        <template v-if="message.content.type">
                                            <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="auth !== sender(message)">
                                                <div class="h-13 w-13"></div>
                                            </div>
                                        </template>
                                        <div class="flex items-center mr-5" v-if="auth === sender(message)">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap" v-if="message.content.type">
                                                {{getDay(message.date)}} <isRead :isRead="message.is_read"></isRead>
                                            </div>
                                        </div>
                                        <div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#4B5563`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3" @previewImage="previewImage($event)"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                                <div class="relative py-2  inline-flex items-center px-3 text-black mb-5 max-w-md" :class="darkMode?`bg-button text-gray-300 ${message.content.type == 0?`bg-opacity-40 rounded-3xl `:`rounded-xl e-shadow`}`:`bg-white ${message.content.type == 0?`bg-opacity-20 rounded-3xl `:`rounded-xl e-shadow`}`">
                                                    <MessageText :message="message" :isMind="auth === sender(message)"></MessageText>
                                                </div>
                                            </div>
                                            <div v-else class="relative py-2 inline-flex items-center px-3 text-black mb-5 max-w-md" :class="darkMode?`bg-button text-gray-300 ${message.content.type == 0?`bg-opacity-40 rounded-3xl `:`rounded-xl e-shadow`}`:`bg-white ${message.content.type == 0?`bg-opacity-20 rounded-3xl`:`rounded-xl e-shadow`}`">
                                               <MessageText :message="message" :isMind="auth === sender(message)"></MessageText>
                                            </div>
                                            
                                        </div>
                                        <div class="flex items-center ml-5" v-if="auth !== sender(message)">
                                            <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap" v-if="message.content.type">
                                                {{getDay(message.date)}}
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- Audio -->
                                <template v-if="message.content.type === 4">
                                    <div :class="auth === sender(message)?`flex justify-end`:`flex justify-start`"  class="items-center relative">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="auth !== sender(message)"></div>
                                        <div>
                                            <div class="flex items-center" v-if="auth === sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap mb-1">
                                                    {{getDay(message.date)}} <isRead :isRead="message.is_read"></isRead>
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#4B5563`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                       {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3" @previewImage="previewImage($event)"></ImageReply>
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
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap my-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- Photo -->
                                <template v-if="message.content.type === 3">
                                    <div :class="auth === sender(message)?`flex justify-end`:`flex justify-start`"  class="items-center relative mb-2">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="auth !== sender(message)"></div>
                                        <div>
                                            <div class="flex items-center mb-2" v-if="auth === sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap">
                                                    {{getDay(message.date)}} <isRead :isRead="message.is_read"></isRead>
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#4B5563`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                          {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1"></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3" @previewImage="previewImage($event)"></ImageReply>
                                                <PdfReply :message="message" v-if="message.reply.type === 2"></PdfReply>
                                                <VoiceReply :message="message" v-if="message.reply.type === 4"></VoiceReply>
                                            </div>
                                            <div class="relative rounded-xl inline-flex flex-col items-start text-black max-w-sm">
                                                <img class="max-w-xs rounded-md mb-2 cursor-pointer" :src="message.content.file.url" @click="previewImage(message.content.file.url)"/>
                                                <div :class="darkMode?`text-gray-300`:`text-black`" class="text-semibold" v-if="message.content.text">{{message.content.text}}</div>
                                            </div>
                                            <div class="flex items-center" v-if="auth !== sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- Pdf -->
                                <template v-if="message.content.type === 2">
                                    <div :class="auth === sender(message)?`flex justify-end`:`flex justify-start`"  class="items-center relative">
                                        <div class="h-13 w-13 rounded-full shadow bg-cover bg-gray-300 mr-10" :style="{backgroundImage:`url(${senderPhoto(message)})`}" v-if="auth !== sender(message)"></div>
                                        <div>
                                            <div class="flex items-center" v-if="auth === sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap mb-1">
                                                    {{getDay(message.date)}} <isRead :isRead="message.is_read"></isRead>
                                                </div>
                                            </div>
                                            <div v-if="message.reply !== undefined">
                                                <div class="flex">
                                                    <div><ReplyIcon :size="16" :fill="darkMode?`#6B7280`:`#4B5563`"></ReplyIcon></div>
                                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-1">
                                                        {{senderName(message)}} {{$t('reply_to')}} {{replyName(message)}}
                                                    </div>
                                                </div>
                                                <TextReply :message="message" v-if="message.reply.type === 1" ></TextReply>
                                                <ImageReply :message="message" v-if="message.reply.type === 3" @previewImage="previewImage($event)"></ImageReply>
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
                                            <div class="flex items-center" v-if="auth !== sender(message)">
                                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs whitespace-nowrap my-1">
                                                    {{getDay(message.date)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                
                            </li>
                        </ul>
                    </div>
                    <!-- Reply -->
                    <div class="h-24 flex items-center px-5 relative z-40" :class="darkMode?`bg-secondary text-gray-300`:`bg-white e-shadow text-primary`" v-if="replyContact">
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
                                <div :class="darkMode?`text-gray-500`:`text-gray-400`" class="text-xs mt-1 flex items-center" v-if="replyContact.content.type === 3" >
                                    <img :src="replyContact.content.file.url" class="rounded w-10" />
                                    <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs ml-2">
                                        {{$t('image_message')}}
                                    </div>
                                </div> 
                                <div :class="darkMode?`text-gray-500`:`text-gray-600`" class="text-xs" v-if="replyContact.content.type === 4" >
                                    {{$t("voice_message")}}
                                </div>
                            </div>
                            <div :class="darkMode?`bg-button`:`bg-gray-300`" class="cursor-pointer rounded-full w-7 h-7 flex items-center justify-center" @click="()=> {this.replyContact = ``}">
                                <CloseIcon  :fill="darkMode?`#D1D5DB`:`#000`"></CloseIcon>
                            </div>
                        </div>
                    </div>
                    <!-- Mention -->
                    <div class="h-24 flex items-center px-5 relative z-40" :class="darkMode?`bg-secondary`:`bg-white ${replyContact?``:`e-shadow`}`">
                        <div class="h-48 overflow-y-scroll w-48 rounded-lg absolute bottom-28 left-0 mb-2" :class="darkMode?`bg-secondary text-gray-300`:`bg-white e-shadow`" v-if="showMention">
                            <ul>
                                <li v-for="(mention, key) in mentions" :key="key"
                                    class="py-1 cursor-pointer h-12 flex items-center px-3"
                                    :class="darkMode?`border-black ${key > 0?`border-t`:``}`:`border-gray-200 ${key > 0?`border-t`:``}`"
                                    @click="replaceMention(mention.name)">
                                    <div class="h-8 w-8 rounded-full shadow bg-cover bg-gray-300 mr-3" :style="{backgroundImage:`url(${mention.photo})`}"></div>
                                <span> {{mention.name}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="cursor-pointer" @click="() => {this.$refs.file.click()}">
                            <ImageIcon :fill="darkMode?`#909090`:`#979797`"></ImageIcon>
                        </div>
                        <input type="file" ref="file" class="hidden" accept="application/pdf, image/*" @change="onSelectFile">
                        <textarea class="w-full h-14 border-2 text-black rounded-full focus:outline-none mx-5 py-4 px-5" :disabled="contact.block_by || !isSelectedContact"
                            @keydown="enableWatch"
                            name="message"
                            ref="message"
                            v-model="message.text"
                            @keyup.enter.exact="onMessage"
                            :placeholder="$t(`2112`)" :class="darkMode?`bg-youtube border-transparent text-gray-300`:``">
                        </textarea>
                        <div class="w-14 flex justify-end">
                            <div class="cursor-pointer  rounded-full ml-5 mt-2" :class="busy?'opacity-30':''">
                                <VueRecord class="record" @result="onResult">
                                    <div class="w-13 h-13 rounded-full flex items-center justify-center" :class="darkMode?`bg-youtube`:`bg-primary`">
                                        <mic-icon :size="28" :fill="darkMode?`#FFFFFF`:`#FFFFFF`"></mic-icon>
                                    </div>
                                    <template slot="isInitiating">
                                        Voice
                                    </template>
                                    <template slot="isRecording">
                                        <div class="w-13 h-13 rounded-full flex items-center justify-center pulse">
                                            <mic-icon :size="28" :fill="darkMode?`#FFFFFF`:`#FFFFFF`"></mic-icon>
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
                
                    <!-- Preview -->
                    <div class="w-full h-full fixed top-0 left-0 bg-black z-50 flex items-center justify-center bg-opacity-90" v-if="isPreview">
                        <div class="w-96 rounded-lg flex flex-col justify-between" :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow`">
                            <div class="py-4 px-5 relative">
                                {{$t('preview')}}
                                <div class="absolute right-3 top-3 cursor-pointer" @click="() => {this.isPreview = false}">
                                    <CloseIcon  :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                                </div>
                            </div>
                            <div class="flex items-center justify-center px-3 overflow-y-scroll max-h-96">
                                <img :src="imgUrl" v-if="type === 1">
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
                        <div class="bg-white w-2/5 h-5/6 overflow-y-hidden rounded">
                            <div class="flex justify-between items-center p-4" :class="darkMode?`bg-fb`:`bg-primary`">
                                <div class="border border-white cursor-pointer" style="padding:1px;" @click="openFullscreen">
                                    <EnlargeIcon :size="16"></EnlargeIcon>
                                </div>
                                <div class="cursor-pointer" @click="() => {this.isRead = false}">
                                    <CloseIcon fill="#ffffff"></CloseIcon>
                                </div>
                            </div>
                            <div id="fullScreen" class="h-full overflow-y-scroll pb-10">
                                <SinglePdf :pdfUrl="pdfUrl" :darkMode="darkMode"></SinglePdf>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="fixed bg-black w-full h-full left-0 top-0 bg-opacity-70" style="z-index:50;" v-if="replyId" @click="() => {this.replyId = false}"></div>
        <Rename v-if="isRename" @cancelRename="() => {this.isRename = false}" :group="contact"></Rename>
        <Member v-if="isMember" @closeMember="() => {this.isMember = false}" :contact="contact" @adminLeft="adminLeft"></Member>
        <BuyMsg v-if="isConfirm" @cancelModal="() => {this.isConfirm = false}" :msg="msg" @yes="leaveGroup()"></BuyMsg>
        <BuyMsg v-if="isDisconnect" @cancelModal="() => {this.isDisconnect = false}" :msg="`block_contact`" @yes="disconnect()"></BuyMsg>
        <BuyMsg v-if="isUnblock" @cancelModal="() => {this.isUnblock = false}" :msg="`unblock_contact`" @yes="unblock()"></BuyMsg>
        <BuyMsg v-if="isDelete" :msg="`remove_message`"  @cancelModal="() => {this.isDelete = false}" @yes="confirmDelete"></BuyMsg>
        <AdminMember v-if="showAdminMember" @closeAdminMember="() => {showAdminMember = false}" @selectedChat="selectedChat($event)"></AdminMember>
        <PreviewImage v-if="viewChat" :URL="previewUrl" @closePreviewImage="()=>{this.viewChat = false}"></PreviewImage>
        
    </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import Vue from "vue"
import SearchIcon from "./../../components/SearchIcon.vue"
import VueTimeago from 'vue-timeago'
import SendMessageIcon from "./../../components/SendMessageIcon.vue"
import EnlargeIcon from "./../../components/EnlargeIcon.vue"
import CloseIcon from "./../../components/CloseIcon.vue"
import DocumentIcon from "./../../components/DocumentIcon.vue"
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
import MessageText from "./components/Text.vue"
import VueSocketIO from 'vue-socket.io'
import SinglePdf from "./../Component/SinglePdf.vue"
import Reply from "./components/Reply.vue"
import ReplyIcon from "./components/ReplyIcon.vue"
import TextReply from "./components/TextReply.vue"
import PdfReply from "./components/PdfReply.vue"
import ImageReply from "./components/ImageReply.vue"
import VoiceReply from "./components/VoiceReply.vue"
import AdminMember from "./components/AdminMember.vue"
const { ipcRenderer } = require('electron')
import VueRecord from "@loquiry/vue-record-audio"
import MicIcon from "./../HotChat/components/MicIcon.vue"
import BoubleIcon from "./components/BoubleIcon.vue"
import isRead from "./components/IsRead.vue"
import PreviewImage from "./components/PreviewImage.vue"
Vue.use(new VueSocketIO({
    connection: config.urlSocket
}));

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale,
  locales: {
    'en': require('date-fns/locale/en')
  }
})


export default {
    sockets: {
        connect: function () {
            console.log('socket connected')
        }
    },
    components:{
        MicIcon,
        SearchIcon,
        ImageIcon,
        ChevronIcon,
        Rename,
        Member,
        BuyMsg,
        MessageText,
        CloseIcon,
        PdfIcon,
        DocumentIcon,
        SendMessageIcon,
        SinglePdf,
        EnlargeIcon,
        Reply,
        ReplyIcon,
        TextReply,
        ImageReply,
        PdfReply,
        VoiceReply,
        AdminMember,
        VueRecord,
        BoubleIcon,
        isRead,
        PreviewImage,
    },
    data(){
        return{
            active: "",
            contact: {
                type: 0,
            },
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
            isRead: false,
            onContext: "",
            showMention: false,
            mentionList: [],
            mentionReplaced: false,
            replyId: "",
            replyContact: "",
            muteLabel:"mute_alll",
            chatText: "",
            fileUrl:"",
            isDelete: false,
            messageId: null,
            showAdminMember: false,
            isSelectedContact: false,
            isTyping: false,
            viewChat: false,
            previewUrl:"",
            share:"",
            lastSeen:"",
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
        ...mapState('setting', ['darkMode', 'localize']),
        ...mapState('auth', ['stProfile']),
        ...mapState('etalk', ['loading','contacts','messages','sending','mentions']),
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
        'sendMessage','getMention','deleteMessage',
        'getContacts','getMessage','deleteMember', 'blockUser', 'unblockUser','readMessage']),
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
        shareLink() {
            var copyText = document.getElementById("share");
            this.chatOption = false
            copyText.select();
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy");
            helper.success("Copied the text: " + copyText.value)
        },
        previewImage(previewUrl){
            this.viewChat = true
            this.previewUrl = previewUrl
        },
        replyUser(message){
             if(message.sender == undefined){
                if(message.is_admin){
                    return this.contact.name
                }
                return 1
            }
            return replyContact.sender.name
        },
        replyTo(replyContact){
            if(replyContact.sender == undefined){
                if(replyContact.is_admin){
                    return this.contact.name
                }
                return this.stProfile.first_name + " " + this.stProfile.last_name
            }
            return replyContact.sender.name
        },
        replyName(message){
            // Group admin
            if(this.contact.type == 0){
                if(message.reply.is_admin == 1){
                    return this.$i18n.t('admin') 
                }
            }
            // Group user
            if(message.sender._id == message.reply.sender._id){
                if(this.auth == message.reply.sender._id){
                    return this.$i18n.t('yourself')
                }else{
                    return this.$i18n.t('hime_self')
                }
            }else{
                if(this.auth == message.reply.sender._id){
                    return this.$i18n.t('you')
                }
                return message.reply.sender.name
            }
        },
        isSeen(){
            this.readMessage({
                id: this.contact._id,
                type: this.contact.type
            })
        },
        enableWatch(){
            this.mentionReplaced = false
        },
        senderName(message){
           // Group admin
            if(this.contact.type == 0){
                if(message.sender.is_admin == 1){
                    return this.$i18n.t('admin') 
                }
            }
            // Group user
            if(message.sender._id == this.auth){
                return this.$i18n.t('you')
            }else{
                return message.sender.name
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
            if(this.contact.type === 0){
                return this.contact.photo
            }
            if(message.sender === undefined ){
                return false
            }
            return message.sender.photo
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
        replaceMention(value){
                let mention = "@" + value;
                this.mentionList.push(mention)

                this.mentionReplaced = true
                this.showMention = false
                let textArea = document.getElementsByName('message')[0];
                let startPos = textArea.selectionStart,
                    // get cursor's position:
                    endPos = textArea.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = textArea.value;

                if (value === null) {
                    return;
                }


                let a = tmpStr.substring(tmpStr.substring(0, startPos).lastIndexOf("@"), startPos) + value
                this.message.text = tmpStr.substring(0, startPos) + value + tmpStr.substring(endPos, tmpStr.length);
                this.message.text = this.message.text.replace(a, "@" + value)

                // move cursor:
                setTimeout(() => {
                    cursorPos += value.length;
                    textArea.selectionStart = textArea.selectionEnd = cursorPos;
                }, 50);

                this.$refs.message.focus()
        },
        getSecondPart(str){
            return str.split('@').pop();
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
        readPdf(pdf){
            this.pdfUrl = pdf
            this.isRead = true
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
        getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        },
        onSelectFile(event){
            this.isPreview = true
            var input = event.target;
            this.file = event.target.files[0] 
                if(this.file && this.file.name != undefined)
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
        selectedChat(chat){
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
            this.isTyping = false
            this.active = index
            this.contact = contact
            this.sockets.unsubscribe(`message_${this.contact._id}`);
            this.$store.commit("etalk/selectedContact",contact)
            this.enableScroll = true
            this.chatPage = 1
            this.isSelectedContact = true
            if(contact.type == 10){
                this.$router.push('chat-admin')
                return;
            }
            this.message.id = this.contact._id
            this.getMessage({
                p: 1,
                id: this.contact._id,
                type: this.contact.type
            }).then((response) => {
                if(response.data.data.room.last){
                    this.lastSeen = response.data.data.room.last.date
                }
                if(response.data.data.room.share){
                    this.share = response.data.data.room.share
                }
                this.scrollToBottom()
                this.lisentMessage()
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
             if((this.contact.type === 0 || this.contact.type === 1 || this.contact.type === 10)){
                return;
            }
            this.$refs.contactPhoto.click()
        },
        receiveAdminMessage(){
            this.getMessage({
                id: this.contact._id,
                type: this.contact.type
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
                payload.type = this.contact.type
                
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
            this.getContact({}).then(() =>{})
        } ,
        getAudioDuration(blob){
            return new Promise(resolve => {
                resolve(getBlobDuration(blob))
            })

        },
        onMessage(){
            if(!this.isSelectedContact){
                return;
            }
            let form = new FormData()
            if(!this.message.text.trim() && !this.message.voice && !this.message.photo && !this.message.pdf){
                return;
            }
            form.append("id", this.message.id)
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
        onResult(blob)
        {
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
        onStream(){
            this.audioUrl = ""
        },
        isReadMessage(){
            this.sockets.subscribe(`read_${this.contact._id}`, function(){
                this.$store.commit("etalk/readMessage", 1)
            })
        },
        lisentMessage(){
            this.sockets.subscribe(`message_${this.contact._id}`, function(data){
                this.$store.commit('etalk/lastMessage', data)
                if(this.contact._id === data.room_id){
                    if(data.sender._id !== this.auth){
                        this.isSeen()
                        this.isReadMessage()
                        if(!this.contact.is_mute){
                            this.paySound()
                        }
                        this.$store.commit("etalk/broadcastMessage",data)
                        this.scrollToBottom()
                    }
                    this.$store.commit('etalk/removeUread', this.contact._id)
                }
            })
        },
        paySound(){
            document.getElementById("message-sound").play()
        },
        showReply(message){
            this.chatText = message.content.text
            if(message.content.file != undefined){
                this.fileUrl = message.content.file.url
            }
            this.replyId = message
            
        },
        goTo(page){
            this.$router.push({
                name: page
            })
        },
        muteAll(){
            if((localStorage.getItem('mute_all') == undefined || localStorage.getItem('mute_all') == 0)){
                this.muteContact().then(()=>{
                    this.eTalkOption = false
                    localStorage.setItem('mute_all', 1)
                    this.getMute()
                })
            }
            if(localStorage.getItem('mute_all') == 1){
                this.deleteMute({
                    id: ""
                }).then(() =>{
                    this.eTalkOption = false
                    localStorage.setItem('mute_all', 0)
                    this.getMute()
                })
            }
            
        },
        copyText() {
            var copyText = document.getElementById("chat-text");
            copyText.select();
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy");
            helper.success("Copied")
        },
        getMute(){
            if(localStorage.getItem("mute_all") == undefined || localStorage.getItem("mute_all") == 0){
                this.muteLabel = "mute_all"
            }else{
                this.muteLabel = "unmute_all"
            }
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
        }
    },
    updated(){
        if(this.contacts.length){
            for(let i = 0; i < this.contacts.length; i++){
                this.sockets.subscribe(`message_${this.contacts[i]._id}`, function(data){
                    if(this.contacts[i]._id != this.contact._id){
                        this.$store.commit('etalk/lastMessage', data)
                    }
                })
            }
        }
    },
    mounted(){
        document.querySelector('.needsInitiation').click();
        this.isReadMessage()
        
    },
    created(){
        this.init()
        this.getMute()
        this.auth = this.stProfile._id
        ipcRenderer.on("fileSaved", (event,arg) => {
            helper.success('file_downloaded')
            this.fileUrl = ""
        })
        
    },
    watch: {
        'contactActive':function(value){
           if(value){
            this.getMessage({
                p: 1,
                id: this.contacts[value]._id,
                type: this.contacts[value].type
            }).then(() => {
                this.selectedContact(this.contacts[value], value)
            })
        }
        },
        'message.text': function (value) {
            if (this.mentionReplaced) {
                return
            }
            this.showMention = false
            if(this.contact.type === 2){
                if (value.includes("@"))
                if (this.getSecondPart(value).length <= 5) {
                    this.getMention({
                        id: this.contact._id,
                        s: this.getSecondPart(value)
                    }).then((response) => {
                        if (response.data.data && response.data.data.length) {
                            this.showMention = true
                        } else {
                            this.showMention = false
                        }
                    })
                } else {
                    this.showMention = false
                }
            }
        }
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
        background-color: #055174 !important;
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
        border: 4px solid #055174;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #055174 transparent transparent transparent;
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
    .notification{
        display: flex;
        border-radius: 50%;
        min-width: 20px;
        min-height: 20px;
        text-align: center;
        line-height: 1;
        box-sizing: content-box;
        white-space: nowrap;
        vertical-align: middle;
        padding: 1px;
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