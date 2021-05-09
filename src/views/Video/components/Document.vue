<template>
    <div class="ml-5 mt-3 rounded-t h-screen overflow-y-scroll pb-60 font-khmer_os flex flex-col justify-center items-center bg-white"
    >
        <div class="text-base text-center" v-html="$t('pdf_des')"></div> 
        <button class="bg-primary rounded-md mt-5 focus:outline-none h-14 text-base text-white px-10" style="box-shadow: 6px 6px 3px #9b9b9b;">{{$t('1110')}}</button>
    </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
export default {
    props:{
        id:{
            defaualt:() =>{
                return ""
            }
        }
    },
    computed:{
        ...mapState('playVideo', ['pdf'])
    },
    methods:{
        ...mapActions('playVideo', ['getPdf'])
    },
    created(){
        this.getPdf({id: this.id}).then(response =>{
            console.log(response.data.data)
        })
    }
}
</script>

<style>

</style>
