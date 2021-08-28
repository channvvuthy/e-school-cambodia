<template>
    <div class="fixed font-khmer_os z-50" style="width: 350px;"
         :style="isHide?{marginLeft:'-350px'}:{marginLeft:'0px'}"
         :class="darkMode?'bg-secondary text-gray-300':'bg-white text-black'"
         
         >
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
                    <div class="w-20 h-20 rounded-full bg-cover bg-center m-auto bg-white cursor-pointer relative"
                         :style="{backgroundImage:`url(${token?stProfile['photo']:'/profile.png'})`}" @mouseover="() =>{this.isEdit = true}" @mouseleave="() => {this.isEdit = false}" @click="() => {token?this.$refs.photo.click():``}">
                         <div class="absolute flex items-end pb-2 justify-center w-full h-full bg-gradient-to-t from-black rounded-full" v-if="isEdit"><CameraIcon fill="#fff"></CameraIcon></div>
                         <div class="absolute w-full h-full rounded-full flex items-start justify-center bg-gradient-to-t from-black" v-if="loading">
                             <div class="loader mt-3"></div>
                         </div>
                         <input type="file" ref="photo" class="hidden" @change="onSelectedPhoto">
                    </div>
                    <div class="flex justify-between items-end mt-3  cursor-pointer"
                         :class="localize==='en'?'text-xs':'text-xs'">
                        <p class="name">
                            {{token ? stProfile.first_name + " " + stProfile.last_name : $t('unname')}}
                        </p>
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
    import CameraIcon from "./../../components/CameraIcon.vue"
    import eSchool from "./components/eSchool.vue"
    import {mapActions, mapState} from "vuex"

    export default{
        components: {
            BackIcon,
            Privacy,
            Report,
            Study,
            eSchool,
            CameraIcon
        },
        data(){
            return{
                isEdit: false,
                loading: false
            }
        },
        computed: {
            ...mapState('auth', ['token', 'stProfile']),
            ...mapState('setting', ['localize','darkMode','isHide'])
        },

        methods: {
            ...mapActions('auth', ['changeProfilePhotoPhoto']),
            switchSidebar(){
                if(this.isHide){
                    this.$store.commit('setting/toggleSidebar', false)
                }else{
                    this.$store.commit('setting/toggleSidebar', true)

                }
            },
            onSelectedPhoto(event){
                if (event.target.value) {
                    this.loading = true
                    const file = event.target.files[0];
                    let formData = new FormData();
                    formData.append("image",file)
                    this.changeProfilePhotoPhoto(formData).then(response =>{
                        let stProfile = localStorage.getItem("stProfile")
                        stProfile = JSON.parse(stProfile)
                        stProfile.photo = response.data.photo
                        this.$store.commit("auth/studentProfile", stProfile)
                        localStorage.setItem("stProfile", JSON.stringify(stProfile))
                        this.loading = false
                    })
                    
                }
            },
        },


    }
</script>