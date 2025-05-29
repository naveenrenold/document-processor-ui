import { Table } from "@mui/material";
import { FormDetails, FormResponse } from "../../Types/Component/Form";
import { useEffect, useState } from "react";
import httpClient from "../../helper/httpClient";
import { useMainContext } from "../../context/MainContextProvider";
import { severity } from "../../Types/ComponentProps/ButtonProps";
import { BaseFilter } from "../../Types/Component/BaseFilter";

function DashBoard() {
  //constants
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();
  //usestate
  let [form, updateForm] = useState<FormResponse>();
  //useeffect
  useEffect(() => {
    getFormDetails();
  }, []);
  const getFormDetails = async () => {
    const filter: BaseFilter = {
      OrderBy: "lastUpdatedBy",
      Query: "",
      SortBy: "desc",
    };
    const queryParams = new URLSearchParams();
    for (const key in Object.keys(filter)) {
      queryParams.append(key, filter[key as keyof BaseFilter] as string);
    }

    httpClient
      .getAsync<FormResponse>(
        `httpClient.GetForm?${queryParams.toString()}`,
        undefined,
        updateAlertProps,
        undefined,
        updateIsLoading,
      )
      .then((response) => {
        if (response) {
          updateForm(response);
        }
      });
  };
  //other api calls
  //render functions
  //helper funtions
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
  //render
  return (
    <>
      <Table></Table>
    </>
  );
}

export default DashBoard;
