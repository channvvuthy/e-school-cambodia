<template>
    <div class="w-full text-xs" :class="darkMode?'bg-secondary':'bg-white'">
        <div class="pl-12 pr-5 flex justify-between items-center">
            <div class="grid grid-cols-5 gap-8">
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('home')">
                    <div v-if="$route.name === 'home'"><HomeFillIcon :fill="darkMode?`#ffffff`:`#055174`"></HomeFillIcon></div>
                    <div v-else><HomeIcon :fill="darkMode?`#909090`:`#055174`"></HomeIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'home')">
                        {{$t('1101')}}
                    </p>
                    <template v-if="$route.name === 'home'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('video')">
                    <div v-if="$route.name === 'video' || $route.name === 'video-detail'"><WatchVideoFillIcon :fill="darkMode?`#ffffff`:`#055174`"></WatchVideoFillIcon></div>
                    <div v-else>
                        <WatchVideoIcon :fill="darkMode?`#909090`:`#055174`"></WatchVideoIcon>
                    </div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'video' || $route.name === 'video-detail')">
                        {{$t('2108')}}
                    </p>
                    <template v-if="$route.name === 'video'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('library')">
                    <div v-if="$route.name === 'library'"><LibraryIcon :fill="darkMode?`#ffffff`:`#055174`"></LibraryIcon></div>
                    <div v-else><LibraryThinIcon :fill="darkMode?`#909090`:`#055174`"></LibraryThinIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'library')">
                        {{$t('2200')}}
                    </p>
                    <template v-if="$route.name === 'library'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                 <template v-if="token">
                    <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('partner')">
                        <div v-if="$route.name === 'partner'"><PartnershipFillIcon :fill="darkMode?`#ffffff`:`#055174`" :fillY="darkMode?`#252527`:`#ffffff`"></PartnershipFillIcon></div>
                        <div v-else><PartnershipIcon :fill="darkMode?`#909090`:`#055174`"></PartnershipIcon></div>
                        <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'partner')">
                            {{$t('1104')}}
                        </p>
                        <template v-if="$route.name === 'partner'">
                            <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                        </template>
                    </div>
                </template>
            </div>
            <div class="flex justify-end" v-if="token">
                <div class="flex justify-between items-end flex-1">
                    <div class="flex flex-col justify-center items-center cursor-pointer relative " @click="() =>{this.$emit('showItemIncart')}" id="myCart">
                        
                        <template>
                            <div class="absolute -top-3 left-4 h-4 w-4 rounded-full flex justify-center items-center text-center text-xs" :class="darkMode?`bg-white text-youtube`:`bg-heart text-white`" v-if="notify.carts">
                                <div style="margin-top:2px">
                                    {{notify.carts}}
                                </div>
                            </div>
                        </template>
                        <div><CartIcon :fill="darkMode?`#909090`:`#181818`"></CartIcon></div>

                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10  relative" @click="goTo('chat')" >
                        <template>
                            <div class="absolute -top-3 left-4 h-4 w-4 rounded-full flex justify-center items-center text-center text-xs" :class="darkMode?`bg-white text-youtube`:`bg-heart text-white`" v-if="notify.chats">
                                <div style="margin-top:2px">
                                    {{notify.chats}}
                                </div>
                            </div>
                        </template>
                        <div>
                            <ChatIcon :fill="darkMode?`#FFF`:`#055174`" v-if="$route.name === `chat`"></ChatIcon>
                            <ChatIcon :fill="darkMode?`#909090`:`#181818`" v-else></ChatIcon>
                        </div>

                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10 relative" @click="() =>{this.$emit('notification')}">
                        <template>
                            <div class="absolute -top-3 left-4 h-4 w-4 rounded-full flex justify-center items-center text-center text-xs" :class="darkMode?`bg-white text-youtube`:`bg-heart text-white`" v-if="notify.notifications">
                                <div style="margin-top:2px">
                                    {{notify.notifications}}
                                </div>
                            </div>
                        </template>
                        <div><NotificationIcon :fill="darkMode?`#909090`:`#181818`"></NotificationIcon></div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import HomeIcon from "./../../components/HomeIcon"
import BorderBottom from "./../../components/BorderBottom.vue"
import HomeFillIcon from "./../../components/HomeFillIcon"
import WatchVideoIcon from "./../../components/WatchVideoIcon.vue"
import WatchVideoFillIcon from "./../../components/WatchVideoFillIcon"
import LibraryIcon from "./../../components/LibraryIcon"
import LibraryThinIcon from "./../../components/LibraryThinIcon"
import PartnershipIcon from "./../../components/PartnershipIcon"
import PartnershipFillIcon from "./../../components/PartnershipFillIcon"
import SupporterIcon from "./../../components/SupporterIcon"
import NotificationIcon from "./../../components/NotificationIcon.vue"
import ChatIcon from "./components/ChatIcon.vue"
import CartIcon from "./../../components/CartIcon.vue"
export default {
    components:{
        HomeIcon,
        HomeFillIcon,
        WatchVideoIcon,
        WatchVideoFillIcon,
        LibraryIcon,
        PartnershipIcon,
        LibraryThinIcon,
        PartnershipFillIcon,
        SupporterIcon,
        NotificationIcon,
        ChatIcon,
        CartIcon,
        BorderBottom
        
    },
    data(){
        return{
        }
    },
    computed: {
        ...mapState("setting", ["localize","darkMode"]),
        ...mapState('cart', ['carts']),
        ...mapState('auth', ['token','notify']),

    },
    methods: {
        ...mapActions('cart', ['getCart']),
        ...mapActions('auth', ['getNotify']),
        goTo(page) {
            this.$store.commit("etalk/setActive", 0)
            this.$router.push({ name: page }).catch((err)=>{err});
        },
        darkActive(darkMode, active){
            if(darkMode && active){
                return 'text-white'
            }
            if(!darkMode && active){
                return 'text-primary'
            }
            
        },
    },
    created(){
        if(this.token){
            this.getNotify()
        }
        
    },
    watch:{
        'carts':function(){
            this.getNotify();
        }
    }
};
</script>