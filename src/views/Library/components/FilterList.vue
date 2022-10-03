<template>
  <div :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" class="pb-3">
    <div class="grid grid-cols-3 gap-x-10 gap-y-5 font-medium mt-2">
      <div class="px-5 cursor-pointer flex justify-between items-center border-b py-3"
           :class="darkMode?`border-button`:`border-primary`" @click="filterLibrary('')">
        <div class="rounded-full flex justify-center items-center w-8 h-8" :class="darkMode?`bg-youtube`:`bg-primary`">
          <WatchVideoIcon fill="#fff" :size="18"></WatchVideoIcon>
        </div>
        <div class="text-left flex-1 ml-5" :class="darkMode ? `text-gray-300` : ``">{{ $t('all') }}</div>
        <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
          <div class="w-2 h-2 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"
               v-if="filter_id === `all` || filter_id === ``"></div>
        </div>
      </div>
      <div v-for="(library, index) in libraries.filter" :key="index">
        <div class="px-5 cursor-pointer flex justify-between items-center border-b py-3"
             :class="darkMode?`border-button`:`border-primary`" @click="filterLibrary(library)">
          <div class="rounded-full flex justify-center items-center w-8 h-8"
               :class="darkMode?`bg-youtube`:`bg-primary`">
            <WatchVideoIcon fill="#fff" :size="18"></WatchVideoIcon>
          </div>
          <div class="text-left flex-1 ml-5" :class="darkMode ? `text-gray-300` : ``">{{ library.name }}</div>
          <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
            <div class="w-2 h-2 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"
                 v-if="filter_id === library._id "></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"
import WatchVideoIcon from "./../../../components/WatchVideoIcon.vue"

export default {
  components: {
    WatchVideoIcon
  },
  computed: {
    ...mapState('library', ['libraries', ['filter_id']]),
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    filterLibrary(library) {
      if (library) {
        this.$store.commit("library/changeFilterId", library._id)
      } else {
        this.$store.commit("library/changeFilterId", 'all')
      }
      this.$emit("filterLibrary", library)
    }
  }
}
</script>