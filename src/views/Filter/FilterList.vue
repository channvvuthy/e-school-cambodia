<template>
    <div class="m-5 z-50">
        <div class="flex justify-between w-3/5">
            <div class="rounded flex-1 relative">
                <input type="text" placeholder="Search" class="w-full h-12 leading-12 focus:outline-none pl-10 text-md bg-white rounded shadow">
                <div>
                    <img src="/icon/icon/Search@2x.png" alt="" class="h-5 absolute left-3 top-2" style="margin-top:5px;">
                </div>
                <div class="flex absolute right-3 cursor-pointer justify-center items-center h-12 leading-12 top-0">
                    <p class="text-md  opacity-50 mr-2">Filter</p>
                    <ChevronIcon/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ChevronIcon from "./../../components/ChevronIcon"
    export default{
        components:{
            ChevronIcon
        }
    }
</script>