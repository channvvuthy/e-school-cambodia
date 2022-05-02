<template>
    <div class="h-screen">
        <!-- Detail -->
         <template>
            <div class="flex mt-5 px-5">
                <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                    <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                        <div class="w-32 h-32 rounded-full bg-gray-300 bg-cover bg-center flex items-center justify-center relative " :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                    </div>
                    <div class="w-full bg-red-100 bg-cover h-40" style="background-image:url('cover.jpg');background-repeat:no-repeat;background-position:0px -5px;"></div>
                    <div class="h-36 pt-14" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="text-base pt-5 text-center font-bold" :class="darkMode?``:`text-primary`">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 ml-5 w-full">
                    <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3 " >
                            <div class="text-center w-full">
                                {{$t('name')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                     <ProfileIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></ProfileIcon>
                                </div>
                                <div class="mt-2">
                                    <span>
                                         {{ stProfile.first_name }}  {{ stProfile.last_name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3"  >
                            <div class="text-center w-full">
                                {{$t('gender')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <GenderIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></GenderIcon>
                                </div>
                                <div class="mt-2">
                                    <span>
                                        {{ stProfile.gender == "M"?$t('2015'):$t('2016') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative " :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3"  >
                            <div class="text-center w-full">
                                {{$t('location')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <MarkerIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></MarkerIcon>
                                </div>
                                <div class="mt-2">
                                    <span v-if="stProfile.province_name">
                                        {{ stProfile.province_name }}
                                    </span>
                                    <span v-else>
                                       {{ $t('unknown') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3"  >
                            <div class="text-center w-full">
                                {{$t('2123')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <SchoolIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></SchoolIcon>
                                </div>
                                <div class="mt-2 px-3 text-center">
                                     <span v-if="stProfile.school_name" :title="stProfile.school_name">
                                        {{ stProfile.school_name}}
                                    </span>
                                    <span v-else>
                                       {{ $t('unknown') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative cursor-pointer" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`" @click="goTo('gallery')">
                        <div class="flex items-center justify-between px-10 py-3">
                            <div class="text-center w-full">
                                {{$t('1113')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <GalleryIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></GalleryIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative cursor-pointer" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"  @click="goTo('friend')">
                        <div class="flex items-center justify-between px-10 py-3">
                            <div class="text-center w-full">
                                {{$t('friend')}}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <NetworkIcon :fill="darkMode?`#909090`:`#055174`" :size="50"></NetworkIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </template>
        <!-- End Detail -->
       
    </div>
</template>

<script>
    import EditUserIcon from "./../../components/EditUserIcon"
    import SchoolIcon from "./../../components/SchoolIcon.vue"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import CalendarIcon from "./../../components/CalendarIcon"
    import GenderIcon from "./../../components/GenderIcon.vue"
    import MapIcon from "./../../components/MapIcon"
    import {mapActions, mapState} from "vuex"
    import UniversityIcon from "./../../components/UniversityIcon"
    import SaveIcon from "./../../components/SaveIcon"
    import CameraIcon from "./../../components/CameraIcon.vue"
    import Loader from "./../../components/Loader"
    import eHeader from "./../Video/components/Header.vue"
    import helper from "./../../helper/helper"
    import MarkerIcon from "./../../components/MarkerIcon.vue"
    import QuizIcon from "./../../components/QuizIcon.vue"
    import BookIcon from "./../../components/BookIcon.vue"
    import EditIcon from "./../../components/EditIcon.vue"
    import ProfileIcon from "./../../components/ProfileIcon.vue"
    import GalleryIcon from "./../../components/GalleryIcon.vue"
    import NetworkIcon from "./../../components/NetworkIcon.vue"

    export default{
        components: {
            ProfileIcon,
            GenderIcon,
            CameraIcon,
            EditUserIcon,
            CalendarIcon,
            MapIcon,
            UniversityIcon,
            SaveIcon,
            Loader,
            eHeader,
            SchoolIcon,
            ChevronIcon,
            MarkerIcon,
            QuizIcon,
            BookIcon,
            EditIcon,
            GalleryIcon,
            NetworkIcon
            
        },
        data(){
            return {
                image: null,
                err: false,
                errMessage: null,
                loading: false,
                noUpdate: true,
                showProvince: false,
                showSchool: false,
                isEdit: false,
                isPic: false,
                stProfile:{},
                province:{
                    _id:"",
                    name:"",
                },
                school:{
                    _id: "",
                    name:"",
                },
                updating: false,
            }
        },
        computed: {
            ...mapState('setting', ['provinces', 'schools', 'loadingProvince', 'loadingSchool', 'darkMode']),
            ...mapState('auth', ['updatingPhoto'])
        },
        methods: {
            ...mapActions('setting', ['getProvinces', 'getSchool']),
            ...mapActions('auth', ['changeProfile', 'getStudentProfile', 'changeProfilePhotoPhoto','getUser']),
             reportDetail(page,user_id){
                this.$router.push({name: page, params:{user_id}})
            },
            closeProvince(){
                this.showProvince = false
            },

            closeSchool(){
                this.showSchool = false
            },

            changePhoto(){
                this.$refs.image.click()
            },
            defaultSelectedProvince(province){
                if(this.stProfile.province != undefined && this.stProfile.province._id != undefined){
                    return province._id == this.stProfile.province._id
                }
                return false
            },
            cutString(text,limit){
                return helper.cutString(text, limit)
            },
            goTo(page) {
                this.$router.push({ name: page,params:{id: this.$route.params.user_id} }).catch((err)=>{err});
            },

            showAllProvince(){
                this.stProfile.school.name = null
                this.showProvince = true
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
            updateProfile(){
                if(!this.$refs.first_name.value){
                    helper.errorMessage("please_enter_first_name")
                    this.$refs.first_name.focus()
                    return
                }
                if(!this.$refs.last_name.value){
                    helper.errorMessage("please_enter_last_name")
                    this.$refs.last_name.focus()
                    return
                }
                if(!this.$refs.phone.value){
                    helper.errorMessage("please_enter_phone_number")
                    this.$refs.phone.focus()
                    return
                }
                if(!this.$refs.dob.value){
                    helper.errorMessage("please_enter_date_of_birth")
                    this.$refs.dob.focus()
                    return
                }
                if(this.school._id == ""){
                      helper.errorMessage("4118")
                    return;
                }

                this.updating = true
                this.stProfile.province = this.province
                this.stProfile.school = this.school
                this.changeProfile(this.stProfile).then(() => {
                    this.updating = false
                    helper.success("account_updated")
                    this.getStudentProfile(this.stProfile)
                    localStorage.setItem('stProfile', JSON.stringify(this.stProfile))
                    this.isEdit = false
                }).catch(() => {
                    this.err = true
                    this.errMessage = "ការកែប្រែពត៍មានត្រូវបានបរាជ័យ"
                    this.updating = false
                })

            },
            filterSchool(event){
               
            },
            closeMessage()
            {
                this.err = false
            },

            changeGender(gender){
                this.stProfile.gender = gender
            },
            enableUpdate(){
                this.noUpdate = false
                if(this.province.name == ""){
                    this.province = this.stProfile.province
                }
            },
            takeSchool(school){
                this.noUpdate = false
                if(this.province.name == ""){
                    this.province = this.stProfile.province
                }
                this.school = school
                this.showSchool = false
            },
            onChange(e) {
                this.noUpdate = false
                this.showSchool = false
                try{
                    let name = e.target.options[e.target.options.selectedIndex].text
                    let province = {
                        _id: e.target.value,
                        name: name
                    }
                    this.province = province
                }catch(errr){}
                this.getSchool(e.target.value).then(()=>{
                    this.school.name = ""
                    this.school._id = ""
                })
            },
            showAllSchool()
            {
                if (!this.schools.length || this.loadingSchool) {
                    return false
                }
                this.showSchool = true
            },
            onFileChange(e)
            {
                const file = e.target.files[0];
                this.stProfile.photo = URL.createObjectURL(file);
                this.image = this.$refs.image.files[0];

                let formData = new FormData();

                formData.append("image", e.target.files[0]);

                this.changeProfilePhotoPhoto(formData).then(response => {
                    this.stProfile.photo = response.data.photo
                    this.getStudentProfile(this.stProfile)
                    localStorage.setItem('stProfile', JSON.stringify(this.stProfile))
                    
                }).catch(() => {})
            }
        },
        created(){
            this.getUser({
                id: this.$route.params.user_id
            }).then(response =>{
                this.stProfile = response.data.data
            })
        }
    }
</script>

<style>
    .camera {
        visibility: hidden;
    }

    .photo:hover .camera {
        transition: 0.5s linear;
        visibility: visible;
    }
</style>