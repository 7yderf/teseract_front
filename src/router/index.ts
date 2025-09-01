import { computed } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import LayoutAuth from "@/layouts/LayoutAuth.vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";

import NotFound from "../views/404View.vue";
import { useAuthStore } from "../modules/login/store/StoreAuth";

const childrensAdmin = [
  {
    path: "/documents",
    name: "documents",
    components: {
      default: () => import("../views/DocumentView.vue"),
    },
    meta: {},
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/404", component: NotFound },
    { path: "/:notFound(.*)", redirect: "/404" },
    {
      path: "/auth",
      alias: ["/login", "/inicio", "/home", "/"],
      name: "auth",
      redirect: "/sign-in",
      component: LayoutAuth,
      meta: {
        requiresAuth: false,
        module: "auth",
      },
      children: [
        {
          path: "/sign-in",
          name: "sign-in",
          components: {
            default: () => import("../views/LoginView.vue"),
          },
        },
        {
          path: "/register",
          name: "register",
          components: {
            default: () => import("../views/RegisterView.vue"),
          },
        },
      ],
    },
    {
      path: "/admin",
      redirect: "/documents",
      component: LayoutAdmin,
      meta: {
        requiresAuth: true,
        roles: ["user"],
      },
      children: childrensAdmin,
    },
  ],
});

router.beforeEach((to) => {
  const { sesion, setHeaders } = useAuthStore();

  setHeaders();

  // eslint-disable-next-line no-undef
  const auth = computed(() => sesion.isAuth);
  const role = computed(() => sesion.role);
  
  if (to.meta?.requiresAuth && role.value?.includes("user") && !auth.value) {
    return "/login";
  }

  if (auth.value && to.meta?.module === "auth") {
    return "/documents";
  }

  return true;
});

export default router;
