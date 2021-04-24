<template>
    <div class="flex justify-center items-center min-h-screen bg-white">
        <div class="flex-col rounded-3xl w-96 p-6 shadow-2xl bg-white">
            <div class="flex justify-between items-center">
                <div class="transform rotate-90 cursor-pointer" @click="()=>{$router.go(-1)}">
                    <ChevronIcon></ChevronIcon>
                </div>
                <div class="flex-1 text-center text-md">
                    {{$t('2008')}}
                </div>
            </div>
            <div class="h-10"></div>
            <form class="flex-col text-sm font-khmer_os">
                <div class="relative">
                    <div class="opacity-50 absolute left-0 top-2">
                        <img src="/icon/icon/user.png" class="h-5">
                    </div>
                    <input
                            type="text"
                            placeholder="នាមត្រកូល"
                            class="p-2 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8 h-10 placeholder-gray-500"
                            v-model="studentInfo.first_name"
                    />
                </div>
                <div class="relative">
                    <div class="opacity-50 absolute left-0 top-2">
                        <img src="/icon/icon/user.png" class="h-5">
                    </div>
                    <input
                            type="text"
                            placeholder="នាមខ្លួន"
                            class="p-2 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8 h-10 placeholder-gray-500"
                            v-model="studentInfo.last_name"
                    />
                </div>
            </form>
            <div class="flex justify-start mt-2 items-center text-sm font-khmer_os">
                <label class="flex mr-10">
                    <div @click="setGender('male')"
                         class="mr-4 flex justify-center items-center border border-gray-500 w-4 h-4 rounded-full">
                        <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.gender==='M'"></div>
                    </div>
                    <input type="radio" class="mr-2 hidden" name="gender" value="M" v-model="studentInfo.gender"
                           ref="male"/>
                    <span>{{$t('2015')}}</span>
                </label>
                <label class="flex">
                    <div @click="setGender('female')"
                         class="mr-4 flex justify-center items-center border border-gray-500 w-4 h-4 rounded-full">
                        <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.gender==='F'"></div>
                    </div>
                    <input type="radio" class="mr-2 hidden" name="gender" value="F" v-model="studentInfo.gender"
                           ref="female"/>
                    <span>{{$t('2016')}}</span>
                </label>
            </div>
            <div class="h-5"></div>
            <form class="flex-col text-sm font-khmer_os w-full">
                <div class="relative">
                    <span class="absolute left-0 mt-2 text-sm font-medium opacity-40">
                        <PhoneIcon size="22"></PhoneIcon>
                    </span>
                    <input type="text" :placeholder="$t('2009')"
                           v-model="studentInfo.phone"
                           @keypress="isNumber($event)"
                           class="h-10 placeholder-gray-500 p-2 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8"/>
                </div>
                <div class="relative">
                    <span class="absolute left-0 mt-2 text-sm font-medium opacity-50">
                            <img src="/icon/icon/lock.png">
                        </span>
                    <input type="password" :placeholder="$t('2010')"
                           v-model="studentInfo.password"
                           class="h-10 placeholder-gray-500 p-2 px-0 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8"/>

                </div>
                <div class="relative">
                    <span class="absolute left-0 mt-2 text-sm font-medium opacity-50">
                            <img src="/icon/icon/lock.png">
                        </span>
                    <input type="password" :placeholder="$t('2017')"
                           v-model="studentInfo.confirm_password"
                           class="h-10 placeholder-gray-500 p-2 px-0 border border-solid border-1 border-gray-500 w-full focus:outline-none border-t-0 border-r-0 border-l-0 mb-4 pl-8"/>
                </div>
            </form>
            <div class="flex justify-start items-center mt-4">
                <label class="flex text-sm">
                    <div @click="()=>{studentInfo.accepted_term=true}"
                         class="mr-4 flex justify-center items-center border border-gray-500 w-4 h-4 rounded-full">
                        <div class="bg-gray-500 w-2 h-2 rounded-full" v-if="studentInfo.accepted_term"></div>
                    </div>
                    <input type="radio" class="mr-3 cursor-pointer hidden" v-model="studentInfo.accepted_term"
                           :checked="studentInfo.accepted_term"
                           value="1"
                           name="term"
                    >
                    <div class="flex"><span class="pr-1">{{$t('2018')}}</span><span
                            class="text-blue-700 cursor-pointer"
                            @click="showTermAndCondition">{{$t('2019')}}</span>
                    </div>
                </label>
            </div>
            <div class="h-5"></div>
            <button class="p-3 mt-4 text-center text-white rounded-lg bg-primary h-11 w-full text-sm outline-none text-sm cursor-pointer font-khmer_os"
                    @click="createAccount" :disabled="(loadingRegister || success)">
                បង្កើតគណនីថ្មី
                <Loader v-if="loadingRegister" :size="10"></Loader>
            </button>
            <ErrMessage v-if="err" :message="message" @closeErr="closeErr"></ErrMessage>
            <TermAndCondition v-if="showTerm" @closeTermAndCondition="closeTermAndCondition"></TermAndCondition>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import ErrMessage from "./components/ErrMessage"
    import Loader from "./../../components/Loader"
    import helper from "./../../helper/helper"
    import TermAndCondition from "./components/TermAndCondition"
    import ChevronIcon from "./../../components/ChevronIcon.vue"
    import PhoneIcon from "./../../components/PhoneIcon.vue"

    import config from "./../../config"
    export default{
        name: "Create",
        components: {
            ErrMessage,
            PhoneIcon,
            ChevronIcon,
            Loader,
            TermAndCondition
        },
        data(){
            return {
                err: false,
                message: null,
                showTerm: false,
                success: false,
                studentInfo: {
                    first_name: null,
                    last_name: null,
                    phone: null,
                    password: null,
                    confirm_password: null,
                    gender: null,
                    device_id: null,
                    device_name: null,
                    device_os: null,
                    player_id: null,
                    app_version: config.appVersion,
                    accepted_term: false
                }
            }
        },
        computed: {
            ...mapState('auth', ['loadingRegister'])
        },
        methods: {
            ...mapActions('auth', ['register']),

            closeTermAndCondition(){
                this.showTerm = false
            },

            showTermAndCondition(){
                this.showTerm = true
            },

            closeErr(){
                this.err = false
            },

            isNumber(evt){
                return helper.isNumber(evt)
            },
            setGender(gender){
                if (gender === 'male') {
                    this.$refs.male.click()
                } else {
                    this.$refs.female.click()
                }

            },

            createAccount(){
                let device_id = helper.deviceId()
                this.studentInfo.device_id = device_id
                let platform = helper.deviceOs()
                this.studentInfo.device_os = platform

                if (!this.studentInfo.first_name) {
                    this.message = "សូមបញ្ចូលនាមត្រកូល"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.last_name) {
                    this.message = "សូមបញ្ចូលនាមខ្លួន"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.gender) {
                    this.message = "សូមជ្រើរើសភេទ"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.phone) {
                    this.message = "សូមបញ្ចូលលេខទូរស័ព្ទ"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.password) {
                    this.message = "សូមបញ្ចូលលេខសម្ងាត់"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.confirm_password) {
                    this.message = "សូមបញ្ចូលលេខសម្ងាត់ផ្ទៀងផ្ទាត់"
                    this.err = true
                    return false
                }


                if (this.studentInfo.confirm_password !== this.studentInfo.password) {
                    this.message = "ពាក្យសម្ងាត់ និងផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់មិនដូចគ្នា"
                    this.err = true
                    return false
                }

                if (!this.studentInfo.accepted_term) {
                    this.message = "សូមធ្វើការត្រួតពិនិត្យលក្ខណ្ឌ"
                    this.err = true
                    return false
                }

                this.register(this.studentInfo).then(response => {
                    if (response.status === 1) {
                        this.message = response.msg
                        this.err = true
                    } else {
                        this.success = true
                        setTimeout(() => {
                            this.$emit("registerSuccess")
                        }, 3000)
                    }
                }).catch(err => {
                    this.message = err
                    this.err = true
                })


            }
        }
    }
</script>