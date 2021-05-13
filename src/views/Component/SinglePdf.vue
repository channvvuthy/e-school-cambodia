<template>
  <div>
    <div v-if="loading" class="w-full flex justify-center items-center h-screen pb-40">
        <img src="/ajax-loader.gif" alt="">
    </div>
    <div v-else>
        <pdf :src="pdfFile" :key="i" v-for="i in numPages" :page="i"></pdf>
    </div>
  </div>
</template>
 
<script>
    import pdf from 'vue-pdf'
    export default {
        components: {
            pdf
        },
        props:{
            pdfUrl:{
                default:()=>{
                    return ""
                }
            }
        },
        data(){
            return{
                loading: false,
                currentPage: 0,
                pageCount: 0,
                pdfFile: "",
                numPages: undefined,
            }
        },
        methods:{
            progress(){
                // console.log("djkf dkfn")
            }
        },
        created(){
            this.loading = true
            this.pdfFile = pdf.createLoadingTask(this.pdfUrl);
            this.pdfFile.promise.then(pdf => {
                this.numPages = pdf.numPages;
                this.loading = false
            })
        }
    }
</script>