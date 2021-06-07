<template>
    <div class="w-full text-xs" :class="darkMode?'bg-secondary':'bg-white'">
        <div class="pl-12 pr-5 flex justify-between items-center">
            <div class="grid grid-cols-5 gap-6">
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('home')">
                    <div v-if="$route.name === 'home'"><HomeFillIcon :fill="darkMode?`#ffffff`:`#0f3c7a`"></HomeFillIcon></div>
                    <div v-else><HomeIcon :fill="darkMode?`#909090`:`#0f3c7a`"></HomeIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'home')">
                        {{$t('1101')}}
                    </p>
                    <template v-if="$route.name === 'home'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('video')">
                    <div v-if="$route.name === 'video'"><WatchVideoFillIcon :fill="darkMode?`#ffffff`:`#0f3c7a`"></WatchVideoFillIcon></div>
                    <div v-else><WatchVideoIcon :fill="darkMode?`#909090`:`#0f3c7a`"></WatchVideoIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'video')">
                        {{$t('2108')}}
                    </p>
                    <template v-if="$route.name === 'video'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('library')">
                    <div v-if="$route.name === 'library'"><LibraryIcon :fill="darkMode?`#ffffff`:`#0f3c7a`"></LibraryIcon></div>
                    <div v-else><LibraryThinIcon :fill="darkMode?`#909090`:`#0f3c7a`"></LibraryThinIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'library')">
                        {{$t('2200')}}
                    </p>
                    <template v-if="$route.name === 'library'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('partner')">
                    <div v-if="$route.name === 'partner'"><PartnershipFillIcon :fill="darkMode?`#ffffff`:`#0f3c7a`" :fillY="darkMode?`#252527`:`#ffffff`"></PartnershipFillIcon></div>
                    <div v-else><PartnershipIcon :fill="darkMode?`#909090`:`#0f3c7a`"></PartnershipIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'partner')">
                        {{$t('1104')}}
                    </p>
                    <template v-if="$route.name === 'partner'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                    
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('support')">
                    <div v-if="$route.name === 'support'"><SupporterIcon :fill="darkMode?`#ffffff`:`#0f3c7a`"></SupporterIcon></div>
                    <div v-else><SupporterIcon :fill="darkMode?`#909090`:`#0f3c7a`"></SupporterIcon></div>
                    <p class="mt-2 pb-1" :class="darkActive(darkMode,$route.name === 'support')">
                        {{$t('1105')}}
                    </p>
                    <template v-if="$route.name === 'support'">
                        <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`"></BorderBottom>
                    </template>
                
                </div>
            </div>
            <div class="flex justify-end">
                <div class="flex justify-between items-end flex-1">
                    <div class="flex flex-col justify-center items-center cursor-pointer opacity-60 relative " @click="() =>{this.$emit('showItemIncart')}">
                        <div class="absolute -top-3 left-2 h-4 w-4 rounded-full flex justify-center items-center text-xs" v-if="carts.list && carts.list.length" :class="darkMode?`bg-white text-youtube`:`bg-heart text-white`">
                            <div>
                                {{carts.list.length}}
                            </div>
                        </div>
                        <div><CartIcon :fill="darkMode?`#909090`:`#0f3c7a`"></CartIcon></div>

                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10 opacity-60 relative" >
                        <div><ChatIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ChatIcon></div>

                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10 opacity-60" @click="() =>{this.$emit('notification')}">
                        <div><NotificationIcon :fill="darkMode?`#909090`:`#0f3c7a`"></NotificationIcon></div>

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
import WatchVideoIcon from "./../../components/WatchVideoIcon"
import WatchVideoFillIcon from "./../../components/WatchVideoFillIcon"
import LibraryIcon from "./../../components/LibraryIcon"
import LibraryThinIcon from "./../../components/LibraryThinIcon"
import PartnershipIcon from "./../../components/PartnershipIcon"
import PartnershipFillIcon from "./../../components/PartnershipFillIcon"
import SupporterIcon from "./../../components/SupporterIcon"
import NotificationIcon from "./../../components/NotificationIcon"
import ChatIcon from "./../../components/ChatIcon"
import CartIcon from "./../../components/CartIcon"
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
    computed: {
        ...mapState("setting", ["localize","darkMode"]),
        ...mapState('cart', ['carts'])
    },
    methods: {
        ...mapActions('cart', ['getCart']),
        goTo(page) {
            this.$router.push({ name: page });
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
    mounted(){
        this.getCart()
    }
};
</script>