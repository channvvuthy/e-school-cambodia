<template>
  <div :class="darkMode ? `bg-secondary` : `bg-white border`"
       class="ml-5 flex flex-col justify-between"
       :style="{height:`${windowHeight}px`}">
    <div class="h-full overflow-y-scroll p-5" ref="feed" @scroll="onScroll">
      <div v-if="loadingForum">
        <div
            v-for="key in 3" :key="key + Math.random()"
            class="border mb-5 p-5"
            :class="darkMode ? `border-button text-lightGray` : ``">
          <Loading :grid="true" :number-of-columns="1"/>
        </div>
      </div>
      <div v-else>
        <div v-if="!forums.length">
          {{ $t('there_is_no_comment_to_show') }}
        </div>
        <div v-for="(forum,index) in forums" :key="index" class="mb-5">
          <div class="flex">
            <div class="h-16 w-16">
              <div class="h-16 w-16 rounded-full bg-cover bg-center bg-gray-300"
                   :style="{backgroundImage:`url(${forum.user.photo})`}">
              </div>
            </div>

            <div class="ml-4">
              <div class="w-full rounded-xl py-4 px-3" :class="darkMode ? `bg-youtube`: `bg-forum`">
                <div>
                  <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">
                    {{ forum.user.name }}
                  </div>
                </div>
                <div v-if="forum.content.photo">
                  <img :src="forum.content.photo.name || forum.content.photo.url"
                       class="max-h-40 rounded my-2">
                </div>
                <div v-if="forum.content.text" :class="darkMode?`text-gray-300`:``">
                  {{ cutString(forum.content.text, 100) }}
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-gray-500 text-sm">
                    <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en"/>
                  </div>
                  <div class="cursor-pointer" @click="forumDetail(forum)">
                    <ReplyIcon/>
                  </div>
                </div>
              </div>

              <!-- Child comment -->
              <div v-if="forum.forum_comment">
                <div class="my-5 flex">
                  <div class="h-14 w-14">
                    <div class="h-14 w-14 rounded-full bg-cover bg-center bg-gray-300"
                         :style="{backgroundImage:`url(${forum.forum_comment.user.photo})`}">
                    </div>
                  </div>
                  <div class="w-full rounded-xl py-4 px-3 ml-4"
                       :class="darkMode ? `bg-youtube`: `bg-forum`">
                    <div>
                      <div class="text-lg font-semibold"
                           :class="darkMode?`text-gray-300`:`text-primary`">
                        {{ forum.forum_comment.user.name }}
                      </div>
                    </div>
                    <div v-if="forum.forum_comment && forum.forum_comment.content.photo">
                      <img :src="forum.forum_comment.content.photo.name"
                           class="max-h-40 rounded my-2">
                    </div>
                    <div v-if="forum.forum_comment && forum.forum_comment.content.sticker">
                      <img :src="forum.forum_comment.content.sticker.name"
                           class="max-h-40 rounded my-2">
                    </div>
                    <div v-if="forum.forum_comment.content.text"
                         :class="darkMode?`text-gray-300`:``">
                      {{ cutString(forum.forum_comment.content.text, 100) }}
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="text-gray-500 text-sm">
                        <vue-moments-ago prefix="" suffix="ago" :date="forum.forum_comment.date"
                                         lang="en"/>
                      </div>
                      <div class="cursor-pointer" @click="forumDetail(forum)">
                        <ReplyIcon/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="h-14 w-14"></div>
                  <div class="ml-4 text-lg capitalize cursor-pointer"
                       @click="forumDetail(forum)"
                       :class="darkMode ?`text-textSecondary`: `text-primary`">
                    {{ $t('more_reply') }}...
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Box chat -->
    <div :class="darkMode ? `bg-youtube`: `bg-forum`"
         class="flex justify-between h-17 px-5 items-center"
    >
      <div class="h-12 w-12 cursor-pointer">
        <div
            class="rounded-full flex items-center justify-center h-12 w-12"
            :class="darkMode ? `comment-dark`: `comment-light`" @click="choosePhoto">
          <ImageIcon :fill="darkMode?`#e4e7eb`:`#055174`" :size="25"/>
        </div>
      </div>

      <div class="w-full">
        <div class="mx-5">
          <form class="hidden">-->
            <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"
                   accept="image/png, image/gif, image/jpeg">
          </form>
          <textarea
              :class="darkMode ? `text-textSecondary`: ``"
              :placeholder="$t('say_something')"
              @keyup.enter.exact="postComment" v-model="text"
              class="w-full bg-transparent py-8 outline-none h-17"
              style="resize: none"></textarea>
        </div>
      </div>

      <div class="h-12 w-12 cursor-pointer">
        <div
            class="rounded-full flex items-center justify-center h-12 w-12"
            :class="darkMode ? `comment-dark`: `comment-light`" @click="postComment">
          <SendMessageIcon :fill="darkMode?`#e4e7eb`:`#055174`" :size="25"/>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import ImageIcon from "./../../../components/ImageIcon.vue"
import helper from "./../../../helper/helper"
import VueMomentsAgo from "vue-moments-ago";
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import SendMessageIcon from "@/components/SendMessageIcon";
import Loading from "@/components/Loading";

export default {
  components: {
    VueMomentsAgo,
    ImageIcon,
    ReplyIcon,
    SendMessageIcon,
    Loading
  },

  props: {
    id: {
      default: () => {
        return ""
      }
    }
  },
  data() {
    return {
      page: 1,
      text: "",
      windowHeight: 0,
    }
  },
  computed: {
    ...mapState('forum', ['forums', 'loadingForum']),
    ...mapState('auth', ['stProfile',]),
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('forum', ['getForum', 'getForumPagination', 'replyComment']),
    showReply(comment) {
      this.replyUser.id = comment._id
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    forumDetail(forum) {
      this.$emit("forumDetail", forum)
    },
    postComment() {
      if (this.text) {
        this.$emit("postComment", this.text)
      }
      this.text = ""
      this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight

    },
    UserReplyComment(event, forum) {
      let text = event.target.value
      let id = forum._id
      let payload = {id, text}
      if (text.length) {
        this.replyComment(payload).then(() => {
          document.getElementById(`${id}`).value = ""
          this.forumDetail(forum);

        })
      }
    },

    onSelectedPhoto(event) {
      if (event.target.value) {
        this.$emit("noReply", false)
        this.$emit("openModal", event)
      }
    },
    choosePhoto() {
      this.$refs.photo.click()
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.page++
        let payload = {}
        payload.id = this.id

        payload.p = this.page
        this.getForumPagination(payload);
      }
    },
  },

  created() {
    this.windowHeight = screen.height - 300
    this.getForum({id: this.id, p: this.page})

  }
}
</script>
<style>
.comment-light {
  background-color: rgba(5, 81, 116, 0.2);
}
</style>
