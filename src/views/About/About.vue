<template>
    <div>
        <div class="h-screen py-4 overflow-y-scroll pb-40 text-base"
             :class="darkMode?`bg-youtube text-gray-400`:`bg-transparent text-youtube`">
            <div class="px-5 py-1 font-khmer_os">
                <div v-if="loading" class="flex justify-center items-center h-screen relative -top-5">
                    <h1 class="text-sm font-semibold font-khmer_os relative -top-20">
                        <loading/>
                    </h1>
                </div>
                <div class="text-14px" v-else>
                    <div class="w-3/4 px-10" :class="darkMode?``:`bg-white e-shadow rounded-xl`">
                        <div class="flex items-center justify-center py-5">
                            <img src="eschool-cambodia.png" class="w-56">
                        </div>
                        <div>{{company.des}}</div>
                        <div class="h-5"></div>
                        <div>{{$t('contact')}}</div>

                        <ul>
                            <li class="flex items-center h-12">
                                <PhoneIcon :fill="darkMode?`#909090`:`#055174`" :size="24"/>
                                <div class="ml-3">
                                    {{ company.phone }}
                                </div>
                            </li>
                            <li class="flex items-center h-12">
                                <MarkerIcon
                                        :fill="darkMode?`#909090`:`#055174`"
                                        :size="24"/>
                                <div class="ml-3">
                                    {{ company.address }}
                                    <span
                                            :class="darkMode?`text-fb`:`text-primary`"
                                            class="cursor-pointer underline"
                                            @click="openLink(mapUrl)">
                                        មើលផែនទី
                                    </span>
                                </div>
                            </li>
                            <li class="flex items-center h-12 cursor-pointer" @click="openLink(company.website )">
                                <WebIcon :fill="darkMode?`#909090`:`#055174`" :size="24"/>
                                <div class="ml-3" :class="darkMode?`text-fb`:`text-primary`">
                                    {{ company.website }}
                                </div>
                            </li>
                        </ul>
                        <div class="h-10"></div>
                        <div class="flex items-center justify-center social">
                            <div class="cursor-pointer" @click="openLink(telegramUrl)">
                                <TelegramIcon :size="45"/>
                            </div>
                            <div class="cursor-pointer px-3" @click="openLink(facebookUrl)">
                                <FacebookIcon/>
                            </div>
                            <div class="cursor-pointer pr-3" @click="openLink(youtubeUrl)">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                     xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     viewBox="0 0 473.931 473.931" height="45"
                                     style="enable-background:new 0 0 473.931 473.931" xml:space="preserve">
                                <circle style="fill:#D42428" cx="236.966" cy="236.966" r="236.966"/>
                                    <path style="fill:#CC202D" d="M404.518,69.38c92.541,92.549,92.549,242.593,0,335.142c-92.541,92.541-242.593,92.545-335.142,0
                                    L404.518,69.38z"/>
                                    <path style="fill:#BA202E" d="M470.321,277.964L310.843,118.487l-12.864,12.864l-12.864-12.864l-14.099,14.099l9.47,9.47
                                    l-3.091,3.091l-24.557-24.557l-1.048,1.055l-33.092-33.092l-14.099,14.099l3.858,3.858l-5.665,5.665l-23.854-23.854l-9.889,9.889
                                    l23.255,56.003l-10.473,42.997l28.632,28.639l-72.418,5.066l-1.096,125.667l116.537,116.679
                                    C362.678,465.505,451.836,383.833,470.321,277.964z"/>
                                    <path style="fill:#FFFFFF" d="M321.724,291.91h-15.289l0.075-8.875c0-3.948,3.237-7.169,7.199-7.169h0.98
                                    c3.963,0,7.214,3.222,7.214,7.169L321.724,291.91z M264.404,272.89c-3.865,0-7.038,2.608-7.038,5.796v43.161
                                    c0,3.188,3.173,5.781,7.038,5.781c3.895,0,7.068-2.593,7.068-5.781v-43.165C271.472,275.498,268.299,272.89,264.404,272.89z
                                    M357.473,248.752v82.102c0,19.697-17.077,35.809-37.96,35.809H163.444c-20.887,0-37.96-16.116-37.96-35.809v-82.102
                                    c0-19.697,17.074-35.816,37.96-35.816h156.073C340.395,212.936,357.473,229.059,357.473,248.752z M173.85,339.771l-0.007-86.487
                                    l19.345,0.007v-12.819l-51.573-0.079v12.595l16.101,0.049v86.73h16.134V339.771z M231.847,266.17h-16.131v46.181
                                    c0,6.683,0.4,10.024-0.022,11.199c-1.317,3.581-7.214,7.383-9.508,0.389c-0.389-1.227-0.045-4.924-0.052-11.274l-0.075-46.499
                                    h-16.041l0.06,45.765c0.007,7.016-0.161,12.247,0.052,14.627c0.393,4.198,0.247,9.096,4.15,11.884
                                    c7.252,5.235,21.163-0.778,24.643-8.251l-0.03,9.534l12.95,0.019V266.17H231.847z M283.45,319.052l-0.03-38.439
                                    c-0.015-14.653-10.971-23.427-25.856-11.573l0.067-28.58l-16.116,0.026l-0.079,98.637l13.25-0.195l1.205-6.148
                                    C272.83,348.332,283.479,337.683,283.45,319.052z M333.941,313.96l-12.101,0.064c0,0.483-0.022,1.033-0.03,1.639v6.75
                                    c0,3.611-2.982,6.552-6.608,6.552h-2.369c-3.633,0-6.615-2.941-6.615-6.552v-0.748v-7.431v-9.579h27.697V294.23
                                    c0-7.614-0.198-15.229-0.827-19.584c-1.979-13.781-21.317-15.966-31.09-8.913c-3.068,2.204-5.407,5.152-6.776,9.119
                                    c-1.373,3.963-2.054,9.369-2.054,16.247v22.918C293.178,352.115,339.452,346.73,333.941,313.96z M271.895,189.524
                                    c0.827,2.028,2.118,3.663,3.88,4.905c1.725,1.212,3.948,1.83,6.6,1.83c2.324,0,4.385-0.629,6.174-1.927
                                    c1.792-1.291,3.304-3.214,4.531-5.788l-0.307,6.331h17.979v-76.467h-14.155v59.513c0,3.218-2.66,5.856-5.905,5.856
                                    c-3.222,0-5.89-2.638-5.89-5.856v-59.513h-14.769v51.573c0,6.571,0.116,10.952,0.314,13.175
                                    C270.559,185.363,271.064,187.477,271.895,189.524z M217.408,146.337c0-7.341,0.614-13.07,1.826-17.201
                                    c1.22-4.12,3.427-7.431,6.608-9.923c3.18-2.511,7.252-3.764,12.191-3.764c4.157,0,7.723,0.819,10.705,2.417
                                    c2.982,1.609,5.298,3.693,6.892,6.271c1.639,2.586,2.739,5.246,3.334,7.966c0.606,2.754,0.898,6.919,0.898,12.52v19.341
                                    c0,7.094-0.284,12.31-0.834,15.626c-0.543,3.323-1.717,6.402-3.536,9.287c-1.796,2.859-4.116,4.995-6.93,6.357
                                    c-2.836,1.381-6.08,2.054-9.755,2.054c-4.093,0-7.551-0.565-10.391-1.751c-2.851-1.175-5.059-2.949-6.627-5.302
                                    c-1.594-2.357-2.705-5.227-3.375-8.572c-0.681-3.349-1.003-8.374-1.003-15.079v-20.247H217.408z M231.484,176.716
                                    c0,4.325,3.229,7.861,7.154,7.861s7.132-3.532,7.132-7.861v-40.71c0-4.325-3.207-7.861-7.132-7.861s-7.154,3.532-7.154,7.861
                                    V176.716z M181.722,197.269h16.969l0.015-58.648l20.045-50.241h-18.555l-10.657,37.324l-10.81-37.421h-18.357l21.324,50.372
                                    L181.722,197.269z"/>
                                </svg>
                            </div>
                            <div class="cursor-pointer" @click="openLink(linkedinUrl)">
                                <InIcon/>
                            </div>
                        </div>
                        <div class="h-5"></div>
                        <div class="text-center">
                            {{ $t('version') }} {{ appVersion }}
                        </div>
                        <div class="h-10"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from "vuex"
    import PhoneIcon from "./../../components/PhoneIcon.vue"
    import MarkerIcon from "./../../components/MarkerIcon.vue"
    import WebIcon from "./../../components/WebIcon.vue"
    import ShareIcon from "./../../components/ShareIcon"
    import FacebookIcon from "./../../components/FacebookIcon.vue"
    import YoutubeIcon from "./../../components/YoutubeIcon.vue"
    import InIcon from "./../../components/InIcon.vue"
    import InstagramIcon from "./../../components/InstagramIcon.vue"

    const {ipcRenderer} = require('electron')
    import config from "./../../config"
    import Loading from "./../../components/Loading"
    import eHeader from "./../Video/components/Header.vue"
    import TelegramIcon from "./../HotChat/components/TelegramIcon.vue"

    export default {
        name: "About",
        components: {
            TelegramIcon,
            PhoneIcon,
            MarkerIcon,
            WebIcon,
            ShareIcon,
            FacebookIcon,
            YoutubeIcon,
            InIcon,
            InstagramIcon,
            Loading,
            eHeader
        },
        data() {
            return {
                loading: false,
                company: null,
                facebookUrl: "https://facebook.com/196770961113954",
                youtubeUrl: "https://www.youtube.com/channel/UCXAVs_YRUwsnx5I-Toy-7Dg",
                linkedinUrl: "https://www.linkedin.com/in/eschoolcambodia/",
                telegramUrl: "https://t.me/eschool_community",
                mapUrl: "https://www.google.com/maps/search/?api=1&query=",
                src: ""
            }
        },
        computed: {
            ...mapState('setting', ['darkMode']),
            appVersion() {
                return config.appVersion
            }
        },
        methods: {
            ...mapActions('setting', ['companyInfo']),
            openLink(link) {
                ipcRenderer.send('openLink', link)
            }
        },

        created() {
            this.loading = true
            this.companyInfo().then(response => {
                this.loading = false
                this.company = response
                this.mapUrl += `${this.company.latitude},${this.company.longitude}`
                this.src = "https://maps.google.com/maps?q=" + response.latitude + "," + response.longitude + "&z=15&output=embed"
            }).catch(() => {
                this.loading = false
            })
        }
    }
</script>
