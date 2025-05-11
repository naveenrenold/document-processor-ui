import { createContext, use } from "react";
import {
  admin,
  AdminContextProviderProps,
} from "../Types/Context/ContextTypes";

export let adminContext = createContext<admin | null>(null);
function AdminContextProvider({ children, admin }: AdminContextProviderProps) {
  return (
    <>
      <adminContext.Provider value={admin}>{children}</adminContext.Provider>
    </>
  );
}

export default AdminContextProvider;

export function useAdminContext() {
  let context = use(adminContext);
  if (!context) {
    throw new Error("Error at useAdminContext: null Context");
  }
  return context;
}
