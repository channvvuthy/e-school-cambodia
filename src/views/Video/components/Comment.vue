<template>
  <div class="mt-4 flex space-x-5" :id="comment._id">
    <Avatar :avatar-url="comment.user.photo" :size="avataSize"></Avatar>
    <div
        @contextmenu="commentAction"
        class="rounded-xl py-4 px-3 relative" :class="darkMode ? `bg-youtube`: `bg-forum`">
      <div
          v-if="actionId === comment._id"
          :class="darkMode ? `bg-youtube`: `bg-forum`"
          class="absolute -right-24 top-0  px-3 py-2 rounded-lg">
        <div
            :class="darkMode ? `pangusu-dark`: `pangusu-light`"
            class="absolute pangusu"></div>
        <ul>
          <li class="mb-2 cursor-pointer">
            {{ $t('actions.edit') }}
          </li>
          <li @click="removeComment"
              class="cursor-pointer">
            {{ $t('actions.delete') }}
          </li>
        </ul>
      </div>
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
        {{ comment.content.text }}
      </div>
      <div class="flex items-center justify-between space-x-4">
        <div class="text-gray-500 text-sm">
          <vue-moments-ago prefix="" suffix="ago" :date="comment.date" lang="en"/>
        </div>
        <div class="cursor-pointer" @click="reply(comment)">
          <ReplyIcon></ReplyIcon>
        </div>
      </div>
    </div>
    <template v-if="isConfirm">
      <ConfirmDelete
          :message="$t(confirmMessage)"
          @closeMessage="()=>{this.isConfirm = false}"
          @ConfirmDeleteCart="confirmDelete">
      </ConfirmDelete>
    </template>
  </div>
</template>

<script>
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import VueMomentsAgo from "vue-moments-ago";
import Avatar from "@/Avatar";
import {mapActions, mapState} from "vuex";
import ConfirmDelete from "@/views/MyCourse/components/ConfirmDelete";

export default {
  name: "Comment",
  components: {
    ReplyIcon,
    VueMomentsAgo,
    Avatar,
    ConfirmDelete
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
  data() {
    return {
      isConfirm: false,
      confirmMessage: "delete",
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['actionId'])
  },
  methods: {
    ...mapActions('social', ['deleteComment', 'deleteReplyComment']),
    confirmDelete() {
      let payload = {
        id: this.comment._id,
        isReply: false,
      }
      if (this.parentCommentId) {
        document.getElementById(this.comment._id).remove()
        payload.parentCommentId = this.parentCommentId
        this.deleteReplyComment(payload).then(() => {
          this.isConfirm = false
        })
      } else {
        this.deleteComment(payload).then(() => {
          this.isConfirm = false
        })
      }

    },
    removeComment() {
      this.isConfirm = true
    },
    commentAction() {
      this.$store.commit("social/setActionId", this.comment._id)
    },
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
.pangusu {
  border: 12px solid transparent;
  left: -23px;
  top: 15px;
}

.pangusu-light {
  border-right-color: #eaeaea;
}

.pangusu-dark {
  border-right-color: #181818;
}
</style>