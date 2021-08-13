import { HttpHeaders } from "@angular/common/http";

export const HttpOptions = 
{
    headers : new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'X-API-KEY' : 'jkbndsukfnleunfaskdjfblhabga54135813a3sgasd54dfgs1'
    }),
    withCredentials: true,
    responseType : 'json'
}