<template>
    <div class="flex items-center justify-center items-center fixed w-full h-full top-0 left-0
    bg-black bg-opacity-90 z-50">
        <div class="w-1/3" :class="darkMode?`bg-secondary rounded-lg`:`bg-white e-shadow rounded-lg`">
            <div class="flex items-center justify-center py-4 relative border-b"
                 :class="darkMode?`border-button text-gray-300`:``">
                <div class="font-semibold text-base">{{$t('add_member')}}</div>
                <div class="absolute right-4 top-4 cursor-pointer" @click="cancelRename()">
                    <CloseIcon :fill="darkMode?`#909090`:`#000000`"/>
                </div>
            </div>
            <div class="p-5">
                <input type="text" class="h-10 rounded-md focus:outline-none w-full pl-3"
                       :class="darkMode?`bg-button text-gray-300`:`bg-softGray`">
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    import CloseIcon from "../../../components/CloseIcon.vue"

    export default {
        components: {
            CloseIcon
        },
        computed: {
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            cancelRename() {
                this.$emit("cancelRename")
            }
        }
    }
</script>