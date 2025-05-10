import { createContext, ReactNode, use } from "react";
import { UserDetails } from "../component/Admin/Admin";

function UserContextProvider(prop: UserContextProps) {
  return (
    <UserContext.Provider value={prop}>
      {prop.children}
    </UserContext.Provider>
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

export interface UserContextProps {
  children: ReactNode;
  user: UserDetails | null;
  updateUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}
export interface UserProps {
  user: UserDetails | null;
  updateUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}

export const UserContext = createContext<UserProps | null>(null);
