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
            <repo-submit @onSubmit="onSubmit" :loading="loading" />
        </div>
    </section>
    <error-message v-if="errorMessage">{{errorMessage}}</error-message>
    <spinner v-if="loading">
    </spinner>
    <template v-else>
        <div class="container repo-metrics-container">
            <repo-metrics v-if="metrics" :metrics="metrics" />
        </div>
        <div class="container">
            <insight-card v-for="insight of visibleInsights" :insight="insight" :key="insight.id" />
        </div>
    </template>
    <custom-footer/>
</div>
</template>


<script lang="ts">
import InsightCard from '../components/insight_card.vue';
import RepoMetrics from '../components/repo_metrics.vue';
import RepoSubmit from '../components/repo_submit.vue';
import Spinner from '../components/common/spinner.vue';
import ErrorMessage from '../components/common/error_message.vue';
import Footer from '../components/footer.vue'

export default {
    data() {
        return {
            errorMessage: null
        }
    },
    components: {
        "insight-card": InsightCard,
        "repo-metrics": RepoMetrics,
        "repo-submit": RepoSubmit,
        "spinner": Spinner,
        "error-message": ErrorMessage,
        "custom-footer": Footer
    },
    computed: {
        visibleInsights() {
            if (!this.$store.state.insights) return null;
            return this.$store.state.insights.filter((i) => i.feel !== "hidden")
        },
        loading(){
            return this.$store.state.loading;
        },
        metrics(){
            return this.$store.state.metrics;
        }
    },
    methods: {
        async onSubmit(repoUrl) {
            console.log(repoUrl)
            this.errorMessage = null
            this.$store.commit("clearProject");
            try {
                const params = repoUrl.split("/")
                if (params.length < 5) throw new Error("Invalid url" + repoUrl)
                const username = params[3];
                const project = params[4];
                await this.$store.dispatch("fetchMetrics", {username, project})
            } catch (err) {
                console.error(err)
                this.errorMessage = `Couldn't load repository ${repoUrl}`;
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.repo-metrics-container {
    margin-bottom: 16px;
}
</style>
