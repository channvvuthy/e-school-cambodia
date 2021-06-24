<template>
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
</template>
<script>
    import Sidebar from "./views/Sidebar/Sidebar.vue"
    import Menu from "./views/Menu/Menu.vue"
    import Cart from "./views/Component/Cart.vue"
    import Notification from "./components/Notification.vue"
    import NotificationDetail from "./components/NotificationDetail.vue"
    import ReceiptInfo from "./views/MyCourse/components/ReceiptInfo.vue"
    import {mapState} from "vuex"
    export default{
        data(){
            return {
                showCart:false,
                showNotification: false,
                showReceipt: false,
                receiptDetail:{},
                showNotificationDetail: false
            }
        },
        components: {
            Sidebar,
            Menu,
            Cart,
            Notification,
            ReceiptInfo,
            NotificationDetail
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode'])
        },
        methods: {
            hideMenu(){
                if(this.$route.name === 'video-detail' || this.$route.name === 'library-video' || this.$route.name === 'my-library' 
                || this.$route.name === 'policy' || this.$route.name === 'invoice' || this.$route.name === 'my-course'
                || this.$route.name === 'parent' || this.$route.name === 'insurance' || this.$route.name === 'profile'
                || this.$route.name === 'document'
                || this.$route.name === 'favorite' || this.$route.name === 'about' || this.$route.name === 'help'){
                    return true
                }
                return false
            },
            showItemIncart(){
                this.showCart = true
            },
            escapeRoute(){
                if (this.$route.name === 'login' || this.$route.name === 'register' || this.$route.name === 'forgot-password') {
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
            }
        }
    }
</script>