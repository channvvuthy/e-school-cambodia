<template>
    <div class="fixed z-50 inset-0 overflow-y-auto font-siemreap w-full h-full left-0 top-0 items-center justify-center flex bg-black">
            <div class="md:w-96 2xl:w-100 h-85 rounded-lg flex flex-col justify-between text-white relative" :style="{backgroundColor:`${backgroundColor}`,color:`${color}`}">
                <!-- Profile -->
                <div class="flex items-center left-3 justify-start p-4" v-if="storyDetail.user">
                    <div class="w-12 h-12 rounded-full bg-cover mr-3 bg-center" :style="{backgroundImage:`url(${storyDetail.user.photo})`}"></div>
                    <div class="flex flex-col items-center justify-start text-left text-base">
                        <div>
                            <div>{{storyDetail.user.name}}</div>
                            <vue-moments-ago prefix="" suffix="ago" :date="storyDetail.date" lang="en" />
                        </div>
                    </div>

                </div>
               <!-- Indicator -->
                <div class="flex w-full h-full absolute left-0 top-0 z-1 justify-between items-center">
                    <!-- Left -->
                    <div class="transform rotate-90 relative -left-20 cursor-pointer bg-secondary w-8 h-8 rounded-full flex items-center justify-center" :class="previous?'visible':'invisible'" @click="previousStory">
                        <ChevronIcon fill="#909090"></ChevronIcon>
                    </div>
                    <!-- Right -->
                        <div class="transform -rotate-90 relative -right-20 cursor-pointer bg-secondary w-8 h-8 rounded-full flex items-center justify-center" :class="next?'visible':'invisible'" @click="nextStory">
                        <ChevronIcon fill="#ffffff"></ChevronIcon>
                    </div>
                </div>
                 <!-- Close -->
                <div class="absolute right-3 top-4 cursor-pointer z-50" @click="closeStory">
                    <close-icon :fill="color"></close-icon>
                </div>
                <div class="flex-1 flex items-center justify-center overflow-hidden" style="max-height:80%;">
                     <img :src="storyDetail.photo.name" style="max-height:100%;" class="story-profile"/>
                </div>
                <div class="h-4"></div>
                <!-- Viewer -->
                <div class="cursor-pointer w-full flex justify-start px-3  items-end text-sm mb-2 relative z-50"
                    >
                    <div class="flex items-center mb-4" @click="showUserViewer(storyDetail._id)">
                        <span><Eye :fill="color"></Eye></span>
                        <span class="px-1"> {{storyDetail.view}}</span>
                        <span class="pr-1">{{$t('1004')}}</span>
                        <span><ChevronIcon :fill="color" :size="18"></ChevronIcon></span>
                    </div>
                </div>
                <!-- End viewer -->
                <!-- List viewer -->
                <div :class="darkMode?'bg-secondary text-textSecondary':'bg-white'" class="absolute z-50 left-0 w-full h-full overflow-y-scroll  rounded-xl shadow-md" @scroll="onScroll" v-if="showViewer">
                    <div class="top-0 sticky relative pt-14 pb-4" :class="darkMode?`bg-secondary`:`text-black bg-white`"> 
                        <div class="absolute right-3 top-0 cursor-pointer opacity-70 z-50 top-4" @click="()=>{this.showViewer = false}">
                            <close-icon :fill="darkMode?'#afb0b4':'#000000'"></close-icon>
                        </div>
                        <div class="flex ml-5 text-sm font-semibold items-center">
                            <span><Eye :fill="darkMode?'#ffffff':'#000000'"></Eye></span>
                            <span class="px-2" :class="darkMode?`text-white`:`text-black`"> {{storyDetail.view}}</span>
                            <span class="pr-1" :class="darkMode?`text-white`:`text-black`">{{$t('1004')}}</span>
                        </div>
                    </div>
                    <div class="mt-5">
                        <div v-for="(viewer,index) in storyDetail.viewer" :key="index" class="text-black text-xs font-semibold">
                            <div class="flex itemls-center mb-5 px-5">
                                <div class="w-12 h-12 rounded-full bg-cover bg-gray-200 mr-5 bg-center" :style="{backgroundImage:`url(${viewer.photo})`}"></div>
                                <div :class="darkMode?'text-textSecondary':''">{{viewer.name}}</div>
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
import FastAverageColor from 'fast-average-color';
const fac = new FastAverageColor();
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
          previous:true,
          backgroundColor:"",
          color:"",
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

    previousStory(){
        this.showViewer = false;
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
        setTimeout(()=>{
             this.averageColor()
        },500)

    },
    averageColor(){
        fac.getColorAsync(document.querySelector('.story-profile'))
        .then(color => {
            this.backgroundColor = color.rgba
            this.color = color.isDark ? '#fff' : '#000';
        }).catch(e => {
            console.log(e);
        });
    },
    nextStory(){
        
        this.showViewer = false
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
        setTimeout(()=>{
             this.averageColor()
        },500)
    }
  },
  mounted(){
      this.averageColor()
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