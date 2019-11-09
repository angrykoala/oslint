<template>
    <ul v-if="links">
        <li v-for="link,i of linkList" :key="i"><custom-link :data="link"/></li>
        <li @click="toggleFullList"><b class="clickable">{{listToggleText}}</b></li>
    </ul>
</template>


<script lang="ts">

import Link from './common/link.vue';

export default {
    props:{
        links: {
            required: true
        }
    },
    components: {
        "custom-link": Link,
    },
    data(){
        return {
            showAll: false
        }
    },
    computed:{
        linkList(){
            if(this.showAll) return this.links;
            else return this.links.slice(0, 3);
        },
        listToggleText(){
            return this.showAll? "Show Less": "Show More"
        }
    },
    methods:{
        toggleFullList(){
            this.showAll=!this.showAll
        }
    }
}

</script>
