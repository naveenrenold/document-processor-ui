import axios, { AxiosRequestConfig } from 'axios';
import { getBearerToken } from './MSALAuth';
import { loginRequest } from './authConfig';

class httpClient
{
    static baseUrl = import.meta.env.VITE_BaseURL;
    static graphApiUrl = "https://graph.microsoft.com/v1.0/";

    public static async getAsync<T>(url : string, scopes : string[] = loginRequest.scopes)
    {
        let bearerToken = await getBearerToken(scopes);
        console.log("Bearer token:",bearerToken);
        if(!bearerToken)
        {            
            return;
        }        
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.get(`${httpClient.baseUrl}${url}`, header);
        return response.data as T;
    }

    public async  postAsync<T>(url : string, request : any, scopes : string[] = loginRequest.scopes)
    {
        let bearerToken = await getBearerToken(scopes);
        if(!bearerToken)
        {            
            return;
        }
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.post(`${httpClient.baseUrl}${url}`, request, header);
        return response.data as T;
    }
    public static async getGraphAsync<T>(url : string, scopes : string[] = loginRequest.scopes)
    {
        let bearerToken = await getBearerToken(scopes);
        console.log("Bearer token:",bearerToken);
        if(!bearerToken)
        {            
            return;
        }        
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.get(`${httpClient.graphApiUrl}${url}`, header);
        return response.data.value as T;
    }

    public static async  postGraphAsync<T>(url : string, request : any, scopes : string[] = loginRequest.scopes)
    {
        let bearerToken = await getBearerToken(scopes);
        if(!bearerToken)
        {            
            return;
        }
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.post(`${httpClient.graphApiUrl}${url}`, request, header);
        return response.data as T;
    }

}

export interface IHttpClient
{
    getAsync: (url: string) => any;
    postAsync: (url: string, request : any) => Promise<any>;
}

export default httpClient;