const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "DashboardAdmin",
        component: () => import("pages/DashboardAdmin.vue"),
        name: "DashboardAdmin",
      },
      {
        path: "TreeTable_INSERISCIPARTNER",
        component: () => import("pages/TreeTable_INSERISCIPARTNER.vue"),
        name: "TreeTable_INSERISCIPARTNER",
      },
      {
        path: "TreeTable_LISTABICI",
        component: () => import("pages/TreeTable_LISTABICI.vue"),
        name: "TreeTable_LISTABICI",
      },
      {
        path: "TreeTable_LISTAPARTNER",
        component: () => import("pages/TreeTable_LISTAPARTNER.vue"),
        name: "TreeTable_LISTAPARTNER",
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayoutPARTNER.vue"),
    children: [
      {
        path: "DashboardPartner",
        component: () => import("pages/DashboardPartner.vue"),
        name: "DashboardPartner",
      },
      {
        path: "TreeTable_LISTABICISUE",
        component: () => import("pages/TreeTable_LISTABICISUE.vue"),
        name: "TreeTable_LISTABICISUE",
      },
      {
        path: "TreeTable_INSERISCIBICI",
        component: () => import("pages/TreeTable_INSERISCIBICI.vue"),
        name: "TreeTable_INSERISCIBICI",
      },
      {
        path: "TreeTable_MODIFICABICI",
        component: () => import("pages/TreeTable_MODIFICABICI.vue"),
        name: "TreeTable_MODIFICABICI",
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayoutUTENTE.vue"),
    children: [
      {
        path: "HOME_UTENTE",
        component: () => import("pages/HOME_UTENTE.vue"),
        name: "HOME_UTENTE",
      },
    ],
  },


  {
    path: "",
    component: () => import("pages/LoginUtente.vue"),
    name: "LoginUtente",
  },
  {
    path: "/LoginAdmin",
    component: () => import("pages/LoginAdmin.vue"),
    name: "LoginAdmin",
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
  {
    path: "/mail",
    component: () => import("layouts/Mail.vue"),
    name: "Mail",
  },
  {
    path: "/maintenance",
    component: () => import("pages/Maintenance.vue"),
    name: "Maintenance",
  },
  {
    path: "/lock",
    component: () => import("pages/LockScreen.vue"),
    name: "Lock",
  },
];

export default routes;