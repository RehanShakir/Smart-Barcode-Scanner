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

import ClientDashboard from "views/pages/dashboards/Client.js";
import Profile from "views/pages/examples/Profile.js";

const routes = [
  {
    name: "Dashboards",
    icon: "ni ni-shop text-primary",
    path: "/dashboard",
    layout: "/client",
    component: ClientDashboard,
  },

  {
    name: "Settings",
    icon: "ni ni-ungroup text-orange",
    path: "/profile",
    miniName: "P",
    component: Profile,
    layout: "/client",
  },
];

export default routes;
