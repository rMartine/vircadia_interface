//  Copyright 2021 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

import { route } from "quasar/wrappers";
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory
} from "vue-router";
import { IRootState } from "../store";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<IRootState>(function(/* { store, ssrContext } */) {
    // eslint-disable-next-line no-nested-ternary
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(
            // eslint-disable-next-line no-void
            process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
        )
    });

    return Router;
});
