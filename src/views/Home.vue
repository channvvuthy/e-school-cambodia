<template>
    <div class="mt-5 overflow-y-scroll pb-40 h-screen">
        <Story></Story>
        <FilterList></FilterList>
        <VideoList></VideoList>
    </div>
</template>

<script>
    // @ is an alias to /src

    import FilterList from "./Filter/FilterList.vue"
    import VideoList from "./Video/VideoList.vue"
    import Story from "./Story/Story.vue"

    export default {
        name: 'Home',
        components: {
            Story,
            FilterList,
            VideoList
        }
    }
</script>
