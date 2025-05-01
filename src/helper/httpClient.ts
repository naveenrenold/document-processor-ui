import axios, { AxiosRequestConfig } from 'axios';
import { getBearerToken } from './MSALAuth';

class httpClient implements IHttpClient
{
    private baseUrl = "";

    public async getAsync<T>(url : string)
    {
        let bearerToken = await getBearerToken();
        if(!bearerToken)
        {            
            return;
        }        
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.get(`${this.baseUrl}/${url}`, header);
        return response.data as T;
    }

    public async  postAsync<T>(url : string, request : any)
    {
        let bearerToken = await getBearerToken();
        if(!bearerToken)
        {            
            return;
        }
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.post(`${this.baseUrl}/${url}`, request, header);
        return response.data as T;
    }

}

export interface IHttpClient
{
    getAsync: (url: string) => any;
    postAsync: (url: string, request : any) => Promise<any>;
}

export default httpClient;