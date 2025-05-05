import { createContext, ReactNode, use } from "react";

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

interface Drawer {
  isDrawerOpen: boolean;
  updateIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type DrawerContextProviderProps = {
  children: ReactNode;
  drawer: Drawer;
};
