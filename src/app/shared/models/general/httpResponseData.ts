import { ErrorData } from ".";

export class HttpResponseData<T,TErrorCode> {
    success: boolean;
    data : T;
    Error : ErrorData<TErrorCode>
  }