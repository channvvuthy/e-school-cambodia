<template>
  <div class="overflow-y-scroll h-screen"
       :class="darkMode ? `bg-secondary`: `bg-white`"
       @scroll="onScroll" ref="feed">
    <template v-if="token">
      <Story></Story>
    </template>
    <template v-else>
      <Signin></Signin>
    </template>
    <NewFeed
        :showScrollTop="showScrollTop"
        @goToTop="goToTop"></NewFeed>
    <div class="h-40"></div>
  </div>
</template>

<script>

import FilterList from "./Filter/FilterList.vue"
import NewFeed from "./Video/NewFeed.vue"
import Story from "./Story/Story.vue"
import {mapActions, mapState} from "vuex"
import Signin from "./Component/Signin.vue"

export default {
  data() {
    return {
      enableScroll: true,
      showScrollTop: false,
      page: 1,
    }
  },
  components: {
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
