<template>
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
      <CreatePost @dismissPost="()=>{this.isPost = false}"></CreatePost>
    </template>
  </div>
</template>
<script>
import Avatar from "@/Avatar";
import mode from "@/mixins/mode";
import {mapState} from "vuex";
import PostVideoIcon from "@/components/PostVideoIcon";
import ImageIcon from "@/components/ImageIcon";
import CreatePost from "@/views/Component/Post/CreatePost";

export default {
  computed: {
    ...mapState('auth', ['stProfile']),
    ...mapState('setting', ['darkMode'])
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
      isPost: false
    }
  },
  methods: {
    createPost() {
      this.isPost = true
    }
  },
  mounted() {
    this.mode()
  }

}
</script>