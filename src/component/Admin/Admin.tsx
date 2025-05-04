import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import httpClient from "../../helper/httpClient";
import data from "../../data/UserTable.json";
import generator from "generate-password-browser";
import styles from "./Admin.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockResetIcon from "@mui/icons-material/LockReset";

function Admin() {
  //constants
  const indiaPhoneRegex = new RegExp("^(\\+91|\\+91\-|0)?[789]\\d{9}$");
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+$");
  const domain = "@navigatorxdd.onmicrosoft.com";
  const isMobile = useMediaQuery("(max-width:639px)");
  //state variable
  let [currentTab, updateCurrentTab] = useState<number>(1);
  let [users, updateUsers] = useState<UserDetails[]>([]);
  let [displayName, updatedisplayName] = useState<stringTextField>({
    value: "",
    error: false,
    helperText: null,
  });
  let [emailAlias, updateEmailAlias] = useState<stringTextField>({
    value: "",
    error: false,
    helperText: null,
  });
  let [phoneNumber, updatePhoneNumber] = useState<stringTextField>({
    value: "",
    error: false,
    helperText: null,
  });
  let [location, updateLocation] = useState<stringTextField>({
    value: "",
    error: false,
    helperText: null,
  });
  let [alertProps, updateAlertProps] = useState<AlertProps>({
    show: false,
    message: "",
    severity: "info",
  });
  let [isLoading, setIsLoading] = useState<boolean>(false);
  let [selectedUser, updateSelectedUser] = useState<UserDetails>();
  let [currentDialog, updateCurrentDialog] = useState({
    showAddUserDialog: false,
    showDeleteUserDialog: false,
    showBlockUserDialog: false,
    showResetUserDialog: false,
  });
  let [addUserDialogProps, updateAddUserDialogProps] = useState({
    username: "",
    password: "",
  });
  let [SnackBarProps, updateSnackBarProps] = useState<SnackBarProps>({
    isOpen: false,
    message: "",
  });
  // let [deleteUserDialogProps, updateDeleteUserDialogProps] = useState("")

  //useEffect
  useEffect(() => {
    const getUsers = () => {
      return httpClient.getAsync<UserDetails[]>(
        "users?$filter=userType eq 'Guest'",
        undefined,
        updateAlertProps,
        undefined,
        setIsLoading,
      );
    };
    getUsers().then((response) => {
      if (!response || response.length === 0) {
        console.log("Get users call failed");
        return;
      }
      updateUsers(
        response.filter((value) => {
          return value.officeLocation;
        }),
      );
    });
  }, []);

  //render functions
  const deleteUserDialog = () => {
    return (
      <>
        <DialogTitle>Delete User:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              deleteUser(selectedUser!);
              updateCurrentDialog({
                showAddUserDialog: false,
                showDeleteUserDialog: false,
                showBlockUserDialog: false,
                showResetUserDialog: false,
              });
            }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              updateCurrentDialog({
                showAddUserDialog: false,
                showDeleteUserDialog: false,
                showBlockUserDialog: false,
                showResetUserDialog: false,
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    );
  };

  const addUserDialog = () => {
    return (
      <>
        <DialogTitle>Added User:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>{`User has been created with:`}</Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography>{`UserName : ${addUserDialogProps.username}`}</Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography>{`Password : ${addUserDialogProps.password}`}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              copyToClipboard(
                `Your login details for GenuineSoft are as follows : \nUserName : ${addUserDialogProps.username}\nPassword : ${addUserDialogProps.password}`,
                updateSnackBarProps,
              );
            }}
          >
            Copy to Clipboard
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              updateCurrentDialog({
                showAddUserDialog: false,
                showDeleteUserDialog: false,
                showBlockUserDialog: false,
                showResetUserDialog: false,
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    );
  };

  const isDialogOpen = () => {
    return (
      currentDialog.showAddUserDialog || currentDialog.showDeleteUserDialog
    );
  };

  const setDialog = () => {
    if (!isDialogOpen) {
      return <></>;
    }
    if (currentDialog.showAddUserDialog) {
      return addUserDialog();
    }
    if (currentDialog.showDeleteUserDialog) {
      return deleteUserDialog();
    }
  };

  const addUser = (
    displayName: string | null,
    emailAlias: string | null,
    phoneNumber: string | null,
    location: string | null,
  ) => {
    if (!validateAddUsers(displayName, emailAlias, phoneNumber, location)) {
      return;
    }
    const addUserrequest: AddUserRequest = {
      accountEnabled: true,
      displayName: displayName!,
      mobilePhone: phoneNumber!,
      officeLocation: location!,
      mailNickname: emailAlias!,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: generatePassword(),
      },
      userPrincipalName: emailAlias! + domain,
      userType: "Guest",
    };
    httpClient
      .postAsync<any>(
        "users",
        addUserrequest,
        undefined,
        updateAlertProps,
        undefined,
        setIsLoading,
      )
      .then((result) => {
        if (result) {
          let user: UserDetails = {
            displayName: addUserrequest.displayName,
            mobilePhone: Number(addUserrequest.mobilePhone),
            officeLocation: addUserrequest.officeLocation,
            userPrincipalName: addUserrequest.mailNickname + domain,
          };
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
          });
          updateAddUserDialogProps({
            username: addUserrequest.mailNickname + domain,
            password: addUserrequest.passwordProfile.password,
          });
          updateCurrentDialog({
            showAddUserDialog: true,
            showDeleteUserDialog: false,
            showBlockUserDialog: false,
            showResetUserDialog: false,
          });
        }
      });
  };
  const deleteUser = (user: UserDetails) => {
    httpClient
      .deleteAsync<any>(
        `users/${user.userPrincipalName}`,
        undefined,
        updateAlertProps,
        "User deleted",
        setIsLoading,
      )
      .then((result) => {
        if (result) {
          updateUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
        }
      });
  };

  //helper functions
  const validateAddUsers = (
    displayName: string | null,
    emailAlias: string | null,
    phoneNumber: string | null,
    location: string | null,
  ): boolean => {
    if (!displayName) {
      updatedisplayName((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User Name is required",
      }));
      return false;
    }
    if (!emailAlias) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "emailAlias is required",
      }));
      return false;
    }
    if (!phoneNumber) {
      updatePhoneNumber((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "PhoneNumber is required",
      }));
      return false;
    }
    if (!location) {
      updateLocation((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Location is required",
      }));
      return false;
    }
    if (displayName.length < 1 || displayName.length > 50) {
      updatedisplayName((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User length should be > 1 and < 50",
      }));
      return false;
    }
    if (emailAlias.length < 1 || emailAlias.length > 50) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User length should be > 1 and < 50",
      }));
      return false;
    }
    if (emailAlias.search(emailRegex)) {
      updateEmailAlias((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Email alias is not valid",
      }));
      return false;
    }
    if (phoneNumber.search(indiaPhoneRegex)) {
      updatePhoneNumber((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "Invalid PhoneNumber",
      }));
      return false;
    }
    return true;
  };

  const generatePassword = (): string => {
    return generator.generate({
      length: 8,
      symbols: true,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
  };

  return (
    <>
      <Snackbar
        open={SnackBarProps.isOpen}
        autoHideDuration={5000}
        onClose={() => {
          updateSnackBarProps({ isOpen: false, message: "" });
        }}
        message={SnackBarProps.message}
      ></Snackbar>
      <Dialog
        open={isDialogOpen()}
        onClose={() => {
          updateCurrentDialog({
            showAddUserDialog: false,
            showDeleteUserDialog: false,
            showBlockUserDialog: false,
            showResetUserDialog: false,
          });
        }}
      >
        {setDialog()}
      </Dialog>
      <TabContext value={currentTab}>
        <Tabs
          value={currentTab}
          onChange={(_, newTab) => updateCurrentTab(newTab)}
        >
          <Tab label="List User" value={1}></Tab>
          <Tab label="Add User" value={2}></Tab>
          <Tab label="Restore User" value={3}></Tab>
          <Tab label="User Logs" value={4}></Tab>
        </Tabs>
        <TabPanel value={1}>
          <Box>
            {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )}
            <Stack>
              <Typography variant="h6">List Users:</Typography>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  {data.getUserHeading.map((heading, id) => {
                    return <TableCell key={id}>{heading}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        <TableCell>{user.mobilePhone}</TableCell>
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              updateSelectedUser(user);
                              updateCurrentDialog({
                                showAddUserDialog: false,
                                showDeleteUserDialog: false,
                                showBlockUserDialog: false,
                                showResetUserDialog: true,
                              });
                            }}
                          >
                            <LockResetIcon></LockResetIcon>
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              updateSelectedUser(user);
                              updateCurrentDialog({
                                showAddUserDialog: false,
                                showDeleteUserDialog: false,
                                showBlockUserDialog: true,
                                showResetUserDialog: false,
                              });
                            }}
                          >
                            <BlockIcon></BlockIcon>
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              updateSelectedUser(user);
                              updateCurrentDialog({
                                showAddUserDialog: false,
                                showDeleteUserDialog: true,
                                showBlockUserDialog: false,
                                showResetUserDialog: false,
                              });
                            }}
                          >
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </Box>
        </TabPanel>

        <TabPanel value={2}>
          <Box>
            {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )}
            <Stack>
              <Typography variant="h6">Add Users:</Typography>
            </Stack>
            <Stack direction={"column"}>
              <Stack>
                <TextField
                  required={true}
                  error={displayName.error}
                  helperText={displayName.helperText}
                  variant="filled"
                  label="Name:"
                  value={displayName?.value}
                  onChange={(e) => {
                    updatedisplayName({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>{" "}
              </Stack>
              <Stack direction="row">
                <TextField
                  className="w-1/2"
                  required={true}
                  error={emailAlias.error}
                  helperText={emailAlias.helperText}
                  variant="filled"
                  label="Email Alias:"
                  value={emailAlias?.value}
                  onChange={(e) => {
                    updateEmailAlias({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>
                <TextField
                  className="w-1/2"
                  disabled={true}
                  value="@navigatorxdd.onmicrosoft.com"
                ></TextField>
              </Stack>
              <Stack>
                <TextField
                  required={true}
                  error={phoneNumber.error}
                  helperText={phoneNumber.helperText}
                  variant="filled"
                  label="Phone No:"
                  value={phoneNumber?.value}
                  onChange={(e) => {
                    updatePhoneNumber({
                      value: e.target.value,
                      error: false,
                      helperText: null,
                    });
                  }}
                ></TextField>{" "}
              </Stack>
              <Stack>
                <Autocomplete
                  value={location?.value}
                  onChange={(_, value) =>
                    updateLocation({
                      value: value,
                      error: false,
                      helperText: null,
                    })
                  }
                  autoHighlight={true}
                  freeSolo={false}
                  options={["Nagercoil", "Tutucorin"]}
                  renderInput={(params) => (
                    <TextField
                      required={true}
                      error={location.error}
                      helperText={location.helperText}
                      {...params}
                      variant="filled"
                      label="Location"
                    ></TextField>
                  )}
                ></Autocomplete>{" "}
              </Stack>
              <Stack>
                <Button
                  onClick={() =>
                    addUser(
                      displayName.value,
                      emailAlias.value,
                      phoneNumber.value,
                      location.value,
                    )
                  }
                  variant="contained"
                >
                  Add User
                </Button>
              </Stack>
            </Stack>
          </Box>
        </TabPanel>
      </TabContext>
    </>
  );
}
export default Admin;

export interface UserDetails {
  businessPhones?: number[];
  displayName?: string;
  givenName?: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: number;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
}
export interface AddUserRequest {
  accountEnabled: boolean;
  displayName: string;
  mailNickname: string;
  userPrincipalName: string;
  passwordProfile: {
    forceChangePasswordNextSignIn: boolean;
    password: string;
  };
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  userType: "Member" | "Guest";
}

export interface stringTextField {
  value: string | null;
  error: boolean;
  helperText: string | null;
}
export interface AlertProps {
  show: boolean;
  severity: severity;
  message: string;
}
export type severity = "error" | "info" | "success" | "warning";

export interface SnackBarProps {
  isOpen: boolean;
  message: string;
}
export const copyToClipboard = (
  message: string,
  updateSnackBarProps: React.Dispatch<React.SetStateAction<SnackBarProps>>,
) => {
  navigator.clipboard
    .writeText(message)
    .then(() => {
      updateSnackBarProps({
        isOpen: true,
        message: "Copied to clipboard",
      });
    })
    .catch(() => {
      updateSnackBarProps({
        isOpen: true,
        message: "Failed to copy to clipboard",
      });
    });
};
