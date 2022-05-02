<template>
    <div class="fixed inset-0 overflow-y-auto bg-black top-0 left-0 w-full h-full bg-opacity-90" style="z-index: 58">
        <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom  rounded-xl text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle"
                 :class="`w-${size} ${darkMode?`bg-secondary text-gray-300`:`bg-white`}`" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                    <div class="flex justify-center items-center">
                        <div class="mt-2 py-2 w-60">
                            <div class="border-b flex justify-center items-center" :class="darkMode?`border-button`:`border-gray-300`">
                                <p class="text-sm text-sm font-khmer_os mb-3">
                                    {{ message }}
                                </p>
                            </div>
                            <ul class="list-none font-khmer_os">
                                <li class="border-b py-2 text-center cursor-pointer"
                                    @click="chooseDuration(1)" :class="duration === 1?`text-red-500 ${darkMode?`border-button`:`border-gray-300`}`:`${darkMode?`border-button`:`border-gray-300`}`">1 ខែ
                                </li>
                                <li class="border-b  py-2 text-center cursor-pointer"
                                    @click="chooseDuration(2)" :class="duration === 2?`text-red-500 ${darkMode?`border-button`:`border-gray-300`}`:`${darkMode?`border-button`:`border-gray-300`}`">2 ខែ
                                </li>
                                <li class="border-b py-2 text-center cursor-pointer"
                                    @click="chooseDuration(3)" :class="duration === 3?`text-red-500 ${darkMode?`border-button`:`border-gray-300`}`:`${darkMode?`border-button`:`border-gray-300`}`">3 ខែ
                                </li>
                                <li class="border-b py-2 text-center cursor-pointer"
                                    @click="chooseDuration(6)" :class="duration === 6?`text-red-500 ${darkMode?`border-button`:`border-gray-300`}`:`${darkMode?`border-button`:`border-gray-300`}`">6 ខែ
                                </li>
                                <li class="border-b py-1 text-center cursor-pointer"
                                    @click="chooseDuration(12)" :class="duration === 12?`text-red-500 ${darkMode?`border-button`:`border-gray-300`}`:` ${darkMode?`border-button`:`border-gray-300`}`">1 ឆ្នាំ
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="sm:flex sm:flex-row font-khmer_os py-2 justify-center items-center">
                    <button type="button" @click="closeDuration"
                            class="w-full inline-flex justify-center px-4 text-base">
                        បោះបង់
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex"
    export default{
        name: "ChooseDuration",
        props: {
            message: {
                type: String,
                default: () => {
                    return 'សូមជ្រើសរើសរយៈពេល'
                }
            },
            size: {
                type: Number,
                default: () => {
                    return 60;
                }
            },
            duration: {
                type: Number,
                default: () => {
                    return 12
                }
            }
        },
        computed:{
            ...mapState('setting', ['darkMode'])
        },
        methods: {
            closeDuration($event){
                this.$emit("closeDuration", $event);
            },

            chooseDuration($event){
                this.$emit("choseDuration", $event);
            }
        }
    }
</script>