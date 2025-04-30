import { createRoot } from "react-dom/client";
import App from "./component/App";
import Header from "./component/Header";
import { BrowserRouter, Route, Routes } from "react-router"
import { use, useEffect, useState } from "react";
import MSALAuth from "./component/MSALAuth";
import LoginContextProvider from "./contexts/LoginContextProvider";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { deepPurple, green, purple } from "@mui/material/colors";

function Main() {
  useEffect(() => {
    new MSALAuth()
    MSALAuth.myMSALObj.initialize()
  },[])
  
  let [isLoggedIn , updateIsLoggedIn] = useState(false);
  const theme = createTheme({
    palette: {
      mode: 'light',
    primary: {
      main: '#458f07',
      contrastText: 'rgba(245,240,240,0.87)',
    },
    secondary: {
      main: '#888f07',
      contrastText: 'rgba(245,243,243,0.87)',
    },
      contrastThreshold: 4.5,
    }
  });

  return (
    <>
    <ThemeProvider theme={theme}>
    <LoginContextProvider login={{isLoggedIn, updateIsLoggedIn}}>
      <Header></Header>   
      </LoginContextProvider>                      
        {isLoggedIn ?? <BrowserRouter>
        <Routes>
          <Route path="/" element={App()}></Route>
        </Routes>
        </BrowserRouter>        
        }      
        </ThemeProvider>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <Main />);

