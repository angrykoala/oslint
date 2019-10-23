<template>
<div>
    <article class="message" :class="[messageStyle]">
        <div class="message-header">
            <p>{{title}}</p>
        </div>
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
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        messageStyle() {
            switch (this.type) {
                case "positive":
                    return "is-success"
                case "negative":
                    return "is-danger"
                default:
                    return ""
            }
        }
    }
}
</script>
