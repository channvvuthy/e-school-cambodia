<template>
    <div>
        <eHeader></eHeader>
        <div class="h-screen flex justify-center items-center flex-col" :class="darkMode?`text-gray-400`:``">
            <div v-if="checkingInsurance"  class="flex justify-center items-center h-screen relative -top-5">
                <h1 class="text-sm font-semibold font-khmer_siemreap relative -top-10">
                    <loading></loading>
                </h1>
            </div>
            <div><Icon></Icon></div>
            <div class="max-w-sm mt-10 text-center">
                {{$t('insurance_note')}}
                <div class="flex justify-between items-center mt-10">
                    <button class="rounded-lg bg-primary py-3 w-full mr-3 text-white focus:outline-none" @click="() => {this.$router.push('/video')}">{{$t('2108')}}</button>
                    <button class="rounded-lg bg-primary py-3 w-full ml-3 text-white focus:outline-none" @click="() => {this.$router.push('/library')}">{{$t('2202')}}</button>
                </div>
            </div>
            <!-- <Message v-if="err" :message="message" @closeMessage="closeMessage"></Message>
            <Province v-if="showProvince" :provinces="provinces" @selectProvince="selectProvince"
                    @closeProvince="closeProvince"></Province>
            <School v-if="showSchool" :schools="schools" @selectSchool="selectSchool"
                    @closeSchool="closeSchool"></School> -->
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex"
    import Message from "./../Auth/components/Message"
    import Loader from "./../../components/Loader"
    import Province from "./../Profile/components/Province"
    import School from "./../Profile/components/School"
    import GotInsuranceIcon from "./../../components/GotInsuranceIcon"
    import moment from "moment"
    import Loading from "./../../components/Loading"
    import eHeader from "./../Video/components/Header.vue"
    import Icon from "./components/Icon.vue"
    export default{
        name: "Insurance",
        components: {
            Message,
            Loader,
            Province,
            School,
            Loading,
            GotInsuranceIcon,
            eHeader,
            Icon
        },
        data(){
            return {
                showProvince: false,
                showSchool: false,
                err: false,
                message: "",
                yourGuardian: {
                    phone: "",
                    type: ""
                }
            }
        },
        computed: {
            ...mapState('insurance', ['insuranceStatus', 'checkingInsurance', 'loadingConfirm', 'userInsurance']),
            ...mapState('auth', ['stProfile']),
            ...mapState('guardian', ['guardians', 'loadingGuardian']),
            ...mapState('setting', ['provinces', 'schools', 'loadingProvince', 'loadingSchool', 'darkMode']),

        },
        methods: {
            ...mapActions('insurance', ['checkInsurance', 'confirmInsurance']),
            ...mapActions('auth', ['getStudentProfile']),
            ...mapActions('guardian', ['getGuardian']),
            ...mapActions('setting', ['getProvinces', 'getSchool']),
            closeMessage(){
                this.err = false
            },
            showAllProvince(){
                this.stProfile.school.name = null
                this.showProvince = true
            },
            selectProvince(province)
            {
                this.getSchool(province._id).then(() => {
                    this.showProvince = false
                    this.stProfile.province = province
                })
            },
            formatDate(date){
                moment.locale('km');
                return moment(date).format('ll');
            },
            showAllSchool()
            {
                if (!this.schools.length || this.loadingSchool) {
                    return false
                }
                this.showSchool = true
            },
            closeProvince(){
                this.showProvince = false
            },
            closeSchool(){
                this.showSchool = false
            },
            selectSchool(school)
            {

                this.showSchool = false
                this.stProfile.school = school

            },
            confirm(){
                if (this.stProfile.first_name === "") {
                    this.err = true
                    this.message = "សូមបញ្ចូលនាមត្រកូល"
                    return

                }
                if (this.stProfile.last_name === "") {
                    this.err = true
                    this.message = "សូមបញ្ចូលនាមខ្លួន"
                    return
                }
                if (this.stProfile.phone === "") {
                    this.err = true
                    this.message = "សូមបញ្ចូលលេខទូរស័ព្ទ"
                    return
                }
                if (this.stProfile.date_of_birth === "") {
                    this.err = true
                    this.message = "សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត"
                    return
                }
                if (this.stProfile.province._id === "") {
                    this.err = true
                    this.message = "សូមជ្រើសរើសខេត្ត"
                    return
                }
                if (this.stProfile.school._id === "") {
                    this.err = true
                    this.message = "សូមជ្រើសរើសសាលា"
                    return
                }
                if (this.yourGuardian.phone === "") {
                    this.err = true
                    this.message = "សូមបញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល"
                    return
                } else {
                    this.stProfile.guardian_phone = this.yourGuardian.phone
                }
                if (this.yourGuardian.type === "") {
                    this.err = true
                    this.message = "សូមបញ្ជាក់ពីតួនាទីអាណាព្យាបាល"
                    return
                } else {
                    this.stProfile.type = this.yourGuardian.type
                }
                this.confirmInsurance(this.stProfile).then(response => {
                    if (response.data.status === 1) {
                        this.err = true
                        this.message = response.data.msg
                    } else {
                        this.checkInsurance()
                    }
                })
            }
        },
        created(){
            this.checkInsurance()
            this.getProvinces()
            this.getGuardian().then(response => {
                if (response.data.data && response.data.data.length) {
                    let theGuardian = response.data.data.map(item => item)[0]
                    this.yourGuardian.phone = theGuardian.phone
                    this.yourGuardian.type = theGuardian.type
                }
            })
        }
    }
</script>