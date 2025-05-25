import {
  Alert,
  Box,
  Button,
  Chip,
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
import {
  Attachment,
  FormDetails,
  FormRequest,
  Process,
} from "../../Types/Component/Form";
import { textFieldString } from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";
import processData from "../../data/process.json";
import style from "./Form.module.css";
import httpClient from "../../helper/httpClient";
import { AlertProps } from "../../Types/ComponentProps/AlertProps";

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
  const [attachments, updateAttachments] = useState<Attachment[]>([]);

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
            updateCurrentProcess(response[0].processId);
          }
        }
      });
  }, []);
  //other api calls
  const postForm = async () => {
    if (!validateForm()) {
      return;
    }
    const requestBody: FormRequest = {
      form: {
        customerName: customerName.value ?? "",
        customerAddress: customerAddress.value ?? "",
        typeId: 1,
        processId: currentProcess,
        lastUpdatedBy: user?.userPrincipalName ?? "",
        location: user?.officeLocation ?? "",
      },
    };
    httpClient
      .postAsync<number>(
        httpClient.GetForm,
        requestBody,
        undefined,
        updateAlertProps,
        undefined,
        updateIsLoading,
        false,
      )
      .then((response) => {
        if (response && response > 0) {
          setAlerts({
            message: `Form: ${response} has been created`,
            severity: "success",
            show: true,
          });
        }
      });
  };
  //render functions
  const attachmentForRender = () => {
    let attachmentElements: Attachment[][] = [];
    for (let i = 0; i < attachments.length; i = i + 5) {
      attachmentElements.push(attachments.slice(i, i + 5));
    }
    return attachmentElements;
  };
  //helper funtions
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    let fileAttachments: Attachment[] = [];
    if (fileList && fileList.length > 0) {
      fileAttachments = Array.from(fileList).map((file) => {
        return {
          filename: file.name,
          fileSizeInKb: file.size / 1024,
          filepath: URL.createObjectURL(file),
          fileType: file.type,
        };
      });
    }
    if (validateAttachments(fileAttachments)) {
      updateAttachments((prev) => [
        ...prev,
        ...fileAttachments.filter((attachment) => {
          return !prev.some(
            (existingAttachment) =>
              existingAttachment.filename === attachment.filename,
          );
        }),
      ]);
    }
  };

  const deleteAttachment = (filepath: string) => {
    updateAttachments((prev) => {
      return attachments.filter(
        (attachment) => attachment.filepath != filepath,
      );
    });
  };

  const validateAttachments = (fileAttachments: Attachment[]): boolean => {
    if (!fileAttachments || fileAttachments.length === 0) {
      return false;
    }
    if (
      fileAttachments.some((fileAttachment) =>
        attachments.find(
          (attachment) => attachment.filename === fileAttachment.filename,
        ),
      )
    ) {
      setAlerts({
        message: "File with same name already exists",
        severity: "error",
        show: true,
      });
      return false;
    }
    if (fileAttachments.length > 20) {
      setAlerts({
        message: "Maximum 20 attachments allowed",
        severity: "error",
        show: true,
      });
      return false;
    }
    for (const attachment of fileAttachments) {
      if (!attachment.filename) {
        setAlerts({
          message: "FileName is required",
          severity: "error",
          show: true,
        });
        return false;
      }
      if (
        !attachment.filepath ||
        !attachment.fileSizeInKb ||
        attachment.fileSizeInKb < 0 ||
        !attachment.fileType
      ) {
        setAlerts({
          message: "Invalid File",
          severity: "error",
          show: true,
        });
        return false;
      }
      if (!attachment.fileType?.startsWith("image")) {
        setAlerts({
          message: `Only img files allowed. Error in ${attachment.filename}`,
          severity: "error",
          show: true,
        });
        return false;
      }
      if (attachment.fileSizeInKb > 5000) {
        setAlerts({
          message: `File size should be less than 5000 KB. Error in ${attachment.filename} with size ${attachment.fileSizeInKb} Kbs Use a website like https://compressjpeg.com/`,
          severity: "error",
          show: true,
        });
        return false;
      }
    }
    return true;
  };

  const validateForm = (): boolean => {
    if (!customerName.value || customerName.value.trim() === "") {
      updatecustomerName({
        value: customerName.value,
        error: true,
        helperText: "Customer Name is required",
      });
      return false;
    }
    if (!customerAddress.value || customerAddress.value.trim() === "") {
      updateCustomerAddress({
        value: customerAddress.value,
        error: true,
        helperText: "Customer Address is required",
      });
      return false;
    }
    if (currentProcess <= 0) {
      setAlerts({
        message: "Please select a process",
        severity: "error",
        show: true,
      });
      return false;
    }
    // if (attachments.length === 0) {
    //   setAlerts({
    //     message: "Please attach at least one file",
    //     severity: "error",
    //     show: true,
    //   });
    //   return false;
    // }
    return true;
  };

  const setAlerts = (alertProps: AlertProps) => {
    updateAlertProps(alertProps);
    window.scrollTo(0, 0);
    setTimeout(() => {
      updateAlertProps({
        message: "",
        severity: "info",
        show: false,
      });
    }, 5000);
  };
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
            required
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
            required
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
              onChange={handleFileChange}
              type="file"
              title="browse"
              multiple
              accept="image/png, image/jpg, image/jpeg"
              capture="environment"
            ></input>
          </Button>
        </Stack>
        {attachmentForRender().map((attachmentGroup, i) => {
          return (
            <>
              <Stack direction={"row"} spacing={2} marginTop={2}>
                {attachmentGroup.map((attachment, index) => {
                  return (
                    <>
                      <Stack
                        direction={"column"}
                        key={index}
                        alignItems={"center"}
                      >
                        <a href={attachment.filepath} target="_blank">
                          <img
                            className="h-16 w-30"
                            src={attachment.filepath}
                            title={attachment.filename}
                          ></img>
                        </a>
                        <Chip
                          label={attachment.filename}
                          className=".overflow-ellipsis h-16 w-30"
                          sx={{ fontSize: "12px" }}
                          variant="outlined"
                          key={index}
                          component={"a"}
                          onDelete={() => {
                            deleteAttachment(attachment.filepath ?? "");
                          }}
                        ></Chip>
                      </Stack>
                    </>
                  );
                })}
              </Stack>
            </>
          );
        })}
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <Button variant="contained">Save</Button>
          <Button variant="contained" onClick={postForm}>
            Submit
          </Button>
        </Stack>
      </Container>
    </>
  );
}
export default Form;
