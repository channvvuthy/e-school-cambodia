<template>
  <div :class="darkMode ? `` : `bg-white border`"
       class="ml-5 flex flex-col justify-between"
       :style="{height:`${windowHeight}px`}">
    <div class="h-full overflow-y-scroll p-5" ref="feed">
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

          <div class="w-full ml-4">
            <div class="w-full rounded-xl py-4 px-3" :class="darkMode ? `bg-youtube`: `bg-forum`">
              <div>
                <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">
                  {{ forum.user.name }}
                </div>
              </div>
              <div v-if="forum.content.photo">
                <img :src="forum.content.photo.name" class="max-h-40 rounded my-2">
              </div>
              <div v-if="forum.content.text" :class="darkMode?`text-gray-300`:``">
                {{ cutString(forum.content.text, 100) }}
              </div>

              <div class="flex items-center justify-between">
                <div class="text-gray-500 text-sm">
                  <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en"/>
                </div>
                <div class="cursor-pointer" @click="showReply(forum)">
                  <ReplyIcon></ReplyIcon>
                </div>
              </div>
            </div>
            <div class="mt-5" v-if="replyUser.id == forum._id">

              <!-- Reply -->
              <div class="flex">
                <div class="h-10 w-10">
                  <div class="h-10 w-10 bg-cover bg-center rounded-full bg-forum"
                       :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                </div>
                <div class="w-full flex ml-3 relative items-center">
                  <textarea
                      :placeholder="$t('reply')"
                      class="text-sm w-full border rounded-full outline-none h-10 px-3 pt-3"
                      style="resize: none"></textarea>
                  <div class="absolute right-4 cursor-pointer">
                    <ImageIcon :fill="darkMode?`#e4e7eb`:`#055174`" :size="25"></ImageIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Box chat -->
    <div :class="darkMode ? `bg-secondary`: `bg-forum`"
         class="flex justify-between h-17 px-5 items-center"
    >
      <div class="h-12 w-12 cursor-pointer">
        <div
            class="rounded-full flex items-center justify-center h-12 w-12"
            :class="darkMode ? `comment-dark`: `comment-light`" @click="choosePhoto">
          <ImageIcon :fill="darkMode?`#e4e7eb`:`#055174`" :size="25"></ImageIcon>
        </div>
      </div>

      <div class="w-full">
        <div class="mx-5">
          <form class="hidden">-->
            <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"
                   accept="image/png, image/gif, image/jpeg">
          </form>
          <textarea
              :placeholder="$t('say_something')"
              @keyup.enter.exact="postComment" v-model="text"
              class="w-full bg-transparent py-8 outline-none h-17"
              style="resize: none"></textarea>
        </div>
      </div>

      <div class="h-12 w-12 cursor-pointer">
        <div
            class="rounded-full flex items-center justify-center h-12 w-12"
            :class="darkMode ? `comment-dark`: `comment-light`" @click="choosePhoto">
          <SendMessageIcon :fill="darkMode?`#e4e7eb`:`#055174`" :size="25"></SendMessageIcon>
        </div>
      </div>

    </div>

  </div>
  <!--  <div class="ml-5 py-3 full relative font-khmer_os"-->
  <!--       :class="loadingForum?`overflow-y-scroll`:darkMode?`bg-secondary`:`bg-white border`">-->
  <!--    <template v-if="loadingForum">-->
  <!--      <div class="flex mb-3 bg-white rounded-md p-3  mx-4" v-for="i in 5" :key="i">-->
  <!--        <div class="forum w-16 h-16 rounded-full"></div>-->
  <!--        <div class="flex-1 ml-5">-->
  <!--          <div class="h-4 w-1/2 forum mb-1"></div>-->
  <!--          <div class="h-4 w-2/3 forum mb-1"></div>-->
  <!--          <div class="h-4 w-full forum"></div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--    <template v-else>-->
  <!--      <div class="">-->
  <!--        <div class="h-24 pt-4 w-full flex justify-between px-4 items-start"-->
  <!--             :class="darkMode?`bg-secondary`:`bg-forum`">-->
  <!--          <div class="opacity-50 cursor-pointer" @click="choosePhoto">-->
  <!--            <ImageIcon :fill="darkMode?`#e4e7eb`:`#000000`"></ImageIcon>-->
  <!--          </div>-->
  <!--          <form class="hidden">-->
  <!--            <input type="file" id="photo" ref="photo" @change="onSelectedPhoto"-->
  <!--                   accept="image/png, image/gif, image/jpeg">-->
  <!--          </form>-->
  <!--          <textarea-->
  <!--              class="ml-5 border h-full flex-1 resize-none leading-10 pl-5 focus:outline-none text-sm bg-transparent"-->
  <!--              :class="darkMode?``:``"-->
  <!--              :placeholder="$t('2112')" @keyup.enter.exact="postComment" v-model="text"></textarea>-->
  <!--        </div>-->
  <!--        <div class="overflow-y-scroll h-4/5 pb-72" @scroll="onScroll" ref="feed"-->
  <!--             :class="forums.length?``:`${darkMode?`bg-secondary text-white flex items-center justify-center`:`bg-white flex items-center justify-center`}`">-->
  <!--          <div v-if="!forums.length">-->
  <!--            {{ $t('there_is_no_comment_to_show') }}-->
  <!--          </div>-->
  <!--          <div v-for="(forum,index) in forums" :key="index"-->
  <!--               class=" mb-3 px-5">-->
  <!--            <div class="flex">-->
  <!--              <div class="h-16 w-16 rounded-full bg-cover bg-center bg-gray-300"-->
  <!--                   :style="{backgroundImage:`url(${forum.user.photo})`}">-->
  <!--              </div>-->

  <!--              <div class="ml-4 flex-1 w-full rounded-xl py-4 px-3" :class="darkMode ? `bg-youtube`: `bg-forum`">-->
  <!--                <div>-->
  <!--                  <div class="text-lg font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">-->
  <!--                    {{ forum.user.name }}-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--                <div v-if="forum.content.photo">-->
  <!--                  <img :src="forum.content.photo.name" class="max-h-40 rounded my-2">-->
  <!--                </div>-->
  <!--                <div v-if="forum.content.text" :class="darkMode?`text-gray-300`:``">-->
  <!--                  {{ cutString(forum.content.text, 100) }}-->
  <!--                </div>-->

  <!--                <div class="flex items-center justify-between">-->
  <!--                  <div class="text-gray-500 text-sm">-->
  <!--                    <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en"/>-->
  <!--                  </div>-->
  <!--                  <div class="cursor-pointer">-->
  <!--                    <ReplyIcon></ReplyIcon>-->
  <!--                  </div>-->
  <!--                </div>-->

  <!--              </div>-->

  <!--            </div>-->
  <!--            &lt;!&ndash;                        <div class="mb-3 flex p-5 cursor-pointer" @click="forumDetail(forum)">&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div class="h-16 w-16 rounded-full bg-cover bg-center bg-gray-300"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                 :style="{backgroundImage:`url(${forum.user.photo})`}"></div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div class="ml-4 flex-1 w-full">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                    <div class="text-base font-semibold" :class="darkMode?`text-gray-300`:`text-primary`">{{forum.user.name}}</div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                    <div class="text-gray-500">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                        <vue-moments-ago prefix="" suffix="ago" :date="forum.date" lang="en"/>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                    </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <div v-if="forum.content.photo">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                    <img :src="forum.content.photo.name" class="max-h-40 rounded my-2">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <div v-if="forum.content.text" :class="darkMode?`text-gray-300`:``">{{cutString(forum.content.text, 100)}}</div>&ndash;&gt;-->


  <!--            &lt;!&ndash;                            </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                        </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                        <div class="h-1 my-2" :class="darkMode?`rgba`:`border-t border-primay `"></div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                        <div class="flex px-5 items-center justify-between">&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div class="w-10 h-10 bg-gray-500 rounded-full bg-cover bg-center"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                 :style="{backgroundImage:`url(${stProfile.photo})`}"></div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <textarea  :placeholder="$t('2114') + `...`"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                          class="pl-5 h-10 pt-3 focus:outline-none bg-transparent"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                          :class="darkMode?`placeholder-gray-300 text-gray-300`:``"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                          style="resize: none;"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                          :style="darkMode?`caret-color: #e5e7eb`:``"&ndash;&gt;-->
  <!--            &lt;!&ndash;                                          @keyup.enter.exact="UserReplyComment($event,forum)" :id="forum._id"></textarea></div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div class="flex items-center">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <Eye :fill="darkMode?`#E5E7EB`:``"></Eye>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <div class="ml-2" :class="darkMode?`text-gray-300`:``">{{forum.view}}</div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            <div class="flex items-center ml-10 mr-5">&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <ChatIcon :size="20" :fill="darkMode?`#E5E7EB`:``"></ChatIcon>&ndash;&gt;-->
  <!--            &lt;!&ndash;                                <div class="ml-2" :class="darkMode?`text-gray-300`:``">{{forum.comment}}</div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                            </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                        </div>&ndash;&gt;-->
  <!--            &lt;!&ndash;                        <div class="h-3"></div>&ndash;&gt;-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--    <div class="h-40"></div>-->
  <!--  </div>-->
</template>
<script>
import {mapActions, mapState} from "vuex"
import Eye from "./../../../components/Eye.vue"
import ChatIcon from "./../../../components/ChatIcon.vue"
import ImageIcon from "./../../../components/ImageIcon.vue"
import helper from "./../../../helper/helper"
import VueMomentsAgo from "vue-moments-ago";
import ReplyIcon from "@/views/Chat/components/ReplyIcon";
import SendMessageIcon from "@/components/SendMessageIcon";

export default {
  components: {
    VueMomentsAgo,
    Eye,
    ChatIcon,
    ImageIcon,
    ReplyIcon,
    SendMessageIcon
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
      replyUser: {
        id: null,
        text: null,
      }
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
        let id = document.getElementById("video").value
        payload.id = id

        payload.p = this.page
        this.getForumPagination(payload);
      }
    },
  },

  created() {
    this.windowHeight = screen.height - 300
    this.getForum(
        {id: this.id, p: this.page}
    )

  }
}
</script>
<style>
.comment-light {
  background-color: rgba(5, 81, 116, 0.2);
}
</style>
