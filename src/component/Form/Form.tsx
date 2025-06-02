import {
  Button,
  Chip,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useImperativeHandle, useState } from "react";
import { Attachment, FormRequest, Process } from "../../Types/Component/Form";
import {
  textFieldString,
  updateTextField,
  validateTextField,
} from "../../Types/ComponentProps/TextFieldProps";
import { useMainContext } from "../../context/MainContextProvider";
import { useLoginContext } from "../../context/LoginContextProvider";
import style from "./Form.module.css";
import httpClient from "../../helper/httpClient";
import { validatePhoneNumber } from "../Admin/Admin";
import { useLocation, useNavigate } from "react-router";
import { AlertProps } from "../../Types/ComponentProps/AlertProps";
import { severity } from "../../Types/ComponentProps/ButtonProps";
import { time } from "console";
import TextBox from "../../custom-component/TextBox";
import { isNumber } from "@mui/x-data-grid/internals";

function Form() {
  //constants
  let [fileIndex, updateFileIndex] = useState<number>(1);
  //usestate
  const defaultTextFieldString: textFieldString = {
    value: "",
    error: false,
    helperText: "",
  };
  const { user } = useLoginContext();
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();
  let [readonly, updateReadonly] = useState<boolean>(false);
  const [customerName, updatecustomerName] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Customer Name",
    type: "text",
    required: true,
  });
  const [customerAddress, updateCustomerAddress] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Customer Address",
    type: "text",
    required: true,
  });
  const [currentProcess, updateCurrentProcess] = useState(0);
  const [process, updateProcess] = useState<Process[]>([]);
  const [attachments, updateAttachments] = useState<Attachment[]>([]);
  const [phoneNumber, updatePhoneNumber] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Phone Number",
    type: "phone",
    required: true,
  });
  const [phoneNumber2, updatePhoneNumber2] = useState<textFieldString>({
    ...defaultTextFieldString,
    name: "Phone Number 2",
    type: "phone",
  });
  const navigate = useNavigate();

  //useeffect
  useEffect(() => {
    const formId = window.location.pathname.split("/form").pop();
    if (formId && formId !== "" && isNumber(formId)) {
      updateReadonly(true);
      let queryParams = new URLSearchParams();
      queryParams;

      httpClient
        .getAsync<FormRequest>(
          httpClient.GetForm,
          updateAlertProps,
          undefined,
          updateIsLoading,
          false,
        )
        .then((response) => {
          if (response) {
            updatecustomerName({
              value: response.form.customerName,
              error: false,
              helperText: "",
            });
            updateCustomerAddress({
              value: response.form.customerAddress,
              error: false,
              helperText: "",
            });
            updateCurrentProcess(response.form.processId);
            updatePhoneNumber({
              value: response.form.phoneNumber,
              error: false,
              helperText: "",
            });
            updatePhoneNumber2({
              value: response.form.phoneNumber2 ?? "",
              error: false,
              helperText: "",
            });
            if (response.Attachments && response.Attachments.length > 0) {
              const fileAttachments = response.Attachments.map((attachment) => {
                return {
                  filename: attachment.filename,
                  fileSizeInKb: attachment.fileSizeInKb,
                  filepath: attachment.filepath,
                  fileType: attachment.fileType,
                };
              });
              updateAttachments(fileAttachments);
            }
          }
        });
    } else {
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
    }
  }, []);
  //other api calls
  const postForm = async () => {
    if (!validateForm()) {
      return;
    }
    let formRequest: FormData = new FormData();
    const requestBody: FormRequest = {
      form: {
        customerName: customerName.value ?? "",
        customerAddress: customerAddress.value ?? "",
        typeId: 1,
        processId: currentProcess,
        lastUpdatedBy: user?.userPrincipalName ?? "",
        location: user?.officeLocation ?? "",
        phoneNumber: phoneNumber.value ?? "",
        phoneNumber2: phoneNumber2.value ?? "",
      },
    };
    formRequest.append("request", JSON.stringify(requestBody.form));
    for (const attachment of attachments) {
      if (attachment.filepath) {
        const file = await fetch(attachment.filepath).then((res) => res.blob());
        formRequest.append("attachments", file, attachment.filename);
      }
    }
    httpClient
      .postFormAsync<string>(
        httpClient.GetForm,
        formRequest,
        undefined,
        updateAlertProps,
        undefined,
        updateIsLoading,
        false,
      )
      .then((response) => {
        if (response) {
          setAlert(response, "success", 3000);
          updateReadonly(true);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      });
  };
  //render functions
  const attachmentForRender = () => {
    let imgsInARow = isMobile ? 2 : 5;
    let attachmentElements: Attachment[][] = [];
    for (let i = 0; i < attachments.length; i = i + imgsInARow) {
      attachmentElements.push(attachments.slice(i, i + imgsInARow));
    }
    return attachmentElements;
  };
  //helper funtions
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    let fileAttachments: Attachment[] = [];
    if (fileList && fileList.length > 0) {
      updateFileIndex((prev) => prev + 1);
      fileAttachments = Array.from(fileList).map((file, index) => {
        return {
          filename: `${file.name.split(".")[0]}-${fileIndex}.${file.name.split(".").slice(-1)[0]}`,
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
      setAlert("File with same name already exists");
      return false;
    }
    if (fileAttachments.length > 10) {
      setAlert("Maximum 10 attachments allowed");
      return false;
    }
    for (const attachment of fileAttachments) {
      if (!attachment.filename) {
        setAlert("FileName is required");
        return false;
      }
      if (
        !attachment.filepath ||
        !attachment.fileSizeInKb ||
        attachment.fileSizeInKb < 0 ||
        !attachment.fileType
      ) {
        setAlert("Invalid File");
        return false;
      }
      if (
        !attachment.fileType?.startsWith("image") &&
        !attachment.fileType?.endsWith("pdf")
      ) {
        setAlert(
          `Only img or pdf files allowed. Error in ${attachment.filename}`,
        );
        return false;
      }
      if (attachment.fileSizeInKb > 3000) {
        setAlert(
          `File size should be less than 3000 KB. Error in ${attachment.filename} with size ${attachment.fileSizeInKb} Kbs Use a website like https://compressjpeg.com/`,
        );
        return false;
      }
    }
    return true;
  };
  const setAlert = (
    alertMessage: string,
    severity: severity = "error",
    timeout: number = 5000,
  ) =>
    setAlerts(
      {
        message: alertMessage,
        severity: severity,
        show: true,
      },
      updateAlertProps,
      timeout,
    );

  const validateForm = (): boolean => {
    if (
      !(
        validateTextField(customerName, updatecustomerName, 3, 30, setAlert) &&
        validateTextField(
          customerAddress,
          updateCustomerAddress,
          5,
          200,
          setAlert,
        ) &&
        validateTextField(
          phoneNumber,
          updatePhoneNumber,
          undefined,
          undefined,
          setAlert,
        ) &&
        validateTextField(
          phoneNumber2,
          updatePhoneNumber2,
          undefined,
          undefined,
          setAlert,
        )
      )
    ) {
      return false;
    }

    // if (!customerName.value || customerName.value.trim() === "") {
    //   updatecustomerName({
    //     value: customerName.value,
    //     error: true,
    //     helperText: "Customer Name is required",
    //   });
    //   return false;
    // }
    // if (!customerAddress.value || customerAddress.value.trim() === "") {
    //   updateCustomerAddress({
    //     value: customerAddress.value,
    //     error: true,
    //     helperText: "Customer Address is required",
    //   });
    //   return false;
    // }
    if (currentProcess <= 0) {
      setAlert("Please select a process");
      return false;
    }
    if (attachments.length === 0) {
      setAlert("Please attach at least one file");
      return false;
    }
    if (attachments.length > 10) {
      setAlert("Maximum 10 attachments allowed");
      return false;
    }
    // if (!phoneNumber.value) {
    //   updatePhoneNumber((lastValue) => ({
    //     ...lastValue,
    //     error: true,
    //     helperText: "PhoneNumber is required",
    //   }));
    //   return false;
    // }
    // if (validatePhoneNumber(phoneNumber.value)) {
    //   setAlert("Phone Number is not valid");
    //   return false;
    // }
    // if (phoneNumber2.value && validatePhoneNumber(phoneNumber2.value)) {
    //   setAlert("Phone Number2 is not valid");
    //   return false;
    // }
    return true;
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
          <TextBox
            {...{
              textFieldString: customerName,
              updateTextFieldString: updatecustomerName,
              readonly: readonly,
            }}
          ></TextBox>
          {/* <TextField
            label="Name of the Candidate:"
            value={customerName.value}
            required={true}
            error={customerName.error}
            helperText={customerName.helperText}
            variant="filled"
            margin="normal"
            onChange={(e) =>
              updateTextField(updatecustomerName, e.target.value)
            }
          ></TextField> */}
        </Stack>
        <Stack>
          <TextBox
            {...{
              textFieldString: customerAddress,
              updateTextFieldString: updateCustomerAddress,
              readonly: readonly,
              multiline: true,
            }}
          ></TextBox>
          {/* <TextField
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
            onChange={(e) =>
              updateTextField(updateCustomerAddress, e.target.value)
            }
          ></TextField> */}
        </Stack>
        <Stack>
          <TextField
            select
            label="Process"
            required
            disabled={readonly}
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
          <TextBox
            {...{
              textFieldString: phoneNumber,
              updateTextFieldString: updatePhoneNumber,
              readonly: readonly,
            }}
          ></TextBox>
          {/* <TextField
            margin="normal"
            label="Phone Number"
            required
            value={phoneNumber.value}
            error={phoneNumber.error}
            helperText={phoneNumber.helperText}
            variant="filled"
            onChange={(e) => updateTextField(updatePhoneNumber, e.target.value)}
          ></TextField> */}
          <TextBox
            {...{
              textFieldString: phoneNumber2,
              updateTextFieldString: updatePhoneNumber2,
              readonly: readonly,
            }}
          ></TextBox>
          {/* <TextField
            margin="normal"
            label="Phone Number 2"
            value={phoneNumber2.value}
            error={phoneNumber2.error}
            helperText={phoneNumber2.helperText}
            variant="filled"
            onChange={(e) =>
              updateTextField(updatePhoneNumber2, e.target.value)
            }
          ></TextField> */}
        </Stack>
        <Stack direction={"row"} spacing={2} marginTop={2}>
          <Button variant="contained" component="label" disabled={readonly}>
            Browse
            <input
              hidden
              onChange={handleFileChange}
              type="file"
              title="browse"
              multiple
              accept="image/png, image/jpg, image/jpeg, application/pdf"
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
                          {attachment.fileType == "application/pdf" ? (
                            <img
                              className="h-16 w-30"
                              src={attachment.filepath}
                              title={attachment.filename}
                            ></img>
                          ) : (
                            <img
                              className="h-16 w-30"
                              src={attachment.filepath}
                              title={attachment.filename}
                            ></img>
                          )}
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
        <Stack
          direction={"row"}
          spacing={2}
          marginTop={2}
          justifyContent={"center"}
        >
          {/* <Button variant="contained">Save</Button> */}
          <Button
            variant="contained"
            onClick={postForm}
            disabled={readonly || isLoading}
          >
            Submit
          </Button>
        </Stack>
      </Container>
    </>
  );
}
export default Form;
