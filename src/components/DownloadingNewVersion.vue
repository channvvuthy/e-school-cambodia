<template>
    <div class="fixed z-50 inset-0 overflow-y-auto font-khmer_os">
        <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle w-100"
                 role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white">
                    <div class="flex justify-between items-center bg-black text-white py-3 px-4">
                        <div class="text-sm">Downloading...</div>
                    </div>
                    <div class="px-4 py-5">
                        <div class="loading-bar bg-gray-200 rounded-full overflow-hidden"></div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import CloseIcon from "./CloseIcon"
    import config from "./../config"
    export default{
        components: {
            CloseIcon
        },
        props: {
            version: {
                default: () => {
                    return config.appVersion
                }
            }
        },
        methods: {
            dimiss(){
                this.$emit("dismiss")
            },
            updateVersion(){
                this.$emit("updateVersion")
            }
        }
    }
</script>
<style>
    .loading-bar{
        height: 10px;
        width: 100%;
        position: relative;

    }
    .loading-bar:after{
        width:0%;
        height:100%;
        background-color: #27ddff;
        content: "";
        position: absolute;
        left:0;
        top:0;
        animation: w 5s ease infinite;
        border-radius:50px;
    }
    @keyframes w {
        0% {
            width:0%;
        }
        10% {
            width:10%;
        }
        20% {
            width:20%;
        }
        30% {
            width:30%;
        }
        40% {
            width:40%;
        }
        50% {
            width:50%;
        }
        60% {
            width:60%;
        }
        70% {
            width:70%;
        }
        80% {
            width:90%;
        }
        90% {
            width:90%;
        }
        100% {
            width:100%;
        }
    }
</style>