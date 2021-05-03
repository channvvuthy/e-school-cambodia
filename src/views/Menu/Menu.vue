<template>
    <div class="w-full" :class="darkMode?'bg-secondary':'bg-white'">
        <div class="pl-12 pr-5 flex justify-between items-center">
            <div class="grid grid-cols-5 gap-6">
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('home')">
                    <img :src="$route.name === 'home'?'/icon/Menu/Group 3@2x.png':'/icon/Menu/Home@2x.png'" class="h-6"/>
                    <p class="mt-2  color-primary" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1101')}}
                    </p>
                    <div class="border border-r-0 border-l-0 w-full" v-if="$route.name === 'home'" :class="darkMode?'border-lightGray bg-lightGray':'bg-primary border-primary'"></div>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer" @click="goTo('video')">
                    <img :src="$route.name === 'video'?'/icon/Menu/Video-Current@2x.png':'/icon/Menu/Video@2x.png'" class="h-6"/>
                    <p class="mt-2 " :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('2108')}}
                    </p>
                    <div class="border border-r-0 border-l-0 w-full" v-if="$route.name === 'video'" :class="darkMode?'border-lightGray bg-lightGray':'bg-primary border-primary'"></div>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Library@2x.png" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('2200')}}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Partner@2x.png" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1104')}}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center cursor-pointer">
                    <img src="/icon/Menu/Support.svg" class="h-6"/>
                    <p class="mt-2" :class="localize==='en'?'text-sm':'text-xs'">
                        {{$t('1105')}}
                    </p>
                </div>
            </div>
            <div class="flex justify-end">
                <div class="flex justify-between items-end flex-1">
                    <div class="flex flex-col justify-center items-center cursor-pointer opacity-60 ">
                        <img src="/icon/Home/shopping-cart.png"/>
                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10 opacity-60">
                        <img src="/icon/Home/chat-bubbles-with-ellipsis.png"/>
                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer ml-10 opacity-60">
                        <img src="/icon/Home/bell.png"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("setting", ["localize","darkMode"])
  },
  methods: {
    goTo(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>