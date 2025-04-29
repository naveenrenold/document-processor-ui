import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {format} from "date-fns";
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useLoginContext } from '../contexts/LoginContextProvider';
import { loginRequest } from '../helper/authConfig';
import MSALAuth from './MSALAuth';
import { AccountInfo, EndSessionPopupRequest, PopupRequest } from '@azure/msal-browser';
import { Typography } from '@mui/material';

function Header()
{
  useEffect(() => {
    new MSALAuth()
    MSALAuth.myMSALObj.initialize().then(
      () => {
        setAccount();
        console.log("Account set");
      }
    ).catch((err) =>{
      console.log("Error at Msal initialse", err);
    })
    const setAccount = () => {
    let accounts = MSALAuth.myMSALObj.getAllAccounts();
    if(!accounts || accounts.length == 0)
    {
      console.log("Signing in")
      signIn();
      return;
    }
    else if(accounts.length > 1)
    {
      console.log("Warning, more than 1 active account");      
      updateAccountInfo(accounts[0]);
      updateIsLoggedIn(true);
    }
    else{
      console.log("Default sign in", accounts[0])
      updateAccountInfo(accounts[0]);
      updateIsLoggedIn(true);
    }
  }
  }, [])
    let [currentDate, updatecurrentDate] = useState(new Date());
    let [accountInfo, updateAccountInfo] = useState<AccountInfo | null>(null);
    let {isLoggedIn, updateIsLoggedIn} = useLoginContext();

    const signIn = () => {
      let request : PopupRequest = loginRequest
      MSALAuth.myMSALObj.loginPopup(request).then(
        (authResult) => {
          MSALAuth.myMSALObj.setActiveAccount(authResult.account);
          updateAccountInfo(authResult.account);
          updateIsLoggedIn(true);
        }
      )
      .catch(
        (err) => {
          console.log("Error at Sign in ", err)
        }
      )
    }
      const signOut = () => {
        console.log("in sign out")
        if(!accountInfo)
        {
          return;
        }
        let request : EndSessionPopupRequest = {account : accountInfo}
        MSALAuth.myMSALObj.logoutPopup(request).then(
            () => {
              console.log("logoutsuccess")
            updateAccountInfo(null);
            updateIsLoggedIn(false);          
            }
        )
        .catch(
          (err) => {
            console.log("Error at Sign in ", err)
          }
        )
      }    


    setInterval(() => {updatecurrentDate(new Date())}, 1000)
    return <>
    <Stack direction={"row"} spacing={1} divider= {<Divider orientation="vertical" flexItem></Divider>}>
          <img alt= "Image failed to load" src='/favicon.svg' className=".w-5 .h-5"></img>
          <div>GenuineSoft</div>          
        {isLoggedIn ? 
        (<>
          <div>
            {accountInfo?.name}
            </div>
            <Button variant='contained' onClick={() => {signOut()}}>
              Sign Out
            </Button>
          </>)
         : (<Button variant='contained' onClick={() => {signIn()}}>Sign In</Button>)}        
        <div>{format(currentDate, "dd/MM/yyyy h:mm aa")}</div>
          </Stack> 
    </>
}
export default Header;