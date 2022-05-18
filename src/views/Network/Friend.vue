<template>
    <div class="mt-5" :class="darkMode?`text-gray-300`:``">
        <a
                :class="darkMode ? `text-gray-300`: `text-primary`"
                @click="()=>{this.$router.go(-1)}"
                href="#" class="absolute right-2 bottom-2">
            <BackMenuIcon :fill="darkMode?`#ffffff`:`#055174`" :width="30"/>
        </a>
        <div v-if="friends.list && friends.list.length">
            <div v-for="(friend, index) in friends.list" :key="index" class="mb-3" @click="getUser(friend._id)">
                <div class="flex justify-between items-center cursor-pointer">
                    <div class="flex justify-start items-center">
                        <div class="h-12 w-12 rounded-full bg-cover bg-white bg-center cursor-pointer"
                             :style="{backgroundImage:`url(${friend.photo})`}"></div>
                        <div class="ml-4 text-sm">
                            <div>
                                {{friend.name}}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center cursor-pointer rounded-2xl"
                         :class="darkMode?`bg-button`:`bg-primary`" v-if="$route.name != 'friend'">
                        <div @click="unFriendFromList(friend)"
                             class="flex items-center justify-center w-10 h-6 rounded-2xl">
                            <CloseIcon :fill="darkMode?`#909090`:`#FFFFFF`" :width="16"></CloseIcon>
                        </div>
                    </div>
                </div>
                <div class="border-t mt-3" :class="darkMode?`border-button`:``">

                </div>
            </div>
        </div>
        <div v-else>
            <span v-if="$route.name != 'friend'">
                {{$t('you_do_not_have_any_friend')}}
            </span>
            <span v-else>
                {{ $t('no_friend') }}
            </span>
        </div>
    </div>
</template>
<script>
    import CloseIcon from "./../../components/CloseIcon.vue"
    import {mapState, mapActions} from "vuex"
    import BackMenuIcon from "../../components/BackMenuIcon";

    export default {
        props: {
            friends: {
                default: () => {
                    return []
                }
            }
        },
        computed: {
            ...mapState('setting', ['darkMode'])
        },
        components: {
            BackMenuIcon,
            CloseIcon,
        },
        methods: {
            ...mapActions('network', ['unFriend']),
            unFriendFromList(friend) {
                let payload = {id: friend._id}
                this.unFriend(payload)
            },
            getUser(user_id) {
                this.$router.push({name: 'user', params: {user_id}})
            },
        }
    }
</script>