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
import AdminContextProvider from "./context/AdminContextProvider";
import Form from "./component/Form/Form";
import UserContextProvider from "./context/UserContextProvider";
import { UserDetails } from "./Types/Component/UserDetails";

function Main() {
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj.initialize(); // initialise singleton authentication on program start
  }, []);

  let [isLoggedIn, updateIsLoggedIn] = useState(false);
  let [isDrawerOpen, updateIsDrawerOpen] = useState(false);
  let [isAdmin, updateIsAdmin] = useState(false);
  let [user, updateUser] = useState<UserDetails | null>(null);
  const isMobile = useMediaQuery("(max-width:639px)");

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/">
          <DrawerContextProvider drawer={{ isDrawerOpen, updateIsDrawerOpen }}>
            <UserContextProvider user={user} updateUser={updateUser}>
              <LoginContextProvider login={{ isLoggedIn, updateIsLoggedIn }}>
                <AdminContextProvider admin={{ isAdmin, updateIsAdmin }}>
                  <Header />
                </AdminContextProvider>
              </LoginContextProvider>
              <Box sx={{ marginLeft: isDrawerOpen && !isMobile ? "240px" : 0 }}>
                {isLoggedIn && (
                  <Routes>
                    {isAdmin && <Route path="admin" element={<Admin />} />}
                    <Route path="form" element={<Form />} />
                  </Routes>
                )}
              </Box>
            </UserContextProvider>
          </DrawerContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Main />);
