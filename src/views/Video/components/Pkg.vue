<template>
  <div class="p-5 border-b-2 border-dashed" :class="darkMode ? `border-left` : ``">
    <vue-horizontal :button="false">
      <section v-for="(pkg, index) in packages" :key="index" class="mr-5">
        <div class="flex items-end h-56 w-96 bg-cover relative" :style="{backgroundImage:`url(${pkg.thumbnail})`}">

          <div class="absolute top-3 left-3" v-if="pkg.is_buy">
            <div class="h-7 w-7 rounded-full flex justify-center items-center text-white text-lg"
                 :class="darkMode?`bg-primary`:`bg-primary`">
              <span>✓</span>
            </div>
          </div>

          <div class="absolute w-full h-full bg-gradient-to-t from-black cursor-pointer" @click="pkgDetail(pkg)"></div>
          <div class="px-5 py-3 text-white relative z-50 w-full">
            <div class="text-lg">{{ khmerNumber(pkg.title) }}</div>
            <div class="flex mt-1 items-center justify-between w-full text-sm">
              <div class="font-semibold">{{ $i18n.locale == 'en' ? pkg.total_item : khmerNumber(pkg.total_item) }}
                {{ $t('1102') }}{{ plural(pkg.total_item) }}
              </div>
              <div class="h-3 w-0 border-l border-white mx-4"></div>
              <div class="font-semibold">
                {{ $t('1006') }}: <span class="text-red-500 text-lg">{{
                  $i18n.locale == 'en' ? pkg.price.year : khmerNumber(pkg.price.year)
                }}$</span>
              </div>
              <div class="flex-1 flex justify-end">
                  <span class="cursor-pointer" :id="pkg._id" @click="addToCart(pkg)">
                      <CartIcon fill="#FFFFFF" v-if="!pkg.is_in_cart"></CartIcon>
                  </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </vue-horizontal>
  </div>
</template>
<script>
import moment from "moment"
import VueHorizontal from 'vue-horizontal';
import CartIcon from "./../../../components/CartIcon.vue"
import {mapActions, mapState} from "vuex"
import helper from "@/helper/helper";

export default {
  components: {
    VueHorizontal,
    CartIcon
  },
  props: {
    packages: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('cart', ['addCart', 'getCart']),
    plural(number) {
      if (this.$i18n.locale == 'en') {
        if (number > 1) {
          return 's'
        }
      }
      return ''
    },
    khmerNumber(str) {
      if (this.$i18n.locale == 'kh') {
        return helper.khmerNumber(str)
      }
      return str
    },
    formatDate(date) {
      moment.locale('en');
      return moment(date).format('ll');
    },
    async addToCart(pk) {
      let payload = {}

      payload.id = pk._id
      await this.addCart(payload).then(() => {
        this.getCart()
      })
    },
    pkgDetail(pkg) {
      this.$router.push({
        name: "packages",
        params: {
          pkg
        }
      })
    }
  },
  created() {

  }
}
</script>
