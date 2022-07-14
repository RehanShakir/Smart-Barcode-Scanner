import {
  SIGN_UP,
  SIGN_IN,
  LOAD_PROF,
  SIGN_OUT,
  UPDATE_PROF,
  REFRESH,
} from "../types";
import server from "../../Axios/index";
import { ToastAndroid } from "react-native";
import { QueryCache } from "react-query";
import { updateProfile } from "../../Axios/apiFunctions";

import { saveToken, deleteToken, saveState } from "../localstorage";

export const signUp = (formValues) => {
  // const { fullName, email, password } = formValues;
  console.log("formValues");

  return async (dispatch) => {
    try {
      const res = await server.post("/auth/signup", formValues);
      if (res.status === 200) {
        ToastAndroid.show("Sign Up Successfull", ToastAndroid.SHORT);
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
        saveState(true);
        dispatch({ type: SIGN_IN, payload: res.data });
      }
    } catch (error) {
      if (error.response.status === 500) {
        ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
      }
    }
  };
};

export const loadProfile = (token) => {
  return async (dispatch) => {
    try {
      console.log("IN LOAD PROFFF");
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
  return { type: REFRESH };
};
