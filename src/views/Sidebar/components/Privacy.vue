<template>
    <div>
        <div class="text-primary font-semibold text-sm" :class="darkMode?'text-textSecondary':''">
            {{$t('1120')}}
        </div>
        <div class="px-3 my-3 mt-5">
            <div class="grid grid-cols-4 gap-x-11 gap-y-4">
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/profile.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1121')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/change-password.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1122')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/parent.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1123')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/insurance.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1124')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/invoice.png" class="h-6 m-auto">
                    </div>
                    <div class="text-xs whitespace-nowrap mt-3">
                        {{$t('1125')}}
                    </div>
                </div>
                <div class="text-center flex flex-col justify-center items-center" @click="logoutUser">
                    <div class="flex-col bg-gray-100 shadow-md rounded flex justify-center items-center h-11 cursor-pointer w-full">
                        <img src="/icon/icon/logout.png" class="h-6 m-auto">
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
    export default{
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