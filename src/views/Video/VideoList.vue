<template>
    <div class="m-5">
        <div v-if="homeLoading">
            <Loading></Loading>
        </div>
        <div class="grid gap-4" :class="isHide?'grid-cols-4':'grid-cols-3'" v-else>
            <div v-for="(view,index) in list" class="bg-white shadow cursor-pointer" :key="index">
                <!--Vdo-->
                <div v-if="view.type ==='vdo'">
                    <img :src="view.vdo.thumbnail" alt="">
                    <div class="flex p-3 items-center justify-start">
                        <img :src="view.vdo.teacher.photo" class="h-10 rounded mr-3">
                        <div>
                            <div class="text-primary text-sm">{{view.vdo.title}}</div>
                            <div class="flex font-khmer_os text-xs opacity-50">
                                <div>{{view.vdo.teacher.name}}</div>
                                <div class="ml-7">1.6k view</div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="float-right">
                                <HeartIcon/>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End vdo-->
                <!--Ads-->
                <div class="relative" v-if="view.type ==='ads'">
                    <div class="absolute top-0 right-0 bg-white bg-opacity-70 p-1 text-sm">{{$t('1005')}}</div>
                    <img :src="view.ads.banner.thumbnail" alt="">
                    <div class="flex p-3 items-center justify-start">
                        <img :src="view.ads.logo" class="h-10 rounded mr-3">
                        <div>
                            <div class="text-primary text-sm">{{view.ads.title}}</div>
                            <div class="flex font-khmer_os text-xs opacity-50">
                                <div>{{view.ads.company}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End ads-->
            </div>
        </div>

    </div>
</template>
<script>
    import HeartIcon from "./../../components/HeartIcon.vue"
    import Loading from "./../../components/Loading"
    import {mapState} from "vuex"
    export default{
        components: {
            HeartIcon,
            Loading
        },
        computed: {
            ...mapState('setting', ['isHide']),
            ...mapState('home', ['list', 'homeLoading'])
        },
        created(){
            console.log(this.list)
        }
    }
</script>