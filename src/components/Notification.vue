<template>
    <div class="fixed inset-0 overflow-y-auto w-full h-full bg-black bg-opacity-90 flex items-center justify-center" style="z-index: 60">
        <div class="rounded-xl shadow-xl w-96" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="flex justify-between items-center p-4 border-b text-sm font-khmer_os" :class="darkMode?`border-button`:`border-bordergray-200`">
                <div class="text-left flex-1 text-center font-semibold text-sm">
                    {{$t('1012')}}
                </div>
                <div class="opacity-80 cursor-pointer" @click="closeNotification">
                    <CloseIcon :width="20" :height="20" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                </div>
            </div>
            <div class="body mt-5 flex-cols justify-start items-center font-khmer_os text-13px mb-5 max-h-100 overflow-y-scroll" @scroll="onScroll">
                <div v-if="loadingNotification"
                        class="flex justify-center items-center h-screen">
                    <div class="relative" :class="window.width <= '1366'?' -top-20':' -top-56'">
                        <Loading/>
                    </div>
                </div>
                <div v-else>
                    <div v-if="notifications && notifications.length">
                        <ul>
                            <li v-for="(notification, key) in notifications" :key="key"
                                class="flex justify-start items-center px-4 py-2 cursor-pointer" :class="darkMode?`border-button ${key<(notifications.length - 1)?`border-b`:``}`:`border-gray-200 ${key<(notifications.length - 1)?`border-b`:``}`"
                                @click="readNotification(notification)">
                                <div class="h-12 w-12 rounded-full bg-primary flex justify-center items-center mr-3">
                                    <div v-if="notification.type === 1">
                                        <NotificationIcon fill="#ffffff"></NotificationIcon>
                                    </div>
                                </div>
                                <div class="flex-cols justify-start items-center flex-1">
                                    <div class="font-semibold mb-1">{{cutString(notification.title, 25)}}</div>
                                    <div>{{cutString(notification.content.text, 40)}}</div>
                                </div>
                                <div class="text-right relative top-5 opacity-50 text-xs">
                                    {{formatDate(notification.date)}}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import {mapActions, mapState} from "vuex"
    import CloseIcon from "./../components/CloseIcon"
    import helper from "./../helper/helper"
    import moment from "moment"
    import Loading from "./Loading"
    import NotificationIcon from "./NotificationIcon"
    export default{
        name: "Notification",
        data(){
            return {
                window: {
                    width: 0,
                    height: 0
                },
                page: 1
            }
        },
        props: {
            size: {
                type: Number,
                default: () => {
                    return 96
                }
            }
        },
        components: {
            CloseIcon,
            Loading,
            NotificationIcon
        },
        computed: {
            ...mapState('auth', ['loadingNotification', 'notifications']),
            ...mapState('setting', ['darkMode'])
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            ...mapActions('auth', ['getNotification', 'readingNotification']),
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

            onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page++

                    this.getNotification(this.page)

                }
            },
            readNotification(notification){
                this.readingNotification(notification._id).then(response =>{
                    this.$emit('readNotification', response.data.data)
                })
                
            },
            formatDate(date){
                moment.locale('en');
                return moment(date).format('DD-MM-YYYY h:mm');
            },
            closeNotification(){
                this.$emit("closeNotification")
            },
            cutString(text, limit){
                if (text) {
                    return helper.cutString(text, limit)
                }
                return ""

            }
        },

        created(){
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            this.getNotification(1)
        }
    }
</script>