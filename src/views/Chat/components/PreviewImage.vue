<template>
    <div class="w-full h-full fixed left-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        <div class="absolute right-5 top-5 cursor-pointer" @click="closePreviewImage">
            <CloseIcon fill="#aaa"></CloseIcon>
        </div>
        <div class="w-96">
            <img :src="URL">
        </div>
    </div>
</template>
<script>
    import CloseIcon from "./../../../components/CloseIcon.vue"

    export default {
        props: {
            URL: {
                default: () => {
                    return ""
                }
            }
        },
        components: {
            CloseIcon
        },
        methods: {
            closePreviewImage() {
                this.$emit("closePreviewImage")
            }
        }
    }
</script>