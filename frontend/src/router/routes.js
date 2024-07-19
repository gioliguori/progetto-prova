const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "login",
      },
      {
        path: "logged-in",
        component: () => import("pages/LoggedInPage.vue"),
        name: "loggedInPage",
      },
      {
        path: "/dashboard/admin",
        component: () => import("pages/DashboardAdmin.vue"),
        name: "DashboardAdmin",
      },
      {
        path: "/dashboard/partner",
        component: () => import("pages/DashboardPartner.vue"),
        name: "DashboardPartner",
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",

    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/login/admin",
    component: () => import("pages/LoginAdmin.vue"),
    name: "LoginAdmin",
  },
];

export default routes;
