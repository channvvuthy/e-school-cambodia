<template>
    <div class="fixed top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center h-full w-full z-50">
        
        <div class="w-2/4 relative">
            <!-- Header -->
            <div class="h-14 w-full flex justify-between items-center px-5 text-gray-300 bg-primary rounded-t">
                <div class="cursor-pointer" @click="openFullscreen()">
                    <EnlargeIcon></EnlargeIcon>
                </div>
                <div>
                    <div class="relative -top-6" v-if="loadingPdf">
                        <div class="loader"></div>
                    </div>
                   <div v-else>
                        {{title}}
                   </div>
                </div>
                <div class="cursor-pointer" @click="closeReading">
                    <CloseIcon fill="#ffffff"></CloseIcon>
                </div>
            </div>
            <!-- Body -->
            <div class="text-center flex flex-col justify-center items-center bg-white text-white relative pt-5 rounded-b" @mouseover="()=>{this.showToolbar = true}" @mouseout="()=>{this.showToolbar = false}">
                <div class="w-full flex flex-col justify-center items-center bottom-10 left-0 px-20 z-50 absolute z-50" :class="showToolbar?`visible`:`invisible`">
                    <div class="w-full py-4 bg-primary rounded-full flex items-center justify-between px-8 shadow">
                        <div class="transform rotate-90 cursor-pointer" @click="onPrevPage()">
                            <ChevronIcon fill="#ffffff"></ChevronIcon>
                        </div>
                        <div class="flex-1 flex justify-center items-center relative cursor-pointer" @click="showLesson(true)">
                            <div class="absolute w-7 h-7 rounded-full bg-primary -top-7">
                                <div class="transform rotate-180" style="margin-right:3.5px;margin-top:3px;">
                                    <ChevronIcon fill="#ffffff" :size="20"></ChevronIcon>
                                </div>
                            </div>
                            <ReadingBookIcon fill="#ffffff"></ReadingBookIcon>
                        </div>
                        <div class="transform -rotate-90 cursor-pointer"  @click="onNextPage()">
                            <ChevronIcon fill="#ffffff"></ChevronIcon>
                        </div>
                    </div>
                </div>
                <div class="h-85 overflow-y-scroll flex items-center justify-center" id="fullScreen" @scroll="onScroll">                    
                    <div id="pdf-viewer"></div>
                </div>
            </div>
            <!-- List -->
            <div class="absolute h-full bg-white top-0 left-0 z-50 rounded-md shadow" :class="showList?`w-full`:`w-0 overflow-hidden`">
                <!-- Header -->
                <div class="h-14 w-full flex justify-between items-center px-5 text-gray-300 bg-primary text-sm rounded-t">
                    <div class="transform rotate-90 cursor-pointer mr-5" @click="showLesson(false)"><ChevronIcon fill="#ffffff"></ChevronIcon></div>
                    <div class="flex-1 text-left">{{mainTitle}}</div>
                </div>
                <!-- List -->
                <div class="px-5 pt-5 overflow-y-scroll h-full pb-20" :class="darkMode?`bg-youtube text-gray-300`:``">
                    <div v-for="(detail,index) in details.list" :key="index">
                        <div class="flex items-center py-3 rounded px-2  cursor-pointer hover:bg-button my-1 hover:text-gray-300" :class="order === index?`bg-button text-gray-300`:``" @click="changeChapter(detail,index)">
                            <div v-if="canRead(detail)" class="mr-3"><CheckIcon :height="20" fill="#5aa20a"></CheckIcon></div>
                            <div v-else><XIcon fill="#ee3d3c" :width="20" :height="20" class="mr-3"></XIcon></div>
                            <div :class="darkMode?``:``">{{detail.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex"
import CloseIcon from "./../../../../components/CloseIcon"
import ChevronIcon from "./../../../../components/ChevronIcon"
import EnlargeIcon from "./../../../../components/EnlargeIcon"
import ReadingBookIcon from "./../../../../components/ReadingBookIcon"
import CheckIcon from "./../../../../components/CheckIcon"
import XIcon from "./../../../../components/XIcon"

import pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib['GlobalWorkerOptions']['workerSrc'] =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.worker.min.js";
export default {
    components:{
        EnlargeIcon,
        CloseIcon,
        ChevronIcon,
        ReadingBookIcon,
        CheckIcon,
        XIcon
    },
    data(){
        return{
            title: "",
            mainTitle:"",
            pdfDoc: null,
            pageNum: 1,
            pageRendering: false,
            pageNumPending: null,
            scale: 1,
            canvas: null,
            ctx: null,
            order: 0,
            showList: false,
            showToolbar: false,
            loadingPdf: true,
            totalPage: null,
            page: 1,
            pdfUrl:"http://staging-admin.e-schoolcambodia.com/files/pdf/202105ze18adbf3f9764c2dfeec0c616757271d.pdf"
        }
    },
    computed:{
        ...mapState('setting', ['darkMode']),
        ...mapState('library', ['details','loadingDetail','readingPdf']),
    },
    methods: {
        ...mapActions('library', ['stopWatch', 'readingLibrary']),
        closeReading(){
            this.$emit("closeReading")
            this.stopReading()
        },
        renderPage(pageNumber, canvas) {
            this.pdfDoc.getPage(pageNumber).then(page=> {
                let viewport = page.getViewport(this.scale);
                canvas.height = viewport.height;
                canvas.width = viewport.width;          
                page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
            });
        },
        queueRenderPage(num) {
            if (this.pageRendering) {
                this.pageNumPending = num;
            } else {
                this.renderPage(num);
            }
        },
        onPrevPage() {
           if(this.order > 0){
                this.order --
                this.changeChapter(this.details.list[this.order],this.order)
            }
        },
        stopReading(){
            let payload = {
                id: this.details.list[this.order]._id,
                mark: this.page,
                duration: this.totalPage
            }
            this.stopWatch(payload)
            this.page = 1
        },
        onNextPage() {
            if(this.order < this.details.list.length){
                this.order ++
                this.changeChapter(this.details.list[this.order],this.order)
                this.readingLibrary({
                    id: this.details.list[this.order]._id
                })
                
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
        hideTollbar(){
            this.showToolbar = false
        },
        showLesson(type = false){
            this.showList = type
        },
        canRead(book){
            if(this.details.is_buy || book.free_watch){
                return true
            }
            return false
        },
        changeChapter(book,index){

            this.stopReading()
            
            if(this.canRead(book)){
                this.pdfUrl = book.filename
                this.title = book.title
                this.showLesson(false)
                this.order = index
                this.initialPdf()
            }
        },
        loadPdf(){
            this.mainTitle = this.details.book.title
            if(this.details.book.last_watch !== undefined){
                this.order = this.details.book.last_watch.order
            }

            let defaultPdf = this.details.list[this.order]
            if(defaultPdf.last_watch !== undefined){
                this.page = defaultPdf.last_watch.mark
            }

            this.readingLibrary({
                id: this.details.list[this.order]._id
            })
            this.pdfUrl = defaultPdf.filename
            this.title = defaultPdf.title
        },
        initialPdf(page = 1){
            this.loadingPdf = true
            pdfjsLib.getDocument(this.pdfUrl).promise.then(pdfDoc=> {
                this.pdfDoc = pdfDoc
                let viewer = document.getElementById('pdf-viewer');
                this.totalPage  = pdfDoc.numPages 
                // for(let page = 1; page <= pdfDoc.numPages; page++) {
                let canvas = document.createElement("canvas");    
                canvas.className = 'pdf-page-canvas';         
                viewer.appendChild(canvas);            
                this.renderPage(page, canvas);
                // }
                this.loadingPdf = false
            });
        },
        onScroll ({target: {scrollTop, clientHeight, scrollHeight}}) {
            if (scrollTop + clientHeight >= (scrollHeight - 1)) {
                if(this.page < this.totalPage){
                    this.page ++
                    this.initialPdf(this.page)
                }
            }
        },
    },
    mounted(){
        this.initialPdf(this.page)
        window.addEventListener('keydown', (e) => {
            
            if(e.key === `ArrowRight`){
                this.onNextPage()
            }

            if(e.key === `ArrowLeft`){
                this.onPrevPage()
            }

            if(e.key === `f`){
                this.openFullscreen()
            }
        }, false)
    },

    created(){
        this.loadPdf()
    }
}
</script>