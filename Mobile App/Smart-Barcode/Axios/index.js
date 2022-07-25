import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.53.182:3500/api",
  baseURL: "https://smart-barcode-webapp.production.rehanshakir.com/api",
  //   baseURL: process.env.REACT_APP_API,
});
