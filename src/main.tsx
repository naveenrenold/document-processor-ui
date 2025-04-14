import { useState } from "react";
import AuthProvider from "./component/AuthProvider";
import { AppContext } from "./store/context";
import { createRoot } from "react-dom/client";

function Main() {
  let [isLoggedIn,updateisLoggedIn] = useState(false);    
  return (
    <>      
      <AppContext value={{ isLoggedIn, updateisLoggedIn }}>        
        <AuthProvider></AuthProvider>
        {isLoggedIn && <></>}
      </AppContext>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <Main />);

