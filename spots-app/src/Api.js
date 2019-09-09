import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_SPOTS_API_URL,
  responseType: "json"
});
