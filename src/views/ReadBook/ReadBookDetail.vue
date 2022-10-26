<template>
  <div>
    <div class="mb-5">
      <eHeader :user="courseDetail.user"></eHeader>
    </div>
    <div class="overflow-y-scroll pb-40 h-screen">
      <div class="px-5 mt-5">
        <div v-if="loading">
          <Loading></Loading>
        </div>
        <div class="flex justify-between" v-else>
          <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"
               class="rounded-xl shadow-md px-10 text-center py-20 w-2/5 flex flex-col">
            <div class="font-bold text-xl mb-10" :class="darkMode?`text-white`:`text-primary`">
              {{ $t('study_graph') }}
            </div>
            <div class="progressBookDetail">
              <div>
                <div class="relative z-50 flex justify-between" style="top:170px;">
                  <div class="text-xs -ml-1" :class="darkMode?`text-gray-400`:`text-gray-500`">0%</div>
                  <div class="text-xs -mr-3" :class="darkMode?`text-gray-400`:`text-gray-500`">100%</div>
                </div>
                <div class="barOverflowBookDetail">
                  <div class="barBookDetail"
                       :style="{transform:`rotate(${45+(Math.round($route.params.percentage)*1.8)}deg)`}"></div>
                </div>
                <span class="text-3xl font-black relative -top-5">
                                    {{ Math.round($route.params.percentage) }}%
                                </span>
              </div>
            </div>
          </div>
          <div class="w-5"></div>
          <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"
               class="rounded-xl shadow-md p-5 w-full flex flex-col overflow-y-scroll pb-40 h-full">
            <div v-for="(list, index) in courseDetail.list" :key="index"
                 :class="darkMode?`bg-button mb-5`:`bg-dadada mb-5`" class="rounded-xl p-5">
              <div class="my-4 font-semibold text-base">{{ list.title }}</div>
              <div class="w-full h-1 border-t border-gray-400 mt-5 border-dashed my-4"></div>
              <div class="flex justify-between items-center">
                <div class="h-4 w-full rounded-full mr-5 my-4" :class="darkMode?`bg-byline`:`bg-gray-400`">
                  <div :class="darkMode?`bg-pass`:`bg-primary`" class="rounded-full h-4"
                       :style="{width:`${list.percentage}%`}"></div>
                </div>
                <div>100%</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import eHeader from "./../Activity/components/eHeader.vue"
import Loading from "./../../components/Loading.vue"
import {mapActions, mapState} from "vuex"

export default {
  components: {
    eHeader,
    Loading,
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('auth', ['stProfile']),
    ...mapState('summary', ['loading', 'courseDetail'])
  },
  data() {
    return {
      page: 1,
      enableScroll: true,
      filter_id: "",
      s: ""
    }
  },
  methods: {
    ...mapActions('summary', ['getCourseDetail']),
    enableUserScroll() {

    }
  },
  created() {
    let payload = {}
    payload.id = this.$route.params.id
    payload.course_id = this.$route.params.course_id
    this.getCourseDetail(payload)
  }
}
</script>
<style>
.progressBookDetail {
  position: relative;
  margin: 4px;
  float: left;
  text-align: center;
}

.barOverflowBookDetail { /* Wraps the rotating .bar */
  position: relative;
  width: 290px;
  height: 145px; /* Half circle (overflow) */
  margin-bottom: -14px; /* bring the numbers up */
  overflow: hidden;
}

.barBookDetail {
  position: absolute;
  top: 0;
  left: 0;
  width: 290px;
  height: 290px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 10px solid #c9c9c9;
  border-bottom-color: #bfca33 !important;
  border-right-color: #bfca33 !important;
  transform: rotate(135deg);
}
</style>