<template>
  <div class="fixed flex items-center justify-center z-50 w-full h-full top-0 left-0 bg-black bg-opacity-90">
    <div class="w-1/2">
      <div @click="closeTermAndCondition"
           :class="darkMode?`bg-secondary text-gray-400`:`bg-gray-100 text-youtube border-t`"
           class="p-5 rounded-xl relative shadow-md">
        <div class="absolute -top-5 -right-3 cursor-pointer w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow"
             @click="closeTermAndCondition">
          <CloseIcon fill="#FFF" :width="25"></CloseIcon>
        </div>
        <div class="w-7 h-7 bg-white absolute left-7 top-6"></div>
        <div v-if="loadingTerm" class="p-5 flex items-center justify-center h-85">
          <div class="loader"></div>
        </div>
        <div v-else style="height: 80vh; overflow-y: scroll">
          <iframe src="https://admin.e-schoolcambodia.com/page/social_privacy" class="h-full w-full"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from "./../../../components/CloseIcon.vue"
import {mapActions, mapState} from "vuex"

export default {
  name: "TermAndCondition",
  components: {
    CloseIcon
  },
  data() {
    return {
      term: ""
    }
  },
  props: {
    size: {
      type: Number,
      default: () => {
        return 96;
      }
    }
  },

  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('view', ['termAndCondition', 'loadingTerm'])
  },

  created() {
    this.getTerm().then(response => {
      let str = response.split('</section>')[0]
      str = str.substring(str.indexOf('login-signup">'))
      str = str.replace('login-signup">', '')
      this.term = str
    })
  },
  methods: {
    ...mapActions('view', ['getTerm']),

    closeTermAndCondition() {
      this.$emit("closeTermAndCondition")
    }
  }
}
</script>

<style lang="scss">
h3 {
  font-size: 1.2em;
  margin: 5px 0px 15px 0px;
  font-weight: 800;

  + {
    p {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
}

ol {
  list-style-type: decimal !important;
  padding: 20px;

  li {
    font-weight: bold;

    p {
      text-indent: 20px;
      margin: 10px 0px;
      font-size: 12px;
      font-weight: normal;
    }
  }
}


</style>
