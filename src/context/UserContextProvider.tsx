import { createContext, use } from "react";
import { UserContextProps, UserProps } from "./MainContextProvider";

function UserContextProvider(prop: UserContextProps) {
  return (
    <UserContext.Provider value={prop}>{prop.children}</UserContext.Provider>
  );
}

export default UserContextProvider;

export const useUserContext = () => {
  const context = use(UserContext);
  if (!context) {
    throw "Error at UserContext Provider";
  }
  return context;
};

export const UserContext = createContext<UserProps | null>(null);
