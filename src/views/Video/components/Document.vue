<template>
    <div>
        <div class="ml-5  h-screen overflow-y-scroll pb-60 font-khmer_os flex flex-col justify-center items-center mt-3"
        :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
            <div class="text-base text-center" v-html="$t('pdf_des')"></div> 
            <button @click="openDoc" class="rounded-lg mt-5 focus:outline-none h-13 text-base text-white px-10" :class="darkMode?`bg-active`:`bg-primary`" :style="darkMode?``:`box-shadow: rgba(155, 155, 155, 0.7) 3px 4px 3px;`">{{$t('1110')}}</button>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
export default {
    components:{
    },
    props:{
        id:{
            defaualt:() =>{
                return ""
            }
        }
    },
    data(){
        return{
            url: ''
        }
    },
    computed:{
        ...mapState('playVideo', ['pdf']),
        ...mapState('setting', ['darkMode'])
    },
    methods:{
        ...mapActions('playVideo', ['getPdf']),
        openDoc(){
            this.$emit("openDoc", this.url)
        }
    },
    created(){
        this.getPdf({id: this.id}).then(response =>{
            this.url = response.data.data.url
        })
    }
}
</script>

<style>

</style>
