import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getBearerToken } from "./MSALAuth";
import { loginRequest } from "./authConfig";
import { UserDetails } from "../Types/Component/UserDetails";
import { AlertProps } from "../Types/ComponentProps/AlertProps";
import { severity } from "../Types/ComponentProps/ButtonProps";

class httpClient {
  static baseUrl = import.meta.env.VITE_BaseURL;
  static graphApiUrl = "https://graph.microsoft.com/v1.0/";

  public static async getAsync<T>(
    url: string,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    successAlertMessage?: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.get<T>(
      `${isGraph ? this.graphApiUrl : httpClient.baseUrl}${url}`,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(
      response,
      setAlert,
      successAlertMessage,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async postAsync<T>(
    url: string,
    request: any,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    successAlertMessage?: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.post<T>(
      `${isGraph ? this.graphApiUrl : httpClient.baseUrl}${url}`,
      request,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(
      response,
      setAlert,
      successAlertMessage,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async deleteAsync<T>(
    url: string,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    successAlertMessage?: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.delete<T>(
      `${isGraph ? this.graphApiUrl : httpClient.baseUrl}${url}`,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(
      response,
      setAlert,
      successAlertMessage,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async patchAsync<T>(
    url: string,
    request: any,
    scopes: string[] = loginRequest.scopes,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    successAlertMessage?: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    isGraph = false,
  ) {
    let header = await this.getAuthHeader(scopes);
    if (!header) {
      return;
    }
    let response = axios.patch<T>(
      `${isGraph ? this.graphApiUrl : httpClient.baseUrl}${url}`,
      request,
      header,
    );
    if (setIsLoading) {
      setIsLoading(true);
    }
    let result = await httpClient.handleHttpResponse<T>(
      response,
      setAlert,
      successAlertMessage,
    );
    if (setIsLoading) {
      setIsLoading(false);
    }
    return result;
  }

  public static async handleHttpResponse<T>(
    result: Promise<AxiosResponse<any, any>>,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    successAlertMessage?: string,
  ): Promise<T | undefined> {
    let response: T | undefined = await result
      .then((response) => {
        if (successAlertMessage) {
          this.setAlerts(successAlertMessage, setAlert, "success");
        }
        return response.data.value || (response.data as T) || true;
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
    return {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        ConsistencyLevel: "eventual",
      },
    };
  }
  static async fetchUsers(
    url: string,
    updateAlertProps: React.Dispatch<React.SetStateAction<AlertProps>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    updateState: React.Dispatch<React.SetStateAction<UserDetails[]>>,
    filterFn: (value: UserDetails) => boolean = (value) =>
      value.officeLocation !== null,
  ) {
    const response = await httpClient.getAsync<UserDetails[]>(
      url,
      undefined,
      updateAlertProps,
      undefined,
      setIsLoading,
      true,
    );
    if (response && response.length > 0) {
      updateState(response.filter(filterFn));
      return;
    }
    console.log(`${url} call failed`);
    return [];
  }

  static async setAlerts<T>(
    result?: T,
    setAlert?: React.Dispatch<React.SetStateAction<AlertProps>>,
    severity: severity = "error",
  ) {
    let response: any = result;
    if (setAlert) {
      let alert: AlertProps = {
        message:
          response?.error?.message ||
          response?.message ||
          (response ? response.toString() : "Error occured"),
        severity: severity,
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
    } else {
      console.log(
        response?.error?.message ||
          response?.message ||
          (response ? response.toString() : "Error occured"),
      );
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
