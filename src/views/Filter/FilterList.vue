<template>
  <div class="m-5 z-50" :class="darkMode?`text-gray-300`:``">
    <div class="flex justify-between w-3/5">
      <div class="flex-1 relative">
        <input type="text" :placeholder="$t('1001')"
               v-model="s"
               v-on:keyup.enter="filterSearch"
               :class="darkMode?`border-button`:`border-gray-300`"
               class="w-full h-12 leading-12 focus:outline-none bg-transparent border-b  pl-8 text-sm">
        <div>
          <div v-if="s" class="absolute left-0 top-2 cursor-pointer" style="margin-top:5px;"
               :title="$t('clear')" @click="clear">
            <CloseIcon
                :width="20"
                :height="20"
                :fill="darkMode?`#D1D5DB`:`#000000`"/>
          </div>
          <div class="absolute left-0 top-3" v-else>
            <SearchIcon :fill="darkMode?`#D1D5DB`:`#000000`"/>
          </div>
        </div>
        <div class="flex absolute right-0 cursor-pointer justify-center items-center h-12 leading-12 top-0"
             @click="showFilter">
          <p class="mr-2" :class="localize==='en'?'text-md':'text-sm'">
            <span v-if="selectedFilterName==='all'">{{ $t('1002') }}</span>
            <span v-else>{{ selectedFilterName }}</span>
          </p>
          <ChevronIcon :fill="darkMode?`#D1D5DB`:`#000000`"/>
        </div>
      </div>
    </div>
    <List :filter="filter" v-if="showFilterForm" @closeFilter="closeFilter"/>
  </div>
</template>
<script>
import ChevronIcon from "./../../components/ChevronIcon"
import SearchIcon from "./../../components/SearchIcon.vue"
import List from "./components/List.vue"
import {mapState, mapActions} from "vuex"
import CloseIcon from "./../../components/CloseIcon.vue"

export default {
  data() {
    return {
      showFilterForm: false,
      s: ""
    }
  },
  components: {
    ChevronIcon,
    List,
    CloseIcon,
    SearchIcon
  },
  computed: {
    ...mapState('setting', ['localize', 'darkMode']),
    ...mapState('home', ['filter', 'selectedFilterName', 'filter_id'])
  },
  methods: {
    ...mapActions('home', ['getList']),
    showFilter() {
      this.showFilterForm = !this.showFilterForm
    },
    closeFilter() {
      this.showFilterForm = false
    },
    clear() {
      this.s = ""
      this.$store.commit("home/receiveFilter", 'all');
      this.$store.commit("home/selectedFilterName", 'all');
      this.filterSearch()
    },
    filterSearch() {
      this.$store.commit("home/receiveS", this.s);
      this.getList({
        s: this.s,
        filter_id: this.filter_id
      }).then((response) => {
        this.$store.commit('setting/setPagination', 1)
        this.$emit("filterSearch", response)
      })
    }
  },
  watch: {
    s: function (val) {
      this.$store.commit("home/receiveS", val);
    }
  }
}
</script>