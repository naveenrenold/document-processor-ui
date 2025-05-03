import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getBearerToken } from "./MSALAuth";
import { loginRequest } from "./authConfig";
import { AlertProps } from "../component/Admin/Admin";

class httpClient {
  static baseUrl = import.meta.env.VITE_BaseURL;
  static graphApiUrl = "https://graph.microsoft.com/v1.0/";

  public static async getAsync<T>(
    url: string,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    if (setIsLoading) {
      setIsLoading(true);
    }
    let response = await axios.get(`${httpClient.baseUrl}${url}`, header);
    if (setIsLoading) {
      setIsLoading(false);
    }
    return httpClient.handleHttpResponse<T>(response, setAlert);
  }

  public static async postAsync<T>(
    url: string,
    request: any,
    scopes: string[] = loginRequest.scopes,
    setAlert: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    if (setIsLoading) {
      setIsLoading(true);
    }
    let response = await axios.post(
      `${httpClient.baseUrl}${url}`,
      request,
      header,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return httpClient.handleHttpResponse<T>(response, setAlert);
  }
  public static async getGraphAsync<T>(
    url: string,
    scopes: string[] = loginRequest.scopes,
    setAlert: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    if (setIsLoading) {
      setIsLoading(true);
    }
    let response = await axios.get(`${httpClient.graphApiUrl}${url}`, header);
    if (setIsLoading) {
      setIsLoading(false);
    }
    return httpClient.handleHttpResponse<T>(response, setAlert);
  }

  public static async postGraphAsync<T>(
    url: string,
    request: any,
    scopes: string[] = loginRequest.scopes,
    setAlert: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    if (setIsLoading) {
      setIsLoading(true);
    }
    let response = await axios.post(
      `${httpClient.graphApiUrl}${url}`,
      request,
      header,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return httpClient.handleHttpResponse<T>(response, setAlert);
  }

  public static handleHttpResponse<T>(
    response: AxiosResponse,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
  ) {
    if (response.status >= 200 && response.status < 400) {
      return response.data as T;
    } else if (response.status == 400) {
      if (setAlert) {
        let alert: AlertProps = {
          message:
            response.data.message.error ||
            response.data.message ||
            response.data,
          severity: "error",
          show: true,
        };
        setAlert(alert);
        alert = {
          message: "",
          severity: "info",
          show: false,
        };
        setTimeout(() => {
          setAlert(alert);
        }, 5000);
      }
    } else {
      console.log("Exception:", response.data);
      if (setAlert) {
        let alert: AlertProps = {
          message: response.data,
          severity: "error",
          show: true,
        };
        setAlert(alert);
        alert = {
          message: "",
          severity: "info",
          show: false,
        };
        setTimeout(() => {
          setAlert(alert);
        }, 5000);
      }
    }
    return;
  }

  static async getAuthHeader(
    scopes: string[],
  ): Promise<AxiosRequestConfig<any> | null> {
    let bearerToken = await getBearerToken(scopes);
    if (!bearerToken) {
      return null;
    }
    return { headers: { Authorization: `Bearer ${bearerToken}` } };
  }
}

export interface IHttpClient {
  getAsync: (url: string) => any;
  postAsync: (url: string, request: any) => Promise<any>;
}

export default httpClient;
