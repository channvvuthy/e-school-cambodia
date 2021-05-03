<template>
    <div class="font-khmer_os">
        <div class="flex" v-if="!escapeRoute()">
            <div>
                <!--Sidebar-->
                <Sidebar/>
            </div>
            <div class="w-full border border-t-0 h-32 flex items-end"
                :class="darkMode?'bg-secondary border-secondary text-textSecondary':'bg-white border-gray-300'"
                 :style="isHide?{marginLeft:'0px'}:{marginLeft:'385px'}">
                <Menu/>
            </div>
        </div>
        <div :style="isHide?{marginLeft:'0px'}:{marginLeft:'385px'}">
            <router-view></router-view>
        </div>

    </div>
</template>
<script>
    import Sidebar from "./views/Sidebar/Sidebar.vue"
    import Menu from "./views/Menu/Menu.vue"
    import {mapState} from "vuex"
    export default{
        data(){
            return {}
        },
        components: {
            Sidebar,
            Menu
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode'])
        },
        methods: {
            escapeRoute(){
                if (this.$route.name === 'login' || this.$route.name === 'register' || this.$route.name === 'forgot-password') {
                    this.$store.commit('setting/toggleSidebar', true);
                    return true;

                }
                return false;
            }
        },
    }
</script>
