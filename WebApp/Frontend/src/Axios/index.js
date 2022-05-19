import axios from "axios";

console.log("ENV");
console.log(process.env.REACT_APP_API);
export default axios.create({
  baseURL: process.env.REACT_APP_API,
});
