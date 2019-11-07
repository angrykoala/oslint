<template>
<div class="insight-card">
    <article class="message" :class="[messageStyle]">
        <!-- <div class="message-header">
            <p>{{title}}</p>
        </div> -->
        <div class="message-body">
            <p>{{data.text}}</p>

            <ul v-if="data.links">
                <li v-for="link,i of data.links" :key="i"><custom-link :data="link"/></li>
            </ul>
        </div>
    </article>
</div>
</template>


<script lang="ts">

import Link from './common/link.vue';

export default {
    props: {
        data: {
            required: true
        }
    },
    components: {
        "custom-link": Link
    },
    computed: {
        messageStyle() {
            switch (this.data.feel) {
                case "positive":
                    return "is-success"
                case "negative":
                    return "is-danger"
                case "warning":
                    return "is-warning"
                default:
                    return ""
            }
        }
    }
}
</script>


<style lang="scss">
.insight-card {
    margin-bottom: 8px;
}
</style>
