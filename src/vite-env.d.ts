/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GIT_PAT: string;
  readonly VITE_AppId: string;
  readonly VITE_TenantId: string;
  readonly VITE_BaseURL: string;
  readonly VITE_Base: string;
  readonly VITE_ApiUrl: string;
  // more env variables...
}
