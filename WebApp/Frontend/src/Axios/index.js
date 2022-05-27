import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3500/api",
  // baseURL: process.env.REACT_APP_API,
});
