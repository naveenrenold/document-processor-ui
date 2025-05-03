import { createRoot } from "react-dom/client";
import Header from "./component/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MSALAuth from "./helper/MSALAuth";
import LoginContextProvider from "./context/LoginContextProvider";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./helper/material-ui-config";
import Admin from "./component/Admin/Admin";

function Main() {
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj.initialize();
  }, []);

  let [isLoggedIn, updateIsLoggedIn] = useState(false);

  return (
    <>
      <ThemeProvider theme={theme}>
        <LoginContextProvider login={{ isLoggedIn, updateIsLoggedIn }}>
          <Header />
        </LoginContextProvider>
        {isLoggedIn && (
          <BrowserRouter basename="/">
            <Routes>
              <Route path="admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        )}
      </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Main />);
