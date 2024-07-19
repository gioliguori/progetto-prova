const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard/admin",
        component: () => import("pages/DashboardAdmin.vue"),
        name: "DashboardAdmin",
      },
      {
        path: "/TreeTable_INSERISCIPARTNER",
        component: () => import("pages/TreeTable_INSERISCIPARTNER.vue"),
      },
      {
        path: "/TreeTable_LISTABICI",
        component: () => import("pages/TreeTable_LISTABICI.vue"),
      },
      {
        path: "/TreeTable_LISTAPARTNER",
        component: () => import("pages/TreeTable_LISTAPARTNER.vue"),
      },

      // Not completed yet
      // {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayoutPARTNER.vue"),
    children: [
      {
        path: "/dashboard/partner",
        component: () => import("pages/DashboardPartner.vue"),
        name: "DashboardPartner",
      },
      {
        path: "/TreeTable_LISTABICISUE",
        component: () => import("pages/TreeTable_LISTABICISUE.vue"),
      },
      {
        path: "/TreeTable_INSERISCIBICI",
        component: () => import("pages/TreeTable_INSERISCIBICI.vue"),
      },
      {
        path: "/TreeTable_MODIFICABICI",
        component: () => import("pages/TreeTable_MODIFICABICI.vue"),
      },

      // Not completed yet
      // {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
  {
    path: "/Mail",
    component: () => import("layouts/Mail.vue"),
  },
  {
    path: "/Maintenance",
    component: () => import("pages/Maintenance.vue"),
  },

  {
    path: "/login/admin",
    component: () => import("pages/LoginAdmin.vue"),
    name: "LoginAdmin",
  },
  {
    path: "/Lock",
    component: () => import("pages/LockScreen.vue"),
  },
];

export default routes;
