<template>
<div>
    <section class="hero is-primary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    OSLint
                </h1>
            </div>
        </div>
    </section>
    <section class="section">
        <div class="container">
            <repo-submit @onSubmit="onSubmit" />
        </div>
    </section>
    <div class="container repo-metrics-container">
        <repo-metrics v-if="metrics" :metrics="metrics" />
    </div>
    <div class="container">
        <insight-card v-for="insight of visibleInsights" :title="insight.title" :text="insight.text" :type="insight.type" :key="insight.title" />
    </div>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                <strong>OSLint</strong> by <a href="https://github.com/angrykoala">@angrykoala</a>.
            </p>
        </div>
    </footer>
</div>
</template>


<script lang="ts">
import MetricAPI from '../api/metrics';
import InsightCard from '../components/insight_card.vue';
import RepoMetrics from '../components/repo_metrics.vue';
import RepoSubmit from '../components/repo_submit.vue';

export default {
    data() {
        return {
            insights: null,
            metrics: null
        }
    },
    components: {
        "insight-card": InsightCard,
        "repo-metrics": RepoMetrics,
        "repo-submit": RepoSubmit
    },
    computed: {
        visibleInsights() {
            if (!this.insights) return null;
            return this.insights.filter((i) => i.type !== "hidden")
        }
    },
    methods: {
        async onSubmit(repoUrl) {
            console.log(repoUrl)
            const params = repoUrl.split("/")
            if (params.length < 5) throw new Error("Invalid url" + repoUrl)
            const username = params[3];
            const project = params[4];
            const metricApi = new MetricAPI(username, project);
            const result = await metricApi.getMetrics();
            console.log(result);
            this.insights = Object.values(result.insights)
            this.metrics = result.metrics
        }
    }
}
</script>


<style lang="scss" scoped>
.repo-metrics-container {
    margin-bottom: 16px;
}
</style>
