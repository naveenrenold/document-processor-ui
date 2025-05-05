import { createRoot } from "react-dom/client";
import Header from "./component/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import MSALAuth from "./helper/MSALAuth";
import LoginContextProvider from "./context/LoginContextProvider";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./helper/material-ui-config";
import Admin from "./component/Admin/Admin";
import Box from "@mui/material/Box";
import DrawerContextProvider from "./context/MainContextProvider";
import useMediaQuery from "@mui/material/useMediaQuery";

function Main() {
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj.initialize();
  }, []);

  let [isLoggedIn, updateIsLoggedIn] = useState(false);
  let [isDrawerOpen, updateIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:639px)");

  return (
    <>
      <ThemeProvider theme={theme}>
        <DrawerContextProvider drawer={{ isDrawerOpen, updateIsDrawerOpen }}>
          <LoginContextProvider login={{ isLoggedIn, updateIsLoggedIn }}>
            <Header />
          </LoginContextProvider>
          <Box sx={{ marginLeft: isDrawerOpen && !isMobile ? "240px" : 0 }}>
            {isLoggedIn && (
              <BrowserRouter basename="/">
                <Routes>
                  <Route path="admin" element={<Admin />} />
                </Routes>
              </BrowserRouter>
            )}
          </Box>
        </DrawerContextProvider>
      </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Main />);
