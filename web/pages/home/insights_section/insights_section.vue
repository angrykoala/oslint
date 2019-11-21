<template>
    <div>
        <insight-card v-for="insight of insights" :insight="insight" :key="insight.id" />
    </div>
</template>



<script lang="ts">
import InsightCard from './insight_card.vue'

export default {
    props: {
        insights: {
            required: true
        }
    },
    components: {
        "insight-card": InsightCard
    },
}

</script>
