import { createRouter, createWebHistory } from "vue-router";
import QuoteForm from "../components/QuoteForm.vue";
import Dashboard from "../components/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "QuoteForm",
    component: QuoteForm,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
