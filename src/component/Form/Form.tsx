import {
  Alert,
  Box,
  Container,
  Divider,
  FormLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Attachment, Process } from "../../Types/Component/Form";
import { textFieldString } from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";

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
  //other api calls
  //render functions
  //helper funtions
  //render
  return (
    <>
      <Container maxWidth="xs">
        <Stack>
          <Typography variant="h5" fontWeight={800} color="primary">
            Form:
          </Typography>
        </Stack>
        <Stack direction={"row-reverse"}>{user?.officeLocation ?? ""}</Stack>
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
          <Select
            label="Process"
            value={currentProcess}
            variant="filled"
            onChange={(e) => {
              updateCurrentProcess(e.target.value as number);
            }}
          >
            {process.map((process) => {
              return (
                <MenuItem key={process.processId} value={process.processId}>
                  {process.processName}
                </MenuItem>
              );
            })}
          </Select>
        </Stack>
        <Stack>
          <></>
        </Stack>
      </Container>
    </>
  );
}
export default Form;
