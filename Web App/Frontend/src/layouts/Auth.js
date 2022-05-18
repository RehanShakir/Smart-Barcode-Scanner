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
import React, { useEffect, useCallback } from "react";
// react library for routing
import { useLocation, Route, Switch, Redirect } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";
import { getToken } from "../Redux/localstorage";
import { loadProfile } from "../Redux/actions/auth.actions";
import { useSelector, useDispatch } from "react-redux";

import routes from "routes.js";

function Auth() {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const fetchProfile = useCallback(() => {
    const token = getToken();
    if (token && !authState.isSignedIn) {
      dispatch(loadProfile(token));
    }
  }, [dispatch, authState.isSignedIn]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  console.log(authState);
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        console.log(prop);
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className='main-content' ref={mainContentRef}>
        <AuthNavbar />
        <Switch>
          {getRoutes(routes)}
          <Redirect from='*' to='/auth/login' />
        </Switch>
      </div>
      <AuthFooter />
    </>
  );
}

export default Auth;
