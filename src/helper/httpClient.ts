import axios from 'axios';

class httpClient implements IHttpClient
{
    private baseUrl = "";

    public async getAsync<T>(url : string)
    {
        var response = await axios.get(`${this.baseUrl}/${url}`);
        return response.data as T;
    }

    public async  postAsync<T>(url : string, request : any)
    {
        var response = await axios.post(`${this.baseUrl}/${url}`, request);
        return response.data as T;
    }

}

export interface IHttpClient
{
    getAsync: (url: string) => any;
    postAsync: (url: string, request : any) => Promise<any>;
}

export default httpClient;