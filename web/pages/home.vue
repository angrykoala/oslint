<template>
<div>
    <section class="hero is-primary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Os Analyser
                </h1>
            </div>
        </div>
    </section>
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
</div>
</template>


<script lang="ts">
import MetricAPI from '../api/metrics';

export default {
    data() {
        return {
            repoUrl: ""
        }
    },
    methods: {
        onSubmit() {
            console.log(this.repoUrl)
            const params = this.repoUrl.split("/")
            if (params.length < 5) throw new Error("Invalid url" + this.repoUrl)
            const username = params[3];
            const project = params[4];
            const metricApi = new MetricAPI(username, project);
            metricApi.getMetrics();
        }
    }
}
</script>
