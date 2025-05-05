import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useLoginContext } from "../../context/LoginContextProvider";
import { loginRequest } from "../../helper/authConfig";
import MSALAuth from "../../helper/MSALAuth";
import {
  AccountInfo,
  EndSessionPopupRequest,
  PopupRequest,
} from "@azure/msal-browser";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import style from "./Header.module.css";
import headings from "../../data/headings.json";
import { useDrawerContext } from "../../context/MainContextProvider";

function Header() {
  //constants
  const drawerWidth = 240;
  useEffect(() => {
    new MSALAuth();
    MSALAuth.myMSALObj
      .initialize()
      .then(() => {
        setAccount();
        console.log("Account set");
      })
      .catch((err) => {
        console.log("Error at Msal initialse", err);
      });
    const setAccount = () => {
      let accounts = MSALAuth.myMSALObj.getAllAccounts();
      if (!accounts || accounts.length == 0) {
        console.log("Signing in");
        signIn();
        return;
      } else if (accounts.length > 1) {
        console.log("Warning, more than 1 active account");
        updateAccountInfo(accounts[0]);
        updateIsLoggedIn(true);
      } else {
        console.log("Default sign in", accounts[0]);
        updateAccountInfo(accounts[0]);
        updateIsLoggedIn(true);
      }
    };
  }, []);
  let [currentDate, updatecurrentDate] = useState(new Date());
  let [accountInfo, updateAccountInfo] = useState<AccountInfo | null>(null);
  let { isLoggedIn, updateIsLoggedIn } = useLoginContext();
  const isMobile = useMediaQuery("(max-width:639px)");
  let { isDrawerOpen, updateIsDrawerOpen } = useDrawerContext();
  const baseURL = import.meta.env.VITE_BaseURL;

  const signIn = () => {
    let request: PopupRequest = loginRequest;
    MSALAuth.myMSALObj
      .loginPopup(request)
      .then((authResult) => {
        MSALAuth.myMSALObj.setActiveAccount(authResult.account);
        updateAccountInfo(authResult.account);
        updateIsLoggedIn(true);
      })
      .catch((err) => {
        console.log("Error at Sign in ", err);
      });
  };
  const signOut = () => {
    console.log("in sign out");
    if (!accountInfo) {
      return;
    }
    let request: EndSessionPopupRequest = { account: accountInfo };
    MSALAuth.myMSALObj
      .logoutPopup(request)
      .then(() => {
        console.log("logoutsuccess");
        updateAccountInfo(null);
        updateIsLoggedIn(false);
      })
      .catch((err) => {
        console.log("Error at Sign in ", err);
      });
  };

  setInterval(() => {
    updatecurrentDate(new Date());
  }, 1000);
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        open={isDrawerOpen}
        onClose={() => {
          updateIsDrawerOpen(false);
        }}
      >
        <Toolbar />
        <List>
          {headings.map((heading, id) => {
            return (
              <div key={id}>
                <ListItem key={id}>
                  <ListItemButton>
                    <ListItemText>
                      <Link href={baseURL + heading.href}>{heading.name}</Link>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <Divider orientation="horizontal" flexItem></Divider>
              </div>
            );
          })}
          {isMobile ? (
            <>
              {isLoggedIn ? (
                <>
                  <ListItem>
                    <ListItemText>
                      {accountInfo?.name && accountInfo?.name.length < 20
                        ? accountInfo?.name
                        : accountInfo?.name?.substring(0, 20) + "..."}
                    </ListItemText>
                  </ListItem>
                  <Divider orientation="horizontal" flexItem></Divider>
                </>
              ) : (
                <></>
              )}
              <ListItem>
                <ListItemText>
                  {format(currentDate, "dd/MM/yy h:mm aa")}
                </ListItemText>
              </ListItem>
              <Divider orientation="horizontal" flexItem></Divider>
            </>
          ) : (
            <></>
          )}
        </List>
      </Drawer>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack
          className="w-full"
          useFlexGap
          direction={"row"}
          spacing={1}
          divider={<Divider orientation="vertical" flexItem></Divider>}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              updateIsDrawerOpen(!isDrawerOpen);
            }}
          >
            <img
              alt="Image failed to load"
              src="/favicon.svg"
              className="w-7 h-7 sm:w-10 sm:h-10"
            ></img>
          </IconButton>
          <Typography variant="h5">Genuine Soft</Typography>
          <Stack
            direction={"row"}
            spacing={1}
            divider={<Divider orientation="vertical" flexItem></Divider>}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {isLoggedIn ? (
              <>
                <div className={style.hm}>{accountInfo?.name}</div>
                {/* <Divider orientation="vertical" flexItem></Divider> */}
                <Button
                  size="small"
                  color={"secondary"}
                  variant="contained"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color={"secondary"}
                variant="contained"
                onClick={() => {
                  signIn();
                }}
              >
                Sign In
              </Button>
            )}
            <div className={style.hm}>
              {format(currentDate, "dd/MM/yy h:mm aa")}
            </div>
          </Stack>
        </Stack>
      </AppBar>
    </>
  );
}
export default Header;
