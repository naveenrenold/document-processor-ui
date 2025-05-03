import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
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

function Admin() {
  let [currentTab, updateCurrentTab] = useState<number>(1);
  let [users, updateUsers] = useState<UserDetails[]>([]);
  const isMobile = useMediaQuery("(max-width:639px)");
  useEffect(() => {
    const getUsers = () => {
      return httpClient.getGraphAsync<UserDetails[]>(
        "users",
        undefined,
        updateAlertProps,
        setIsLoading,
      );
    };
    getUsers().then((response) => {
      if (!response) {
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

  let [displayName, updatedisplayName] = useState<stringTextField>({
    value: null,
    error: false,
    helperText: null,
  });
  let [emailAlias, updateEmailAlias] = useState<stringTextField>({
    value: null,
    error: false,
    helperText: null,
  });
  let [phoneNumber, updatePhoneNumber] = useState<stringTextField>({
    value: null,
    error: false,
    helperText: null,
  });
  let [location, updateLocation] = useState<stringTextField>({
    value: null,
    error: false,
    helperText: null,
  });
  let [alertProps, updateAlertProps] = useState<AlertProps>({
    show: false,
    message: "",
    severity: "info",
  });
  let [isLoading, setIsLoading] = useState<boolean>(false);

  const indiaPhoneRegex = new RegExp("^(\\+91|\\+91\-|0)?[789]\\d{9}$");
  const domain = "@navigatorxdd.onmicrosoft.com";
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
    console.log("login request:");
    console.log(addUserrequest);
    httpClient
      .postGraphAsync<any>(
        "users",
        addUserrequest,
        undefined,
        updateAlertProps,
        setIsLoading,
      )
      .then((value) => {
        console.log(value);
      });
  };

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
      updatedisplayName((lastValue) => ({
        ...lastValue,
        error: true,
        helperText: "User length should be > 1 and < 50",
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
    });
  };

  return (
    <>
      <TabContext value={currentTab}>
        <Tabs
          value={currentTab}
          onChange={(_, newTab) => updateCurrentTab(newTab)}
        >
          <Tab label="List User" value={1}></Tab>
          <Tab label="Add User" value={2}></Tab>
        </Tabs>
        <TabPanel value={1}>
          <Box>
            {isLoading ?? <LinearProgress></LinearProgress>}
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
            {isLoading ?? <LinearProgress></LinearProgress>}
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
  severity: "error" | "info" | "success" | "warning";
  message: string;
}
export const emailRegex = new RegExp("^\S+@\S+\.\S+$");
