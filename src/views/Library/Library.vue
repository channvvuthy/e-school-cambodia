<template>
  <div>
    <ViewBook
        v-if="preview" @close="close"
        @readingBook="readingBook"
        @listenAudio="listenAudio"
        @listVideo="listVideo"
        @shopNow="shopNow"
        :is_favorite="true"/>
    <ReadingBook
        v-if="reading"
        @closeReading="closeReading"/>
    <LibraryAudio
        v-if="showAudio"/>
    <div class="mt-3 overflow-y-scroll h-screen text-sm pb-72" @scroll="onScroll">
      <div class="px-5 pt-7 shadow-md"
           :class="darkMode?`bg-secondary border-t border-b border-button text-gray-300`:`bg-white text-black`">
        <FilterData/>
        <!-- Tab -->
        <div class="mt-7" v-if="!showList">
          <div class="flex justify-start">
            <div @click="changeType('pdf')" class="cursor-pointer  w-12 text-center"
                 :class="type==`pdf`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
              <div class="pb-2">{{ $t('2202') }}</div>
              <div v-if="type === `pdf`">
                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
              </div>
            </div>
            <div @click="changeType('sound')" class="cursor-pointer ml-20 w-24 text-center"
                 :class="type==`sound`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
              <div class="pb-2">{{ $t('2204') }}</div>
              <div v-if="type === `sound`">
                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
              </div>
            </div>
            <div @click="changeType('video')" class="cursor-pointer ml-20 w-24 text-center"
                 :class="type==`video`?`font-bold text-primary ${darkMode?'text-white':''}`:``">
              <div class="pb-2">{{ $t('2205') }}</div>
              <div v-if="type === `video`">
                <BorderBottom :bg="darkMode?`bg-white`:`bg-primary`" :h="2"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Filter list -->
      <div class="mx-5">
        <FilterList v-if="showList" @filterLibrary="filterLibrary($event)"/>
      </div>
      <!-- Membership -->
      <div class="mt-5" :class="darkMode?`bg-youtube`:`transparent`">
        <div class="mt-10">
          <Membership @getDetail="getPackage($event)"/>
        </div>
      </div>
      <div class="border-t border-dashed w-full my-10" :class="darkMode?`border-button`:`border-gray-300`"
           v-if="libraries.package && libraries.package.length"></div>
      <!-- Loading -->
      <div class="px-5" v-if="loading">
        <Loading/>
      </div>
      <!-- Book -->
      <div class="mx-5" v-else>
        <div v-if="(libraries.list == undefined || libraries.list.length <= 0)" class="h-screen pb-60"
             style="display:block;">
          <Empty/>
        </div>
        <div class="grid gap-6"
             :class="type != `sound`?`${isHide?`md:grid-cols-3 2xl:grid-cols-4`:`md:grid-cols-2 2xl:grid-cols-3`}`:`md:grid-cols-2`">
          <div v-for="(book, index) in libraries.list" :key="index">
            <!-- Book & Video -->
            <template v-if="type != 'sound'">
              <div class="flex rounded-xl shadow p-4" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <img :src="book.thumbnail" class="rounded-xl max-h-36 cursor-pointer" @click="getDetail(book)"/>

                <div class="px-3 flex flex-col justify-between">
                  <div>
                    <div class="text-sm cursor-pointer" @click="getDetail(book)">
                      {{ cutString(book.title, 30) }}
                    </div>
                    <div v-if="book.des" class="text-xs my-2">{{ cutString(book.des, 150) }}</div>
                  </div>
                  <div class="text-xs"><span v-if="book.price.year">{{ $t('1006') }}:</span>
                    <span
                        :class="darkMode?``:`text-heart`">{{
                        book.price.year ? `${book.price.year}$` : `${$t('1007')}`
                      }}</span>
                  </div>
                </div>
                <div class="flex flex-col justify-end flex-1 items-end">
                  <div v-if="book.price.year" @click="addToCart(book)" class="cursor-pointer">
                    <div v-if="!book.is_in_cart">
                      <CartIcon :fill="darkMode?`#909090`:`#4A4A4A`"/>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex rounded-xl shadow p-4" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <img :src="book.thumbnail" class="rounded-xl max-h-36 cursor-pointer" @click="getDetail(book)"/>

                <div class="px-3 flex flex-col justify-between">
                  <div>
                    <div class="text-sm cursor-pointer" @click="getDetail(book)">
                      {{ cutString(book.title, 30) }}
                    </div>
                    <div v-if="book.des" class="text-xs my-2">{{ cutString(book.des, 150) }}</div>
                  </div>
                  <div class="text-xs"><span v-if="book.price.year">{{ $t('1006') }}:</span>
                    <span
                        :class="darkMode?``:`text-heart`">{{
                        book.price.year ? `${book.price.year}$` : `${$t('1007')}`
                      }}</span>
                  </div>
                </div>
                <div class="flex flex-col justify-end flex-1 items-end">
                  <div v-if="book.price.year" @click="addToCart(book)" class="cursor-pointer">
                    <div v-if="!book.is_in_cart">
                      <CartIcon :fill="darkMode?`#909090`:`#4A4A4A`"/>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <BuyMsg
        v-if="showMsg"
        :msg="msg" @cancelModal="() => {this.showMsg = false}"
        @yes="yes"/>
  </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import FilterData from "./components/Filter.vue"
