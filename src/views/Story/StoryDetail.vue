<template>
    <div class="fixed z-50 inset-0 overflow-y-auto font-khmer_os">
        <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-black bg-opacity-95"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-opacity-0  overflow-hidden  transform transition-all  sm:align-middle  w-7/12"
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
                        <div class="absolute right-3 top-4 cursor-pointer opacity-80 z-50" @click="closeStory" v-if="showCloseIcon">
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
                        <img :src="storyDetail.photo.name" class="max-h-105 rounded"/>
                        <!-- Viewer -->
                        <div class="cursor-pointer absolute bottom-0 left-0 w-full flex justify-start px-3 items-end text-sm"
                         style="background-image: url('/footer.png'); background-repeat: repeat-x; height:165px;">
                            <div class="flex items-center mb-4" @click="showUserViewer(storyDetail._id)">
                                <span><Eye></Eye></span>
                                <span class="px-1"> {{countView(storyDetail.viewer)}}</span>
                                <span class="pr-1">{{$t('1004')}}</span>
                                <span><ChevronIcon fill="#ffffff" :size="18"></ChevronIcon></span>
                            </div>
                        </div>
                        <!-- End viewer -->
                        <!-- List viewer -->
                        <div class="absolute top-14 z-50 left-0 bg-white w-full h-full rounded-2xl shadow-md" v-if="showViewer">
                            <div class="absolute right-3 top-4 cursor-pointer opacity-80 z-50" @click="()=>{this.showViewer = false}">
                                <close-icon fill="#000000" :width="15" :height="15"></close-icon>
                            </div>
                            <div class="flex text-black mt-5 ml-5 text-xs font-semibold mt-12">
                                <span><Eye></Eye></span>
                                <span class="px-1"> {{countView(storyDetail.viewer)}}</span>
                                <span class="pr-1">{{$t('1004')}}</span>
                                <span><ChevronIcon fill="#ffffff" :size="18"></ChevronIcon></span>
                            </div>
                            <div class="mt-5 overflow-y-scroll h-full" @scroll="onScroll">
                                <div v-for="(viewer,index) in storyDetail.viewer" :key="index" class="text-black text-xs font-semibold">
                                    <div class="flex items-center mb-5 px-5">
                                        <div class="w-12 h-12 rounded-full bg-cover bg-gray-200 mr-5" :style="{backgroundImage:`url(${viewer.photo})`}"></div>
                                        <div>{{viewer.name}}</div>
                                    </div>
                                   
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
    ...mapState("auth", ["storyDetail","storyIndex","story"])
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
        this.next = true

        if(this.story[storyIndex]!==undefined){
            let payload = {id:this.story[storyIndex]._id}
            this.$store.commit("auth/setStoryIndex", storyIndex);
            this.viewStory(payload).then((response)=>{
                console.log(response)
            });
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
            this.viewStory(payload).then((response)=>{
                console.log(response)
            });
        }else{
            this.next = false
        }
        
    }
  },
  created() {
    console.log(this.storyDetail);
  }
};
</script>