import {
  SIGN_UP,
  SIGN_IN,
  LOAD_PROF,
  SIGN_OUT,
  UPDATE_PROF,
  REFRESH,
} from "../types";
import server from "../../Axios/index";
import { notification } from "antd";
import { QueryCache } from "react-query";
import { updateProfile } from "Axios/apiFunctions";

import { saveToken, deleteToken } from "../localstorage";

export const signUp = (formValues) => {
  // const { fullName, email, password } = formValues;

  return async (dispatch) => {
    try {
      const res = await server.post("/auth/signup", formValues);
      if (res.status === 200) {
        notification["success"]({
          message: "Sign Up Successfull",
        });
        console.log("Sign Up Successfully");
      }
      dispatch({ type: SIGN_UP });
    } catch (error) {
      console.log(error);
      return error;
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    try {
      const res = await server.post("/auth/login", { email, password });
      if (res.status === 200) {
        saveToken(res.data.token);
        dispatch({ type: SIGN_IN, payload: res.data });
      }
    } catch (error) {
      if (error.response.status === 500) {
        notification["error"]({
          message: `${error.response.data.message}`,
        });
      }
      console.log(error.response);
    }
  };
};

export const loadProfile = (token) => {
  return async (dispatch) => {
    try {
      const res = await server.get("/auth/my-profile", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      dispatch({ type: LOAD_PROF, payload: res.data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateUserProfile = (formValues) => {
  return async (dispatch) => {
    try {
      const res = await updateProfile(formValues);
      if (res.status === 200) {
        notification["success"]({
          message: `${res.data.message}`,
        });
      }
      dispatch({ type: UPDATE_PROF, payload: res.data.data });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
};

export const signOut = () => {
  const queryCache = new QueryCache();
  queryCache.clear();
  deleteToken();
  return { type: SIGN_OUT };
};

export const refresh = () => {
  console.log(`Refreshing`);
  return { type: REFRESH };
};
