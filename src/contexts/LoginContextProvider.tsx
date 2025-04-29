import {createContext, ReactNode, use} from "react";

export let loginContext = createContext<login | null>(null);
function LoginContextProvider({children, login} : LoginContextProviderProps)
{            
    return <>
    <loginContext.Provider value = {login}>
        {children}
    </loginContext.Provider>
    </>
    
}

export default LoginContextProvider;

export function useLoginContext()
{
    let context = use(loginContext);
    if(!context)
    {
        throw new Error("Error at useLoginContext: null Context")        
    }
    return context;
}

interface login{
    isLoggedIn: boolean;
    updateIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>>;
   }

type LoginContextProviderProps = {
    children: ReactNode;
    login :login    
};