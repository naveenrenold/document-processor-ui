import { FormLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useUserContext } from "../../context/UserContextProvider";
import { useState } from "react";

function Form() {
  //constants
  //usestate
  const { user, updateUser } = useUserContext();
  const [customerName, updatecustomerName] = useState("");
  const [customerAddress, updateCustomerAddress] = useState("");
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
      <Stack direction={"row-reverse"}>{user?.officeLocation ?? ""}</Stack>
      <Stack>
        <TextField
          label="Name of the Candidate:"
          value={customerName}
          required={true}
          onChange={(e) => {
            updatecustomerName(e.target.value);
          }}
        ></TextField>
      </Stack>
      <Stack>
        <TextField
          label="Address"
          multiline={true}
          minRows={3}
          value={customerAddress}
          onChange={(e) => {
            updateCustomerAddress(e.target.value);
          }}
        ></TextField>
      </Stack>
      <Stack>
        <Select
          label="Process"
          value={currentProcess}
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
    </>
  );
}
export default Form;
