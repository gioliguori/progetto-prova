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
        path: "/DashboardAdmin",
        component: () => import("pages/DashboardAdmin.vue"),
        name: "DashboardAdmin",
      },
      {
        path: "/DashboardPartner",
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
    path: "/LoginAdmin",
    component: () => import("pages/LoginAdmin.vue"),
    name: "LoginAdmin",
  },
];

export default routes;
