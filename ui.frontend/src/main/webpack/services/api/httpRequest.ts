import { HttpRequestConfig } from "../../types/services/api/httpRequest";
import { jsonResponseHandler } from "./responseUtils";



const getResponseError = async (response: Response) => {
    const text = await response.text();
    return text ? JSON.parse(text) : new Error(response.statusText);
};

export const get = async <T,>(config: HttpRequestConfig<T>): Promise<T> => {
    const handler = config.responseHandler || jsonResponseHandler;
    const response = await fetch(config.url);

    if (!response.ok) {
        throw await getResponseError(response);
    }

    return handler(response);
};

export const simulateGet = (ms = 500): Promise<void> => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });