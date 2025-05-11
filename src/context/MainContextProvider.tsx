import { createContext, ReactNode, use } from "react";
import {
  Drawer,
  DrawerContextProviderProps,
} from "../Types/Context/ContextTypes";
import { UserDetails } from "../Types/Component/UserDetails";

export let DrawerContext = createContext<Drawer | null>(null);
function DrawerContextProvider({
  children,
  drawer,
}: DrawerContextProviderProps) {
  return (
    <>
      <DrawerContext.Provider value={drawer}>{children}</DrawerContext.Provider>
    </>
  );
}

export default DrawerContextProvider;

export function useDrawerContext() {
  let context = use(DrawerContext);
  if (!context) {
    throw new Error("Error at usedrawerContext: null Context");
  }
  return context;
}

export interface UserContextProps {
  children: ReactNode;
  user: UserDetails | null;
  updateUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}
export interface UserProps {
  user: UserDetails | null;
  updateUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}
