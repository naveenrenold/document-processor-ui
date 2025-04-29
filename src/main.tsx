import { createRoot } from "react-dom/client";
import App from "./component/App";
import Header from "./component/Header";
import { BrowserRouter, Route, Routes } from "react-router"
import { use, useEffect, useState } from "react";
import MSALAuth from "./component/MSALAuth";
import { msalConfig } from "./helper/authConfig";
import LoginContextProvider from "./contexts/LoginContextProvider";

function Main() {
  useEffect(() => {
    new MSALAuth()
    MSALAuth.myMSALObj.initialize()
  },[])
  
  let [isLoggedIn , updateIsLoggedIn] = useState(false);

  return (
    <>
    <LoginContextProvider login={{isLoggedIn, updateIsLoggedIn}}>
      <Header></Header>   
      </LoginContextProvider>                      
        {<BrowserRouter>
        <Routes>
          <Route path="/" element={App()}></Route>
        </Routes>
        </BrowserRouter>
        }      
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <Main />);

