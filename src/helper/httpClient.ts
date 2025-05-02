import axios, { AxiosRequestConfig } from 'axios';
import { getBearerToken } from './MSALAuth';
import { loginRequest } from './authConfig';

class httpClient
{
    static baseUrl = import.meta.env.VITE_BaseURL;
    static graphApiUrl = "https://graph.microsoft.com/v1.0/";

    public static async getAsync<T>(url : string, scopes : string[] = loginRequest.scopes, handleError = true)
    {
        let bearerToken = await getBearerToken(scopes);
        console.log("Bearer token:",bearerToken);
        if(!bearerToken)
        {            
            return;
        }        
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.get(`${httpClient.baseUrl}${url}`, header);
        if(response.status >= 200 && response.status < 400)
        {
        return response.data as T;
        }
        else if(response.status == 400)
        {
            if(handleError)
            {
            alert(response.data.message && response.data)
            }
        }
        else{
            console.log("Exception:",response.data)
        }
        return;            
    }

    public async  postAsync<T>(url : string, request : any, scopes : string[] = loginRequest.scopes,  handleError = true)
    {
        let bearerToken = await getBearerToken(scopes);
        if(!bearerToken)
        {            
            return;
        }
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.post(`${httpClient.baseUrl}${url}`, request, header);
        if(response.status >= 200 && response.status < 400)
            {
            return response.data as T;
            }
            else if(response.status == 400)
            {
                if(handleError)
                {
                    alert(response.data.message && response.data)
                } 
            }
            else{
                console.log("Exception:",response.data)
            }
            return;        
    }
    public static async getGraphAsync<T>(url : string, scopes : string[] = loginRequest.scopes,  handleError = true)
    {
        let bearerToken = await getBearerToken(scopes);
        console.log("Bearer token:",bearerToken);
        if(!bearerToken)
        {            
            return;
        }        
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.get(`${httpClient.graphApiUrl}${url}`, header);
        if(response.status >= 200 && response.status < 400)
            {
            return response.data as T;
            }
            else if(response.status == 400)
            {
                if(handleError)
                {
                alert(response.data.error.message || response.data)
                }                
            }
            else{
                console.log("Exception:",response.data)
            }
            return;
    }

    public static async  postGraphAsync<T>(url : string, request : any, scopes : string[] = loginRequest.scopes,  handleError = true)
    {
        let bearerToken = await getBearerToken(scopes);
        if(!bearerToken)
        {            
            return;
        }
        let header : AxiosRequestConfig<any> = {headers: {Authorization: `Bearer ${bearerToken}`}}
        let response = await axios.post(`${httpClient.graphApiUrl}${url}`, request, header);
        if(response.status >= 200 && response.status < 400)
            {
            return response.data as T;
            }
            else if(response.status == 400 && handleError)
            {
                if(handleError)
                    {
                    alert(response.data.error.message || response.data)
                }                
            }
            else{
                console.log("Exception:",response.data)
            }
            return;
    }

}

export interface IHttpClient
{
    getAsync: (url: string) => any;
    postAsync: (url: string, request : any) => Promise<any>;
}

export default httpClient;