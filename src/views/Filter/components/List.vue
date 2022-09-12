<template>
  <div class=" px-5 pb-4 mt-1 pt-2" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
    <div class="text-sm">
      <div class="grid grid-cols-3 gap-x-10 gap-y-5 font-medium">
        <div @click="selectFilter('all')"
             class="px-5 cursor-pointer flex items-center border-b py-3"
             :class="darkMode?`border-button`:`border-gray-500`">
          <div class="rounded-full flex justify-center items-center w-8 h-8"
               :class="darkMode?`bg-youtube`:`bg-primary`">
            <WatchIcon fill="#fff" :size="18"/>
          </div>
          <div class="flex justify-start flex-1">
            <span class="pl-5">{{ $t('all') }}</span>
          </div>
          <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
            <div class="w-2 h-2 rounded-full "
                 v-if="filter_id==='all'" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
          </div>
        </div>
        <div v-for="(list,index) in filter"
             class="px-5 cursor-pointer flex justify-between items-center border-b py-3"
             :class="darkMode?`border-button`:`border-gray-500`"
             :key="index" @click="selectFilter(list)">
          <div class="rounded-full flex justify-center items-center w-8 h-8"
               :class="darkMode?`bg-youtube`:`bg-primary`">
            <WatchIcon fill="#fff" :size="18"/>
          </div>
          <div class="flex justify-start flex-1">
            <span class="pl-5"> {{ list.name }}</span>
          </div>
          <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
            <div
                class="w-2 h-2  rounded-full"
                v-if="filter_id ===list._id "
                :class="darkMode?`bg-gray-300`:`bg-primary`">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WatchIcon from "./../../../components/WatchVideoIcon.vue"
import CloseIcon from "./../../../components/CloseIcon.vue"
import {mapState, mapActions} from "vuex"

export default {
  components: {
    WatchIcon,
    CloseIcon
  },
  props: {
    filter: {
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['filter_id', 's']),
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('home', ['getList']),
    closeFilter() {
      this.$emit("closeFilter")
    },

    selectFilter(list) {
      if (typeof list !== "object") {
        list = {
          _id: "all",
          name: "all"
        }
      }
      this.$store.commit('home/receiveFilter', list._id);
      this.$store.commit('home/selectedFilterName', list.name);
      this.getList({
        filter_id: list._id,
        s: this.s
      }).then(() => {
        this.$store.commit('setting/setPagination', 1)
      });

      this.$emit("closeFilter")
    }
  }
}
</script>