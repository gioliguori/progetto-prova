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
    component: () => import("layouts/MainLayoutUtente.vue"),
    children: [
      {
        path: "HOME_UTENTE",
        component: () => import("pages/HOME_UTENTE.vue"),
        name: "HOME_UTENTE",
      },
      {
        path: "ProfiloUtente",
        component: () => import("pages/ProfiloUtente.vue"),
        name: "ProfiloUtente",
      },
      {
        path: "Movimenti",
        component: () => import("pages/Movimenti.vue"),
        name: "Movimenti",
      },
      {
        path: "ModificaProfilo",
        component: () => import("pages/ModificaProfilo.vue"),
        name: "ModificaProfilo",
      },
      {
        path: "Assistenza",
        component: () => import("pages/Assistenza.vue"),
        name: "Assistenza",
      },
      {
        path: "QReader",
        component: () => import("pages/QReader.vue"),
        name: "QReader",
      },
      {
      path: "IstruzioniNoleggio",
      component: () => import("pages/IstruzioniNoleggio.vue"),
      name: "IstruzioniNoleggio",
    },
    ],
  },


  {
    path: "/LoginUtente",
    component: () => import("pages/LoginUtente.vue"),
    name: "LoginUtente",
  },
  {
    path: "/RegistrazioneUtente",
    component: () => import("pages/RegistrazioneUtente.vue"),
    name: "RegistrazioneUtente",
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
  {
    path: "",
    component: () => import("pages/PaginaIniziale.vue"),
    name: "PaginaIniziale",
  },
];

export default routes;