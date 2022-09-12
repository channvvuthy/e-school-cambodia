<template>
  <div class="mt-5" :class="darkMode?`text-gray-300`:``">
    <a
        :class="darkMode ? `text-gray-300`: `text-primary`"
        @click="()=>{this.$router.go(-1)}"
        href="#" class="absolute right-2 bottom-2">
      <BackMenuIcon :fill="darkMode?`#ffffff`:`#055174`" :width="30"/>
    </a>
    <div v-if="friendNotInContact.list && friendNotInContact.list.length">
      <div v-for="(friend, index) in friendNotInContact.list" :key="index" class="mb-3">
        <div class="flex justify-between items-center">
          <div class="flex justify-start items-center">
            <div class="h-12 w-12 rounded-full bg-cover bg-white bg-center cursor-pointer"
                 :style="{backgroundImage:`url(${friend.photo})`}" @click="getUser(friend._id)"></div>
            <div class="ml-4 text-sm">
              <div>

                {{ friend.name }}
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center cursor-pointer rounded-2xl"
               :class="darkMode?`bg-button`:`bg-primary`">
            <div @click="addUser(friend)" v-if="!isRequested(friend)"
                 class="flex items-center justify-center w-10 h-6 rounded-2xl">
              <AddIcon :fill="darkMode?`#909090`:`#FFFFFF`" :size="16"></AddIcon>
            </div>
            <div v-else @click="cancelFriendRequest(friend)"
                 class="flex items-center justify-center w-10 h-6 rounded-2xl">
              <ArrowRight fill="#FFFFFF" :size="16"/>
            </div>
          </div>
        </div>
        <div class="border-t mt-3" :class="darkMode?`border-button`:``">

        </div>
      </div>
    </div>
    <div v-else>
      {{ $t('there_is_no_friend_to_add') }}
    </div>
  </div>
</template>
<script>
import AddIcon from "./../../components/AddIcon.vue"
import ArrowRight from "./../../components/ArrowRight.vue"
import {mapState, mapActions} from "vuex"
import BackMenuIcon from "../../components/BackMenuIcon";

export default {
  props: {
    friendNotInContact: {
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  data() {
    return {
      addedFriend: []
    }
  },
  components: {
    BackMenuIcon,
    AddIcon,
    ArrowRight
  },
  methods: {
    ...mapActions('network', ['addFriend', 'cancelRequest']),
    addUser(friend) {
      let payload = {id: friend._id}
      this.addFriend(payload).then(() => {
        this.addedFriend.push(friend._id)
      })
    },
    getUser(user_id) {
      this.$router.push({name: 'user', params: {user_id}})
    },
    isRequested(friend) {
      for (let i = 0; i < this.addedFriend.length; i++) {
        if (this.addedFriend[i] === friend._id) {
          return true
        }
      }
      return false
    },
    cancelFriendRequest(friend) {
      this.cancelRequest(friend._id).then(() => {
        this.addedFriend = this.addedFriend.filter(item => item != friend._id)
      })
    }
  }
}
</script>