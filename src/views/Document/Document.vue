<template>
    <div>
        <eHeader :title="`1112`"></eHeader>
        <div :class="darkMode?`bg-youtube text-gray-300 mt-5 px-5 `:`mt-5 px-5 `" class="h-screen pb-40 overflow-y-scroll">
            <div class="w-1/2">
                <div class="relative">
                    <input type="text" class="w-full h-12 border rounded-lg pl-3 focus:outline-none shadow" :placeholder="$t('1001')" :class="darkMode?`bg-secondary border-button`:``">
                    <div class="absolute right-4 top-3">
                        <SearchIcon :fill="darkMode?`#909090`:`#000000`"></SearchIcon>
                    </div>
                </div>
            </div>
            <div class="h-10"></div>
            <div class="grid md:grid-cols-3 2xl:grid-cols-4 gap-5">
                <div class="rounded-xl shadow w-full p-5" :class="darkMode?`bg-secondary`:`bg-white`" v-for="i in 15" :key="i">
                    <div class="bg-softGray p-8 rounded-xl inline-block">
                        <FolderIcon :size="50" :fill="darkMode?`#909090`:`#0f3c7a`"></FolderIcon>
                    </div>
                    <div class="font-semibold text-primary text-base mt-5">Examination class 12</div>
                    <div class="text-gray-400 font-normal mt-3 text-xs">2021-02-23</div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 right-0 bg-red-500 h-40">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam possimus eius quisquam in magni quas fuga aspernatur voluptate vel pariatur ipsa quasi sequi tempora voluptatibus, excepturi, iure dicta totam voluptates?
        </div>
    </div>
</template>
<script>
    import eHeader from "./../Video/components/Header.vue"
    import SearchIcon from "./../../components/SearchIcon.vue"
    import FolderIcon from "./../../components/FolderIcon.vue"
    import {mapState, mapActions} from "vuex"
    export default {
        components:{
            eHeader,
            SearchIcon,
            FolderIcon
        },
        computed:{
            ...mapState('document', ['documents', 'loading']),
            ...mapState('setting', ['darkMode'])
        },
        methods:{
            ...mapActions('document', ['getDocument'])
        },
        mounted(){
            this.getDocument()
        }
    }
</script>