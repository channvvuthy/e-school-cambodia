<template>
  <div>
    <ReadingBook v-if="reading" @closeReading="closeReading"></ReadingBook>
    <LibraryAudio v-if="showAudio"></LibraryAudio>

    <div :class="darkMode ?`bg-youtube` : `bg-gray-50`" class="p-5 h-screen overflow-y-scroll">
      <div class="w-9/12" :class="darkMode ?`bg-youtube text-textSecondary` : `bg-white shadow rounded-b-xl`">
        <div class="relative" :class="darkMode ? ``: `bg-gradient-to-t from-gray-100`">
          <img :src="details.book.thumbnail" class="m-auto max-w-sm">
          <div class="w-full absolute left-0 -bottom-5 flex justify-center">
            <button
                @click="readingBook"
                v-if="type === 'pdf'"
                class="flex items-center justify-center bg-primary text-white w-7/12 py-2 outline-none rounded-full shadow text-xl">
              <ReadingBookIcon fill="#fff" :size="35"></ReadingBookIcon>
              <span class="ml-3">{{ $t('read_book') }}</span>
            </button>

            <button
                @click="listenAudio"
                v-if="type === 'sound'"
                class="flex items-center justify-center bg-primary text-white w-7/12 py-2 outline-none rounded-full shadow text-xl">
              <HeadphoneIcon fill="#fff" :size="35"></HeadphoneIcon>
              <span class="ml-3">{{ $t('2208') }}</span>
            </button>

            <button
                @click="listVideo"
                v-if="type === 'video'"
                class="flex items-center justify-center bg-primary text-white w-7/12 py-2 outline-none rounded-full shadow text-xl">
              <VideoCameraIcon fill="#fff" :size="35"></VideoCameraIcon>
              <span class="ml-3">{{ $t('1117') }}</span>
            </button>
          </div>
        </div>
        <div class="my-10 px-5 border-b" :class="darkMode ? `border-secondary` : ``">
          <div class="font-bold text-2xl">{{ details.book.title }}</div>
          <div class="flex justify-between items-center my-5">
            <div class="text-lg">
              <template v-if="details.price.highlight">
                {{ $t('1006') }}:
                <span class="mr-3">$ <del>
                        {{ khmerNumber(details.price.highlight) }}</del></span>
                <span class="text-red-600 font-semibold">$ {{ khmerNumber(details.price.year) }}</span>
              </template>
              <template v-else>
                <span>{{ $t('1007') }}</span>
              </template>
            </div>

            <div class="flex items-center">
              <Eye :height="30"></Eye>
              <span v-if="loading">
              <Loader :size="10" bg="#000"></Loader>
            </span>
              <span v-else>
              <span class="pl-2">
              {{ kFormatter(details.book.view) }}
            </span>
            </span>
            </div>

            <div class="cursor-pointer">
              <div v-if="details.is_favorite">
                <FavoriteFill fill="#c0272d"></FavoriteFill>
              </div>
              <div v-else @click="addToFavorite">
                <FavoriteIcon :size="30"></FavoriteIcon>
              </div>
            </div>

          </div>
        </div>

        <div class="flex items-center justify-center my-10 pb-5" v-if="!loading">
          <div class="progressVideoDetail flex items-center justify-center">
            <div>
              <div class="barOverflowVideoDetail">
                <div class="reportDetail"
                     :style="{transform:`rotate(${45+(Math.round(report('percentage'))*1.8)}deg)`}"></div>
              </div>
              <div class="absolute w-full top-0 h-full flex flex-col justify-end items-center">
                <div class="text-xl">
                  {{ $t('1117') }}
                </div>
                <div class="font-bold text-3xl mt-2">
                  {{ report('watch') }}/{{ report('total') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t p-5" :class="darkMode ?`border-secondary` : ``">
          <div v-html="details.book.des"></div>
        </div>
      </div>
      <div class="h-40"></div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import Eye from "@/components/Eye";
import helper from "@/helper/helper";
import Loader from "@/components/Loader";
import FavoriteIcon from "@/components/FavoriteIcon";
import FavoriteFill from "@/components/FavoriteFill";
import ReadingBookIcon from "@/components/ReadingBookIcon";
import HeadphoneIcon from "@/components/HeadphoneIcon";
import VideoCameraIcon from "@/views/Video/components/VideoCameraIcon";
import ViewBook from "@/views/Library/components/book/ViewBook";
import ReadingBook from "@/views/Library/components/book/ReadingBook";
import LibraryAudio from "@/views/Library/Audio"

export default {
  components: {
    ReadingBookIcon,
    Eye,
    VideoCameraIcon,
    HeadphoneIcon,
    Loader,
    FavoriteIcon,
    FavoriteFill,
    LibraryAudio,
    ReadingBook,
    ViewBook
  },
  data() {
    return {
      showAudio: false,
      reading: false,
      preview: false,
      detail: {},
      loading: false,
      payload: {
        id: null,
        package_id: null,
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('library', ['details', 'type']),
  },
  methods: {
    ...mapActions('favorite', ['add']),
    shopNow() {
      this.preview = false
      let payload = {}
      payload.id = this.details._id

      this.addCart(payload).then(() => {
        this.getCart()
        let myCart = document.getElementById("myCart")
        myCart.click()
      })
    },
    listenAudio() {
      this.showAudio = false
      setTimeout(() => {
        this.showAudio = true
      }, 100)
      this.close()
    },
    listVideo() {
      this.$router.push('library-video')
      this.close()
    },
    close() {
      this.preview = false
    },
    readingBook() {
      this.reading = true
      this.showAudio = false
      this.close()
    },
    closeReading() {
      this.reading = false
    },
    addToFavorite() {
    },
    report(field) {
      try {
        return this.details.book.report_watch[field]
      } catch (err) {
        return 0
      }
    },
    kFormatter(view) {
      return helper.kFormatter(view)
    },
    reportWatch() {
      try {
        return this.details.book.report_watch.watch + `/` + this.details.book.report_watch.total
      } catch (err) {
        return '0/0'
      }
    },
    khmerNumber(str) {
      if (this.$i18n.locale === 'kh') {
        return helper.khmerNumber(str)
      }
      return str
    }
  },
}
</script>
<style>
.progressVideoDetail {
  position: relative;
  margin: 4px;
  float: left;
  text-align: center;
}

.barOverflowVideoDetail { /* Wraps the rotating .bar */
  position: relative;
  width: 290px;
  height: 145px; /* Half circle (overflow) */
  margin-bottom: -14px; /* bring the numbers up */
  overflow: hidden;
}

.reportDetail {
  position: absolute;
  top: 0;
  left: 0;
  width: 290px;
  height: 290px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 15px solid #c9c9c9;
  border-bottom-color: #055174;
  border-right-color: #055174;
}
</style>