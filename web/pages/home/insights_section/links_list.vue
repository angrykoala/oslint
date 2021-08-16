<template>
<div>
    <ul v-if="links" class="links-list">
        <li v-for="link,i of linkList" :key="i">
            <custom-link :data="link" />
        </li>
    </ul>
    <ul>
        <li @click="toggleFullList" v-if="showToggleButton"><b class="clickable">{{listToggleText}}</b></li>
    </ul>
</div>
</template>


<script lang="ts">
import Link from '../../../components/common/link.vue';

const maxLinks = 3;

export default {
    props: {
        links: {
            required: true,
            type: Array
        }
    },
    components: {
        "custom-link": Link,
    },
    data() {
        return {
            showAll: false
        }
    },
    computed: {
        linkList() {
            if (this.showAll) return this.links;
            else return this.links.slice(0, maxLinks);
        },
        listToggleText() {
            return this.showAll ? "Show Less" : "Show More"
        },
        showToggleButton() {
            return this.links.length > maxLinks;
        }
    },
    methods: {
        toggleFullList() {
            this.showAll = !this.showAll
        }
    }
}
</script>


<style lang="scss">
.links-list {
    max-height: 200px;
    overflow-y: auto;
}
</style>
