import { ResponseHandler } from "../../types/services/api/httpRequest";

export const jsonResponseHandler: ResponseHandler<any> = (response) => response.json();
