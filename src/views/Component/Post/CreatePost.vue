<template>
  <div class="flex items-center justify-center fixed left-0 top-0 z-50 bg-black bg-opacity-80 w-full h-full">
    <div
        class="shadow rounded-xl w-2/5"
        :class="darkMode ? `bg-secondary`: `bg-white`"
    >
      <div
          :class="darkMode ?`border-b border-facebook`: `border-b`"
          class="h-14 flex items-center justify-between px-5 text-lg">


        <div class="cursor-pointer" @click="()=>{this.$emit('dismissPost')}">
          <CloseIcon :fill="darkMode ? `#909090` : `#000000`"></CloseIcon>
        </div>
        <div class="w-full text-center">
          <div>
            {{ $t('create_post') }}
          </div>
        </div>
        <div>
          <div class="cursor-pointer" :class="darkMode? `` : `text-primary`">
            {{ $t('post') }}
          </div>
        </div>

      </div>

      <!-- Body -->
      <div class="p-5">
        <div class="flex space-x-5">
          <Avatar :size="16" :avatar-url="stProfile.photo"></Avatar>
          <div>
            <div class="flex space-x-1 items-center">
              <span>{{ stProfile.first_name }}</span>
              <span>{{ stProfile.last_name }}</span>
            </div>
            <div>
              <div
                  :class="darkMode ? `border-button` : `border-roundBorder` "
                  class="flex items-center border rounded-md px-2 mt-1 text-sm py-1 justify-between">
                <span class="capitalize">{{ $t('category') }}</span>
                <div>
                  <ChevronDown :fill="darkMode ? `#909090` : `#000000`" :size="15"></ChevronDown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-72">
          <textarea
              :placeholder="$t('say_something')"
              class="w-full outline-none mt-5 bg-transparent" style="resize: none"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="h-24 border-t flex items-center space-x-10 px-5"
           :class="darkMode ? `border-facebook`: ``"
      >
        <div
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`"
        >
          <CameraIcon :width="20" :height="22"  :fill="darkMode ? `#909090` : `#055174`"></CameraIcon>
        </div>
        <div
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`"
        >
          <ImageIcon :size="20"  :fill="darkMode ? `#909090` : `#055174`"></ImageIcon>
        </div>
        <div
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`"
        >
          <PostVideoIcon  :fill="darkMode ? `#909090` : `#055174`"></PostVideoIcon>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center  text-sm fot-semibold cursor-pointer"
             :class="darkMode ? `bg-button text-textSecondary `: `bg-softGray text-primary`">
          Live
        </div>
        <div
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            :class="darkMode ? `bg-button`: `bg-softGray`"
        >
          <BackgroundIcon :fill="darkMode ? `#909090` : `#055174`"></BackgroundIcon>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import CloseIcon from "@/components/CloseIcon";
import Avatar from "@/Avatar";
import CameraIcon from "@/components/CameraIcon";
import ImageIcon from "@/components/ImageIcon";
import PostVideoIcon from "@/components/PostVideoIcon";
import ChevronDown from "@/views/MyCourse/components/Chevron";
import BackgroundIcon from "@/components/BackgroundIcon";

export default {
  name: "CreatePost",
  components: {BackgroundIcon, ChevronDown, PostVideoIcon, ImageIcon, CameraIcon, Avatar, CloseIcon},
  data() {
    return {}
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile'])
  }
}
</script>

<style scoped>

</style>