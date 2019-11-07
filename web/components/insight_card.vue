<template>
<div class="insight-card">
    <article class="message" :class="[messageStyle]">
        <!-- <div class="message-header">
            <p>{{title}}</p>
        </div> -->
        <div class="message-body">
            <p>{{data.text}}</p>

            <ul v-if="data.links">
                <li v-for="link,i of data.links" v-key="i"><a :href="link">{{link}}</a></li>
            </ul>
        </div>
    </article>
</div>
</template>


<script lang="ts">
export default {
    props: {
        data: {
            required: true
        }
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
