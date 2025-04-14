import * as msal from "@azure/msal-browser";
import { loginRequest, msalConfig } from "../helper/authConfig";
import { useContext, useState } from "react";
import { AppContext } from "../store/context";

function AuthProvider() {
  console.log("In Auth provider");
  let [accountId, updateAccountId] = useState("");  
  let {isLoggedIn, updateisLoggedIn} = useContext(AppContext);

  const myMSALObj = new msal.PublicClientApplication(msalConfig);

  myMSALObj.initialize().then(() => {
        selectAccount()
    //   .handleRedirectPromise()
    //   .then((authResult) => setActiveAccount(authResult))      
  });

  const selectAccount = () => {
    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts) {
        updateisLoggedIn(false);
      return;
    } else if (currentAccounts.length > 1) {
      // Add your account choosing logic here
      console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
      //username = currentAccounts[0].username;
      updateisLoggedIn(true);
      updateAccountId(currentAccounts[0].homeAccountId);
      console.log("Account found: " + currentAccounts[0].username);
    }
  }

  const setActiveAccount = (resp: msal.AuthenticationResult | null) => {
    if (resp !== null) {
      accountId = resp.account.homeAccountId;
      myMSALObj.setActiveAccount(resp.account);
      updateisLoggedIn(true);
      updateAccountId(accountId);
    } else {
      selectAccount();
    }
  };

  const signIn = async(method : "popup" | "redirect") => {    
    if (method === "popup") {
      return myMSALObj
        .loginPopup({
          ...loginRequest,
          redirectUri: "http://localhost:5173/",
        })
        .then(setActiveAccount)
        .catch(function (error) {
          console.log(error);
        });
    } else if (method === "redirect") {
      return myMSALObj.loginRedirect(loginRequest);
    }
  }

  const signOut = async() => {
    const logoutRequest = {
      account: myMSALObj.getAccount({homeAccountId : accountId}),
    };
      myMSALObj.logoutPopup({...logoutRequest}).then(() =>{        
        updateisLoggedIn(false);
        updateAccountId("");
      });
      
  }

  return (
    <>
      {isLoggedIn ? <button type="submit" onClick={() => signOut()}>SignOut</button>
      : <button type="submit" onClick={() => signIn("popup")}>SignIn</button>}
      {isLoggedIn && <div>{"AccountId:" + accountId}</div>}
    </>
  );
}

export default AuthProvider;