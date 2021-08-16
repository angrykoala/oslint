<template>
<div class="insight-card">
    <article class="message" :class="[messageStyle]">
        <!-- <div class="message-header">
            <p>{{title}}</p>
        </div> -->
        <div class="message-body">
            <p>{{insight.text}}</p>

            <links-list v-if="insight.links" :links="insight.links" />
        </div>
    </article>
</div>
</template>


<script lang="ts">
import LinksList from './links_list.vue'

export default {
    props: {
        insight: {
            required: true
        }
    },
    components: {
        "links-list": LinksList
    },
    computed: {
        messageStyle() {
            switch (this.insight.feel) {
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
