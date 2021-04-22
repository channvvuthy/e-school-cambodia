<template>
    <div>
        <div class="grid gap-4" :class="isHide?'grid-cols-4':'grid-cols-3'">
            <div v-for="i in 12" class="cursor-pointer h-36 w-full box-loading">
                <div class="flex flex-col justify-between">
                    <div class="line-1"></div>
                    <div class="line-2 mt-3"></div>
                    <div class="line-3 mt-3"></div>
                    <div class="line-4 mt-3"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex"
    export default{
        computed: {
            ...mapState('setting', ['isHide']),
        },
    }
</script>
<style>
    .line-1, .line-2, .line-3, .line-4 {
        height: 18px;
    }

    .line-1 {
        width: 50%;
        background-color: #dfdfdf;
        animation: box 1s infinite;
    }

    .line-2 {
        width: 70%;
        background-color: #dfdfdf;
        animation: box 1s infinite;
    }

    .line-3 {
        width: 80%;
        background-color: #dfdfdf;
        animation: box 1s infinite;
    }

    .line-4 {
        width: 100%;
        background-color: #dfdfdf;
        animation: box 1s infinite;
    }

    @keyframes box {
        0% {
            opacity: 0.5;
        }

        50% {
            opacity: 1;
        }

        100% {
            opacity: 0.5;
        }
    }
</style>