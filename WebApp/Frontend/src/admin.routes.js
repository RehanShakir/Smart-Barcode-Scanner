/*!

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import AdminDashboard from "views/pages/dashboards/Admin.js";
import Profile from "views/pages/examples/Profile.js";
import AllUsers from "views/pages/AllUsers";
import UserDetails from "views/pages/UserDetails";
import UserClaims from "views/pages/UserClaims";

const routes = [
  {
    name: "Dashboards",
    icon: "ni ni-shop text-primary",
    path: "/dashboard",
    layout: "/admin",
    component: AdminDashboard,
    miniName: "D",
    visible: true,
  },

  {
    name: "All Users",
    icon: "ni ni-single-02 text-green",
    path: "/all-users",
    layout: "/admin",
    miniName: "AU",
    component: AllUsers,
    visible: true,
  },
  {
    name: "User Claims",
    icon: "ni ni-circle-08 text-black",
    path: "/claim",
    miniName: "UC",
    component: UserClaims,
    layout: "/admin",
    visible: true,
  },
  {
    name: "Settings",
    icon: "ni ni-ungroup text-orange",
    path: "/profile",
    miniName: "S",
    component: Profile,
    layout: "/admin",
    visible: true,
  },

  {
    path: "/details",
    component: UserDetails,
    layout: "/admin",
    visible: false,
  },
];

export default routes;
