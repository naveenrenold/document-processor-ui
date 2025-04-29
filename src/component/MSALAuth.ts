import * as msal from "@azure/msal-browser";
import { msalConfig } from "../helper/authConfig";


export default class MSALAuth{
  static myMSALObj : msal.PublicClientApplication;    
  constructor()
  {
    if(!MSALAuth.myMSALObj)
    {
      MSALAuth.myMSALObj = new msal.PublicClientApplication(msalConfig);      
    }    
  }
}

  // selectAccount = (myMSALObj : msal.PublicClientApplication) => {
  //   const currentAccounts = myMSALObj.getAllAccounts();
  //   return currentAccounts;
  //   // if (!currentAccounts) {
  //   //     //updateisLoggedIn(false);        
  //   //   return;
  //   // } else if (currentAccounts.length > 1) {
  //   //   // Add your account choosing logic here
  //   //   console.warn("Multiple accounts detected.");
  //   // } else if (currentAccounts.length === 1) {
  //   //   //username = currentAccounts[0].username;
  //   //   //updateisLoggedIn(true);
  //   //   //updateAccountId(currentAccounts[0].homeAccountId);
  //   //   console.log("Account found: " + currentAccounts[0].username);
  //   // }
  // }

  // setActiveAccount = (resp: msal.AuthenticationResult | null, accountId : string, myMSALObj : msal.PublicClientApplication) => {
  //   if (resp !== null) {
  //     accountId = resp.account.homeAccountId;
  //     myMSALObj.setActiveAccount(resp.account);
  //     //updateisLoggedIn(true);
  //     //updateAccountId(accountId);
  //   } else {
  //     selectAccount();
  //   }
  // };

  // signIn = async(method : "popup" | "redirect") => { 
  //   console.log("in sign in")   
  //   if (method === "popup") {
  //     return myMSALObj
  //       .loginPopup({
  //         ...loginRequest,
  //         redirectUri: import.meta.env.VITE_BaseURL,
  //       })
  //       .then(setActiveAccount)
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   } else if (method === "redirect") {
  //     return myMSALObj.loginRedirect(loginRequest);
  //   }
  // }

  //  signOut = async() => {
  //   const logoutRequest :msal.EndSessionRequest = {
  //     account: myMSALObj.getAccount({homeAccountId : accountId})      
  //   };
  //     myMSALObj.logoutPopup({...logoutRequest}).then((a) =>{
  //       console.log("signout value",a)        
  //       //updateisLoggedIn(false);
  //       //updateAccountId("");
  //     }).catch(() => {
  //       console.log("failed")
  //     });
      
  // }  
// }