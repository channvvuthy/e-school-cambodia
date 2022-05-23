<template>
    <div class="h-screen">
        <a
                :class="darkMode ? `text-gray-300`: `text-primary`"
                @click="()=>{this.$router.go(-1)}"
                href="#" class="absolute right-2 bottom-2">
            <BackMenuIcon :fill="darkMode?`#ffffff`:`#055174`" :width="30"/>
        </a>
        <!-- Detail -->
        <template v-if="!isEdit">
            <div class="flex mt-5 px-5">
                <div class="w-3/5 rounded-xl overflow-hidden shadow-md relative">
                    <input type="file" ref="photo" class="hidden" accept="image/png, image/gif, image/jpeg"
                           @change="onSelectedPhoto">
                    <div class="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center">
                        <div
                                class="w-32 h-32 rounded-full bg-gray-300 bg-cover bg-center flex items-center justify-center relative cursor-pointer"
                                :style="{backgroundImage:`url(${stProfile.photo})`}"
                                @mouseover="() =>{this.isPic = true}" @mouseleave="() => {this.isPic = false}"
                                @click="()=>{this.$refs.photo.click()}">
                            <div
                                    class="bg-gradient-to-t pb-2 from-black absolute w-full h-full rounded-full flex items-end justify-center"
                                    v-if="isPic">
                                <CameraIcon fill="#FFFFFF"/>
                            </div>
                        </div>
                    </div>
                    <input type="file" class="hidden" ref="cover" @change="changeCover"
                           accept="image/png, image/gif, image/jpeg">
                    <div class="w-full bg-red-100 bg-cover h-40"
                         :style="{backgroundImage:`url(${cover})`}"
                         style="background-repeat:no-repeat;background-position:0 -5px;">
                        <div class="right-10 absolute top-2 absolute z-50" v-if="changingCover">
                            <div class="loader"></div>
                        </div>
                        <div
                                v-else
                                @click="()=>{this.$refs.cover.click()}"
                                style="background-color: rgba(5,81,116,0.7)"
                                class="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer right-4 absolute top-2">
                            <CameraIcon fill="#FFFFFF"/>
                        </div>
                    </div>
                    <div class="h-36 pt-14" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="text-base pt-5 text-center font-bold" :class="darkMode?``:`text-primary`">
                        </div>
                        <div class="text-center font-black">
                            (+855){{ stProfile.phone }}
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 ml-5 w-full">
                    <div class="shadow-md rounded-xl relative"
                         :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="()=>{this.isEdit = true}">
                            <div class="text-center w-full">
                                {{ $t('name') }}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <ProfileIcon :fill="darkMode?`#909090`:`#055174`" :size="50"/>
                                </div>
                                <div class="mt-2">
                                      <span>
                                          {{ stProfile.first_name }}  {{ stProfile.last_name }}
                                      </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative"
                         :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="()=>{this.isEdit = true}">
                            <div class="text-center w-full">
                                {{ $t('gender') }}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <GenderIcon :fill="darkMode?`#909090`:`#055174`" :size="50"/>
                                </div>
                                <div class="mt-2">
                                      <span>
                                          {{ stProfile.gender == "M" ? $t('2015') : $t('2016') }}
                                      </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative"
                         :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="()=>{this.isEdit = true}">
                            <div class="text-center w-full">
                                {{ $t('location') }}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <MarkerIcon :fill="darkMode?`#909090`:`#055174`" :size="50"/>
                                </div>
                                <div class="mt-2">
                                    <span v-if="stProfile.province">
                                        {{ stProfile.province.name }}
                                    </span>
                                    <span v-else>
                                        {{ $t('unknown') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer shadow-md rounded-xl relative"
                         :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                        <div class="flex items-center justify-between px-10 py-3" @click="()=>{this.isEdit = true}">
                            <div class="text-center w-full">
                                {{ $t('2123') }}
                            </div>
                            <div class="flex w-full h-full flex-col items-center justify-center absolute left-0 top-0">
                                <div class="mt-8">
                                    <SchoolIcon :fill="darkMode?`#909090`:`#055174`" :size="50"/>
                                </div>
                                <div class="mt-2 px-3">
                                    <span v-if="stProfile.school">
                                        {{ stProfile.school.name }}
                                    </span>
                                    <span v-else>
                                        {{ $t('unknown') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="p-5 flex space-x-6">
                <div :class="darkMode ? `bg-secondary text-gray-300` : `bg-white text-primary`"
                     @click="social"
                     class="p-5 rounded-lg shadow flex items-center space-x-3 cursor-pointer font-black w-full justify-center">
                    <SocialIcon :fill="darkMode?`#909090`:`#055174`"/>
                    <div>
                        {{$t('social')}}
                    </div>
                </div>
                <div :class="darkMode ? `bg-secondary text-gray-300` : `bg-white text-primary`"
                     @click="()=>{this.isChangeName = true}"
                     class="p-5 rounded-lg shadow flex items-center space-x-3 cursor-pointer w-full justify-center">
                    <EditIcon :fill="darkMode?`#909090`:`#055174`"/>
                    <div>
                        {{$t('request_change_name')}}
                    </div>
                </div>
                <div :class="darkMode ? `bg-secondary text-gray-300` : `bg-white text-primary`"
                     @click="()=>{this.isChangePhone = true}"
                     class="p-5 rounded-lg shadow flex items-center space-x-3 cursor-pointer w-full justify-center">
                    <EditIcon :fill="darkMode?`#909090`:`#055174`"/>
                    <div>
                        {{$t('request_change_phone')}}
                    </div>
                </div>

            </div>
        </template>
        <!-- End Detail -->
        <!-- Edit -->
        <div v-if="isEdit" class="m-5 rounded-lg p-5 w-3/4 z-10" :class="darkMode?`text-gray-300`:`bg-white e-shadow`">
            <input type="file" ref="photo" class="hidden" accept="image/png, image/gif, image/jpeg"
                   @change="onSelectedPhoto">
            <div class="flex items-center ">
                <div class="w-20 h-20 rounded-full bg-primary bg-cover bg-center cursor-pointer relative"
                     :style="{backgroundImage:`url(${stProfile.photo})`}"
                     @click="()=>{this.$refs.photo.click()}" @mouseover="() =>{this.isPic = true}"
                     @mouseleave="() => {this.isPic = false}">
                    <div
                            class="bg-gradient-to-t pb-2 from-black absolute w-full h-full rounded-full flex items-end justify-center"
                            v-if="isPic">
                        <CameraIcon fill="#FFFFFF"/>
                    </div>
                </div>
                <div class="font-semibold ml-5">
                    <div class="text-lg">{{ stProfile.first_name + ' ' + stProfile.last_name }}</div>
                    <div class="text-xs" :class="darkMode?`text-white`:`text-black`">(+855) {{ stProfile.phone }}</div>
                </div>

            </div>
            <div class="mt-5">
                <!-- Name -->
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label>
                            <div>{{ $t('2013') }}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="first_name"
                                   class="border focus:outline-none h-10 rounded-md w-full pl-2"
                                   disabled
                                   v-model="stProfile.first_name"
                                   :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `"
                                   @keypress="enableUpdate">
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{ $t('2014') }}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="last_name"
                                   class="border focus:outline-none h-10 rounded-md w-full pl-2"
                                   disabled
                                   v-model="stProfile.last_name"
                                   :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `"
                                   @keypress="enableUpdate">
                        </label>
                    </div>
                </div>

                <!-- Phone-->
                <div class="grid grid-cols-2 gap-5 mt-6">
                    <div>
                        <label>
                            <div>{{ $t('2009') }}</div>
                            <div class="h-2"></div>
                            <input type="text" ref="phone" class="border focus:outline-none h-10 rounded-md w-full pl-2"
                                   :value="`(+855) ${stProfile.phone}`"
                                   :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `"
                                   @keypress="enableUpdate" disabled>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div>{{ $t('date_of_birth') }}</div>
                            <div class="h-2"></div>
                            <input type="date" ref="dob" class="border focus:outline-none h-10 rounded-md w-full pl-2"
                                   v-model="stProfile.date_of_birth"
                                   :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `"
                                   @change="enableUpdate">

                        </label>
                    </div>
                </div>


                <!-- Gender-->
                <div class="grid grid-cols-1 gap-5 mt-6">
                    <div>
                        <label>
                            <div>{{ $t('gender') }}</div>
                            <div class="h-2"></div>

                            <select class="w-full border h-10 rounded-md focus:outline-none"
                                    :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `"
                                    ref="gender"
                                    v-model="stProfile.gender" @change="enableUpdate">
                                <option value="F" :selected="stProfile.gender === `F`">{{ $t('2016') }}</option>
                                <option value="M" :selected="stProfile.gender === `M`">{{ $t('2015') }}</option>
                            </select>
                        </label>
                    </div>
                </div>

                <!-- Province -->
                <div class="grid grid-cols-2 gap-5 mt-6">
                    <div>
                        <label>
                            <div>{{ $t('2124') }}</div>
                            <div class="h-2"></div>
                            <select class="w-full border h-10 rounded-md focus:outline-none" id="provinces"
                                    @change="onChange($event)"
                                    :class="darkMode?`bg-secondary border-button`:`bg-softGray border-gray-300 `">
                                <option v-for="(province, index) in provinces" :key="index"
                                        :selected="defaultSelectedProvince(province)" :value="province._id">
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
                            <div>{{ $t('2123') }}</div>
                            <div class="h-2"></div>
                            <div class="border cursor-pointer rounded w-full h-10 relative flex items-center pl-2 text-sm"
                                 :class="darkMode?`bg-secondary border-button`:`bg-softGray border border-gray-300`"
                                 @click="() => {this.showSchool = !this.showSchool}">
                                {{ school.name }}
                                <div class="absolute right-2 top-6" style="margin-top:-4px;">
                                    <ExpendIcon :size="9" :fill="darkMode?`#fff`:`#000`"/>
                                </div>
                                <div class="absolute right-2 top-3 transform rotate-180">
                                    <ExpendIcon :size="9" :fill="darkMode?`#fff`:`#000`"/>
                                </div>
                            </div>
                        </label>
                        <ul class="w-full border mt-1 rounded overflow-y-scroll absolute  left-0 z-50"
                            :class="darkMode?`border-button bg-secondary `:`bg-softGray`"
                            v-if="showSchool && schools.length"
                            style="z-index:100;height:300px;">
                            <li v-for="(school,index) in schools" :key="index"
                                class="h-10 px-3 flex items-center justify-start cursor-pointer"
                                @click="takeSchool(school)">
                                {{ school.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex justify-end items-center mt-6 mb-2">
                    <button class="mr-5 h-12 rounded-md bg-secondary focus:outline-none px-5 text-white"
                            @click="()=>{this.isEdit = false}">
                        <span>{{ $t('1011') }}</span>
                    </button>
                    <button class="h-12 rounded-md bg-primary focus:outline-none px-5 text-white relative"
                            @click="updateProfile"
                            :disabled="(noUpdate || updating)" :class="(noUpdate || updating)?`bg-opacity-60`:``">
                        <div class="flex items-center justify-center w-full absolute -top-1 left-0" v-if="updating">
                            <div class="loader"></div>
                        </div>
                        <span v-else>{{ $t('save_change') }}</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- End edit -->
        <ChangeName
                :info="stProfile"
                v-if="isChangeName"
                @close="()=>{this.isChangeName = false}"
        />
        <ChangePhone
                v-if="isChangePhone"
                @close="()=>{this.isChangePhone = false}"
        />
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
    import Message from "./components/Message"
    import Loader from "./../../components/Loader"
    import Province from "./components/Province.vue"
    import School from "./components/School"
    import eHeader from "./../Video/components/Header.vue"
    import helper from "./../../helper/helper"
    import ExpendIcon from "./components/ExpendIcon.vue"
    import MarkerIcon from "./../../components/MarkerIcon.vue"
    import QuizIcon from "./../../components/QuizIcon.vue"
    import BookIcon from "./../../components/BookIcon.vue"
    import EditIcon from "./../../components/EditIcon.vue"
    import ProfileIcon from "./../../components/ProfileIcon.vue"
    import ChangeName from "./components/ChangeName";
    import ChangePhone from "./components/ChangePhone";
    import SocialIcon from "../../components/SocialIcon";
    import BackMenuIcon from "../../components/BackMenuIcon";

    export default {
        components: {
            BackMenuIcon,
            SocialIcon,
            ChangePhone,
            ChangeName,
            ProfileIcon,
            GenderIcon,
            CameraIcon,
            EditUserIcon,
            CalendarIcon,
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
            BookIcon,
            EditIcon

        },
        data() {
            return {
                isChangePhone: false,
                isChangePassword: false,
                isChangeName: false,
                changingCover: false,
                image: null,
                err: false,
                errMessage: null,
                loading: false,
                noUpdate: true,
                showProvince: false,
                showSchool: false,
                isEdit: false,
                isPic: false,
                cover: "cover.jpg",
                province: {
                    _id: "",
                    name: "",
                },
                school: {
                    _id: "",
                    name: "",
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
            ...mapActions('auth', ['changeProfile', 'getStudentProfile', 'changeProfilePhotoPhoto', 'updateCover']),
            ...mapActions('upload', ['singleUpload']),
            reportDetail(page, user_id) {
                this.$router.push({name: page, params: {user_id}})
            },
            closeProvince() {
                this.showProvince = false
            },

            closeSchool() {
                this.showSchool = false
            },

            changePhoto() {
                this.$refs.image.click()
            },
            defaultSelectedProvince(province) {
                if (this.stProfile.province != undefined && this.stProfile.province._id != undefined) {
                    return province._id == this.stProfile.province._id
                }
                return false
            },
            cutString(text, limit) {
                return helper.cutString(text, limit)
            },

            showAllProvince() {
                this.stProfile.school.name = null
                this.showProvince = true
            },
            changeCover(event) {
                this.changingCover = true
                if (event.target.files.length) {
                    const file = event.target.files[0];
                    let formData = new FormData();
                    formData.append("photo", file)
                    this.singleUpload(formData).then(res => {
                        if (res.data) {
                            let cover = new FormData();
                            cover.append("photo", res.data.url)
                            this.updateCover(cover).then(res => {
                                this.cover = res.data.photo
                                let stProfile = localStorage.getItem("stProfile")
                                stProfile = JSON.parse(stProfile)
                                stProfile.photo_cover = this.cover
                                this.$store.commit("auth/studentProfile", stProfile)
                                localStorage.setItem("stProfile", JSON.stringify(stProfile))
                                this.changingCover = false
                            })
                        }
                    })

                }
            },
            onSelectedPhoto(event) {
                if (event.target.value) {
                    this.loading = true
                    const file = event.target.files[0];
                    let formData = new FormData();
                    formData.append("photo", file)
                    this.singleUpload(formData).then(res => {
                        if (res.data && res.length) {
                            let photo = new FormData()
                            photo.append("photo", res.data[0].url)
                            this.changeProfilePhotoPhoto(photo).then(response => {
                                if (res.data && res.length) {
                                    let stProfile = localStorage.getItem("stProfile")
                                    stProfile = JSON.parse(stProfile)
                                    stProfile.photo = response.data.photo
                                    this.$store.commit("auth/studentProfile", stProfile)
                                    localStorage.setItem("stProfile", JSON.stringify(stProfile))
                                }
                                this.loading = false
                            })
                        }
                        this.loading = false

                    })

                }
            },
            updateProfile() {
                if (!this.$refs.first_name.value) {
                    helper.errorMessage("please_enter_first_name")
                    this.$refs.first_name.focus()
                    return
                }
                if (!this.$refs.last_name.value) {
                    helper.errorMessage("please_enter_last_name")
                    this.$refs.last_name.focus()
                    return
                }
                if (!this.$refs.phone.value) {
                    helper.errorMessage("please_enter_phone_number")
                    this.$refs.phone.focus()
                    return
                }
                if (!this.$refs.dob.value) {
                    helper.errorMessage("please_enter_date_of_birth")
                    this.$refs.dob.focus()
                    return
                }
                if (this.school._id == "") {
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
            filterSchool(event) {

            },
            closeMessage() {
                this.err = false
            },

            changeGender(gender) {
                this.stProfile.gender = gender
            },
            enableUpdate() {
                this.noUpdate = false
                if (this.province.name == "") {
                    this.province = this.stProfile.province
                }
            },
            takeSchool(school) {
                this.noUpdate = false
                if (this.province.name == "") {
                    this.province = this.stProfile.province
                }
                this.school = school
                this.showSchool = false
            },
            onChange(e) {
                this.noUpdate = false
                this.showSchool = false
                try {
                    let name = e.target.options[e.target.options.selectedIndex].text
                    this.province = {
                        _id: e.target.value,
                        name: name
                    }
                } catch (errr) {
                }
                this.getSchool(e.target.value).then(() => {
                    this.school.name = ""
                    this.school._id = ""
                })
            },
            showAllSchool() {
                if (!this.schools.length || this.loadingSchool) {
                    return false
                }
                this.showSchool = true
            },
            onFileChange(e) {
                const file = e.target.files[0];
                this.stProfile.photo = URL.createObjectURL(file);
                this.image = this.$refs.image.files[0];

                let formData = new FormData();

                formData.append("image", e.target.files[0]);

                this.changeProfilePhotoPhoto(formData).then(response => {
                    this.stProfile.photo = response.data.photo
                    this.getStudentProfile(this.stProfile)
                    localStorage.setItem('stProfile', JSON.stringify(this.stProfile))

                }).catch(() => {
                })
            },
            social() {
                this.$router.push({
                    name: "social",
                    params: {
                        user: this.stProfile
                    }
                })
            }
        },
        mounted() {
            this.cover = this.stProfile.photo_cover ? this.stProfile.photo_cover : this.cover
        },
        created() {
            this.getProvinces().then(() => {
                if (this.stProfile.province)
                    this.getSchool(this.stProfile.province._id).then((response) => {
                        if (response.msg == undefined) {
                            for (let index = 0; index < response.data.length; index++) {
                                if (this.stProfile.school._id == response.data[index]._id) {
                                    this.school = response.data[index]
                                }
                            }
                        } else {
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