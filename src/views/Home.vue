<template>
  <div class="mt-3 overflow-y-scroll pb-40 h-screen"
       :class="darkMode ? `bg-youtube`: ``"
       @scroll="onScroll" ref="feed" id="feed">
    <template v-if="token">
      <Story></Story>
    </template>
    <template v-else>
      <Signin></Signin>
    </template>
    <FilterList @filterSearch="filterSearch"></FilterList>
    <VideoList @loadMore="loadMore" :showScrollTop="showScrollTop" @goToTop="goToTop"></VideoList>
  </div>
</template>

<script>
// @ is an alias to /src

import FilterList from "./Filter/FilterList.vue"
import VideoList from "./Video/VideoList.vue"
import Story from "./Story/Story.vue"
import {mapActions, mapState} from "vuex"
import Signin from "./Component/Signin.vue"
import helper from "./../helper/helper"

export default {
  name: 'Home',
  data() {
    return {
      enableScroll: true,
      showScrollTop: false,
    }
  },
  components: {
    Story,
    FilterList,
    VideoList,
    Signin
  },
  computed: {
    ...mapState('home', ['filter_id', 's']),
    ...mapState('setting', ['page', 'darkMode']),
    ...mapState('auth', ['token'])
  },
  methods: {
    ...mapActions('home', ['getList', 'getListPagination']),
    loadMore() {
      this.$store.commit('setting/setPagination', this.page + 1)
      this.getListPagination({
        filter_id: this.filter_id,
        s: this.s,
        p: this.page
      }).then(response => {
        if (response.data.data.list != undefined && response.data.data.list.length <= 0) {
          helper.success('no_more_result')
        }
      })

    },
    goToTop() {
      this.$refs.feed.scrollTop = 0;
    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (!scrollTop) {
        this.showScrollTop = false
      }

      if (scrollTop > 300) {
        this.showScrollTop = true
      }

      if (scrollTop + clientHeight >= scrollHeight) {

        if (this.enableScroll) {
          this.$store.commit('setting/setPagination', this.page + 1)
          this.getListPagination({
            filter_id: this.filter_id,
            s: this.s,
            p: this.page
          }).then(response => {
            try {
              if (response.data.data.list.length == 0) {
                this.enableScroll = false
                this.$store.commit('setting/setPagination', 1)
              }
              // eslint-disable-next-line no-empty
            } catch (err) {

            }
          })
        }
      }
    },
    filterSearch(list) {
      if (list.data.data.list.length != undefined) {
        // eslint-disable-next-line no-empty
        if (list.data.data.list.length < 1) {
        }
      }

    }
  },
  created() {
    this.getList({
      filter_id: this.filter_id
    })
  }
}
</script>
