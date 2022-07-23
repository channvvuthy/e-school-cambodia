<template>
  <div class="overflow-y-scroll h-screen"
       :class="darkMode ? `bg-secondary`: `bg-white`"
       @scroll="onScroll" ref="feed">
    <template v-if="token">
      <Story/>
    </template>
    <template v-else>
      <Signin/>
    </template>
    <NewFeed
        :showScrollTop="showScrollTop"
        @goToTop="goToTop"/>
    <div class="fixed left-0 w-full h-12 bottom-0 z-50 flex justify-end items-center px-2 " v-if="showScrollTop">
      <div class="w-10 h-10 rounded-full bg-primary flex justify-center items-center cursor-pointer" @click="goToTop()">
        <ScrollTopIcon fill="#FFF" :size="28"/>
      </div>
    </div>
    <div class="h-40"></div>
  </div>
</template>

<script>

import FilterList from "./Filter/FilterList.vue"
import NewFeed from "./Video/NewFeed.vue"
import Story from "./Story/Story.vue"
import {mapActions, mapState} from "vuex"
import Signin from "./Component/Signin.vue"
import ScrollTopIcon from "../components/ScrollTopIcon";

export default {
  data() {
    return {
      enableScroll: true,
      showScrollTop: false,
      page: 1,
    }
  },
  components: {
    ScrollTopIcon,
    Story,
    FilterList,
    NewFeed,
    Signin
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['token'])
  },
  methods: {
    ...mapActions('social', ['getMoreSocial']),
    goToTop() {
      this.$refs.feed.scrollTop = 0;
    },

    onScroll: function ({target: {scrollTop, clientHeight, scrollHeight}}) {
      this.scrollTop = scrollTop
      if (!scrollTop) {
        this.showScrollTop = false
      }

      if (scrollTop > 300) {
        this.showScrollTop = true
      }

      if (scrollTop + clientHeight >= scrollHeight) {
        this.page++
        if (this.enableScroll) {
          this.getMoreSocial({
            p: this.page
          }).then(res => {
            if (res.data.length <= 0) {
              this.enableScroll = false
            }
          })
        }

      }
    }
  }
}
</script>
