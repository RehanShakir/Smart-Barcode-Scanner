import React from "react";
import "antd/dist/antd.css";

import { Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import AuthLayout from "layouts/Auth.js";
import Login from "views/pages/examples/Login";
import IndexView from "views/Index.js";
import Register from "./views/pages/examples/Register";
import Profile from "./views/pages/examples/Profile";
import Dashboard from "./views/pages/dashboards/Dashboard";
import { getToken } from "./Redux/localstorage";

function LoggedIn({ children, redirectTo }) {
  let isAuthenticated = getToken();

  return isAuthenticated ? <Redirect from='*' to={redirectTo} /> : children;
}

function RequireAuth({ children, redirectTo }) {
  let isAuthenticated = getToken();
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Redirect from='*' to={redirectTo} />;
}

const App = () => {
  return (
    <Switch>
      {/* <Route path='/admin' render={(props) => <AdminLayout {...props} />} /> */}
      <Route path='/rtl' render={(props) => <RTLLayout {...props} />} />
      <Route
        path='/auth'
        render={() => (
          <LoggedIn redirectTo={"/dashboard"}>
            <Login />
          </LoggedIn>
        )}
      />

      <Route
        path='/register'
        render={() => (
          <LoggedIn redirectTo={"/dashboard"}>
            <Register />
          </LoggedIn>
        )}
      />
      <Route
        path='/profile'
        render={(props) => (
          <RequireAuth redirectTo={"/auth"}>
            <Profile />
          </RequireAuth>
        )}
      />
      <Route
        path='/'
        render={() => (
          <RequireAuth redirectTo={"/auth"}>
            <AdminLayout />
          </RequireAuth>
        )}
      />

      <Redirect from='*' to='/' />
    </Switch>
  );
};

export default App;
