import { SIGN_UP, SIGN_IN, LOAD_PROF, SIGN_OUT } from "../types";
import server from "../../Axios/index";
import { notification } from "antd";

import { saveToken, deleteToken } from "../localstorage";

export const signUp = (formValues) => {
  const { fullName, email, password } = formValues;

  return async (dispatch) => {
    try {
      const res = await server.post("/auth/signup", {
        fullName,
        email,
        password,
      });
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
      console.log(res.response.status);
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
      console.log(res.data);
      dispatch({ type: LOAD_PROF, payload: res.data });
    } catch (error) {
      console.log(error);
    }
  };
};

export const signOut = () => {
  deleteToken();
  return { type: SIGN_OUT };
};
