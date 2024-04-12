/**
 * Defines Custom data types and some of their implementations.
 */

import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

export interface CustomResponse {
  config: InternalAxiosRequestConfig;
  data: object;
  status_code: number;
  status_text: string;
}

export interface CustomError {
  code?: string;
  message: string;
  data: any; // FIXME: not any
  status_code?: number;
  status_text?: string;
}

/**
 *
 * @param {AxiosResponse} r
 * @returns Custom Axios response object
 */
const CustomAxiosResponse = (r: AxiosResponse): CustomResponse => {
  return {
    config: r.config,
    data: r.data,
    status_code: r.status,
    status_text: r.statusText,
  };
};

/**
 *
 * @param {AxiosError} er
 * @returns Custom Axios error object
 */
const CustomAxiosError = (er: AxiosError): CustomError => {
  return {
    code: er.code,
    message: er.message,
    data: er.response?.data,
    status_code: er.response?.status,
    status_text: er.response?.statusText,
  };
};

export { CustomAxiosResponse, CustomAxiosError };
