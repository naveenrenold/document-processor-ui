import {createContext, useState, ReactNode} from "react";

function LoginContextProvider({children} : LoginContextProviderProps)
{    
    let loginContext = createContext<login | null>(null);
    let [isLoggedIn, updateIsLoggedIn] = useState(false);
    return <>
    <loginContext.Provider value = {{isLoggedIn, updateIsLoggedIn}}>
        {children}
    </loginContext.Provider>
    </>
    
}

export default LoginContextProvider;

interface login{
    isLoggedIn: boolean;
    updateIsLoggedIn : React.Dispatch<React.SetStateAction<boolean>>;
   }

type LoginContextProviderProps = {
    children: ReactNode
};