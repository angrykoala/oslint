<template>
<div class="insight-card">
    <article class="message" :class="[messageStyle]">
        <!-- <div class="message-header">
            <p>{{title}}</p>
        </div> -->
        <div class="message-body">
            {{text}}
        </div>
    </article>
</div>
</template>


<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        feel: {
            type: String,
            required: true
        }
    },
    computed: {
        messageStyle() {
            switch (this.feel) {
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
