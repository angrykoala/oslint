<template>
<div>
    <insight-card v-for="insight of insights" :insight="insight" :key="insight.id"></insight-card>
    <p v-if="insights.length===0">No insights available</p>
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
