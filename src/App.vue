<template>
    <div>
        <div v-if="isSplashScreen" class="fixed top-0 left-0  w-full h-full" style="z-index: 100;">
            <Splash/>
        </div>
        <div class="font-khmer_os" :class="darkMode?`bg-youtube`:``">
            <!-- Cart -->
            <Cart
                    v-if="showCart"
                    @closeCart="() =>{this.showCart = false}"
                    @showInvoice="showInvoice"/>
            <!-- Receipt info -->
            <ReceiptInfo
                    v-if="showReceipt"
                    :receiptDetail="receiptDetail"
                    @closeInfo="() =>{this.showReceipt = false}"/>
            <!-- Notification -->
            <Notification
                    v-if="showNotification"
                    @closeNotification="() =>{this.showNotification = false}"
                    @readNotification="readNotification($event)"/>
            <!-- NotificationDetail -->
            <NotificationDetail
                    v-if="showNotificationDetail"
                    @closeNotificationDetail="closeNotificationDetail"/>
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
        <!-- If update available -->
        <div class="fixed w-full h-full left-0 top-0 z-50 flex justify-center items-center bg-black" v-if="isUpdate">

            <div class="bg-white shadow-lg rounded-xl p-5 relative">
                <div class="absolute rounded-full flex items-center justify-center w-7 h-7 right-2 top-2 cursor-pointer"
                     @click="()=>{this.isUpdate = false}">
                    <CloseIcon :width="50"/>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <div class="update w-16 h-16 flex items-center justify-center rounded-full">
                            <UpdateIcon/>
                        </div>
                    </div>
                    <div class="w-full ml-5">
                        <div class="font-black text-2xl">Updates Available</div>
                        <div>Please update to the latest version of the e-school app</div>
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <button class="update text-white px-4 py-2 rounded-full mt-5 outline-none font-semibold"
                            @click="update">
                        Update Now
                    </button>
                </div>
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
    import CloseIcon from "./components/CloseIcon.vue"
    import UpdateIcon from "./components/UpdateIcon.vue"
    import ReceiptInfo from "./views/MyCourse/components/ReceiptInfo.vue"
    import helper from "./helper/helper"
    import {mapActions, mapState} from "vuex"
    import Splash from "./views/Splash/Splash.vue"

    const {ipcRenderer} = require('electron')
    export default {
        data() {
            return {
                showCart: false,
                showNotification: false,
                showReceipt: false,
                receiptDetail: {},
                showNotificationDetail: false,
                isSplashScreen: true,
                isUpdate: false,
                window: {
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
            Splash,
            UpdateIcon,
            CloseIcon
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode']),
            ...mapState('auth', ['stProfile'])
        },

        methods: {
            ...mapActions('auth', ['getUser']),
            ...mapActions('etalk', ['join', 'getContact']),
            ...mapActions('setting', ['checkForUpdate']),
            hideMenu() {
                return this.$route.name === 'library-video'
                    || this.$route.name === 'course-quiz' || this.$route.name === 'story-list'
                    || this.$route.name === 'document-detail'
                    || this.$route.name === 'download-detail'
                    || this.$route.name === 'activity-detail' || this.$route.name === 'attendant'
                    || this.$route.name === 'watch-detail' || this.$route.name === 'read-book-detail';

            },
            showItemIncart() {
                this.showCart = true
            },
            escapeRoute() {
                if (this.$route.name === 'login' || this.$route.name === 'register' || this.$route.name === 'forgot-password' || this.$route.name === 'splash') {
                    this.$store.commit('setting/toggleSidebar', true);
                    return true;

                }
                return this.$route.name === 'change-password';

            },
            showInvoice(data) {
                this.receiptDetail = data
                this.showReceipt = true
                this.showCart = false
            },
            readNotification() {
                this.showNotification = false
                this.showNotificationDetail = true
            },
            closeNotificationDetail() {
                this.showNotificationDetail = false
            },
            handleResize() {
                this.window.width = window.innerWidth;
            },
            update() {
                ipcRenderer.send("update", "https://e-schoolcambodia.com/download")
            },
            checkUpdate() {
                this.checkForUpdate().then(res => {
                    if (res.data.status == 1) {
                        this.isUpdate = true
                    }
                }).catch(err => {
                    console.log(err.response.data);
                })
            }
        },


        mounted() {
            this.checkUpdate();
            ipcRenderer.send("deeplink")
            ipcRenderer.on("deeplink", (event, arg) => {
                try {
                    if (localStorage.getItem("token") != null) {
                        let deeplink = arg.deeplink.split('/')
                        if (deeplink[3] == 'profile') {
                            this.$router.push({name: 'user', params: {user_id: deeplink.pop()}})
                        } else {
                            let payload = {
                                id: deeplink.pop(),
                                user_id: JSON.stringify([this.stProfile._id])
                            }
                            this.join(payload).then(response => {
                                if (response.data.msg) {
                                    helper.errorMessage(response.data.msg)
                                    return;
                                }
                                let room_id = response.data.data.room_id
                                this.getContact().then(group => {
                                    let contacts = group.data.data
                                    for (let index = 0; index < contacts.length; index++) {
                                        if (contacts[index]._id == room_id) {
                                            this.$store.commit('etalk/setActive', index)
                                        }
                                    }
                                })
                                this.$router.push({name: 'chat'}).catch(err => {
                                    err
                                })
                            })
                        }

                    } else {
                        this.$router.push({name: 'home'}).catch(err => {
                            err
                        })
                    }
                } catch (err) {
                    return err;
                }
            })
        },
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            if (this.window.width <= 1440) {
                this.$store.commit('setting/toggleSidebar', true)
            }
            setTimeout(() => {
                this.isSplashScreen = false
            }, 4000)
        }
    }
</script>
<style lang="scss">
    .update {
        background-image: linear-gradient(150deg, #000046 0%, #055174, 33%, #1cb5e0 100%);
    }

    .liker-2 {
        .circle-0 {
            right: -1rem;
            z-index: 10;
        }
    }

    .liker-3 {
        .circle-1 {
            right: -1rem;
            z-index: 10;
        }

        .circle-0 {
            right: -2rem;
            z-index: 20;
        }
    }

    .liker-4 {
        .circle-2 {
            right: -1rem;
            z-index: 10;
        }

        .circle-1 {
            right: -2rem;
            z-index: 20;
        }

        .circle-0 {
            right: -3rem;
            z-index: 30;
        }
    }

    .liker-5 {
        .circle-3 {
            right: -1rem;
            z-index: 10;
        }

        .circle-2 {
            right: -2rem;
            z-index: 20;
        }

        .circle-1 {
            right: -3rem;
            z-index: 30;
        }

        .circle-0 {
            right: -4rem;
            z-index: 40;
        }
    }

</style>
