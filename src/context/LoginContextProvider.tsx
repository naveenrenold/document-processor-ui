import { createContext, use } from "react";
import {
  login,
  LoginContextProviderProps,
} from "../Types/Context/ContextTypes";

export let loginContext = createContext<login | null>(null);
function LoginContextProvider({ children, login }: LoginContextProviderProps) {
  return (
    <>
      <loginContext.Provider value={login}>{children}</loginContext.Provider>
    </>
  );
}

export default LoginContextProvider;

export function useLoginContext() {
  let context = use(loginContext);
  if (!context) {
    throw new Error("Error at useLoginContext: null Context");
  }
  return context;
}
