import { createRoot } from "react-dom/client";
import App from "./component/App";
import Header from "./component/Header";
import { BrowserRouter, Route, Routes } from "react-router"
import { use, useEffect } from "react";
import MSALAuth from "./component/MSALAuth";
import { msalConfig } from "./helper/authConfig";

function Main() {
  useEffect(() => {
    new MSALAuth()
    MSALAuth.myMSALObj.initialize()
  },[])
  
  return (
    <>           
      <Header></Header>                     
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

