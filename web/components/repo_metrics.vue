<template>
<div>
    <div>

        <p class="title">{{metrics.project.name}}</p>
        <custom-link :data="metrics.project.url" />
        <!-- <a :href="metrics.project.url">{{metrics.project.url}}</a> -->
        <p>{{metrics.project.description}}</p>
        <br>

    </div>
    <div class="level box">
        <div class="level-item has-text-centered" v-for="(item, i) of items" :key="i">
            <div>
                <p class="heading">{{item.name}}</p>
                <p class="title">{{item.value}}</p>
            </div>
        </div>
    </div>
</div>
</template>


<script lang="ts">
import Link from './common/link.vue';


export default {
    props: ["metrics"],
    components: {
        "custom-link": Link
    },
    computed: {
        items() {
            if (!this.metrics) return [];
            else return [{
                name: "Stars",
                value: this.metrics.project.stars,
            }, {
                name: "Contributors",
                value: this.metrics.contributors ? this.metrics.contributors.length : "unknown",
            }, {
                name: "Issues",
                value: this.metrics.issues.length,
            }, {
                name: "Forks",
                value: this.metrics.project.forks,
            }, {
                name: "Pull Requests",
                value: this.metrics.pullRequests.length
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
