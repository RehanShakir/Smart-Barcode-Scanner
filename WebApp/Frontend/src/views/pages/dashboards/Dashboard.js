import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../../Redux/localstorage";
import ClientDashboard from "./Client";
import AdminDashboard from "./Admin";
import { loadProfile } from "../../../Redux/actions/auth.actions";

const Dash = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const fetchProfile = useCallback(() => {
    const token = getToken();
    if (token && !authState.isSignedIn) {
      dispatch(loadProfile(token));
    }
  }, [authState.isSignedIn, dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return authState.role === "admin" ? <AdminDashboard /> : <ClientDashboard />;
};
export default Dash;
