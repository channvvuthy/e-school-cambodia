<template>
    <div class="mx-5 mb-5 pb-4" :class="darkMode?'bg-secondary text-gray-300':'bg-white'">          
        <div class="text-sm">
            <div class="grid grid-cols-3 gap-x-10 gap-y-5 font-medium">
                <div @click="selectFilter('all')"
                        class="px-5 cursor-pointer flex items-center border border-t-0 border-l-0 border-r-0 border-gray-500 py-3">
                    <div class="rounded-full flex justify-center items-center w-8 h-8" :class="darkMode?`bg-fb`:`bg-primary`">
                        <WatchIcon fill="#fff" :size="18"></WatchIcon>
                    </div>
                    <div class="flex justify-start flex-1">
                        <span class="pl-5">{{$t('all')}}</span>
                    </div>
                    <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
                        <div class="w-2 h-2 rounded-full" :class="darkMode?`bg-fb`:`bg-primary`"
                                v-if="filter_id==='all'"></div>
                    </div>
                </div>
                <div v-for="(list,index) in filter"
                        class="px-5 cursor-pointer flex justify-between items-center border border-t-0 border-l-0 border-r-0 py-3"
                        :key="index" @click="selectFilter(list)" :class="darkMode?`border-gray-300`:`border-gray-500`">
                    <div class="rounded-full flex justify-center items-center w-8 h-8" :class="darkMode?`bg-fb`:`bg-primary`">
                        <WatchIcon fill="#fff" :size="18"></WatchIcon>
                    </div>
                    <div class="flex justify-start flex-1">
                        <span class="pl-5"> {{list.name}}</span>
                    </div>
                    <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
                        <div class="w-2 h-2 rounded-full" :class="darkMode?`bg-fb`:`bg-primary`"
                                v-if="filter_id ===list._id "></div>
                    </div>
                </div>
            </div>
        </div>           
    </div>
</template>
<script>
import WatchIcon from "./../../../components/WatchVideoIcon.vue";
// import CloseIcon from "./../../../components/CloseIcon.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    WatchIcon,
    // CloseIcon
  },
  props: {
    filter: {
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapState("home", ["filter_id", "s"]),
    ...mapState("setting", ["darkMode"])
  },
  methods: {
    ...mapActions("home", ["getList"]),
    closeFilter() {
      this.$emit("closeFilter");
    },

    selectFilter(list) {
      if (typeof list !== "object") {
        list = {
          _id: "all",
          name: "all"
        };
      }
      this.$store.commit("home/receiveFilter", list._id);
      this.$store.commit("home/selectedFilterName", list.name);
      this.$store.commit("setting/setPagination", 1);
      this.$emit("closeFilter");
    }
  }
};
</script>