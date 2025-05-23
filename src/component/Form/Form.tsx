import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Attachment, Process } from "../../Types/Component/Form";
import { textFieldString } from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";
import processData from "../../data/process.json";
import style from "./Form.module.css";
import httpClient from "../../helper/httpClient";

function Form() {
  //constants
  //usestate
  const defaultTextFieldString: textFieldString = {
    value: "",
    error: false,
    helperText: "",
  };
  const { user } = useLoginContext();
  const { updateAlertProps, updateIsLoading, updateSnackBarProps } =
    useMainContext();
  const [customerName, updatecustomerName] = useState<textFieldString>(
    defaultTextFieldString,
  );
  const [customerAddress, updateCustomerAddress] = useState(
    defaultTextFieldString,
  );
  const [currentProcess, updateCurrentProcess] = useState(0);
  const [process, updateProcess] = useState<Process[]>([]);
  const [attachments, updateattachments] = useState<Attachment[]>([]);

  //useeffect
  useEffect(() => {
    httpClient
      .getAsync<
        Process[]
      >(httpClient.GetProcess, [], updateAlertProps, undefined, updateIsLoading, false)
      .then((response) => {
        if (response && response.length > 0) {
          {
            updateProcess(response);
          }
        }
      });
  }, []);
  //other api calls
  //render functions
  //helper funtions
  //render
  return (
    <>
      <Container maxWidth="xs">
        <Stack>
          <Typography
            variant="h5"
            fontWeight={800}
            color="primary"
            className={style.textshadowsec}
          >
            Form:
          </Typography>
        </Stack>
        {/* <Stack direction={"row-reverse"}>
          <Typography className={style.textshadowsec} color="primary">
            {user?.officeLocation ?? ""}
          </Typography>
        </Stack> */}
        <Stack>
          <TextField
            label="Name of the Candidate:"
            value={customerName.value}
            required={true}
            error={customerName.error}
            helperText={customerName.helperText}
            variant="filled"
            margin="normal"
            onChange={(e) => {
              updatecustomerName({
                value: e.target.value,
                error: false,
                helperText: "",
              });
            }}
          ></TextField>
        </Stack>
        <Stack>
          <TextField
            label="Address"
            multiline={true}
            minRows={3}
            maxRows={5}
            value={customerAddress.value}
            margin="normal"
            variant="filled"
            error={customerAddress.error}
            helperText={customerAddress.helperText}
            onChange={(e) => {
              updateCustomerAddress({
                value: e.target.value,
                error: false,
                helperText: "",
              });
            }}
          ></TextField>
        </Stack>
        <Stack>
          <TextField
            select
            label="Process"
            value={currentProcess}
            variant="filled"
            onChange={(e) => {
              updateCurrentProcess(Number(e.target.value));
            }}
          >
            {process.map((process) => {
              return (
                <MenuItem key={process.processId} value={process.processId}>
                  {process.processName}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <Button variant="contained" component="label">
            Browse
            <input
              hidden
              type="file"
              title="browse"
              multiple
              accept="image/png, image/jpg, image/jpeg"
              capture="environment"
            ></input>
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <Button variant="contained">Save</Button>
          <Button variant="contained">Submit</Button>
        </Stack>
      </Container>
    </>
  );
}
export default Form;
