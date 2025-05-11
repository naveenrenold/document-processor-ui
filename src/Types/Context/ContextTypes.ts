import { ReactNode } from "react";

export interface admin {
  isAdmin: boolean;
  updateIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AdminContextProviderProps = {
  children: ReactNode;
  admin: admin;
};

export interface login {
  isLoggedIn: boolean;
  updateIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export type LoginContextProviderProps = {
  children: ReactNode;
  login: login;
};

export interface Drawer {
  isDrawerOpen: boolean;
  updateIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type DrawerContextProviderProps = {
  children: ReactNode;
  drawer: Drawer;
};
