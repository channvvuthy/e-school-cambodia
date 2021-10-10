<template>
    <div>
        <div v-if="isSplashScreen" class="fixed top-0 left-0  w-full h-full" style="z-index: 100;">
            <Splash></Splash>
        </div>
        <div class="font-khmer_siemreab" :class="darkMode?`bg-youtube`:``">
            <!-- Cart -->
            <Cart v-if="showCart" @closeCart="() =>{this.showCart = false}" @showInvoice="showInvoice"></Cart>
            <!-- Receipt info -->
            <ReceiptInfo v-if="showReceipt" :receiptDetail="receiptDetail" @closeInfo="() =>{this.showReceipt = false}"></ReceiptInfo>
            <!-- Notification -->
            <Notification v-if="showNotification" @closeNotification="() =>{this.showNotification = false}" @readNotification="readNotification($event)"></Notification>
            <!-- NotificationDetail -->
            <NotificationDetail v-if="showNotificationDetail" @closeNotificationDetail="closeNotificationDetail"></NotificationDetail>
            <div class="flex" v-if="!escapeRoute()">
                <div>
                    <!--Sidebar-->
                    <Sidebar/>
                </div>
                <div class="w-full border border-t-0 h-32 flex items-end"
                    v-if="!hideMenu()"
                    :class="darkMode?'bg-secondary border-secondary text-textSecondary':'bg-white border-gray-300'"
                    :style="isHide?{marginLeft:'0px'}:{marginLeft:'350px'}">
                    <Menu @showItemIncart="showItemIncart" @notification="() =>{this.showNotification = true}"/>
                </div>
            </div>
            <div :style="isHide?{marginLeft:'0px'}:{marginLeft:'350px'}" id="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import Sidebar from "./views/Sidebar/Sidebar.vue"
    import Menu from "./views/Menu/Menu.vue"
    import Cart from "./views/Component/Cart.vue"
    import Notification from "./components/Notification.vue"
    import NotificationDetail from "./components/NotificationDetail.vue"
    import ReceiptInfo from "./views/MyCourse/components/ReceiptInfo.vue"
    import helper from "./helper/helper"
    import {mapActions, mapState} from "vuex"
    import Splash from "./views/Splash/Splash.vue"
    const { ipcRenderer } = require('electron')
    export default{
        data(){
            return {
                showCart:false,
                showNotification: false,
                showReceipt: false,
                receiptDetail:{},
                showNotificationDetail: false,
                isSplashScreen: true,
                window:{
                    wwidth: null
                }

            }
        },

        components: {
            Sidebar,
            Menu,
            Cart,
            Notification,
            ReceiptInfo,
            NotificationDetail,
            Splash
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode']),
            ...mapState('auth', ['stProfile'])
        },

        methods: {
            ...mapActions('auth', ['getUser']),
            ...mapActions('etalk', ['join','getContact']),
            hideMenu(){
                if(this.$route.name === 'library-video' 
                || this.$route.name === 'course-quiz' || this.$route.name === 'story-list' 
                || this.$route.name === 'document-detail'
                || this.$route.name === 'download-detail'
                || this.$route.name === 'activity-detail' || this.$route.name === 'attendant'
                || this.$route.name === 'watch-detail' || this.$route.name === 'read-book-detail'){
                    return true
                }
                return false
            },
            showItemIncart(){
                this.showCart = true
            },
            escapeRoute(){
                if (this.$route.name === 'login' || this.$route.name === 'register' || this.$route.name === 'forgot-password' || this.$route.name === 'splash') {
                    this.$store.commit('setting/toggleSidebar', true);
                    return true;

                }
                if(this.$route.name === 'change-password'){
                    return true
                }
                return false;
            },
            showInvoice(data){
                this.receiptDetail = data
                this.showReceipt = true
                this.showCart = false
            },
            readNotification(){
                this.showNotification = false
                this.showNotificationDetail = true
            },
            closeNotificationDetail(){
                this.showNotificationDetail = false
            },
            handleResize() {
                this.window.width = window.innerWidth;
            },
        },
        mounted(){
            ipcRenderer.send("deeplink")
            ipcRenderer.on("deeplink",(event, arg)=>{
                if(localStorage.getItem("token") !== null){
                    let deeplink =  arg.deeplink.split('/')
                    if(deeplink[3] == 'profile'){
                        this.$router.push({name:'user', params:{user_id:deeplink.pop()}})
                    }else{
                        let payload = {
                            id: deeplink.pop(),
                            user_id: JSON.stringify([this.stProfile._id])
                        }
                        this.join(payload).then(response =>{
                            if(response.data.msg){
                                helper.errorMessage(response.data.msg)
                                return;
                            }
                            let room_id = response.data.data.room_id
                            this.getContact().then(group => {
                                let contacts = group.data.data
                                for(let index = 0; index < contacts.length; index++){
                                    if(contacts[index]._id == room_id ){
                                        this.$store.commit('etalk/setActive', index)
                                    }
                                }
                            })
                            this.$router.push({name:'chat'}).catch(err=>{err})
                        })
                    }
                    
                }else{
                    this.$router.push({name:'login'}).catch(err=>{err})
                }
            })
        },
        created(){
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            if(this.window.width <= 1440){
                this.$store.commit('setting/toggleSidebar', true)
            }
            setTimeout(()=>{
                this.isSplashScreen = false
            },4000)
        }
    }
</script>