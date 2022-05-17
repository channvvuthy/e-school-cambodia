<template>
  <div @mouseleave="clearAction">
    <div class="mt-4 flex space-x-5" :id="comment._id">
      <div @click="userDetail(comment.user)">
        <Avatar :avatar-url="comment.user.photo" :size="avataSize"></Avatar>
      </div>
      <div
          class="rounded-xl py-4 px-3 relative" :class="darkMode ? `bg-youtube`: `bg-forum`">
        <div
            id="comment-action"
            v-if="actionId === comment._id"
            :class="darkMode ? `bg-youtube`: `bg-forum`"
            class="absolute -right-21 top-0  px-3 py-2 rounded-lg">
          <div
              :class="darkMode ? `pangusu-dark`: `pangusu-light`"
              class="absolute pangusu"></div>
          <ul>
            <li class="mb-2 cursor-pointer" @click="editComment">
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
      <div class="flex items-center justify-between space-x-1 cursor-pointer"
           v-if="comment.user._id == stProfile._id"
           @click="commentAction">
        <div class="w-1 h-1 rounded-full" :class="darkMode ? `bg-black`: `bg-instagram`"></div>
        <div class="w-1 h-1 rounded-full" :class="darkMode ? `bg-black`: `bg-instagram`"></div>
        <div class="w-1 h-1 rounded-full" :class="darkMode ? `bg-black`: `bg-instagram`"></div>
      </div>
    </div>
    <template v-if="isConfirm">
      <ConfirmDelete
          :message="$t(confirmMessage)"
          @closeMessage="()=>{this.isConfirm = false}"
          @ConfirmDeleteCart="confirmDelete">
      </ConfirmDelete>
    </template>

    <template v-if="isEdit">
      <EditComment
          :reply-id="replyId"
          :socialComment="comment"
          @closeComment="()=>{this.isEdit = false}"></EditComment>
    </template>
  </div>
</template>

<script>
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import VueMomentsAgo from "vue-moments-ago";
import Avatar from "@/Avatar";
import {mapActions, mapState} from "vuex";
import ConfirmDelete from "@/views/MyCourse/components/ConfirmDelete";
import EditComment from "./EditComment";

export default {
  name: "Comment",
  components: {
    ReplyIcon,
    VueMomentsAgo,
    EditComment,
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
      isEdit: false,
      replyId: null,
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['actionId']),
    ...mapState('auth', ['stProfile'])
  },
  methods: {
    ...mapActions('social', ['deleteComment', 'deleteReplyComment']),
    userDetail(user) {
      this.$router.push({
        name: "user",
        params: {
          user_id: user._id
        }
      })
    },
    editComment() {
      if (this.parentCommentId) {
        this.replyId = this.comment._id
      }

      this.isEdit = true
      this.clearAction()
      this.$store.commit("social/socialComment", this.comment)
    },
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
    clearAction() {
      this.$store.commit("social/setActionId", null)
    },
    reply(comment) {
      if (this.parentCommentId) {
        comment._id = this.parentCommentId
      }
      this.$emit("reply", comment)
    }
  },
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