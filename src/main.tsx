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
import useMediaQuery from "@mui/material/useMediaQuery";
import Form from "./component/Form/Form";
import { UserDetails } from "./Types/Component/UserDetails";
import MainContextProvider, { setAlerts } from "./context/MainContextProvider";
import { AlertProps } from "./Types/ComponentProps/AlertProps";
import { AccountInfo } from "@azure/msal-browser";
import { Role } from "./Types/Component/Role";
import { SnackBarProps } from "./Types/ComponentProps/SnackBarProps";
import DashBoard from "./component/DashBoard/DashBoard";

function Main() {
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj.initialize(); // initialise singleton authentication on program start
  }, []);

  let [isDrawerOpen, updateIsDrawerOpen] = useState(false);
  let [alertProps, updateAlertProps] = useState<AlertProps>({
    message: "",
    show: false,
    severity: "info",
  });
  let [snackBarProps, updateSnackBarProps] = useState<SnackBarProps>({
    isOpen: false,
    message: "",
  });
  let [isLoading, updateIsLoading] = useState(false);
  let [user, updateUser] = useState<UserDetails | null>(null);
  let [accountInfo, updateAccountInfo] = useState<AccountInfo | null>(null);
  let [role, updateRole] = useState<Role>("Employee");
  const isMobile = useMediaQuery("(max-width:639px)");

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/">
          <MainContextProvider
            mainContext={{
              isDrawerOpen,
              updateIsDrawerOpen,
              alertProps,
              updateAlertProps,
              isLoading,
              updateIsLoading,
              snackBarProps,
              updateSnackBarProps,
              setAlerts,
              isMobile,
            }}
          >
            <LoginContextProvider
              loginContextProvider={{
                user,
                updateUser,
                accountInfo,
                updateAccountInfo,
                role,
                updateRole,
              }}
            >
              <Header />
              <Box sx={{ marginLeft: isDrawerOpen && !isMobile ? "240px" : 0 }}>
                {accountInfo && (
                  <Routes>
                    {role === "Admin" && (
                      <Route path="admin" element={<Admin />} />
                    )}
                    <Route path="form/:formId" element={<Form />} />
                    <Route path="form" element={<Form />} />
                    <Route path="/" element={<DashBoard />} />
                  </Routes>
                )}
              </Box>
            </LoginContextProvider>
          </MainContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Main />);
