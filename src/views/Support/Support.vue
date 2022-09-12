<template>
  <div class="p-5 h-screen overflow-y-scroll pb-40 text-sm">
    <div class="w-9/12 rounded-xl shadow px-10 py-5 " :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
      <div :class="darkMode?`bg-button`:`bg-softGray text-primary`" class="rounded p-3">
        <div>{{ $t('personal_info') }}</div>
      </div>
      <div class="h-5"></div>
      <div>{{ $t('full_name') }}*</div>
      <input type="text" class="w-full focus:outline-none h-10 border-b"
             :class="darkMode?`bg-transparent border-b border-button`:`border-gray-300`">
      <div class="h-5"></div>
      <div>{{ $t('date_of_birth') }}</div>
      <input type="text" class="w-full focus:outline-none h-10 border-b"
             :class="darkMode?`bg-transparent border-b border-button`:`border-gray-300`">
      <div class="h-5"></div>
      <div class="flex items-center">
        <div class="mr-10">{{ $t('gender') }}</div>
        <label class="flex items-center cursor-pointer">
          <input type="radio" class="hidden"/>
          <span class="px-5">{{ $t('2016') }}</span>
          <div class="h-4 w-4 rounded-full border flex items-center justify-center"
               :class="darkMode?`border-button`:`border-gray-300`">
            <div class="h-2 w-2 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
          </div>
        </label>
        <label class="flex items-center cursor-pointer">
          <input type="radio" class="hidden"/>
          <span class="px-5">{{ $t('2015') }}</span>
          <div class="h-4 w-4 rounded-full border flex items-center justify-center"
               :class="darkMode?`border-button`:`border-gray-300`">
            <div class="h-2 w-2 rounded-full" :class="darkMode?`bg-gray-300`:`bg-primary`"></div>
          </div>
        </label>
      </div>
      <div class="h-7"></div>
      <div class="grid grid-cols-2 gap-5">
        <div>
          <div>{{ $t('national') }}</div>
          <input type="text" class="w-full focus:outline-none h-10 border-b"
                 :class="darkMode?`bg-transparent border-b border-button pl-3`:`border-gray-300`">
        </div>
        <div>
          <div>{{ $t('country') }}</div>
          <input type="text" class="w-full focus:outline-none h-10 border-b"
                 :class="darkMode?`bg-transparent border-b border-button pl-3`:`border-gray-300`">
        </div>
      </div>
      <div class="h-5"></div>
      <div>{{ $t('2123') }}</div>
      <input type="text" class="w-full focus:outline-none h-10 border-b"
             :class="darkMode?`bg-transparent border-b border-button pl-3`:`border-gray-300`">
      <div class="h-5"></div>
      <div :class="darkMode?`bg-button`:`bg-softGray text-primary`" class="rounded p-3">
        <div>{{ $t('attach_file') }}</div>
      </div>
      <div class="h-5" :class="darkMode?`border-button`:`border-gray-300`"></div>
      <div class="flex items-center">
        <div class="flex items-center cursor-pointer">
          <div>
            <ImageIcon :fill="darkMode?`#909090`:`#000000`"/>
          </div>
          <div class="ml-5">{{ $t('add_image') }}</div>
        </div>
        <div class="flex items-center cursor-pointer ml-10">
          <div>
            <AttachFileIcon :fill="darkMode?`#909090`:`#000000`"/>
          </div>
          <div class="ml-5">
            {{ $t('attach_file') }}
          </div>
        </div>
      </div>
      <div class="h-10"></div>
      <div class="flex justify-center items-center">
        <button class="h-11 rounded-lg px-40 bg-primary text-white">{{ $t('submit') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex"
import AttachFileIcon from "./../../components/AttachFileIcon.vue"
import ImageIcon from "./../../components/AddImageIcon.vue"

export default {
  components: {
    AttachFileIcon,
    ImageIcon
  },
  computed: {
    ...mapState('setting', ['darkMode'])
  }
}
</script>