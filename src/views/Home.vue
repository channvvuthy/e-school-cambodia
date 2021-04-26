<template>
    <div class="mt-5 overflow-y-scroll pb-40 h-screen" @scroll="onScroll" ref="feed" id="feed">
        <template v-if="token">
            <Story></Story>
        </template>
        <template v-else>
            <Signin></Signin>
        </template>
        <FilterList></FilterList>
        <VideoList></VideoList>
    </div>
</template>

<script>
    // @ is an alias to /src

    import FilterList from "./Filter/FilterList.vue"
    import VideoList from "./Video/VideoList.vue"
    import Story from "./Story/Story.vue"
    import {mapActions, mapState} from "vuex"
    import Signin from "./Component/Signin.vue"

    export default {
        name: 'Home',
        data(){
            return {}
        },
        components: {
            Story,
            FilterList,
            VideoList,
            Signin
        },
        computed: {
            ...mapState('home', ['filter_id', 's']),
            ...mapState('setting', ['page']),
            ...mapState('auth', ['token'])
        },
        methods: {
            ...mapActions('home', ['getList', 'getListPagination']),

            onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.$store.commit('setting/setPagination', this.page + 1)
                    this.getListPagination({
                        filter_id: this.filter_id,
                        s: this.s,
                        p: this.page
                    })
                }
            },
        },
        created(){
            this.getList({
                filter_id: this.filter_id
            })
        }
    }
</script>
