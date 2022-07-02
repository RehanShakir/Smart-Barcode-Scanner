import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.10.26:3500/api",
  // baseURL: "https://smart-barcode-webapp.production.rehanshakir.com/api",
  //   baseURL: process.env.REACT_APP_API,
});
