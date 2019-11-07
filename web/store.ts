import Vuex from 'vuex';
import { SerializedInsight } from './types';
import MetricsAPI from './api/metrics';

export default new Vuex.Store({
    state: {
        metrics: null as any | null,
        insights: null as Array<SerializedInsight> | null,
        loading: false
    },
    getters: {

    },
    mutations: {
        addProject(state, data: { metrics: any, insights: Array<SerializedInsight> }) {
            state.metrics = data.metrics;
            state.insights = data.insights;
            state.loading = false;
        },
        clearProject(state) {
            state.metrics = null;
            state.insights = null;
        },
        setLoading(state, data: boolean) {
            state.loading = data;
        }
    },
    actions: {
        async fetchMetrics(context, data: { username: string, project: string }) {
            const api = new MetricsAPI(data.username, data.project);
            context.commit("clearProject");
            context.commit("setLoading", true);
            try {
                const { metrics, insights } = await api.getMetrics();
                context.commit("addProject", { metrics, insights })
            } finally {
                context.commit("setLoading", false);
            }
        }
    }
});
