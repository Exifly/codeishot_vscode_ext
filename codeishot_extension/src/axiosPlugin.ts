/**
 * Ported from vue axios plugin.
 * Needs to:
 * - Use the extension configuration instead of authStore
 * - Change the import.meta
 */

import axios from "axios";
import { getTokenFromConfiguration } from "./login";

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

    if (token) {
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
