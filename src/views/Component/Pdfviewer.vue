<template>
    <div>
        <div>
            <button id="prev" @click="onPrevPage()">Previous</button>
            <button id="next" @click="onNextPage()">Next</button>
            &nbsp; &nbsp;
            <span>
                Page: <span id="page_num"></span> / <span id="page_count"></span>
            </span>
        </div>
        <canvas id="my_canvas"></canvas>
    </div>
</template>

<script>
    import pdfjsLib from "pdfjs-dist/build/pdf";
    import "pdfjs-dist/web/pdf_viewer.css";

    pdfjsLib['GlobalWorkerOptions']['workerSrc'] =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.worker.min.js";

    export default {
        name: "PdfViewer",
        props: {
            pdfUrl: {
                default: function () {
                    return "http://staging-admin.e-schoolcambodia.com/files/pdf/202105ze18adbf3f9764c2dfeec0c616757271d.pdf"
                }
            }
        },
        data() {
            return {
                pdfDoc: null,
                pageNum: 1,
                pageRendering: false,
                pageNumPending: null,
                scale: 1,
                canvas: null,
                ctx: null
            }
        },
        created() {

        },
        mounted() {
            pdfjsLib.getDocument(this.pdfUrl).promise.then(pdfDoc_ => {
                this.pdfDoc = pdfDoc_;
                document.getElementById('page_count').textContent = this.pdfDoc.numPages;
                // Initial/first page rendering
                this.renderPage(this.pageNum);
            });
        },
        methods: {
            renderPage(num) {
                this.pageRendering = true;
                // Using promise to fetch the page
                this.pdfDoc.getPage(num).then(page => {
                    this.canvas = document.getElementById('my_canvas');
                    this.ctx = this.canvas.getContext('2d');
                    var viewport = page.getViewport(this.scale);
                    this.canvas.height = viewport.height;
                    this.canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: this.ctx,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);

                    // Wait for rendering to finish
                    renderTask.promise.then(() => {
                        this.pageRendering = false;
                        if (this.pageNumPending !== null) {
                            // New page rendering is pending
                            this.renderPage(this.pageNumPending);
                            this.pageNumPending = null;
                        }
                    });
                });

                // Update page counters
                document.getElementById('page_num').textContent = num;
            },
            queueRenderPage(num) {
                if (this.pageRendering) {
                    this.pageNumPending = num;
                } else {
                    this.renderPage(num);
                }
            },
            onPrevPage() {
                if (this.pageNum <= 1) {
                    return;
                }
                this.pageNum--;
                this.queueRenderPage(this.pageNum);
            },
            onNextPage() {
                if (this.pageNum >= this.pdfDoc.numPages) {
                    return;
                }
                this.pageNum++;
                this.queueRenderPage(this.pageNum);
            }
        }
    };
</script>

<style>
    #pageContainer {
        margin: auto;
        width: 80%;
    }

    div.page {
        display: inline-block;
    }
</style>
