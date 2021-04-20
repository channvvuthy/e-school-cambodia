<template>
    <div class="fixed bg-white" style="width: 385px;" :style="isHide?{marginLeft:'-385px'}:{marginLeft:'0px'}">
        <div class="sidebar relative h-screen shadow">
            <div class="toggle bg-primary absolute rounded py-4 top-8 cursor-pointer"
                 :class="!isHide?'pl-5 pr-2 -right-8':'pl-2 pr-6 -right-14'"
                 @click="switchSidebar">
                <template v-if="!isHide">
                    <div class="bg-white rounded-full absolute h-3 w-3 left-0 top-5 flex justify-center items-center">
                        <BackIcon :width="8" :height="8"></BackIcon>
                    </div>
                    <img src="/icon/Menu/menu.png" class="h-5">
                </template>
                <template v-else>
                    <div class="bg-white rounded-full absolute h-3 w-3 right-2 top-5 flex justify-center items-center transform rotate-180">
                        <BackIcon :width="8" :height="8"></BackIcon>
                    </div>
                    <img src="/icon/Menu/menu-rotate.png" class="h-5">
                </template>
            </div>
            <div class="profile bg-primary px-10 py-8 flex justify-between items-end text-white">
                <div style="padding: 1px 0px;">
                    <img src="/profile.png" class="rounded-full w-20 "/>
                    <div class="flex justify-between items-end mt-3">
                        <p class="name">Kamal Perez</p>
                        <div class="relative flex-col justify-center items-center">
                        <span class="absolute text-xs z-50 absolute right-0"
                              style="bottom:5px;margin-right: 1px;">✓</span>
                            <img src="/icon/Menu/insurance.png" class="h-4 ml-5 relative -top-1"/>
                        </div>
                    </div>

                </div>
                <div class="h-5 border border-white border-t-0 border-b-0 border-r-0 border-opacity-30"></div>
                <div class="flex flex-col justify-center items-center text-center">
                    <img src="/icon/Menu/point.png" class="h-8">
                    <div class="mt-3">100 Points</div>
                </div>
            </div>
            <div class="px-5 py-3 overflow-y-scroll h-screen pb-40">
                <Study></Study>
                <div class="h-10"></div>
                <Report></Report>
                <div class="h-10"></div>
                <Privacy></Privacy>
                <div class="h-10"></div>
                <eSchool></eSchool>
                <div class="h-10"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import InsuranceIcon from "./../../components/InsuranceIcon"
    import BackIcon from "./../../components/BackIcon"
    import Study from "./components/Study.vue"
    import Report from "./components/Report.vue"
    import Privacy from "./components/Privacy.vue"
    import eSchool from "./components/eSchool.vue"

    export default{
        data(){
            return {
                isHide: false
            }
        },
        components: {
            InsuranceIcon,
            BackIcon,
            Privacy,
            Report,
            Study,
            eSchool
        },
        methods: {
            switchSidebar(){
                this.isHide = !this.isHide
                this.$store.commit('setting/toggleSidebar', this.isHide)
            }
        }
    }
</script>