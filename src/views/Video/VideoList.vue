<template>
  <div>
    <div class="px-5 flex items-center h-24"
         :class="mode()">
      <Avatar
          :avatar-url="stProfile.photo"
          :size="16"></Avatar>
      <textarea
          :class="mode()"
          class="outline-none h-full w-full ml-4 text-sm pt-10 border-none bg-transparent"
          style="resize: none"
          :placeholder="$t('say_something')"></textarea>
      <div class="flex items-center space-x-8">
        <div
            @click="createPost"
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`">
          <PostVideoIcon :fill="darkMode ? `#909090` : `#055174`"></PostVideoIcon>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
             @click="createPost"
             :class="darkMode ? `bg-button`: `bg-softGray`">
          <ImageIcon :size="20" :fill="darkMode ? `#909090` : `#055174`"></ImageIcon>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center  text-sm fot-semibold cursor-pointer"
             :class="darkMode ? `bg-button text-textSecondary `: `bg-softGray text-primary`">
          Live
        </div>
      </div>
      <template v-if="isPost">
        <CreatePost
            @dismissPost="()=>{this.isPost = false}"
            @closeCreate="closeCreate"></CreatePost>
      </template>
    </div>
    <div class="flex flex-wrap p-5">
      <div class="w-9/12">
        <div v-for="(post, index) in social" :key="index">
          <div class="border p-5 mb-5">
            <div class="flex justify-between">
              <div class="flex space-x-3">
                <Avatar :avatar-url="post.user.photo" :size="16"></Avatar>
                <div>
                  <div class="font-semibold text-lg">{{post.user.name}}</div>
                  <div>
                    {{post.date}}
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="h-1 w-1 rounded-full bg-black"></div>
                <div class="h-1 w-1 rounded-full bg-black"></div>
                <div class="h-1 w-1 rounded-full bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from "@/Avatar";
import mode from "@/mixins/mode";
import {mapActions, mapState} from "vuex";
import PostVideoIcon from "@/components/PostVideoIcon";
import ImageIcon from "@/components/ImageIcon";
import CreatePost from "@/views/Component/Post/CreatePost";

export default {
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode']),
    ...mapState('social', ['loading', 'social'])
  },
  components: {
    Avatar,
    PostVideoIcon,
    ImageIcon,
    CreatePost
  },
  mixins: [mode],
  data() {
    return {
      isPost: false,
      payload: {
        p: 1
      }
    }
  },
  methods: {
    ...mapActions('social', ['getSocial']),
    closeCreate() {
      this.isPost = false
      this.$router.push({
        name: "refresh-post"
      })
    },
    createPost() {
      this.isPost = true
    }
  },
  mounted() {
    this.mode()
  },
  created() {
    this.getSocial(
        this.payload
    )
  }

}
</script>