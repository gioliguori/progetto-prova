const routes = [
  {
    // Rotte per l'area admin
    path: "/",
    component: () => import("src/layouts/AdminLayout.vue"),
    children: [
      {
        path: "AdminDashboard",
        component: () => import("pages/AdminDashboard.vue"),
        name: "AdminDashboard",
      },
      {
        path: "AdminInsertPartner",
        component: () => import("pages/AdminInsertPartner.vue"),
        name: "AdminInsertPartner",
      },
      {
        path: "AdminBikeList",
        component: () => import("pages/AdminBikeList.vue"),
        name: "AdminBikeList",
      },
      {
        path: "AdminPartnerList",
        component: () => import("pages/AdminPartnerList.vue"),
        name: "AdminPartnerList",
      },
      {
        path: "AdminBikeMap",
        component: () => import("pages/AdminBikeMap.vue"),
        name: "AdminBikeMap",
      },
    ],
  },
  {
    // Rotte per l'area partner
    path: "/",
    component: () => import("src/layouts/PartnerLayout.vue"),
    children: [
      {
        path: "PartnerDashboard",
        component: () => import("pages/PartnerDashboard.vue"),
        name: "PartnerDashboard",
      },
      {
        path: "PartnerBikeList",
        component: () => import("pages/PartnerBikeList.vue"),
        name: "PartnerBikeList",
      },
      {
        path: "PartnerInsertBike",
        component: () => import("pages/PartnerInsertBike.vue"),
        name: "PartnerInsertBike",
      },
      {
        path: "PartnerEditBike",
        component: () => import("pages/PartnerEditBike.vue"),
        name: "PartnerEditBike",
      },
    ],
  },
  {
    // Rotte per l'area utente
    path: "/",
    component: () => import("src/layouts/UserLayout.vue"),
    children: [
      {
        path: "UserHome",
        component: () => import("pages/UserHome.vue"),
        name: "UserHome",
      },
      {
        path: "UserProfile",
        component: () => import("pages/UserProfile.vue"),
        name: "UserProfile",
      },
      {
        path: "UserRentals",
        component: () => import("pages/UserRentals.vue"),
        name: "UserRentals",
      },
      {
        path: "UserEditProfile",
        component: () => import("pages/UserEditProfile.vue"),
        name: "UserEditProfile",
      },
      {
        path: "UserQrPage",
        component: () => import("pages/UserQrPage.vue"),
        name: "UserQrPage",
      },
      {
        path: "RentalInstructions",
        component: () => import("pages/RentalInstructions.vue"),
        name: "RentalInstructions",
      },
    ],
  },
  {
    // Rotta per la pagina di login dell'utente
    path: "/UserLogin",
    component: () => import("pages/UserLogin.vue"),
    name: "UserLogin",
  },
  {
    // Rotta per la pagina di registrazione dell'utente
    path: "/UserRegistration",
    component: () => import("pages/UserRegistration.vue"),
    name: "UserRegistration",
  },
  {
    // Rotta per la pagina di login dell'amministratore
    path: "/AdminLogin",
    component: () => import("pages/AdminLogin.vue"),
    name: "AdminLogin",
  },
  {
    // Rotta per la pagina di errore 404
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
  {
    // Rotta per la pagina di manutenzione
    path: "/maintenance",
    component: () => import("pages/Maintenance.vue"),
    name: "Maintenance",
  },
  {
    // Rotta per la pagina di blocco schermo
    path: "/lock",
    component: () => import("pages/LockScreen.vue"),
    name: "Lock",
  },
  {
    // Rotta per la pagina principale
    path: "",
    component: () => import("pages/IndexPage.vue"),
    name: "IndexPage",
  },
];

export default routes;
