import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import router from "./router";
import ApiService from "./core/services/ApiService";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/assets/scss/style.scss";

// External packages
import { VueQueryPlugin } from "@tanstack/vue-query";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

VueQueryPlugin.install(app, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 2, // 5 minutes
        refetchOnReconnect: "always",
      },
    },
  },
});

ApiService.init(app);
app.mount("#app");
