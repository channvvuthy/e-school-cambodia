<template>
    <div class="bg-white shadow">
        <div class="px-5 py-5">
            <div class="flex text-primary  text-md gap-4">
                <div>
                    <img src="/icon/icon/smile.svg" class="mr-3">
                </div>
                <div>{{$t('2003')}} <span class="font-semibold">Kamal Perez!</span></div>
            </div>
            <div class="list mt-5">
                <div class="w-full overflow-x-scroll flex overflow-y-hidden box-list-story">
                    <div class="text-center text-sm mr-5 relative">
                        <div class="box-story relative h-36 bg-black w-24 rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden relative">
                            <div class="absolute w-full h-full bg-black bg-opacity-30"></div>
                            <img src="https://images.unsplash.com/photo-1615887329889-a67219ec25dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1484&q=80"
                                 alt="">

                        </div>
                        <div class="bg-primary w-7 h-7 rounded-full flex justify-center items-center absolute -right-2 bottom-7 cursor-pointer">
                            <AddIcon :size="16"/>
                        </div>
                        <p class="mt-3" :class="localize==='en'?'text-sm':'text-xs'">
                            {{$t('2004')}}
                        </p>
                    </div>
                    <div class="text-center text-sm mr-5" v-for="i in 30">
                        <div class="box-story relative h-36 bg-black w-24 rounded-lg cursor-pointer flex flex-col items-center justify-center overflow-hidden relative">
                            <div class="absolute w-full h-full bg-black bg-opacity-30"></div>
                            <img src="https://images.unsplash.com/photo-1587554801471-37976a256db0?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80" alt="">
                        </div>
                        <p class="mt-3">Sabriyah Nasir </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AddIcon from "./../../components/AddIcon.vue"
    import {mapState} from "vuex"
    import Loading from "./../../components/Loading.vue"
    export default{
        components:{
            AddIcon,
            Loading
        },
        computed: {
            ...mapState('setting', ['localize'])
        }
    }
</script>
<style scoped>
    .box-list-story::-webkit-scrollbar {
        display: none;
    }
</style>