import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/layout/Index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
      },
    ],
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/dataViewer",
    name: "dataViewer",
    component: () => import("@/views/DataView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"), 
  },
  
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
];

export const asyncRouters: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    component: () => import("@/layout/Index.vue"),
    children: [
      {
        path: "",
        redirect: "/admin/project",
      },
      {
        path: "project",
        name: "project",
        component: () => import("@/views/ProjectAdminView.vue"),
        meta: {
          requiresAuth: "admin",
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "Redirect404",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export const resetRouters = () => {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
  });
  const removeList: string[] = [];
  router.getRoutes().forEach((item) => {
    for (let i = 0; i < newRouter.getRoutes().length; i++) {
      if (item.name === newRouter.getRoutes()[i].name) {
        return;
      }
    }
    removeList.push(item.name as string);
  });
  removeList.forEach((item) => {
    router.removeRoute(item);
  });
};

export default router;
