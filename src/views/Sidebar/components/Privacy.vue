<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1120')}}
        </div>
        <div class="px-3 mt-8">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/profile.png" class="h-5 m-auto"> -->
                        <div><ProfileIcon :fill="darkMode?`#909090`:`#0f3c7a`"></ProfileIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1121')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full"  :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/change-password.png" class="h-5 m-auto"> -->
                        <div><LockIcon :fill="darkMode?`#909090`:`#0f3c7a`"></LockIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1122')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/parent.png" class="h-5 m-auto"> -->
                        <div><GuardianIcon :fill="darkMode?`#909090`:`#0f3c7a`"></GuardianIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1123')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/insurance.png" class="h-5 m-auto">InsuranceIcon -->
                        <div><InsuranceIcon :fill="darkMode?`#909090`:`#0f3c7a`"></InsuranceIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1124')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/invoice.png" class="h-5 m-auto"> -->
                        <div><InvoiceIcon :fill="darkMode?`#909090`:`#0f3c7a`"></InvoiceIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1125')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="logoutUser">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?``:`bg-gray-100 shadow-md `">
                        <!-- <img src="/icon/icon/logout.png" class="h-5 m-auto"> -->
                        <div><LogoutIcon :fill="darkMode?`#909090`:`#0f3c7a`"></LogoutIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1126')}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions,mapState} from "vuex"
    import ProfileIcon from "./../../../components/ProfileIcon"
    import LockIcon from "./../../../components/LockIcon"
    import GuardianIcon from "./../../../components/GuardianIcon"
    import InsuranceIcon from "./../../../components/InsuranceIcon"
    import InvoiceIcon from "./../../../components/InvoiceIcon"
    import LogoutIcon from "./../../../components/LogoutIcon"
    
    export default{
        components:{
            ProfileIcon,
            LockIcon,
            GuardianIcon,
            InsuranceIcon,
            InvoiceIcon,
            LogoutIcon
        },
        computed: {
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            ...mapActions('auth', ['logout']),
            logoutUser(){
                this.logout().then(() => {
                    this.$forceUpdate()
                })
            }
        }
    }
</script>