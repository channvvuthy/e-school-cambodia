<template>
    <div>
        <div class="flex items-center h-14 text-sm px-5 mt-3"
             :class="darkMode?`text-gray-300 bg-secondary`:`bg-white shadow`">
            <div class="cursor-pointer" :class="active === `friend`?`font-bold ${darkMode?`text-fb`:`text-primary`}`:``"
                 @click="switchMenu('friend')">{{$t('friend')}}
            </div>
        </div>
        <div class="p-5 h-screen pb-40">
            <div class="w-4/6 rounded-xl p-5 overflow-y-scroll" :class="darkMode?`bg-secondary`:`bg-white shadow`"
                 style="height:93%" @scroll="onScroll">
                <div class="relative w-3/4 sticky top-0">
                    <input type="text" class="focus:outline-none h-10 rounded-md bg-softGray pl-3 text-sm w-full"
                           :placeholder="$t('1001')" :class="darkMode?`bg-button text-gray-300`:``"
                           v-on:keyup.enter="search" v-model="s">
                    <div class="absolute right-3 top-2">
                        <SearchIcon :fill="darkMode?`#FFFFFF`:`#000000`"/>
                    </div>
                </div>
                <!-- Loading -->
                <div v-if="loading">
                    <div class="mt-5" v-for="i in 5" :key="i">
                        <div class="animate-pulse flex space-x-4 items-center">
                            <div class="rounded-full h-12 w-12" :class="darkMode?`bg-byline`:`bg-gray-300`"></div>
                            <div class="flex-1 space-y-2 py-1">
                                <div class="h-3 w-3/4" :class="darkMode?`bg-byline`:`bg-gray-300`"></div>
                                <div class="space-y-2">
                                    <div class="h-3" :class="darkMode?`bg-byline`:`bg-gray-300`"></div>
                                    <div class="h-3 w-5/6" :class="darkMode?`bg-byline`:`bg-gray-300`"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-else>
                    <!-- Friend -->
                    <Friend :friends="friends" v-if="active === `friend`"/>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import eHeader from "./../Video/components/Header.vue"
    import {mapState, mapActions} from "vuex"
    import SearchIcon from "./../../components/SearchIcon.vue"
    import Friend from "./Friend.vue"

    export default {
        components: {
            eHeader,
            SearchIcon,
            Friend,
            Request,
        },
        data() {
            return {
                page: 1,
                enableScroll: false,
                s: ""
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            ...mapState('network', ['active', 'friends', 'loading', 'friendNotInContact', 'myRequest', 'friendRequest'])
        },
        methods: {
            ...mapActions('network', ['getFriend', 'getFriendNotInContact', 'requestTo', 'getFriendRequest']),
            switchMenu(tap) {
                this.page = 1
                this.enableScroll = true

                this.$store.commit("network/switchTab", tap)
                if (tap === 'add_friend') {
                    this.getFriendNotInContact({
                        p: this.page,
                        s: this.s
                    })
                }

                if (tap === 'friend') {
                    this.getFriend({
                        p: this.page
                    })
                }

                if (tap === 'your_request') {
                    this.requestTo({
                        p: this.page
                    })
                }

                if (tap === 'friend_request') {
                    this.getFriendRequest({
                        p: this.page
                    })
                }
            },
            search() {
                if (this.active === 'add_friend') {
                    this.getFriendNotInContact({
                        p: 1,
                        s: this.s
                    })
                }

                if (this.active === 'your_request') {
                    this.requestTo({
                        p: 1,
                        s: this.s
                    })
                }

                if (this.active === 'friend_request') {
                    this.getFriendRequest({
                        p: 1,
                        s: this.s
                    })
                }

                if (this.active === 'friend') {
                    this.getFriend({
                        p: 1,
                        s: this.s
                    })
                }

            },
            onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                    this.page++

                    let payload = {}

                    payload.p = this.page
                    payload.s = this.s

                    if (this.active === 'add_friend') {
                        if (this.enableScroll) {
                            this.getFriendNotInContact(payload).then(res => {
                                if (res.data.data.list.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        }
                    }

                    if (this.active === 'your_request') {
                        if (this.enableScroll) {
                            this.requestTo(payload).then(res => {
                                if (res.data.data.list.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        }
                    }

                    if (this.active === 'friend') {
                        if (this.enableScroll) {
                            this.getFriend(payload).then(res => {
                                if (res.data.data.list.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        }
                    }

                    if (this.active === 'friend_request') {
                        if (this.enableScroll) {
                            this.getFriendRequest(payload).then(res => {
                                if (res.data.data.list.length <= 0) {
                                    this.enableScroll = false
                                }
                            })
                        }
                    }
                }
            },
        },
        created() {
            this.getFriend({p: this.page, id: this.$route.params.id})
        }
    }
</script>