<template>
    <div class="flex flex-col justify-center items-center h-5/6" :class="darkMode?`text-gray-300`:`text-primary`">
        <img src="/icon/icon/empty.svg" class="h-24">
        <p class="text-md font-semibold mt-3">{{$t('no_result')}}</p>
        <div class="h-3"></div>
        <p class="text-sm">{{$t(des)}}</p>
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:{
        des:{
            default:function(){
                return "no_result_des"
            }
        }
    },
    computed:{
        ...mapState('setting', ['darkMode'])
    }
}
</script>