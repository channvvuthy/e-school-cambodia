<template>
    <div class="fixed z-50 inset-0 overflow-y-auto font-siemreap w-full h-full left-0 top-0 items-center justify-center flex bg-black bg-opacity-95">
            <div class="min-w-96 max-w-xl"
                 role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="text-gray-50 flex justify-center items-center">
                    <div class="relative" @mouseover="()=>{this.showCloseIcon = true}" @mouseleave="()=>{this.showCloseIcon = false}">
                        <!-- Overlay -->
                        <div class="absolute w-full h-full -top-2" style="background-image:url('/bg-media.png');background-repeat: repeat-x;"></div>
                        <!-- Profile -->
                        <div class="flex items-center absolute top-4 left-3 justify-start z-50" v-if="storyDetail.user">
                            <div class="w-12 h-12 rounded-full bg-cover mr-3" :style="{backgroundImage:`url(${storyDetail.user.photo})`}"></div>
                            <div class="flex flex-col items-center justify-start text-left text-base">
                                <div>
                                    <div>{{storyDetail.user.name}}</div>
                                    <vue-moments-ago prefix="" suffix="ago" :date="storyDetail.date" lang="en" />
                                </div>
                            </div>

                        </div>
                        <!-- Close -->
                        <div class="absolute right-3 top-4 cursor-pointer z-50" @click="closeStory" v-if="showCloseIcon">
                            <close-icon fill="#ffffff"></close-icon>
                        </div>
                        <!-- Indicator -->
                        <div class="flex w-full h-full absolute left-0 top-0 z-1 justify-between items-center">
                            <!-- Left -->
                            <div class="transform rotate-90 relative -left-10 cursor-pointer opacity-80" :class="previous?'visible':'invisible'" @click="previousStory">
                                <ChevronIcon fill="#ffffff"></ChevronIcon>
                            </div>
                            <!-- Right -->
                             <div class="transform -rotate-90 relative -right-10 cursor-pointer opacity-80" :class="next?'visible':'invisible'" @click="nextStory">
                                <ChevronIcon fill="#ffffff"></ChevronIcon>
                            </div>
                        </div>
                        <img :src="storyDetail.photo.name" class="max-h-105"/>
                        <!-- Viewer -->
                        <div class="cursor-pointer absolute bottom-0 left-0 w-full flex justify-start px-3 items-end text-sm  h-1/2 bg-gradient-to-t from-black"
                         >
                            <div class="flex items-center mb-4" @click="showUserViewer(storyDetail._id)">
                                <span><Eye fill="#ffffff"></Eye></span>
                                <span class="px-1"> {{countView(storyDetail.viewer)}}</span>
                                <span class="pr-1">{{$t('1004')}}</span>
                                <span><ChevronIcon fill="#ffffff" :size="18"></ChevronIcon></span>
                            </div>
                        </div>
                        <!-- End viewer -->
                        <!-- List viewer -->
                        <div :class="darkMode?'bg-secondary text-textSecondary':'bg-white'" class="absolute top-5 z-50 left-0 w-full h-full overflow-y-scroll  rounded-t-xl shadow-md" @scroll="onScroll" v-if="showViewer">
                            <div class="top-0 sticky relative pt-14 pb-4" :class="darkMode?`bg-secondary`:`text-black bg-white`"> 
                                <div class="absolute right-3 top-0 cursor-pointer opacity-70 z-50 top-4" @click="()=>{this.showViewer = false}">
                                    <close-icon :fill="darkMode?'#afb0b4':'#000000'" :width="20" :height="20"></close-icon>
                                </div>
                                <div class="flex ml-5 text-xs font-semibold items-center">
                                    <span><Eye :fill="darkMode?'#ffffff':'#000000'"></Eye></span>
                                    <span class="px-2" :class="darkMode?`text-white`:`text-black`"> {{countView(storyDetail.viewer)}}</span>
                                    <span class="pr-1" :class="darkMode?`text-white`:`text-black`">{{$t('1004')}}</span>
                                </div>
                            </div>
                            <div class="mt-5">
                                <div v-for="(viewer,index) in storyDetail.viewer" :key="index" class="text-black text-xs font-semibold">
                                    <div class="flex items-center mb-5 px-5">
                                        <div class="w-12 h-12 rounded-full bg-cover bg-gray-200 mr-5" :style="{backgroundImage:`url(${viewer.photo})`}"></div>
                                        <div :class="darkMode?'text-textSecondary':''">{{viewer.name}}</div>
                                    </div>
                                     
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import { mapState, mapActions} from "vuex";
import CloseIcon from "./../../components/CloseIcon.vue";
import ChevronIcon from "./../../components/ChevronIcon.vue";
import Eye from "./../../components/Eye.vue";
import VueMomentsAgo from "vue-moments-ago";
export default {
  components: {
    VueMomentsAgo,
    CloseIcon,
    Eye,
    ChevronIcon
  },
  data(){
      return{
          showCloseIcon:false,
          showViewer:false,
          page: 1,
          id: "",
          next:true,
          previous:true
      }
  },
  computed: {
    ...mapState("auth", ["storyDetail","storyIndex","story"]),
    ...mapState("setting", ["darkMode"]),
    
  },
  methods: {
    ...mapActions('auth', ['viewStory']),
    closeStory() {
      this.$emit("closeStory");
    },

    showUserViewer(id){
        this.showViewer = true
        this.id = id;
    },

    onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
        if (scrollTop + clientHeight >= scrollHeight) {
            this.page ++ 
            let payload = {
                id:this.id,
                p:this.page
            }

            this.viewStory(payload)
        }
    },

    countView(viewer) {
      if (typeof viewer === "object") {
        if (viewer.length) {
          return viewer.length;
        }
      }
      return "";
    },
    previousStory(){
        let storyIndex = this.storyIndex - 1
        if(storyIndex <= 0){
            this.previous = false
        }
        this.next = true

        if(this.story[storyIndex]!==undefined){
            let payload = {id:this.story[storyIndex]._id}
            this.$store.commit("auth/setStoryIndex", storyIndex);
            this.viewStory(payload);
        }else{
            this.previous = false
        }

    },
    nextStory(){
        this.previous = true
        let storyIndex = this.storyIndex + 1
        if(this.story[storyIndex]!==undefined){
            let payload = {id:this.story[storyIndex]._id}
            this.$store.commit("auth/setStoryIndex", storyIndex);
            this.viewStory(payload);
            if(storyIndex + 1 >= this.story.length){
                this.next = false
                return
            }
        }else{
            this.next = false
        }
        
    }
  },
  created() {
      if(this.storyIndex <= 0){
          this.previous = false
      }
  }
};
</script>
<style scoped>
    .loader {
        border: 2px solid #f3f3f3;
        border-radius: 50%;
        border-top: 2px solid #3498db;
        width: 15px;
        height: 15px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        }

        /* Safari */
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg);
        }
    }

</style>