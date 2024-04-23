<template>
    <div :class="darkMode ? `bg-youtube` : `bg-gray-50`" class="p-5 h-screen overflow-y-scroll">
        <div class="w-9/12" :class="darkMode ? `bg-youtube text-textSecondary` : `bg-white shadow rounded-b-xl`">
            <div v-if="loading">
                <Loading />
            </div>
            <div v-else>
                <div class="relative">
                    <img :src="detail.course.thumbnail" class="w-full m-auto">
                    <div class="w-full absolute left-0 -bottom-5 flex justify-center space-x-5">
                        <button @click="gotToPlayList()"
                            class="flex items-center justify-center bg-primary text-white w-72 py-2 outline-none rounded-full shadow text-xl">
                            <VideoCameraIcon fill="#fff" :size="35" />
                            <span class="ml-3">{{ $t('1117') }}</span>
                        </button>
                        <a @click="zoomAttendant()"
                            class="flex items-center cursor-pointer justify-center bg-primary text-white w-72 py-2 outline-none rounded-full shadow text-xl">
                            <TVIcon fill="#fff" :size="35" />
                            <span class="ml-3">{{ $t('join_zoom') }}</span>
                        </a>
                    </div>
                </div>

                <div class="my-10 px-5">
                    <div class="font-bold text-2xl">{{ detail.course.teacher.name }} ({{ detail.course.title }})</div>
                    <div class="flex justify-between items-center my-5">
                        <div class="text-lg">
                            <template v-if="detail.price.highlight">
                                {{ $t('1006') }}:
                                <span class="mr-3">
                                    $ <del>{{ khmerNumber(detail.price.highlight) }}</del>
                                </span>
                                <span class="text-red-600 font-semibold">$ {{ khmerNumber(detail.price.year) }}</span>
                            </template>
                            <template v-else>
                                <span>{{ $t('1007') }}</span>
                            </template>
                        </div>

                        <div class="flex items-center">
                            <Eye :height="30" />
                            <span v-if="loading">
                                <Loader :size="10" bg="#000" />
                            </span>
                            <span v-else>
                                <span class="pl-2">
                                    {{ kFormatter(detail.course.view) }}
                                </span>
                            </span>
                        </div>

                        <div>&nbsp;</div>
                    </div>


                    <div class="border-b border-t py-3 px-5" :class="darkMode ? `border-button` : ``">
                        <div class="flex items-center text-center justify-between w-96">
                            <div class="cursor-pointer" :title="$t('2108')">
                                <YoutubeIcon :fill="darkMode ? `#909090` : `#000000`" :size="42" />
                                <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                    {{ detail.course.total_video ? detail.course.total_video : 0 }}
                                </div>
                            </div>
                            <div class="cursor-pointer" :title="$t('pdf')">
                                <PdfIcon :fill="darkMode ? `#909090` : `#000000`" :size="42" />
                                <div class="h-6 mt-1 bg-transparent flex items-end justify-center">
                                    {{ detail.course.total_pdf ? detail.course.total_pdf : 0 }}
                                </div>
                            </div>
                            <div class="cursor-pointer" :title="$t('support')">
                                <ChatIcon :fill="darkMode ? `#909090` : `#000000`" :size="42" />
                                <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                                    :class="darkMode ? `text-skyBlue` : `text-primary`">
                                    {{ detail.course.has_support ? $t('1008') : $t('1009') }}
                                </div>
                            </div>
                            <div class="cursor-pointer text-center flex justify-center flex-col" :title="$t('2111')">
                                <TestIcon :fill="darkMode ? `#909090` : `#000000`" :size="42" />
                                <div class="h-6 mt-1 bg-transparent"
                                    :class="darkMode ? `text-skyBlue` : `text-primary`">
                                    {{ detail.course.has_quiz ? $t('1008') : $t('1009') }}
                                </div>
                            </div>
                            <div class="cursor-pointer" :title="$t('1114')">
                                <CertificateIcon :fill="darkMode ? `#909090` : `#000000`" :size="42" />
                                <div class="h-6 mt-1 bg-transparent flex items-end justify-center"
                                    :class="darkMode ? `text-skyBlue` : `text-primary`">
                                    {{ detail.course.has_certificate ? $t('1008') : $t('1009') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-center my-10 pb-20">
                    <div class="progressVideoDetail flex items-center justify-center">
                        <div>
                            <div class="barOverflowVideoDetail">
                                <div class="reportDetail"
                                    :style="{ transform: `rotate(${45 + (Math.round(report('percentage')) * 1.8)}deg)` }">
                                </div>
                            </div>
                            <div class="absolute w-full top-0 h-full flex flex-col justify-end items-center">
                                <div class="text-xl">
                                    {{ $t('1117') }}
                                </div>
                                <div class="font-bold text-3xl mt-2">
                                    {{ report('watch') }}/{{ report('total') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-40"></div>
                <!-- Clear height -->
            </div>
            <!-- End else -->
        </div>
    </div>

</template>
<script>
import { mapState, mapActions } from "vuex";
import Loading from "@/components/Loading.vue"
import TVIcon from "@/components/TVIcon";
import VideoCameraIcon from "@/views/Video/components/VideoCameraIcon";
import helper from "@/helper/helper";
import Eye from "@/components/Eye";
import Loader from "@/components/Loader";
import CertificateIcon from "@/components/CertificateIcon";
import TestIcon from "@/components/TestIcon";
import PdfIcon from "@/components/PdfIcon";
import ChatIcon from "@/components/ChatIcon";
import YoutubeIcon from "@/components/YoutubeIcon";
const { ipcRenderer } = require("electron");


export default {
    components: {
        Loading,
        TVIcon,
        VideoCameraIcon,
        Eye,
        Loader,
        YoutubeIcon,
        PdfIcon,
        TestIcon,
        ChatIcon,
        CertificateIcon

    },
    data() {
        return {
            detail: {},
            loading: false
        }
    },
    computed: {
        ...mapState('setting', ['darkMode']),
        ...mapState("video", ["playlist"]),
    },
    methods: {
        ...mapActions("video", ["getPlaylist"]),
        ...mapActions('zoom', ['getZoomAttendant']),

        khmerNumber(str) {
            if (this.$i18n.locale == 'kh') {
                return helper.khmerNumber(str)
            }
            return str
        },

        kFormatter(view) {
            return helper.kFormatter(view)
        },

        report(field) {
            try {
                return this.detail.course.report_watch[field] || 0
            } catch (err) {
                return 0
            }
        },

        zoomAttendant() {
            let payload = {
                id: this.detail.course._id
            }
            this.getZoomAttendant(payload).then(res => {
                if (res.msg == undefined) {
                    ipcRenderer.send("update", this.detail.course.zoom_link);
                }
            })
        },

        gotToPlayList() {
            if (this.detail.list.length <= 0) {
                helper.errorMessage('no_video')
                return;
            }
            if (localStorage.getItem('token') === null) {
                this.showMsg = true
                return;
            }
            this.$router.push({ name: 'video-detail', params: { course: this.detail.course } })
        },


    },
    created() {
        let payload = {
            id: this.$route.params.course["_id"]
        };

        this.loading = true;
        this.getPlaylist(payload).then((res) => {
            this.detail = res.data.data
            this.loading = false
        });
    }
};
</script>