const routes = [
  {
    path: "/",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "/DashboardAdmin",
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
    component: () => import("layouts/PartnerLayout.vue"),
    children: [
      {
        path: "/DashboardPartner",
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
    path: "",
    component: () => import("pages/LoginAdmin.vue"),
    name: "LoginAdmin",
  },

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
    path: "/Lock",
    component: () => import("pages/LockScreen.vue"),
  },
];

export default routes;
