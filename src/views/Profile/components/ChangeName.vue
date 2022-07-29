<template>
  <Modal width="w-100">
    <div class="p-5 h-1/3 overflow-y-scroll">
      <div class="font-black flex justify-between">
        <div class="w-full text-center text-lg">
          ទម្រង់ស្នើរសុំប្តូរឈ្មោះ
        </div>
        <div class="cursor-pointer" @click="()=>{this.$emit('close')}">
          <CloseIcon/>
        </div>
      </div>
      <div class="mt-2">
        ការស្នើរសុំប្តូរឈ្មោះ អ្នកប្រើប្រាស់ឈ្មោះពិត ឬប្រើពត៍មានពិត
      </div>
      <div class="my-5">
        <input type="text" class="bg-transparent border-b w-full" ref="first_name"
               :class="darkMode ? `border-button` : ``"
               :value="stProfile.first_name">
      </div>
      <div>
        <input type="text" class="bg-transparent border-b w-full" ref="last_name"
               :class="darkMode ? `border-button` : ``"
               :value="stProfile.last_name">
      </div>
      <div class="my-10">
        <div
            :class="darkMode ? `border-button` : ``"
            class="border-b py-3">ប្រវត្តិនៃការប្តូរឈ្មោះ
        </div>
        <div v-if="names.length">
          <div v-for="(name, index) in names" :key="index"
               :class="darkMode ? `border-button` : ``"
               class="border-b py-2 flex justify-between items-center">
            <div>
              <div class="font-black">{{ name.name }}</div>
              <div
                  :class="darkMode ? `` : `text-gray-400`"
                  class="text-sm">{{ dateFormat(name.date) }}
              </div>
            </div>
            <div class="w-2 h-2 rounded-full" :class="status(name.status)"></div>
          </div>
        </div>
      </div>
      <button
          :disabled="loading"
          @click="updateName"
          class="relative bg-primary w-full rounded-lg text-white py-3 text-center outline-none">
        <div v-if="!loading">
          {{ $t('submit') }}
        </div>
        <div v-else>
          <div>&nbsp;</div>
          <div class="absolute -top-1 flex items-center justify-center w-full">
            <div class="loader"></div>
          </div>
        </div>
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../../components/Modal";
import CloseIcon from "../../../components/CloseIcon";
import helper from "../../../helper/helper";
import moment from "moment";
import {mapState} from "vuex"


export default {
  components: {
    CloseIcon,
    Modal
  },
  data() {
    return {
      loading: false,
      names: []
    }
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile'])
  },
  methods: {
    updateName() {
      this.loading = true
      let user = {
        first_name: this.$refs.first_name.value,
        last_name: this.$refs.last_name.value
      }
      this.$store.dispatch("auth/updateName", user).then(res => {
        this.loading = false
        this.$emit('close')
        if (res.msg) {
          helper.errorMessage(res.msg)
          return
        }
        helper.success('review_change_name')
      })
    },
    dateFormat(date) {
      return moment(date).format('MMM DD YYYY')
    },
    status(status) {
      if (status == 1) {
        return "bg-primary"
      }
      if (status == 2) {
        return "bg-yellow-500"
      }
      if (status == 3) {
        return "bg-red-500"
      }
    }
  },
  mounted() {
    this.$store.dispatch("auth/getNames").then(res => {
      if (res.data) {
        this.names = res.data
      }
    })
  }
}
</script>

<style scoped>

</style>