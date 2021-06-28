<template>
    <div>
        <eHeader :title="`1112`"></eHeader>
        <div :class="darkMode?`bg-youtube text-gray-300 mt-5 px-5 `:`mt-5 px-5 `" class="h-screen pb-80 overflow-y-scroll" @scroll="onScroll">
            <div class="w-1/2">
                <div class="relative">
                    <input type="text" class="w-full h-12 border rounded-lg pl-4 focus:outline-none shadow" :placeholder="$t('1001')" :class="darkMode?`bg-secondary border-button`:``" v-model="s" v-on:keyup.enter="search">
                    <div class="absolute right-4 top-3">
                        <SearchIcon :fill="darkMode?`#909090`:`#000000`"></SearchIcon>
                    </div>
                </div>
            </div>
            <div class="h-5"></div>
            <div v-if="documents.length <= 0" class="flex items-center justify-center h-65">
                <Empty :des="$t(`there_are_no_documents_in_this_view`)"></Empty>
            </div>
            <template v-if="loadingDoc">
                <Loading></Loading>
            </template>
            <template v-else>
                <div class="grid md:grid-cols-3 2xl:grid-cols-4 gap-5">
                    <div class="rounded-xl shadow w-full p-5" :class="darkMode?`bg-secondary`:`bg-white`" v-for="(document, index) in documents" :key="index">
                        <div class="p-8 rounded-xl inline-block cursor-pointer" :class="darkMode?`bg-button`:`bg-softGray`" @click="previewFile(document)">
                            <FolderIcon :size="50" :fill="darkMode?`#909090`:`#0f3c7a`" v-if="document.type === 1"></FolderIcon>
                            <PdfIcon :size="50" :fill="darkMode?`#909090`:`#0f3c7a`" v-if="document.type === 2"></PdfIcon>
                            <ImageIcon :size="50" :fill="darkMode?`#909090`:`#0f3c7a`" v-if="document.type === 3"></ImageIcon>
                        </div>
                        <div class="font-semibold text-lg mt-5" :class="darkMode?`text-gray-300`:`text-primary`" :title="document.name">
                            {{cutString(document.name, 25)}}
                        </div>
                        <div class="flex items-center justify-between mt-3">
                            <div class="text-gray-400 font-normal text-sm">
                                {{formatDate(document.date)}}
                            </div>
                            <div class="cursor-pointer" @click="confirmDelete(document._id)">
                                <DeleteIcon :fill="darkMode?`#909090`:`#c0272d`"></DeleteIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="fixed bottom-0 right-0 bg-transparent h-36 w-full">
            <div class="t-shadow  w-full h-36 t-shadow p-10" :style="isHide?{marginLeft:'0px'}:{marginLeft:'350px'}" style="box-shadow: 0px -3px 2px rgba(50, 50, 50, 0.);" :class="darkMode?`bg-secondary text-gray-300`:`bg-white`">
                <div class="flex items-center" :class="darkMode?``:`text-gray-500`">
                    <div class="flex items-center cursor-pointer" @click="() =>{this.$refs.add_image.click()}">
                        <div>
                            <ImageIcon :fill="darkMode?`#909090`:`#000000`"></ImageIcon>
                        </div>
                        <div class="ml-5">
                            {{$t('add_image')}}
                        </div>
                        <input type="file" class="hidden" ref="add_image" accept="image/png, image/gif, image/jpeg" @change="addImage">
                    </div>

                    <div class="flex items-center mx-20 cursor-pointer" @click="() =>{this.$refs.attach_file.click()}">
                        <div>
                            <AttachFileIcon :fill="darkMode?`#909090`:`#000000`"></AttachFileIcon>
                        </div>
                        <div class="ml-5">
                            {{$t('attach_file')}}
                        </div>
                        <input type="file" class="hidden" ref="attach_file"  accept="application/pdf" @change="addFile">
                    </div>


                    <div class="flex items-center cursor-pointer" @click="() =>{this.showDirectory = true}">
                        <div class="border rounded-full w-6 h-6 flex items-center justify-center" :class="darkMode?`border-gray-500`:`border-youtube`">
                            <AddIcon :fill="darkMode?`#909090`:`#000000`" :size="15"></AddIcon>
                        </div>
                        <div class="ml-5">
                            {{$t('create_folder')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Directroy v-if="showDirectory" @closeDirectory="closeDirectory"></Directroy>
        <!-- Preview Image -->
        <div class="w-full h-full fixed top-0 left-0 bg-black z-50 flex items-center justify-center bg-opacity-90" v-if="showPreview">
            <div class="w-96 rounded-xl flex flex-col justify-between" :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow`">
                <div class="py-4 px-5 relative">
                    {{$t('preview')}}
                    <div class="absolute right-2 top-3 cursor-pointer" @click="() => {this.showPreview = false}">
                        <CloseIcon :width="18" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                    </div>
                </div>
                <div class="border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                <div class="h-5"></div>
                <div class="px-5" v-if="directories.length">
                    <div class="mb-3"> {{$t('choose_parent_directory')}}</div>
                    <div>
                        <select v-model="directroy" class="w-full h-10 focus:outline-none" :class="darkMode?`border bg-youtube border-button text-gray-300`:`bg-white border border-gray-300`">
                            <option :value="directory._id" v-for="(directory, index) in directories" :key="index" >{{directory.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="h-5"></div>
                <div class="px-5">
                    <img :src="preview" style="max-height:80%;">
                </div>
                <div class="h-5"></div>
                <div class="flex justify-end px-5">
                    <button class="bg-primary h-11 text-white w-40 rounded-md mb-5 focus:outline-none relative" @click="createImage" :disabled="loading">
                        <div class="flex items-center absolute -top-1 justify-center w-full text-center" v-if="loading">
                            <div class="loader"></div>
                        </div>
                        <span v-else>{{$t('add_image')}}</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- Preview Pdf -->
        <div class="w-full h-full fixed top-0 left-0 bg-black z-50 flex items-center justify-center bg-opacity-90" v-if="showPdf">
            <div class="w-96 rounded-xl flex flex-col justify-between" :class="darkMode?`bg-secondary text-gray-300`:`bg-white shadow`">
                <div class="py-3 px-5 relative">
                    {{$t('preview')}}
                    <div class="absolute right-2 top-3 cursor-pointer" @click="() => {this.showPdf = false}">
                        <CloseIcon :width="18" :fill="darkMode?`#909090`:`#000000`"></CloseIcon>
                    </div>
                </div>
                <div class="border-t" :class="darkMode?`border-button`:`border-gray-300`"></div>
                <div class="h-5"></div>
                <div class="px-5">
                    <div class="mb-3"> {{$t('choose_parent_directory')}}</div>
                    <select v-model="directroy" class="w-full h-10 focus:outline-none" :class="darkMode?`border bg-youtube border-button text-gray-300`:`bg-white border border-gray-300`">
                        <option :value="directory._id" v-for="(directory, index) in directories" :key="index" >{{directory.name}}</option>
                    </select>
                </div>
                <div class="px-5 justify-center mt-5">
                    <div class="flex items-center">
                       <div class="mr-3"><PdfIcon :size="35"></PdfIcon></div><div> {{fileName}}</div>
                    </div>
                </div>
                <div class="h-5"></div>
                <div class="flex justify-end px-5">
                    <button class="bg-primary h-11 text-white w-40 rounded-md mb-5 focus:outline-none relative" @click="createImage" :disabled="loading">
                        <div class="flex items-center absolute -top-1 justify-center w-full text-center" v-if="loading">
                            <div class="loader"></div>
                        </div>
                        <span v-else>{{$t('attach_file')}}</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- Confirm -->
        <BuyMsg v-if="showConfirm" :msg="msg" @cancelModal="() => {this.showConfirm = false}" @yes="yes"></BuyMsg>
        <!-- Viwe pdf file -->
        <div class="fixed w-full h-full left-0 top-0 bg-black bg-opacity-95 flex items-center justify-center z-50" v-if="pdfUrl">
           <div style="max-height:90%;">
               <div class="rounded-t h-12 w-full bg-primary flex justify-between items-center px-3">
                   <div class="cursor-pointer" @click="openFullscreen">
                       <EnlargeIcon :size="20"></EnlargeIcon>
                   </div>
                   <div class="flex-1 text-center text-white">
                       {{fileName}}
                   </div>
                   <div class="cursor-pointer" @click="() => {this.pdfUrl = ``}">
                       <CloseIcon fill="#FFF" :width="20"></CloseIcon>
                   </div>
               </div>
                <div class="overflow-y-scroll w-110 rounded-b" id="fullScreen" style="max-height:36rem;"><SinglePdf :pdfUrl="pdfUrl"></SinglePdf></div>
           </div>
        </div>
        <!--  -->
        <!-- View image -->
        <div class="fixed w-full h-full bg-black bg-opacity-95 flex items-center justify-center z-50 top-0 left-0 p-10" v-if="preivewImage">
             <div class="absolute right-5 top-5 cursor-pointer" @click="() => {this.preivewImage = false}">
                    <CloseIcon fill="#888" :width="20"></CloseIcon>
                </div>
            <div class="relative overflow-y-scroll max-h-full p-5">
                <img :src="preivewImage" class="max-w-full">
            </div>
        </div>
    </div>
</template>
<script>
    import eHeader from "./../Video/components/Header.vue"
    import SearchIcon from "./../../components/SearchIcon.vue"
    import FolderIcon from "./../../components/FolderIcon.vue"
    import AttachFileIcon from "./../../components/AttachFileIcon.vue"
    import PdfIcon from "./../../components/PdfFileIcon.vue"
    import CloseIcon from "./../../components/CloseIcon.vue"
    import ImageIcon from "./../../components/AddImageIcon.vue"
    import EnlargeIcon from "./../../components/EnlargeIcon.vue"
    import DeleteIcon from "./../MyCourse/components/DeleteIcon.vue"
    import AddIcon from "./../../components/AddIcon.vue"
    import {mapState, mapActions} from "vuex"
    import Directroy from "./components/Directory.vue"
    import helper from "./../../helper/helper"
    import moment from "moment"
    import BuyMsg from "./../Component/BuyMsg.vue"
    import SinglePdf from "./../Component/SinglePdf.vue"
    import Empty from "./../Component/Empty.vue"
    import Loading from "./../../components/Loading.vue"

    export default {
        data(){
            return{
                showDirectory: false,
                file: "",
                preview: "",
                showPreview: false,
                fileName: "",
                showPdf: false,
                showConfirm: false,
                user_id: '',
                msg: 'delete',
                id:"",
                directories: [],
                directroy: "",
                pdfUrl: "",
                preivewImage: "",
                folder: "",
                s:"",
                page: 1,
                enableScroll:true,
                loadingDoc: false
                
            }
        },
        components:{
            eHeader,
            SearchIcon,
            FolderIcon,
            ImageIcon,
            AttachFileIcon,
            AddIcon,
            Directroy,
            CloseIcon,
            PdfIcon,
            DeleteIcon,
            BuyMsg,
            SinglePdf,
            EnlargeIcon,
            Empty,
            Loading
        },
        computed:{
            ...mapState('document', ['documents', 'loading']),
            ...mapState('setting', ['darkMode','isHide']),
            ...mapState('auth', ['stProfile'])
        },
        methods:{
            ...mapActions('document', ['getDocument','createDocument', 'deleteDocument', 'getMoreDocument']),
            attachFile(){

            },
            confirmDelete(id){
                this.id = id
                this.showConfirm = true
            },
            yes(){
                this.deleteDocument(this.id)
                this.showConfirm = false
            },

            closeDirectory(){
                this.showDirectory = false
                this.getDocument({
                    user_id: this.user_id
                })
            },
            formatDate(date){
                moment.locale('en');
                return moment(date).format('DD-MM-YYYY');
            },
            cutString(text, limit){
                return helper.cutString(text, limit)
            },
            createImage(){
                let formData = new FormData()
                formData.append("file", this.file)
                formData.append("name", this.fileName)
                formData.append("id", this.$route.params.folder)

                this.createDocument(formData).then(() =>{
                    this.showPreview = false
                    this.showPdf = false
                    this.getDocument({
                        user_id: this.user_id,
                        folder: this.$route.params.folder
                    })
                    helper.success("file_has_been_uploaded")
                })
            },
            onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
                if (scrollTop + clientHeight >= scrollHeight) {
                    this.page ++ 

                    let payload = {}
                    payload.p = this.page
                    payload.user_id = this.user_id
                    payload.s = this.s
                    payload.folder = this.$route.params.folder

                    if(this.enableScroll){
                        this.getMoreDocument(payload).then(res =>{
                            if(res.data.data.length <= 0){
                                this.enableScroll = false
                            }
                        })
                    }
                }
            },
            search(){
                this.loadingDoc = true
                let payload = {}
                payload.s = this.s
                payload.user_id = this.user_id
                payload.folder = this.$route.params.folder
                this.getDocument(payload).then(response =>{
                    this.loadingDoc = false
                    if(response.data.data && response.data.data.length){
                        this.directories = response.data.data.filter(item => item.type === 1)
                    }
                })
            },
            addFile(event){
                var input = event.target;
                this.file = event.target.files[0]  
                this.fileName = this.file.name  

                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                     
                        this.preview = e.target.result
                        this.showPdf = true
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            },
            addImage(event){
                var input = event.target;
                this.file = event.target.files[0]  
                this.fileName = this.file.name  

                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                     
                        this.preview = e.target.result
                        this.showPreview = true
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            },

            previewFile(file){
                console.log(file)
                if(file.type === 2){
                    this.pdfUrl = file.url
                    this.fileName = file.name
                    return;
                }
                if(file.type === 3){
                    this.preivewImage = file.url
                    this.fileName = file.name
                    return;
                }
                if(file.type === 1){
                    this.$router.push({name:'document-detail', params:{folder: file._id}})
                   
                }
            },
            openFullscreen() {
                var elem = document.getElementById("fullScreen");
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            },
            closeFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
        },
        mounted(){
            this.loadingDoc = true
            this.getDocument({
                user_id: this.user_id,
                folder: this.$route.params.folder
            }).then(response =>{
                this.loadingDoc = false
                if(response.data.data && response.data.data.length){
                    this.directories = response.data.data.filter(item => item.type === 1)
                }
            })
        },
        created(){
            this.user_id = this.stProfile._id
        }
    }
</script>