import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getBearerToken } from "./MSALAuth";
import { loginRequest } from "./authConfig";
import { AlertProps } from "../component/Admin/Admin";

class httpClient {
  static baseUrl = import.meta.env.VITE_BaseURL;
  static graphApiUrl = "https://graph.microsoft.com/v1.0/";

  public static async getAsync<T extends axiosTypes<T>>(
    url: string,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.get(
      `${isGraph ? httpClient.baseUrl : this.graphApiUrl}${url}`,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(response, setAlert);
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async postAsync<T extends axiosTypes<T>>(
    url: string,
    request: any,
    scopes: string[] = loginRequest.scopes,
    setAlert: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.post(
      `${isGraph ? httpClient.baseUrl : this.graphApiUrl}${url}`,
      request,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(response, setAlert);
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async handleHttpResponse<T extends axiosTypes<T>>(
    result: Promise<AxiosResponse<any, any>>,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
  ): Promise<T | undefined> {
    let response: T | undefined = await result
      .then((response) => {
        return response.data.value || (response.data as T);
      })
      .catch((err: AxiosError<T>) => {
        let response = err.response?.data;
        this.setAlerts(response, setAlert);
        return;
      });
    return response;
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

  static async setAlerts<T extends axiosTypes<T>>(
    response?: T,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
  ) {
    let graphMessage;
    if (response?.error?.message && response?.error?.message.length > 0) {
      graphMessage = response?.error?.message[0];
    }
    if (setAlert) {
      let alert: AlertProps = {
        message:
          graphMessage ||
          response?.message ||
          (response ? response.toString() : "Error occured"),
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
}

export interface IHttpClient {
  getAsync: (url: string) => any;
  postAsync: (url: string, request: any) => Promise<any>;
}

export interface message {
  message: string[];
}

export interface axiosTypes<T> {
  value: T;
  message: string;
  error: message;
}

export default httpClient;
