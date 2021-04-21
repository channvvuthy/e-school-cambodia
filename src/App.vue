<template>
    <div>
        <div class="flex">
            <div>
                <!--Sidebar-->
                <Sidebar/>
            </div>
            <div class="w-full bg-white border border-gray-300 border-t-0 h-32 flex items-end"
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
            ...mapState('setting', ['isHide'])
        },
    }
</script>
