<template>
  <div
      :class="darkMode?'bg-secondary text-textSecondary border-t border-b border-button':'bg-white border-b shadow'">
    <div class="px-5 py-5">
      <div class="flex text-primary  text-md gap-4">
        <div>
          <div class="mr-3">
            <SmileIcon :fill="darkMode?`#ffffff`:`#055174`"/>
          </div>
        </div>
        <div class="text-base font-PoppinsMedium" :class="darkMode?'text-white':''">
          <span class="uppercase">{{ $t('2003') }} </span>
          <span>{{ token ? stProfile.first_name + " " + stProfile.last_name : $t('1127') }}</span>
        </div>
      </div>
      <div class="list mt-5 relative" :class="darkMode?`text-gray-300`:``">
        <div class="absolute -right-3  h-full flex items-center justify-center z-40 text-white">
          <div class="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-button"
               :title="$t('see_all_story')" @click="listOfStory" :class="darkMode?`bg-button`:`bg-secondary`">
            <ArrowRight :size="16" fill="#F3F4F6"/>
          </div>
        </div>
        <div class="w-full overflow-x-auto flex overflow-y-hidden box-list-story" @scroll="onScroll">
          <div class="text-center text-sm mr-5 relative">
            <div
                class="box-story h-36 w-24 rounded-lg cursor-pointer flex flex-col items-center
                                justify-center relative">
              <div
                  @click="goToGallery('gallery')"
                  :style="{backgroundImage:`url(${currentStory.photo.url})`}"
                  class="h-full w-full bg-cover bg-center rounded-lg"
                  v-if="currentStory.hasOwnProperty('photo')"></div>
              <div
                  @click="goToGallery('gallery')"
                  v-else
                  class="h-full w-full bg-cover bg-center rounded-lg"
                  :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
              <div
                  @click="addStory()"
                  class="w-7 h-7 rounded-full flex justify-center items-center absolute right-1
                                    bottom-1 cursor-pointer"
                  :class="darkMode?`bg-secondary`:`bg-primary`">
                <AddIcon :size="16"/>
              </div>
            </div>

            <p class="mt-3" :class="localize==='en'?'text-sm':'text-xs'">
              {{ $t('2004') }}
            </p>
            <input type="file" ref="file" class="hidden" accept="image/x-png,image/gif,image/jpeg"
                   @change="chooseFile">
          </div>
          <div class="text-center text-sm mr-5 relative" v-for="(my_story,index) in story" :key="index"
               @click="getStoryDetail(my_story,index)">
            <div
                class="w-10 h-10 border-3 rounded-full bg-center bg-cover absolute z-40 left-2 top-2
                                bg-white flex justify-center items-center"
                :class="darkMode?`border-fb`:`border-fb`"
                :style="{backgroundImage:`url(${my_story.user.photo})`}"
            >
            </div>
            <div
                class="box-story relative h-36 bg-black w-24 p bg-center rounded-lg cursor-pointer
                                flex flex-col items-center justify-center overflow-hidden relative">
              <img

                  :src="my_story.photo.url?my_story.photo.url:'/poster.png'" alt=""
                  :id="my_story._id">
              <div class="absolute w-full h-full bg-black bg-opacity-30"></div>
            </div>
            <div class="flex items-center justify-center font-Ubuntu">
              <p class="mt-3 whitespace-nowrap flex justify-between space-x-4"
                 :title="my_story.user.name">
                <span>{{ cutString(my_story.user.name, 10) || $t('unknown') }}</span>
                <span
                    class="text-xs font-black text-center h-5 w-6 rounded"
                    style="padding-top: 2px;"
                    :class="darkMode ? `bg-iconColor` : `bg-forum`"
                    v-if="(my_story.type === 51 || my_story.type === 52)">
                  <span>AD</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <StoryDetail
        v-if="showStory"
        @closeStory="closeStory"/>
    <AddStory
        @closeAddStory="closeAddStory"
        v-if="showAddStory"
        @shareStory="shareStory"/>
  </div>
</template>

<script>
import AddIcon from "./../../components/AddIcon.vue"
import SmileIcon from "./../../components/SmileIcon.vue"
import ArrowRight from "./../../components/ArrowRight.vue"
import StoryDetail from "./StoryDetail.vue"
import AddStory from "./AddStory.vue"
import {mapState, mapActions} from "vuex"
import helper from "./../../helper/helper"

export default {
  components: {
    AddIcon,
    StoryDetail,
    AddStory,
    SmileIcon,
    ArrowRight,
  },
  data() {
    return {
      page: 1,
      showStory: false,
      showAddStory: false,
      file: "",
      seeMore: false,
    }
  },
  computed: {
    ...mapState('setting', ['localize', 'darkMode']),
    ...mapState('auth', ['token', 'stProfile', 'story', 'loadingStory']),
    ...mapState('story', ['currentStory'])
  },
  methods: {
    ...mapActions('auth', ['getStory', 'viewStory', 'addMyStory']),
    ...mapActions('upload', ['multiUpload']),
    goToGallery(page) {
      this.$router.push({name: page, params: {id: this.stProfile._id}}).catch((err) => {
        err
      });
    },
    listOfStory() {
      this.$router.push({name: 'story-list'})
    },
    onScroll({target: {scrollLeft, clientWidth, scrollWidth}}) {
      this.seeMore = true

      if (scrollLeft + clientWidth >= (scrollWidth - 1)) {

        this.page++
        this.getStory(this.page).then(() => {
        });
      }
    },
    cutString(text, limit) {
      return helper.cutString(text, limit)
    },
    getStoryDetail(story, index = 0) {
      if (story.type === 51 || story.type === 52) {
        let payload = {
          id: story._id,
          type: story.type
        }

        this.$store.dispatch('social/countView', payload).then(res => {
          this.$store.commit('story/getStoryDetail', res)
        })
        return
      }
      let payload = {id: story._id}
      this.$store.commit("auth/setStoryIndex", index);
      this.viewStory(payload).then(response => {
        if (response.data.msg != undefined) {
          helper.errorMessage(response.data.msg)
        } else {
          this.showStory = true
        }
      });
    },
    closeStory() {
      this.showStory = false
    },

    addStory() {
      this.$refs.file.click()
    },
    chooseFile(event) {
      // Reference to the DOM input element
      let input = event.target;
      this.file = event.target.files[0]

      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        let reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.$store.commit("auth/setImgUrl", e.target.result)
          this.showAddStory = true
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    shareStory() {
      let payload = {}
      let photo = new FormData()
      photo.append("photo", this.file)
      this.multiUpload(photo).then(res => {
        payload.photo = res.data[0]
        this.addMyStory(payload).then(res => {
          if (res.data && res.data.data) {
            localStorage.setItem("currentStory", JSON.stringify(res.data.data))
            this.$store.commit("story/setStory", res.data.data)
          }
          helper.success("009")
          this.showAddStory = false
        })
      }).finally(() => {
        this.showAddStory = false
      })

    },
    closeAddStory() {
      this.showAddStory = false
    }
  },
  created: function () {
    if (localStorage.getItem("currentStory")) {
      this.$store.commit("story/setStory", JSON.parse(localStorage.getItem("currentStory")))
    }
    this.getStory()
  }
}
</script>
<style>
.box-list-story::-webkit-scrollbar {
  display: none;
}
</style>