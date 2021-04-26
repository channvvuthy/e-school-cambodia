<template>
    <div class="fixed bg-white font-khmer_os" style="width: 385px;"
         :style="isHide?{marginLeft:'-385px'}:{marginLeft:'0px'}">
        <div class="sidebar relative h-screen shadow">
            <div class="toggle bg-primary absolute rounded py-4 top-8 cursor-pointer"
                 :class="!isHide?'pl-5 pr-2 -right-8':'pl-2 pr-6 -right-12'"
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
            <div class="profile bg-primary px-10 py-8 flex items-end text-white justify-between">
                <div style="padding: 1px 0px;" class="flex flex-col justify-center items-center">
                    <div class="w-20 h-20 rounded-full bg-cover m-auto bg-white cursor-pointer"
                         :style="{backgroundImage:`url(${token?stProfile['photo']:'/profile.png'})`}">
                    </div>
                    <div class="flex justify-between items-end mt-3  cursor-pointer"
                         :class="localize==='en'?'text-base':'text-sm'">
                        <p class="name">
                            {{token ? stProfile.first_name + " " + stProfile.last_name : $t('unname')}}
                        </p>
                        <div class="relative flex-col justify-center items-center">
                            <!--<span class="absolute text-xs z-50 absolute right-0"-->
                            <!--style="bottom:5px;margin-right: 1px;">✓</span>-->
                            <!--<img src="/icon/Menu/insurance.png" class="h-4 ml-5 relative -top-1"/>-->
                        </div>
                    </div>

                </div>
                <template>
                    <div class="h-5 border border-white border-t-0 border-b-0 border-r-0 border-opacity-30"></div>
                    <div class="flex flex-col justify-center items-center text-center">
                        <img src="/icon/Menu/point.png" class="h-8">
                        <div class="mt-3" :class="localize==='en'?'text-base':'text-sm'">100 {{$t('2020')}}</div>
                    </div>
                </template>
            </div>
            <div class="px-5 py-3 overflow-y-scroll h-screen pb-40">
                <template v-if="token">
                    <Study></Study>
                    <div class="h-10"></div>
                    <Report></Report>
                    <div class="h-10"></div>
                    <Privacy></Privacy>
                    <div class="h-10"></div>
                </template>
                <eSchool></eSchool>
                <div class="h-10"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import BackIcon from "./../../components/BackIcon"
    import Study from "./components/Study.vue"
    import Report from "./components/Report.vue"
    import Privacy from "./components/Privacy.vue"
    import eSchool from "./components/eSchool.vue"
    import {mapState} from "vuex"

    export default{
        data(){
            return {
                isHide: false
            }
        },
        components: {
            BackIcon,
            Privacy,
            Report,
            Study,
            eSchool
        },
        computed: {
            ...mapState('auth', ['token', 'stProfile']),
            ...mapState('setting', ['localize'])
        },

        methods: {
            switchSidebar(){
                this.isHide = !this.isHide
                this.$store.commit('setting/toggleSidebar', this.isHide)
            }
        },
        created(){
            console.log(this.stProfile)
        }
    }
</script>