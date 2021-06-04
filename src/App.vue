<template>
    <div class="font-khmer_os" :class="darkMode?`bg-youtube`:``">
        <!-- Cart -->
        <Cart v-if="showCart" @closeCart="() =>{this.showCart = false}"></Cart>
        <!-- Notification -->
        <Notification v-if="showNotification" @closeNotification="() =>{this.showNotification = false}"></Notification>
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
    import {mapState} from "vuex"
    export default{
        data(){
            return {
                showCart:false,
                showNotification: false
            }
        },
        components: {
            Sidebar,
            Menu,
            Cart,
            Notification
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode'])
        },
        methods: {
            hideMenu(){
                if(this.$route.name === 'video-detail' || this.$route.name === 'library-video'){
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
                return false;
            },
        }
    }
</script>