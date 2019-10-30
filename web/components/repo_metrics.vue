<template>
<nav class="level box container">
    <div class="level-item has-text-centered" v-for="(item, i) of items" :key="i">
        <div>
            <p class="heading">{{item.name}}</p>
            <p class="title">{{item.value}}</p>
        </div>
    </div>
</nav>
</template>


<script lang="ts">
export default {
    props: ["metrics"],
    computed: {
        items() {
            if (!this.metrics) return [];
            else return [{
                name: "Stars",
                value: this.metrics.project.stars,
            }, {
                name: "Contributors",
                value: this.metrics.contributors.length,
            }, {
                name: "Issues",
                value: this.metrics.issues.length,
            }, {
                name: "Forks",
                value: this.metrics.project.forks,
            }].filter(item => item.value !== null && item.value !== undefined)

            //TODO: PRs

            // Name
            // Description
            // Url
            // Webpage
        }
    }
}
</script>
