<template>
  <div class="mt-4 flex space-x-5">
    <Avatar :avatar-url="comment.user.photo" :size="avataSize"></Avatar>
    <div class="rounded-xl py-4 px-3" :class="darkMode ? `bg-youtube`: `bg-forum`">
      <div>
        <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">
          {{ comment.user.name }}
        </div>
      </div>
      <div v-if="comment.content.photo">
        <img :src="comment.content.photo.url" class="max-h-40 rounded my-2 m-auto">
      </div>
      <div v-if="comment.content.sticker">
        <img :src="comment.content.sticker.url" class="max-h-40 rounded my-2 m-auto">
      </div>
      <div v-if="comment.content.text" :class="darkMode?`text-gray-300`:``">
        {{comment.content.text}}
      </div>

      <div class="flex items-center justify-between">
        <div class="text-gray-500 text-sm">
          <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en"/>
        </div>
        <div class="cursor-pointer" @click="reply(comment)">
          <ReplyIcon></ReplyIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import VueMomentsAgo from "vue-moments-ago";
import Avatar from "@/Avatar";
import {mapState} from "vuex";

export default {
  name: "Comment",
  components: {
    ReplyIcon,
    VueMomentsAgo,
    Avatar
  },
  props: {
    avataSize: {
      default: () => 14
    },
    parentCommentId: {
      default: () => null
    },
    comment: {
      default: () => {
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    reply(comment) {
      if (this.parentCommentId) {
        comment._id = this.parentCommentId
      }
      this.$emit("reply", comment)
    }
  }
}
</script>

<style scoped>

</style>