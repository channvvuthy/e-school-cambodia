<template>
    <div class="w-full h-28 flex items-end pb-3 shadow"
         :class="darkMode?'bg-secondary border-secondary text-gray-300':'bg-white border-gray-300'">
        <div class="flex px-10 items-center">
            <div class="e-shadow rounded-md flex justify-center items-center h-8 px-3 cursor-pointer"
                 :class="isHide?`ml-7`:`mx-3`"
                 @click="back()">
                <BackIcon :width="20" :height="20" :fill="darkMode?`#D1D5DB`:`#000000`"/>
            </div>
            <div class="text-sm font-mediums" v-if="lable">{{lable}}</div>
            <div class="text-sm font-mediums" v-else>{{$t(title)}}</div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import BackIcon from "./../../../components/BackIcon.vue"

    export default {
        name: "VideoHeader",

        components: {
            BackIcon
        },
        computed: {
            ...mapState('setting', ['isHide', 'darkMode'])
        },
        props: {
            isRoute: {
                default: () => {
                    return true
                }
            },
            title: {
                default: () => {
                    return '2126'
                }
            },
            lable: {
                default: () => {
                    return ''
                }
            },
        },
        methods: {
            back() {

                if (this.isRoute) {
                    this.$router.go(-1)
                } else {
                    this.$emit("exit")
                }
            }
        }

    }
</script>
