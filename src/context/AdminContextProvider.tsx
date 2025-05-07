import {createContext, ReactNode, use} from "react";

export let adminContext = createContext<admin | null>(null);
function AdminContextProvider({children, admin} : AdminContextProviderProps)
{            
    return <>
    <adminContext.Provider value = {admin}>
        {children}
    </adminContext.Provider>
    </>
    
}

export default AdminContextProvider;

export function useAdminContext()
{
    let context = use(adminContext);
    if(!context)
    {
        throw new Error("Error at useAdminContext: null Context")        
    }
    return context;
}

interface admin{
    isAdmin: boolean;
    updateIsAdmin : React.Dispatch<React.SetStateAction<boolean>>;
   }

type AdminContextProviderProps = {
    children: ReactNode;
    admin :admin    
};