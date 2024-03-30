import fetch from "../axiosPlugin";
import {
  CustomAxiosError,
  CustomAxiosResponse,
  type CustomError,
  type CustomResponse,
} from "../customs";
import { headers } from "../config";

const axios = fetch.fetch;

const verifyToken = async (
  token: string
): Promise<CustomResponse | CustomError> => {
  let body = { token: token };
  return await axios
    .post("/api/auth/token/verify/", body, { headers: headers })
    .then((res) => CustomAxiosResponse(res))
    .catch((er) => CustomAxiosError(er));
};

const createSnippet = async (
  snippet: any
): Promise<CustomResponse | CustomError> => {
  return await axios
    .post("/api/snippets/", snippet, { headers: headers })
    .then((res) => CustomAxiosResponse(res))
    .catch((er) => CustomAxiosError(er));
};

export { verifyToken, createSnippet };
