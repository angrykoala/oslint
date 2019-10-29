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
            <form @submit.prevent="onSubmit">
                <div class="field">
                    <label class="label">Repository Url</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="https://github.com/username/project" v-model="repoUrl">
                    </div>
                    <div class="control">
                        <button class="button is-link">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </section>
    <div class="container">
        <insight-card v-for="insight of visibleInsights" :title="insight.title" :text="insight.text" :type="insight.type" />
    </div>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                <strong>OSLint</strong> by <a href="https://jgthms.com">angrykoala</a>.
            </p>
        </div>
    </footer>
</div>
</template>


<script lang="ts">
import MetricAPI from '../api/metrics';
import InsightCard from '../components/insight_card.vue';

export default {
    data() {
        return {
            repoUrl: "",
            insights: null
        }
    },
    components: {
        "insight-card": InsightCard
    },
    computed: {
        visibleInsights() {
            console.log(this.insights)
            if (!this.insights) return null;
            return this.insights.filter((i) => i.type !== "hidden")
        }
    },
    methods: {
        async onSubmit() {
            console.log(this.repoUrl)
            const params = this.repoUrl.split("/")
            if (params.length < 5) throw new Error("Invalid url" + this.repoUrl)
            const username = params[3];
            const project = params[4];
            const metricApi = new MetricAPI(username, project);
            const result = await metricApi.getMetrics();
            console.log(result);
            this.insights = Object.values(result.insights)
        }
    }
}
</script>
