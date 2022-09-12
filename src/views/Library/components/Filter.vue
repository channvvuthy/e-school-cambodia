<template>
  <div class="pb-5" :class="darkMode?`text-gray-300`:`text-youtube`">
    <div class="flex items-center border-b w-3/5 text-sm" :class="darkMode?'border-button':'border-gray-300'">
      <div class="flex items-center flex-1">
        <div>
          <SearchIcon :fill="darkMode?'#afb0b4':'#000000'"></SearchIcon>
        </div>
        <input type="text" class="h-10 border-transparent bg-transparent focus:outline-none flex-1 pl-5"
               :placeholder="$t('1001')"/>
      </div>
      <div class="flex items-center cursor-pointer" @click="showFilter">
        <div class="mr-3">{{ $t('1002') }}</div>
        <div class="cusor-pointer">
          <ChevronIcon></ChevronIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchIcon from "./../../../components/SearchIcon"
import ChevronIcon from "./../../../components/ChevronIcon"

import {mapState} from "vuex"

export default {
  components: {
    SearchIcon,
    ChevronIcon,
  },
  computed: {
    ...mapState('setting', ['darkMode']),
    ...mapState('library', ['showList'])
  },
  methods: {
    showFilter() {
      this.$store.commit("library/showFilterList", this.showList)
    }
  }
}
</script>