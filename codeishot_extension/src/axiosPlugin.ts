/**
 * This file is a Typescript module that uses Axios, a Promise-based HTTP client, to make HTTP requests.
 * It creates an Axios instance with custom configurations, such as base URL,
 * timeout, headers, etc. It also defines an interceptor to add a bearer token
 * to the request headers if the user is authenticated.
 * Finally, it exports the configured Axios instance as a default export.
 */
import axios from "axios";
import { getTokenFromConfiguration } from "./utils";
import { isAuthApproved } from "./preferences";

const fetch = axios.create({
  baseURL: process.env.API_BASE_URL || "https://api.codeishot.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  responseType: "json",
});

// Interceptor
fetch.interceptors.request.use(
  (config) => {
    // Check if the user tokens are stored to apply the bearer on the headers,
    // Otherwise the request is not authenticated.
    const token = getTokenFromConfiguration();
    const isAuthApprvd = isAuthApproved();

    if (token && isAuthApprvd) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(`Error in request ${error}`);
    return Promise.reject(error);
  }
);

export default { fetch };
