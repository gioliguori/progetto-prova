const routes = [
  {
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
    path: "/UserLogin",
    component: () => import("pages/UserLogin.vue"),
    name: "UserLogin",
  },
  {
    path: "/UserRegistration",
    component: () => import("pages/UserRegistration.vue"),
    name: "UserRegistration",
  },
  {
    path: "/AdminLogin",
    component: () => import("pages/AdminLogin.vue"),
    name: "AdminLogin",
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
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
    component: () => import("pages/IndexPage.vue"),
    name: "IndexPage",
  },
];

export default routes;
