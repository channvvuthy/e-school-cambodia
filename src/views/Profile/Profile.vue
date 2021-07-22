<template>
    <div>
        <eHeader></eHeader>
        <!-- View -->
        <div></div>
        <!-- End View -->
        <!-- Edit -->
        <div v-if="showEdit" class="h-screen overflow-y-scroll m-5 pb-40" :class="darkMode?`text-gray-300`:``">
           <div class="flex items-center ">
               <div class="w-20 h-20 rounded-full bg-primary bg-cover" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
               <div class="font-semibold ml-10">
                   <div class="text-lg">{{stProfile.first_name + ' ' + stProfile.last_name}}</div>
                   <div class="text-sm text-center text-gray-400 mt-2">+855{{stProfile.phone}}</div>
               </div>

           </div>
           <div class="w-1/2 mt-10">
                <!-- Name -->
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label>
                            <div>{{$t('2013')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="first_name" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.first_name" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{$t('2014')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="last_name" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.last_name" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">
                        </label>
                    </div>
                </div>

                <!-- Phone-->
                <div class="grid grid-cols-2 gap-5 mt-10">
                    <div>
                        <label>
                            <div>{{$t('2009')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="phone" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.phone" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{$t('date_of_birth')}}</div>
                            <div class="h-2"></div>
                            <input type="date" ref="dob" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.date_of_birth" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">

                        </label>
                    </div>
                </div>


                <!-- Gender-->
                <div class="grid grid-cols-1 gap-5 mt-10">
                    <div>
                        <label>
                            <div>{{$t('gender')}}</div>
                            <div class="h-2"></div>

                            <select class="w-full border h-10 rounded-md focus:outline-none" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" ref="gender" v-model="stProfile.gender">
                                <option value="F" :selected="stProfile.gender === `F`">{{$t('2016')}}</option>
                                <option value="M" :selected="stProfile.gender === `M`">{{$t('2015')}}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <!-- Province -->
                <div class="grid grid-cols-2 gap-5 mt-10">
                    <div>
                        <label>
                            <div>{{$t('2124')}}</div>
                            <div class="h-2"></div>
                            <select class="w-full border h-10 rounded-md focus:outline-none"  @change="onChange($event)" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" v-model="stProfile.province">
                                <option v-if="(stProfile.province && stProfile.province.name)" :value="stProfile.province">{{stProfile.school.name}}</option>
                                <option v-for="(province, index) in provinces" :key="index" :value="province" :selected="(stProfile.province && stProfile.province._id) && stProfile.province._id === province._id">{{province.name}}</option>
                            </select>
                        </label>
                    </div>
                    <div class="relative">

                        <label>
                            <div>{{$t('2123')}}</div>
                            <div class="h-2"></div>
                            <select class="w-full border h-10 rounded-md  focus:outline-none" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" v-model="stProfile.school">
                                <option v-for="(school, index) in schools" :key="index" :value="school">{{school.name}}</option>
                            </select>
                        </label>
                        <div class="absolute bottom-10 left-0 items-center w-full flex items-center justify-center" v-if="showSchool">
                            <div class="loader"></div>
                        </div>
                    </div>
                </div>


                <div class="flex justify-center items-center mt-10">
                    <button class="h-11 rounded-lg bg-primary focus:outline-none px-20 text-white relative" @click="updateProfile">
                       
                        <div class="flex items-center justify-center w-full absolute top-0 left-0" v-if="loading">
                            <div class="loader"></div>
                        </div>
                         <span v-else>{{$t('save_change')}}</span>
                    </button>
                </div>
           </div>
        </div>
        <!-- End edit -->
    </div>
</template>

<script>
    import EditUserIcon from "./../../components/EditUserIcon"
    import CalendarIcon from "./../../components/CalendarIcon"
    import GenderIcon from "./../../components/GenderIcon"
    import MapIcon from "./../../components/MapIcon"
    import {mapActions, mapState} from "vuex"
    import UniversityIcon from "./../../components/UniversityIcon"
    import SaveIcon from "./../../components/SaveIcon"
    import CameraIcon from "./../../components/CameraIcon"
    import Message from "./components/Message"
    import Loader from "./../../components/Loader"
    import Province from "./components/Province"
    import School from "./components/School"
    import eHeader from "./../Video/components/Header.vue"
    import helper from "./../../helper/helper"


    export default{
        name: "Profile",
        components: {
            CameraIcon,
            EditUserIcon,
            CalendarIcon,
            GenderIcon,
            MapIcon,
            UniversityIcon,
            SaveIcon,
            Message,
            Loader,
            Province,
            School,
            eHeader
        },
        data(){
            return {
                image: null,
                err: false,
                errMessage: null,
                loading: false,
                showProvince: false,
                showSchool: false,
                province:{},
                showEdit: false
            }
        },
        computed: {
            ...mapState('setting', ['provinces', 'schools', 'loadingProvince', 'loadingSchool', 'darkMode']),
            ...mapState('auth', ['stProfile', 'updatingPhoto'])
        },
        methods: {
            ...mapActions('setting', ['getProvinces', 'getSchool']),
            ...mapActions('auth', ['changeProfile', 'getStudentProfile', 'changeProfilePhotoPhoto']),

            closeProvince(){
                this.showProvince = false
            },

            closeSchool(){
                this.showSchool = false
            },

            changePhoto(){
                this.$refs.image.click()
            },

            showAllProvince(){
                this.stProfile.school.name = null
                this.showProvince = true
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

                this.loading = true
                this.changeProfile(this.stProfile).then(() => {
                    this.loading = false
                    helper.success("account_updated")
                    this.getStudentProfile(this.stProfile)
                    localStorage.setItem('stProfile', JSON.stringify(this.stProfile))
                }).catch(() => {
                    this.err = true
                    this.errMessage = "ការកែប្រែពត៍មានត្រូវបានបរាជ័យ"
                    this.loading = false
                })

            },
            closeMessage()
            {
                this.err = false
            },

            changeGender(gender){
                this.stProfile.gender = gender
            },
            selectProvince(province)
            {
                this.getSchool(province._id).then(() => {
                    this.showProvince = false
                    this.stProfile.province = province
                })
            }
            ,
            onChange() {
                this.showSchool = true
                this.getSchool(this.stProfile.province._id).then(() => {
                    this.showSchool = false
                
                })
            },
            showAllSchool()
            {
                if (!this.schools.length || this.loadingSchool) {
                    return false
                }
                this.showSchool = true
            }
            ,

            selectSchool(school)
            {

                this.showSchool = false
                this.stProfile.school = school

            }
            ,

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
            this.getProvinces()
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