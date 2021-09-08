<template>
    <div class="h-screen">
        <!-- Detail -->
         <template v-if="!isEdit">
            <div class="flex mt-5 px-5">
                <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                    <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                        <div class="w-32 h-32 rounded-full bg-gray-300 bg-cover bg-center" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
                    </div>
                    <div class="w-full bg-red-100 bg-cover h-40" style="background-image:url('cover.jpg');background-repeat:no-repeat;background-position:0px -5px;">
                    
                    </div>
                    <div class="h-36 pt-14" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="text-base pt-5 text-center font-bold" :class="darkMode?``:`text-primary`">
                        </div>
                        <div class="text-center">
                            <!-- {{relative.grade}} -->
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 ml-5 w-full">
                    <div class="shadow-md rounded-xl relative cursor-pointer" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`"  @click="()=>{this.isEdit = true}">
                        <div class="flex items-center justify-between px-10 py-3">
                            <div>
                                {{$t('location')}}
                            </div>
                            <div class="cursor-pointer">
                                <EditIcon :fill="darkMode?`#909090`:`#000000`" :size="18"></EditIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <MarkerIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></MarkerIcon>
                                </div>
                                <div class="mt-2">
                                    <span v-if="stProfile.province">
                                        {{stProfile.province.name}}
                                    </span>
                                    <span v-else>
                                        E-School
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3 cursor-pointer" @click="()=>{this.isEdit = true}">
                            <div>
                                {{$t('2123')}}
                            </div>
                            <div class="cursor-pointer">
                                <EditIcon :fill="darkMode?`#909090`:`#000000`" :size="18"></EditIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <SchoolIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></SchoolIcon>
                                </div>
                                <div class="mt-2">
                                    <span v-if="stProfile.school">
                                       <span :title="stProfile.school.name"> {{cutString(stProfile.school.name,20)}}</span>
                                    </span>
                                    <span v-else>
                                        E-School
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('activity', stProfile._id)">
                            <div>
                                {{$t('summary')}}
                            </div>
                            <div class="transform -rotate-90">
                                <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <QuizIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></QuizIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('watch-video', stProfile._id)">
                            <div>
                            {{$t('1117')}}
                            </div>
                            <div class="transform -rotate-90">
                                <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <WatchIcon :fill="darkMode?`#909090`:`#0f3c7a`" :width="50" :height="50"></WatchIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('read-book', stProfile._id)">
                            <div>
                            {{$t('1118')}}
                            </div>
                            <div class="transform -rotate-90">
                                <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <BookIcon :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></BookIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="reportDetail('attendant', stProfile._id)">
                            <div>
                            {{$t('attendant')}}
                            </div>
                            <div class="transform -rotate-90">
                                <ChevronIcon :fill="darkMode?`#909090`:`#000000`"></ChevronIcon>
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <Attendant :fill="darkMode?`#909090`:`#0f3c7a`" :size="50"></Attendant>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- End Detail -->
        <!-- Edit -->
        <div v-if="isEdit" class="m-5 rounded-lg p-5 w-3/4 z-10" :class="darkMode?`text-gray-300`:`bg-white e-shadow`">
           <div class="flex items-center ">
               <div class="w-20 h-20 rounded-full bg-primary bg-cover bg-center" :style="{backgroundImage:`url(${stProfile.photo})`}"></div>
               <div class="font-semibold ml-5">
                   <div class="text-lg">{{stProfile.first_name + ' ' + stProfile.last_name}}</div>
                   <div class="text-xs" :class="darkMode?`text-white`:`text-black`">(+855) {{stProfile.phone}}</div>
               </div>

           </div>
           <div class="mt-5">
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
                <div class="grid grid-cols-2 gap-5 mt-6">
                    <div>
                        <label>
                            <div>{{$t('2009')}}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="phone" class="border focus:outline-none h-10 rounded-md w-full pl-2" v-model="stProfile.phone" :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `" @keypress="enableUpdate" disabled>
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
                <div class="grid grid-cols-1 gap-5 mt-6">
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
                <div class="grid grid-cols-2 gap-5 mt-6">
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
                        <ul class="w-full border mt-1 rounded overflow-y-scroll absolute  left-0 z-50" :class="darkMode?`border-button bg-secondary `:`bg-softGray`" v-if="showSchool && schools.length" style="z-index:100;height:300px;">
                            <li v-for="(school,index) in schools" :key="index" class="h-10 px-3 flex items-center justify-start cursor-pointer" @click="takeSchool(school)">
                                {{ school.name }}
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="flex justify-end items-center mt-6 mb-2">
                    <button class="h-12 rounded-md bg-primary focus:outline-none px-20 text-white relative" @click="updateProfile" :disabled="(noUpdate || updating)" :class="(noUpdate || updating)?`bg-opacity-60`:``">
                       
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
    import MarkerIcon from "./../../components/MarkerIcon.vue"
    import QuizIcon from "./../../components/QuizIcon.vue"
    import WatchIcon from "./../../components/YoutubeIcon.vue"
    import BookIcon from "./../../components/BookIcon.vue"
    import Attendant from "./../../components/AttendantIcon.vue"
    import EditIcon from "./../../components/EditIcon.vue"


    export default{
        components: {
            Attendant,
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
            ExpendIcon,
            MarkerIcon,
            QuizIcon,
            WatchIcon,
            BookIcon,
            EditIcon
            
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