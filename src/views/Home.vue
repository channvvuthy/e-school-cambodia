<template>
  <div class="overflow-y-scroll h-screen"
       :class="darkMode ? `bg-secondary`: `bg-white`"
       @scroll="onScroll" ref="feed" id="feed">
    <template v-if="token">
      <Story></Story>
    </template>
    <template v-else>
      <Signin></Signin>
    </template>
    <NewFeed
        @loadMore="loadMore"
        :showScrollTop="showScrollTop"
        @goToTop="goToTop"></NewFeed>
    <div class="h-40" ></div>
  </div>
</template>

<script>

import FilterList from "./Filter/FilterList.vue"
import NewFeed from "./Video/NewFeed.vue"
import Story from "./Story/Story.vue"
import {mapActions, mapState} from "vuex"
import Signin from "./Component/Signin.vue"
import helper from "./../helper/helper"

export default {
  data() {
    return {
      enableScroll: true,
      showScrollTop: false,
    }
  },
  components: {
    Story,
    FilterList,
    NewFeed,
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
        if (response.data.data.list !== undefined && response.data.data.list.length <= 0) {
          helper.success('no_more_result')
        }
      })

    },
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

        if (this.enableScroll) {
          this.$store.commit('setting/setPagination', this.page + 1)
          this.getListPagination({
            filter_id: this.filter_id,
            s: this.s,
            p: this.page
          }).then(response => {
            try {
              if (response.data.data.list.length === 0) {
                this.enableScroll = false
                this.$store.commit('setting/setPagination', 1)
              }
              // eslint-disable-next-line no-empty
            } catch (err) {

            }
          })
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
