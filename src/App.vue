<template>
    <div>
        <div class="flex">
            <div>
                <!--Sidebar-->
                <Sidebar/>
            </div>
            <div class="w-full bg-white shadow-md h-32 flex items-end"
                 :style="isHide?{marginLeft:'0px'}:{marginLeft:'385px'}">
                <div class="menu px-14">
                    <div class="grid grid-cols-5 gap-20">
                        <div class="flex flex-col justify-center items-center cursor-pointer">
                            <img src="/icon/Menu/Group 3@2x.png" class="h-6"/>
                            <p class="py-1 text-sm color-primary">Home</p>
                            <div class="border border-primary border-r-0 border-l-0 bg-primary w-full"></div>
                        </div>
                        <div class="flex flex-col justify-center items-center cursor-pointer">
                            <img src="/icon/Menu/Video@2x.png" class="h-6"/>
                            <p class="py-1 text-sm">Video</p>
                        </div>
                        <div class="flex flex-col justify-center items-center cursor-pointer">
                            <img src="/icon/Menu/Library@2x.png" class="h-6"/>
                            <p class="py-1 text-sm">Library</p>
                        </div>
                        <div class="flex flex-col justify-center items-center cursor-pointer">
                            <img src="/icon/Menu/Partner@2x.png" class="h-6"/>
                            <p class="py-1 text-sm">Partner</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Sidebar from "./views/Sidebar/Sidebar.vue"
    import {mapState} from "vuex"
    export default{
        data(){
            return {}
        },
        components: {
            Sidebar
        },
        computed: {
            ...mapState('setting', ['isHide'])
        },
    }
</script>
