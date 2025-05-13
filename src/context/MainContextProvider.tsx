import { createContext, ReactNode, use } from "react";
import {
  MainContextProviderProps,
  MainContextType,
} from "../Types/Context/ContextTypes";

export let MainContext = createContext<MainContextType | null>(null);
function MainContextProvider({
  children,
  mainContext,
}: MainContextProviderProps) {
  return (
    <>
      <MainContext.Provider value={mainContext}>
        {children}
      </MainContext.Provider>
    </>
  );
}

export default MainContextProvider;

export function useMainContext() {
  let context = use(MainContext);
  if (!context) {
    throw new Error("Error at useMainContext: null Context");
  }
  return context;
}
