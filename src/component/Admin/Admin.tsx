import {
  Alert,
  Autocomplete,
  Box,
  Button,
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import httpClient from "../../helper/httpClient";
import data from "../../data/UserTable.json";
import generator from "generate-password-browser";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircle from "@mui/icons-material/CheckCircle";
import RestoreIcon from "@mui/icons-material/Restore";

function Admin() {
  //constants
  const indiaPhoneRegex = new RegExp("^(\\+91|\\+91\-|0)?[789]\\d{9}$");
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+$");
  const domain = "@navigatorxdd.onmicrosoft.com";
  const isMobile = useMediaQuery("(max-width:639px)");
  const defaultDialog = {
    showAddUserDialog: false,
    showDeleteUserDialog: false,
    showBlockUserDialog: false,
    showResetUserDialog: false,
    showResetUserSuccessDialog: false,
    ShowUnBlockUserDialog: false,
    ShowRestoreUserDialog: false,
  };
  //state variable
  let [currentTab, updateCurrentTab] = useState<number>(1);
  let [users, updateUsers] = useState<UserDetails[]>([]);
  let [blockedUsers, updateBlockedUsers] = useState<UserDetails[]>([]);
  let [deletedUsers, updateDeletedUsers] = useState<UserDetails[]>([]);
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
  let [currentDialog, updateCurrentDialog] = useState(defaultDialog);
  let [userDialogProps, updateUserDialogProps] = useState({
    username: "",
    password: "",
  });
  let [SnackBarProps, updateSnackBarProps] = useState<SnackBarProps>({
    isOpen: false,
    message: "",
  });

  //useEffect
  useEffect(() => {
    const getUsers = () => 
      {
      return httpClient.getAsync<UserDetails[]>(
        "users?$filter=userType eq 'Guest'",
        undefined,
        updateAlertProps,
        undefined,
        setIsLoading,
        true,
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

    const getBlockedUsers = () => {
      return httpClient.getAsync<UserDetails[]>(
        "users?$filter=userType eq 'Guest' and accountEnabled eq false",
        undefined,
        updateAlertProps,
        undefined,
        setIsLoading,
        true,
      );
    };
    getBlockedUsers().then((response) => {
      if (!response || response.length === 0) {
        console.log("Get blocked users call failed");
        return;
      }
      updateBlockedUsers(
        response.filter((value) => {
          return value.officeLocation;
        }),
      );
    });

    const getDeletedUsers = () => {
      return httpClient.getAsync<UserDetails[]>(
        "/directory/deletedItems/microsoft.graph.user?$filter=userType eq 'Guest'&$orderby=deletedDateTime desc&$count=true",
        undefined,
        updateAlertProps,
        undefined,
        setIsLoading,
        true,
      );
    };
    getDeletedUsers().then((response) => {
      if (!response || response.length === 0) {
        console.log("Get deleted users call failed");
        return;
      }
      updateDeletedUsers(
        response.filter((value) => {
          return value.officeLocation;
        }),
      );
    });
  }, []);

  //render functions
  const deleteUserDialog = () => {
    const deleteUserDialogProps: ConfirmationDialogProps = {
      title: "Delete User",
      content: `Are you sure you want to delete user: ${selectedUser?.displayName}?`,
      onButton1: () => {
        deleteUser(selectedUser!);
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
    };
    return (
      <>
        <ConfirmationDialog {...deleteUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const addUserDialog = () => {
    const addUserDialogProps: ConfirmationDialogProps = {
      title: "Added User",
      content: [
        "User has been created with:",
        `UserName : ${userDialogProps.username}`,
        `Password : ${userDialogProps.password}`,
      ],
      onButton1: () => {
        copyToClipboard(
          `Your login details for GenuineSoft are as follows : \nUserName : ${userDialogProps.username}\nPassword : ${userDialogProps.password}`,
          updateSnackBarProps,
        );
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
      Button1: "Copy to ClipBoard",
      Button2: "Cancel",
    };
    return (
      <>
        <ConfirmationDialog {...addUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const resetUserDialog = () => {
    const resetUserDialogProps: ConfirmationDialogProps = {
      title: "Reset User",
      content: `Are you sure you want to reset password for ${selectedUser?.displayName}?`,
      onButton1: () => {
        resetUserPassword(selectedUser!);
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
    };
    return (
      <>
        <ConfirmationDialog {...resetUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const resetUserSuccessDialog = () => {
    const resetUserSuccessDialogProps: ConfirmationDialogProps = {
      title: "User password Reset!",
      content: [
        "User new login details are:",
        `UserName : ${userDialogProps.username}`,
        `Password : ${userDialogProps.password}`,
      ],
      onButton1: () => {
        copyToClipboard(
          `Your new login details for GenuineSoft are as follows : \nUserName : ${userDialogProps.username}\nPassword : ${userDialogProps.password}`,
          updateSnackBarProps,
        );
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
      Button1: "Copy to ClipBoard",
      Button2: "Cancel",
    };
    return (
      <>
        <ConfirmationDialog
          {...resetUserSuccessDialogProps}
        ></ConfirmationDialog>
      </>
    );
  };

  const blockUserDialog = () => {
    const blockUserDialogProps: ConfirmationDialogProps = {
      title: "Block User",
      content: `Are you sure you want to block user ${selectedUser?.displayName}`,
      onButton1: () => {
        blockUser(selectedUser!);
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
    };
    return (
      <>
        <ConfirmationDialog {...blockUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const unBlockUserDialog = () => {
    const unblockUserDialogProps: ConfirmationDialogProps = {
      title: "Unblock User",
      content: `Are you sure you want to unblock user ${selectedUser?.displayName}`,
      onButton1: () => {
        unblockUser(selectedUser!);
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
    };
    return (
      <>
        <ConfirmationDialog {...unblockUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const restoreUserDialog = () => {
    const restoreUserDialogProps: ConfirmationDialogProps = {
      title: "Restore User",
      content: `Are you sure you want to restore user ${selectedUser?.displayName}`,
      onButton1: () => {
        restoreUser(selectedUser!);
        updateCurrentDialog(defaultDialog);
      },
      onButton2: () => {
        updateCurrentDialog(defaultDialog);
      },
    };
    return (
      <>
        <ConfirmationDialog {...restoreUserDialogProps}></ConfirmationDialog>
      </>
    );
  };

  const isDialogOpen = () => {
    return (
      currentDialog.showAddUserDialog ||
      currentDialog.showDeleteUserDialog ||
      currentDialog.showResetUserDialog ||
      currentDialog.showBlockUserDialog ||
      currentDialog.ShowUnBlockUserDialog ||
      currentDialog.ShowRestoreUserDialog ||
      currentDialog.showResetUserSuccessDialog
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
    if (currentDialog.showResetUserDialog) {
      return resetUserDialog();
    }
    if (currentDialog.showResetUserSuccessDialog) {
      return resetUserSuccessDialog();
    }
    if (currentDialog.showBlockUserDialog) {
      return blockUserDialog();
    }
    if (currentDialog.ShowUnBlockUserDialog) {
      return unBlockUserDialog();
    }
    if (currentDialog.ShowRestoreUserDialog) {
      return restoreUserDialog();
    }
  };
  // api calls
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
        true,
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
          updateUserDialogProps({
            username: addUserrequest.mailNickname + domain,
            password: addUserrequest.passwordProfile.password,
          });
          updateCurrentDialog({
            ...defaultDialog,
            showAddUserDialog: true,
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
        true,
      )
      .then((result) => {
        if (result) {
          updateUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });

          updateDeletedUsers((prevUsers) => {
            return [user, ...prevUsers];
          });
        }
      });
  };

  const resetUserPassword = (user: UserDetails) => {
    const resetPasswordRequest = {
      //passwordProfile: {
      //forceChangePasswordNextSignIn: true,
      newPassword: generatePassword(),
      //},
    };
    httpClient
      .postAsync<any>(
        `users/${user.userPrincipalName}/authentication/methods/28c10230-6103-485e-b985-444c60001490/resetPassword`,
        resetPasswordRequest,
        undefined,
        updateAlertProps,
        "Password reset successfully",
        setIsLoading,
        true,
      )
      .then((result) => {
        if (result) {
          updateUserDialogProps({
            username: user.userPrincipalName ?? "",
            password: resetPasswordRequest.newPassword,
          });
          updateCurrentDialog({
            ...defaultDialog,
            showResetUserSuccessDialog: true,
          });
        }
      });
  };

  const blockUser = (user: UserDetails) => {
    const blockUserRequest = {
      accountEnabled: false,
    };
    httpClient
      .patchAsync<any>(
        `users/${user.userPrincipalName}`,
        blockUserRequest,
        undefined,
        updateAlertProps,
        "User blocked",
        setIsLoading,
        true,
      )
      .then((result) => {
        if (result) {
          updateUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateBlockedUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
      });
  };

  const unblockUser = (user: UserDetails) => {
    const unblockUserRequest = {
      accountEnabled: true,
    };
    httpClient
      .patchAsync<any>(
        `users/${user.userPrincipalName}`,
        unblockUserRequest,
        undefined,
        updateAlertProps,
        "User Unblocked",
        setIsLoading,
        true,
      )
      .then((result) => {
        if (result) {
          updateBlockedUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
      });
  };

  const restoreUser = (user: UserDetails) => {
    const restoreUserRequest = { autoReconcileProxyConflict: "true" };
    httpClient
      .postAsync<any>(
        `/directory/deletedItems/${user.id}/restore`,
        restoreUserRequest,
        undefined,
        updateAlertProps,
        "User restored",
        setIsLoading,
        true,
      )
      .then((result) => {
        if (result) {
          updateDeletedUsers((prevUsers) => {
            return prevUsers.filter((user) => {
              return user.userPrincipalName != selectedUser?.userPrincipalName;
            });
          });
          updateUsers((prevUsers) => {
            return [...prevUsers, user];
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
          updateCurrentDialog(defaultDialog);
        }}
      >
        {setDialog()}
      </Dialog>
      <TabContext value={currentTab}>
        <Tabs
          variant="scrollable"
          value={currentTab}
          onChange={(_, newTab) => updateCurrentTab(newTab)}
        >
          <Tab label="List User" value={1}></Tab>
          <Tab label="Add User" value={2}></Tab>
          <Tab label="UnBlock User" value={3}></Tab>
          <Tab label="Restore User" value={4}></Tab>
          <Tab label="User Logs" value={5}></Tab>
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
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="Reset">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog({
                                    ...defaultDialog,
                                    showResetUserDialog: true,
                                  });
                                }}
                              >
                                <LockResetIcon></LockResetIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Block">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog({
                                    ...defaultDialog,
                                    showBlockUserDialog: true,
                                  });
                                }}
                              >
                                <BlockIcon></BlockIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog({
                                    ...defaultDialog,
                                    showDeleteUserDialog: true,
                                  });
                                }}
                              >
                                <DeleteIcon></DeleteIcon>
                              </IconButton>
                            </Tooltip>
                          </Stack>
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
        <TabPanel value={3}>
          <Box>
            {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )}
            <Stack>
              <Typography variant="h6">Unblock Users:</Typography>
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
                {blockedUsers && blockedUsers.length > 0 ? (
                  blockedUsers.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="UnBlock">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog({
                                    ...defaultDialog,
                                    ShowUnBlockUserDialog: true,
                                  });
                                }}
                              >
                                <CheckCircle></CheckCircle>
                              </IconButton>
                            </Tooltip>
                          </Stack>
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
        <TabPanel value={4}>
          <Box>
            {isLoading && <LinearProgress></LinearProgress>}
            {alertProps.show && (
              <Alert variant="filled" severity={alertProps.severity}>
                {alertProps.message}
              </Alert>
            )}
            <Stack>
              <Typography variant="h6">Restore Users:</Typography>
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
                {deletedUsers && deletedUsers.length > 0 ? (
                  deletedUsers.map((user, id) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{user.displayName}</TableCell>
                        {/* <TableCell>{user.mail}</TableCell> */}
                        {/* <TableCell>{user.mobilePhone}</TableCell> */}
                        <TableCell>{user.officeLocation}</TableCell>
                        <TableCell>
                          <Stack direction={isMobile ? "column" : "row"}>
                            <Tooltip title="Restore">
                              <IconButton
                                onClick={() => {
                                  updateSelectedUser(user);
                                  updateCurrentDialog({
                                    ...defaultDialog,
                                    ShowRestoreUserDialog: true,
                                  });
                                }}
                              >
                                <RestoreIcon></RestoreIcon>
                              </IconButton>
                            </Tooltip>
                          </Stack>
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

export type ConfirmationDialogProps = {
  title: string;
  content: string | string[];
  onButton1?: () => void;
  onButton2?: () => void;
  Button1?: string;
  Button2?: string;
};

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

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  const {
    title,
    content,
    onButton1,
    onButton2,
    Button1 = "Yes",
    Button2 = "Cancel",
  } = props;
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content && typeof content === "object" ? (
          content.map((value, id) => {
            return <DialogContentText key={id}>{value}</DialogContentText>;
          })
        ) : (
          <>
            <DialogContentText>{content}</DialogContentText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {onButton1 && (
          <Button
            variant="contained"
            onClick={() => {
              onButton1();
            }}
          >
            {Button1}
          </Button>
        )}
        {onButton2 && (
          <Button
            variant="outlined"
            onClick={() => {
              onButton2();
            }}
          >
            {Button2}
          </Button>
        )}
      </DialogActions>
    </>
  );
}
