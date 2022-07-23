<template>
  <div>
    <div class="py-5 px-3 text-sm " :class="darkMode?`bg-youtube text-gray-400`:`bg-gray-50 border-t`">
      <div v-if="loadingTerm " class="flex justify-center items-center h-screen relative -top-5">
        <h1 class="text-sm font-semibold font-khmer_os relative -top-10">
          <loading/>
        </h1>
      </div>
      <div class="relative px-3 h-screen pb-40 relative" v-else>
        <div class="w-56 h-7 bg-white absolute left-5 top-0"></div>
        <iframe src="https://admin.e-schoolcambodia.com/page/social_privacy" class="h-full w-full"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import Loading from "./../../components/Loading"
import eHeader from "./../Video/components/Header.vue"

export default {
  name: "TermAndCondition",
  data() {
    return {
      term: ""
    }
  },
  components: {
    Loading,
    eHeader
  },
  computed: {
    ...mapState('view', ['termAndCondition', 'loadingTerm']),
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('view', ['getTerm']),
  },

  created() {
    this.getTerm().then(response => {
      let str = response.split('</section>')[0]
      str = str.substring(str.indexOf('login-signup">'))
      str = str.replace('login-signup">', '')
      this.term = str

    })
  },
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
