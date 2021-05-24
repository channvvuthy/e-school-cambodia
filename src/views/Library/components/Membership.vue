<template>
    <div>
        <div class="px-5">
            <div v-if="loading">
                <div class="grid grid-cols-4 gap-4">
                    <div class="flex items-center justify-between" v-for="i in 4" :key="i">
                        <div class="rounded-full w-14 h-14 bg-gray-300 mr-3 line"></div>
                        <div class="w-full flex-1">
                            <div class="h-3 bg-gray-300 w-1/2 mb-2 line"></div>
                            <div class="h-3 bg-gray-300 w-4/5 mb-2 line"></div>
                            <div class="h-3 bg-gray-300 w-full line"></div>
                        </div>
                    </div>
                </div>
            </div>
            <vue-horizontal v-else>
                <section v-for="(pk, index) in libraries.package" :key="index">
                    <div class="flex items-start rounded-xl pr-5 h-36" :class="darkMode?`bg-secondary text-gray-300`:`bg-white `">
                        <img :src="pk.thumbnail" class="max-h-36 rounded-l-xl mr-5">
                        <div class="h-full py-4 flex flex-col justify-beteen items-between">
                            <div class="flex-1">{{pk.title}}</div>
                            <div class="flex justify-between items-center">
                                <div class="mr-5">{{$t('1006')}}: {{pk.price.year}}$</div>
                                <div><CartIcon :fill="darkMode?`#909090`:`#000000`"></CartIcon></div>
                            </div>
                        </div>

                    </div>
                </section>
                
            </vue-horizontal>
        </div>
    </div>
</template>
<script>
import VueHorizontal from 'vue-horizontal';
import CartIcon from "./../../../components/CartIcon.vue"
import {mapState} from "vuex"
export default {
    components: {VueHorizontal,CartIcon},
    data() {
        return {items: [1, 2, 3]}
    },
    computed:{
        ...mapState('library', ['libraries', 'loading']),
        ...mapState('setting', ['darkMode'])
    }
}
</script>

<style>
    .line {
        animation: box 1s infinite;
    }
    @keyframes box {
        0% {
            opacity: 0.5;
        }

        50% {
            opacity: 1;
        }

        100% {
            opacity: 0.5;
        }
    }
</style>