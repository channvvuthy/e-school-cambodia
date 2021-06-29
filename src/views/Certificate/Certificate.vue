<template>
    <div>
        <eHeader :title="`1114`"></eHeader>
    </div>
</template>
<script>
import eHeader from "./../Video/components/Header.vue"
import {mapActions} from "vuex"
export default {
   components:{
       eHeader
   },
   data(){
       return{
           certificate: [],
           loading: false
       }
   },
   methods:{
       ...mapActions('certificate', ['getCertificate'])
   },
   created(){
       this.loading = true
       this.getCertificate().then(response =>{
           this.loading = false
           this.certificate = response.data.data
       }).catch(err =>{
           console.log(err)
       })
   }
    
}
</script>