import FilterList from "./components/FilterList.vue"
import Membership from "./components/Membership.vue"
import CartIcon from "./../../components/CartIcon.vue"
import Loading from "./../../components/Loading.vue"
import NewIcon from "./../../components/NewIcon.vue"
import ViewBook from "./components/book/ViewBook.vue"
import ReadingBook from "./components/book/ReadingBook.vue"
import BorderBottom from "./../../components/BorderBottom.vue"
import LibraryAudio from "./Audio.vue"
import helper from "./../../helper/helper"
import BuyMsg from "./../Component/BuyMsg.vue"
import Empty from "./../Component/Empty.vue"

export default {
  components: {
    FilterData,
    Membership,
    FilterList,
    CartIcon,
    Loading,
    NewIcon,
    ViewBook,
    ReadingBook,
    LibraryAudio,
    BorderBottom,
    BuyMsg,
    Empty
  },
  data() {
    return {
      filter_id: null,
      minHeight: 0,
      page: 1,
      enableScroll: true,
      preview: false,
      reading: false,
      showAudio: false,
      isPackage: false,
      packageId: null,
      showMsg: false,
      msg: "2006",
      pk: {},
    }
  },
  computed: {
    ...mapState('setting', ['darkMode', 'isHide']),
    ...mapState('cart', ['carts']),
    ...mapState('library', ['loading', 'libraries', 'showList', 'details', 'type'])
  },
  methods: {
    ...mapActions('library', ['getLibrary', 'getLibraryPagination', 'getLibraryDetail', 'getMyPackage']),
    ...mapActions('cart', ['addCart', 'getCart']),
    ...mapActions('favorite', ['addFavoriteBook', 'removeFavoriteBook']),
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    filterLibrary(library) {
      this.filter_id = library._id
      let filter = {}

      if (library) {
        filter.filter_id = library._id
      }
      if (!this.isPackage) {
        filter.type = this.type
        this.getLibrary(filter).then(() => {
          this.$store.commit("library/showFilterList", this.showList)
        })
      } else {
        filter.id = this.packageId
        this.getMyPackage(filter).then(() => {
          this.$store.commit("library/showFilterList", this.showList)
        })
      }
    },

    changeType(type) {
      this.showAudio = false
      this.$store.commit("library/setType", type)
      let filter = {
        type: this.type
      }

      if (this.filter_id != null) {
        filter.filter_id = this.filter_id
      }

      if (this.isPackage) {
        delete filter.filter_id
        this.isPackage = false
      }

      this.getLibrary(filter)

    },
    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.page++
        let payload = {}
        if (this.filter_id != null) {
          payload.filter_id = this.filter_id
        }
        if (this.type) {
          payload.type = this.type
        }
        payload.p = this.page


        if (this.enableScroll) {
          if (this.isPackage) {
            this.getMyPackage({
              id: this.pk._id,
              type: this.type,
              p: this.page
            }).then(res => {
              if (res.data.data.list.length <= 0) {
                this.enableScroll = false
              }
            })
            return
          }
          this.getLibraryPagination(payload).then(res => {
            if (res.data.data.list.length <= 0) {
              this.enableScroll = false
            }
          })
        }

      }
    },
    getDetail(library) {
      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        return;
      }
      let payload = {
        id: library._id
      }
      if (this.packageId !== null) {
        payload.package_id = this.packageId
      }
      this.getLibraryDetail(payload).then(() => {
        this.$router.push({
          name: 'book-overview'
        })
      })
    },
    yes() {
      this.$router.push('login');
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
    getLibraryBook() {
      this.page = 1
      this.getLibrary({
        type: this.type
      })
    },
    getPackage(pk) {
      this.enableScroll = true
      this.page = 1
      this.pk = pk
      this.isPackage = true
      this.packageId = pk._id
      this.getMyPackage({
        id: pk._id,
        type: this.type,
        p: this.page
      })
    },
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
    addToCart(book) {
      if (localStorage.getItem('token') === null) {
        this.showMsg = true
        return;
      }
      let payload = {}
      payload.id = book._id
      this.addCart(payload).then(() => {
        this.getCart()
      })
      this.$store.commit("library/addToCart", book._id)
    },
    addToFavorite(book) {
      this.addFavoriteBook(book._id).then(() => {
        this.$store.commit("library/addToFavorite", book._id)
      })
    },
    removeFromFavorite(book) {
      this.removeFavoriteBook(book.filter_id).then(() => {
        this.$store.commit("library/removeFromFavorite", book._id)
      })
    },
    matchHeight() {
      let arr = []
      let interval = setInterval(() => {
        let box = document.getElementsByClassName('view')
        if (box) {
          for (let i = 0; i < box.length; i++) {
            arr.push(box[i].clientHeight)
          }
          this.minHeight = Math.max(...arr)
          clearInterval(interval)

        }
      }, 1000)
    },
  },
  created() {
    this.getLibraryBook()
  },
  updated() {
    this.matchHeight()
  },
  watch: {
    'type': function (type) {
      if (type === 'sound') {
        this.$nextTick(() => {
          this.matchHeight()
        })

      }
    }
  }

}
</script>