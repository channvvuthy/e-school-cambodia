<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-white':''">
            {{$t('1120')}}
        </div>
        <div class="px-3 mt-8">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('profile')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `profile`?`bg-byline`:`bg-button`}`:`${$route.name === `profile`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <ProfileIcon :fill="darkMode?`#212121`:`#FFFFFF`"  v-if="$route.name === `profile`"></ProfileIcon>
                            <ProfileIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></ProfileIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1121')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center"  @click="goTo('change-password')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full"  :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
                        <div><LockIcon :fill="darkMode?`#909090`:`#0f3c7a`"></LockIcon></div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1122')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('parent')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `parent`?`bg-byline`:`bg-button`}`:`${$route.name === `parent`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <GuardianIcon :fill="darkMode?`#212121`:`#FFFFFF`"  v-if="$route.name === `parent`"></GuardianIcon>
                            <GuardianIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></GuardianIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1123')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="goTo('insurance')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `insurance`?`bg-byline`:`bg-button`}`:`${$route.name === `insurance`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <InsuranceIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `insurance`"></InsuranceIcon>
                            <InsuranceIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></InsuranceIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1124')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center"  @click="goTo('invoice')">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`${$route.name === `invoice`?`bg-byline`:`bg-button`}`:`${$route.name === `invoice`?`bg-primary`:`bg-gray-100`} shadow-md`">
                        <div>
                            <InvoiceIcon :fill="darkMode?`#212121`:`#FFFFFF`" v-if="$route.name === `invoice`"></InvoiceIcon>
                            <InvoiceIcon :fill="darkMode?`#909090`:`#0f3c7a`" v-else></InvoiceIcon>
                        </div>

                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1125')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="logoutUser">
                    <div class="flex-col rounded flex justify-center items-center h-10 cursor-pointer w-full" :class="darkMode?`bg-button`:`bg-gray-100 shadow-md `">
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
    import InvoiceIcon from "./../../../components/BillInvoiceIcon.vue"
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
                    this.$router.push('/').catch((err)=>{err})
                })
            },
            goTo(page) {
                this.$router.push({ name: page }).catch((err)=>{err});
            },
        }
    }
</script>