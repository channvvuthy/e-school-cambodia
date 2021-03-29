<template>
    <div id="app">
        <div v-if="$route.name == 'login' || $route.name == 'change-password'  ">
            <router-view/>
        </div>
        <div class="flex  max-h-screen" v-else>
            <div class="w-60 fixed border border-b-0 border-l-0 border-gray-200 min-h-screen">
                <sidebar :stProfile="stProfile"/>
            </div>
            <div class="ml-60 flex-1">
                <div class="border border-b-0 border-l-0 border-gray-200">
                    <Menu/>
                    <div class="flex justify-between items-center px-5 bg-white"
                         :class="$route.name !=='change-profile' && $route.name !=='about' &&
                          $route.name !=='lock' && $route.name !=='discuss'&& $route.name !=='test'
                           && $route.name !=='term' && $route.name !=='guardian'
                            && $route.name !=='insurance' && $route.name !=='invoice' && $route.name !=='course-detail'
                             && $route.name !=='help'  && $route.name !=='partner'
                             && $route.name !=='download'  && $route.name !=='download-detail'
                           && $route.name !=='other'?'border border-t-0 border-r-0 border-l-0 border-gray-200 ':''">
                        <Search/>
                        <div>
                            <FilterClass/>
                        </div>
                    </div>
                    <div>
                        <router-view/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Sidebar from "./views/Sidebar/Sidebar.vue";
    import Menu from "./views/Menu/Menu.vue";
    import Search from "./views/Search/Search.vue";
    import FilterClass from "./views/Filter/FilterClass.vue";
    import {mapState, mapActions} from "vuex"


    export default {
        components: {
            Sidebar,
            Menu, Search, FilterClass
        },

        computed: {
            ...mapState('auth', ['stProfile']),
        },

        methods: {
            ...mapActions('auth', ['getStudentProfile'])
        },
        created(){
            if (!this.stProfile.first_name && !this.stProfile.last_name) {
                if (JSON.parse(localStorage.getItem('stProfile'))) {
                    this.getStudentProfile(JSON.parse(localStorage.getItem('stProfile')))
                }
            }

        }
    };
</script>
<style lang="scss">
    body {
        overflow-x: hidden;
    }
</style>

