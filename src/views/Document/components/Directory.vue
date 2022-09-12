<template>
  <div class="fixed w-full h-full flex items-center justify-center top-0 left-0 bg-black z-50 bg-opacity-80">
    <div class="w-80 rounded-xl shadow" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div class="h-12 flex items-center px-5 text-base relative">
        {{ $t('create_folder') }}
        <div class="absolute right-3 top-2 opacity-80 cursor-pointer" @click="() => {this.$emit('closeDirectory')}">
          <CloseIcon :width="18" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
        </div>
      </div>
      <div class="border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
      <div class="px-5 my-6">
        <label>
          <input type="text" v-model="directoryName"
                 class="w-full h-10 border focus:outline-none rounded-lg px-3 text-sm"
                 :placeholder="$t('directory_name')" ref="directory"
                 :class="darkMode?`bg-youtube border-button`:`border-gray-300`">
        </label>
      </div>
      <div class="px-5 flex justify-end" @click="createDirectory">
        <button class="bg-primary h-11 px-10 rounded-lg text-white mb-6 focus:outline-none">{{ $t('submit') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from "vuex"
import CloseIcon from "./../../../components/CloseIcon.vue"
import helper from "./../../../helper/helper"

export default {
  data() {
    return {
      directoryName: ""
    }
  },
  components: {
    CloseIcon
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  },
  methods: {
    ...mapActions('document', ['createDocument']),
    createDirectory() {
      if (!this.$refs.directory.value) {
        helper.errorMessage("please_enter_folder_name");
        this.$refs.directory.focus()
        return;

      }
      let formData = new FormData();
      formData.append("name", this.directoryName)

      this.createDocument(formData).then(() => {
        helper.success("folder_created")
        this.$emit("closeDirectory")
      })
    }
  }
}
</script>