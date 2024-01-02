export type ResponseHandler<T> = (response: Response) => Promise<T>;

export type HttpRequestConfig<T> = {
  url: string,
  responseHandler?: ResponseHandler<T>,
}
