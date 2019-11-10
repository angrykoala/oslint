import { VueRouter, Route } from "vue-router/types/router";

export default class RouterActions {
    private router: VueRouter;

    constructor(router: VueRouter) {
        this.router = router;
    }

    public goToInsights(username: string, project: string): Promise<Route> {
        return this.router.replace({
            name: 'insights',
            query: {
                username,
                project
            }
        })
    }
}
