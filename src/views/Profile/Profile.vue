<template>
    <div class="h-screen">
        <!-- Edit -->
        <div class="overflow-y-scroll m-5 pb-10 rounded-lg p-5 w-3/4" :class="darkMode?`text-gray-300`:`bg-white e-shadow`">
           <div class="flex items-center ">
               <div class="w-20 h-20 rounded-full bg-primary bg-cover bg-center" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
               <div class="font-semibold ml-5">
                   <div class="text-lg">{{stProfile.first_name + ' ' + stProfile.last_name}}</div>
                   <div class="text-xs" :class="darkMode?`text-white`:`text-black`">(+855) {{stProfile.phone}}</div>
               </div>

           </div>
           <div class="mt-10">
                <!-- Name -->
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label>
                            <div>{{$t('2013')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="first_name" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.first_name" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" @keypress="enableUpdate">
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{$t('2014')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="last_name" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.last_name" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" @keypress="enableUpdate">
                        </label>
                    </div>
                </div>

                <!-- Phone-->
                <div class="grid grid-cols-2 gap-5 mt-10">
                    <div>
                        <label>
                            <div>{{$t('2009')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="phone" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.phone" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" @keypress="enableUpdate">
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{$t('date_of_birth')}}</div>
                            <div class="h-2"></div>
                            <input type="date" ref="dob" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.date_of_birth" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" @change="enableUpdate">

                        </label>
                    </div>
                </div>


                <!-- Gender-->
                <div class="grid grid-cols-1 gap-5 mt-10">
                    <div>
                        <label>
                            <div>{{$t('gender')}}</div>
                            <div class="h-2"></div>

                            <select class="w-full border h-10 rounded-md focus:outline-none" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" ref="gender" v-model="stProfile.gender" @change="enableUpdate">
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
                            <select class="w-full border h-10 rounded-md focus:outline-none" id="provinces" @change="onChange($event)" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">
                                <option v-for="(province, index) in provinces" :key="index" :selected="defaultSelectedProvince(province)" :value="province._id">
                                    {{ province.name }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <div class="relative w-full">
                        <div class="absolute right-14 top-6 z-50">
                            <div class="loader" v-if="loadingSchool"></div>
                        </div>
                        <label>
                            <div>{{$t('2123')}}</div>
                            <div class="h-2"></div>
                            <div class="border cursor-pointer rounded w-full h-10 relative flex items-center pl-2 text-sm" :class="darkMode?`bg-secondary border-button`:`bg-softGray border border-gray-300`" @click="() => {this.showSchool = !this.showSchool}">
                                {{ school.name }}
                                <div class="absolute right-2 top-6" style="margin-top:-4px;">
                                    <ExpendIcon :size="9" :fill="darkMode?`#fff`:`#000`"></ExpendIcon>
                                </div>
                                <div class="absolute right-2 top-3 transform rotate-180">
                                    <ExpendIcon :size="9" :fill="darkMode?`#fff`:`#000`"></ExpendIcon>
                                </div>
                            </div>
                        </label>
                        <ul class="w-full border mt-1 rounded overflow-y-scroll h-full absolute  left-0 z-50" :class="darkMode?`border-button bg-secondary `:`bg-softGray`" v-if="showSchool && schools.length">
                            <li v-for="(school,index) in schools" :key="index" class="h-10 px-3 flex items-center justify-start cursor-pointer" @click="takeSchool(school)">
                                {{ school.name }}
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="flex justify-end items-center mt-10">
                    <button class="h-12 rounded-lg bg-primary focus:outline-none px-20 text-white relative" @click="updateProfile" :disabled="(noUpdate || updating)" :class="(noUpdate || updating)?`bg-opacity-60`:``">
                       
                        <div class="flex items-center justify-center w-full absolute -top-1 left-0" v-if="updating">
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
    import SchoolIcon from "./../../components/SchoolIcon.vue"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
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
    import ExpendIcon from "./components/ExpendIcon.vue"


    export default{
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
            eHeader,
            SchoolIcon,
            ChevronIcon,
            ExpendIcon
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
            defaultSelectedProvince(province){
                if(this.stProfile.province != undefined && this.stProfile.province._id != undefined){
                    return province._id == this.stProfile.province._id
                }
                return false
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
            this.getProvinces().then(()=>{
                if(this.stProfile.province)
                    this.getSchool(this.stProfile.province._id).then((response) =>{
                        if(response.msg == undefined){
                            for(let index = 0; index < response.data.length; index++){
                                if(this.stProfile.school._id == response.data[index]._id){
                                    this.school = response.data[index]
                                }
                            }
                        }else{
                            helper.errorMessage(response.msg)
                        }
                    })
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