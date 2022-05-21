import React from "react";
import "antd/dist/antd.css";

import { Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import UsersDetails from "views/pages/UserDetails";
import Login from "views/pages/examples/Login";
import Register from "./views/pages/examples/Register";
import Profile from "./views/pages/examples/Profile";
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
        path='/details'
        render={() => (
          <RequireAuth redirectTo={"/auth"}>
            <UsersDetails />
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
