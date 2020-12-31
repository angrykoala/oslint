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
    <template v-else-if="visibleInsights">
        <div class="container repo-metrics-container">
            <repo-metrics v-if="metrics" :metrics="metrics" />
        </div>
        <div class="container">
            <div class="tabs">
                <ul>
                    <li v-for="section of sections" :key="section" :class="{'is-active': section===currentSection}"><a @click.prevent="changeSection(section)">{{section}}</a></li>
                </ul>
            </div>
            <insights-section :insights="visibleInsights">
        </div>
    </template>
    <custom-footer />
</div>
</template>


<script lang="ts">
import InsightsSection from './insights_section/insights_section.vue';
import RepoMetrics from './repo_metrics.vue';
import RepoSubmit from './repo_submit.vue';
import Spinner from '../../components/common/spinner.vue';
import ErrorMessage from '../../components/common/error_message.vue';
import Footer from '../../components/footer.vue'

export default {
    data() {
        return {
            errorMessage: null
            currentSection: "Repository"
        }
    },
    components: {
        "insights-section": InsightsSection,
        "repo-metrics": RepoMetrics,
        "repo-submit": RepoSubmit,
        "spinner": Spinner,
        "error-message": ErrorMessage,
        "custom-footer": Footer
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.fetchMetrics(to.query.username, to.query.project);
        })
    },
    async beforeRouteUpdate(to, from, next) {
        this.fetchMetrics(to.query.username, to.query.project);
        next()
    },
    computed: {
        visibleInsights() {
            if (!this.$store.state.insights) return null;
            return this.$store.state.insights.filter((i) => {
                return i.feel !== "hidden" && i.section === this.currentSection
            })
        },
        loading() {
            return this.$store.state.loading;
        },
        metrics() {
            return this.$store.state.metrics;
        },
        sections() {
            return ["Repository", "Issues", "Pull Requests", "Community", "Branches"];
        }
    },
    methods: {
        async onSubmit(repoUrl) {
            console.log(repoUrl)
            try {
                const params = repoUrl.split("/")
                if (params.length < 5) throw new Error("Invalid url" + repoUrl)
                const username = params[3];
                const project = params[4];
                if (username !== this.$route.query.username || project !== this.$route.query.project) {
                    this.$routerActions.goToInsights(username, project)
                }
            } catch (err) {
                console.error(err)
                this.errorMessage = `Invalid repo url ${repoUrl}`;
            }
        },
        async fetchMetrics(username: string, project: string) {
            if (username && project) {
                this.errorMessage = null
                this.$store.commit("clearProject");

                try {
                    await this.$store.dispatch("fetchMetrics", {
                        username,
                        project
                    })
                } catch (err) {
                    console.error(err)
                    this.errorMessage = `Couldn't load repository ${username}/${project}`;
                }
            }
        }
        changeSection(section: string) {
            this.currentSection = section;
        }
    }
}
</script>


<style lang="scss" scoped>
.repo-metrics-container {
    margin-bottom: 16px;
}
</style>
