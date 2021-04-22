<template>
    <div>
        <div class="fixed inset-0" style="z-index:51">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4"
                     role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div class="bg-white px-5 pb-4">
                        <div class="flex justify-end py-2">
                            <div class="relative -right-2 cursor-pointer" @click="closeFilter">
                                <CloseIcon></CloseIcon>
                            </div>
                        </div>
                        <div class="text-md overflow-y-scroll pb-10 h-85">
                            <div class="grid grid-cols-3 gap-x-10 gap-y-5 font-medium">
                                <div class="px-5 cursor-pointer flex items-center border border-t-0 border-l-0 border-r-0 border-gray-500 py-3">
                                    <div class="bg-primary rounded-full flex justify-center items-center w-8 h-8">
                                        <WatchIcon></WatchIcon>
                                    </div>
                                    <div class="flex justify-start flex-1">
                                        <span class="pl-5">{{$t('all')}}</span>
                                    </div>
                                    <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center"
                                         @click="selectFilter('all')">
                                        <div class="w-2 h-2 bg-primary rounded-full "
                                             v-if="selectedFilter==='all'"></div>
                                    </div>
                                </div>
                                <div v-for="(list,index) in filter"
                                     class="px-5 cursor-pointer flex justify-between items-center border border-t-0 border-l-0 border-r-0 border-gray-500 py-3"
                                     :key="index" @click="selectFilter(list._id)">
                                    <div class="bg-primary rounded-full flex justify-center items-center w-8 h-8">
                                        <WatchIcon></WatchIcon>
                                    </div>
                                    <div class="flex justify-start flex-1">
                                        <span class="pl-5"> {{list.name}}</span>
                                    </div>
                                    <div class="h-5 w-5 rounded-full border border-gray-300 flex justify-center items-center">
                                        <div class="w-2 h-2 bg-primary rounded-full"
                                             v-if="selectedFilter ===list._id "></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import WatchIcon from "./../../../components/WatchIcon.vue"
    import CloseIcon from "./../../../components/CloseIcon.vue"
    export default{
        data(){
            return {
                selectedFilter: 'all'
            }
        },
        components: {
            WatchIcon,
            CloseIcon
        },
        props: {
            filter: {
                default: () => {
                    return []
                }
            }
        },
        methods: {
            closeFilter(){
                this.$emit("closeFilter")
            },
            selectFilter(filter){
                this.selectedFilter = filter
                this.$emit("closeFilter")
            }
        }
    }
</script>