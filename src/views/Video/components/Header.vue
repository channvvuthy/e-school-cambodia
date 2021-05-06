<template>
    <div class="w-full h-28 flex items-end pb-3 shadow"
        :class="darkMode?'bg-secondary border-secondary text-textSecondary':'bg-white border-gray-300'">
        <div class="flex px-10 items-center">
            <div class="shadow rounded-md flex justify-center items-center h-8 px-3 mr-4 cursor-pointer"
            :class="isHide?`ml-7`:`ml-3`"
             @click="()=>{this.$router.go(-1)}">
                <BackIcon :width="20" :height="20"></BackIcon>
            </div>
            <div class="text-base font-mediums">{{$t('2126')}}</div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import BackIcon from "./../../../components/BackIcon.vue"
    export default{
        name:"VideoHeader",
        components:{
            BackIcon
        },
        computed:{
            ...mapState('setting', ['isHide','darkMode'])
        }

    }
</script>
