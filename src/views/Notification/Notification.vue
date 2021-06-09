<template>
    <div class="h-screen px-5 py-3" :class="darkMode?`bg-youtube text-gray-300`:``">
        <div class="max-w-screen-sm bg-white rounded">
            <div v-if="detail.type === 1">
                <div class="text-sm font-semibold text-base p-3">{{detail.title}}</div>
                <div class="mt-3 px-3">{{detail.content.text}}</div>
                <div :class="darkMode?``:`text-gray-500`" class="my-3 px-3 ">{{formatDate(detail.date)}}</div>
                <div class="h-3"></div>
            </div>
        </div>
        {{detail}}
    </div>
</template>
<script>
import {mapState} from "vuex"
import moment from "moment"

export default {
    computed:{
        ...mapState('setting', ['darkMode'])
    },
    data(){
        return{
            detail: {}
        }
    },
    methods:{
        formatDate(date){
            moment.locale('en');
            return moment(date).format('DD-MM-YYYY h:mm');
        },
    },
    created(){
        this.detail = this.$route.params.detail
    }
}
</script>