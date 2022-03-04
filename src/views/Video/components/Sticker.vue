<template>
  <div
      :class="darkMode ? `bg-secondary border-button` : `bg-white`"
      class="border fixed right-5 bottom-20 w-96 h-1/2 z-50 rounded-xl shadow-lg flex flex-col justify-between">
    <div class="px-3 h-14 flex items-center border-b"
         :class="darkMode ? `border-button` : `border-forum`"
    >
      <!-- Header -->
      <div v-if="!loading" class="flex w-full overflow-x-scroll">
        <div class="text-lg px-3 rounded-full py-0.5 cursor-pointer"
             @click="allSticker"
             :class="active == `all` ? `bg-primary text-white` : ``"
        >
          {{ $t('all') }}
        </div>
        <div v-for="(sticker, index) in stickers.filter"
             :class="active == index ? `bg-primary text-white` : ``"
             @click="filterSticker(sticker, index)"
             :key="index" class="px-3 rounded-full py-0.5 flex items-center justify-center">
          <img :src="sticker.icon" :alt="sticker.name" class="w-6 cursor-pointer">
        </div>
      </div>
      <!-- End header -->
    </div>
    <!-- List sticker -->
    <div class="p-3 h-full overflow-y-scroll" ref="feed" @scroll="onScroll">
      <div v-if="loadingSticker">
        <div v-for="i in 3" class="w-full box-loading mb-5" :key="i">
          <div class="flex flex-col justify-between">
            <div class="line-1"></div>
            <div class="line-2 mt-3"></div>
            <div class="line-3 mt-3"></div>
            <div class="line-4 mt-3"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-4" v-else>
        <div v-for="(sticker, index) in stickers.list" :key="index">
          <div class="cursor-pointer" @click="selectSticker(sticker)">
            <img :src="sticker.sticker.name" :alt="sticker._id">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "Sticker",
  data() {
    return {
      loading: false,
      active: 'all',
      payload: {
        p: 1,
        filter_id: '',
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('sticker', ['stickers', 'loadingSticker']),
  },
  methods: {
    ...mapActions('sticker', ['getSticker', 'getMoreSticker']),
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.payload.p++
        this.getMoreSticker(this.payload)
      }
    },
    allSticker() {
      this.active = 'all'
      this.getSticker({})
    },
    filterSticker(sticker, index) {
      this.payload.filter_id = sticker._id
      this.active = index
      this.payload.p = 1
      this.getSticker(this.payload)
    },
    selectSticker(sticker) {
      this.$emit("selectSticker", sticker)
    }
  },
  created() {
    this.loading = true
    this.getSticker({}).then(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>
.overflow-x-scroll::-webkit-scrollbar {
  display: none;
}
</style>