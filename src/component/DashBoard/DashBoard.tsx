import { Button, Stack, Table, Typography } from "@mui/material";
import { FormDetails, FormResponse } from "../../Types/Component/Form";
import { useEffect, useState } from "react";
import httpClient from "../../helper/httpClient";
import { useMainContext } from "../../context/MainContextProvider";
import { severity } from "../../Types/ComponentProps/ButtonProps";
import { BaseFilter } from "../../Types/Component/BaseFilter";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
} from "@mui/x-data-grid";
import { useLoginContext } from "../../context/LoginContextProvider";
import { set } from "date-fns";
import { useNavigate } from "react-router";

function DashBoard() {
  //constants
  const DashBoardColumns: GridColDef<FormResponse>[] = [
    {
      field: "id",
      headerName: "Id",
      type: "string",
      hideable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="text"
            size="small"
            onClick={() => {
              navigateToForm(params.value);
            }}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      field: "typeName",
      headerName: "TypeName",
      type: "string",
    },
    {
      field: "statusName",
      headerName: "StatusName",
      type: "singleSelect",
      valueOptions: [
        "Draft",
        "Submitted",
        "Processed",
        "Completed",
        "Rejected",
      ],
    },
    {
      field: "processName",
      headerName: "ProcessName",
      type: "singleSelect",
      valueOptions: [
        "Process 1",
        "Process 2",
        "Process 3",
        "Process 4",
        "Process 5",
        "Process 6",
        "Process 7",
      ],
    },
    {
      field: "customerName",
      headerName: "CustomerName",
      type: "string",
    },
    {
      field: "customerAddress",
      headerName: "CustomerAddress",
      type: "string",
    },
    {
      field: "phoneNumber",
      headerName: "PhoneNumber",
      type: "string",
    },
    {
      field: "phoneNumber2",
      headerName: "PhoneNumber2",
      type: "string",
    },
    {
      field: "locationName",
      headerName: "LocationName",
      type: "string",
    },
    {
      field: "createdBy",
      headerName: "CreatedBy",
      type: "string",
      valueGetter: (params: string) => {
        return params ? params.split("@")[0] : "User";
      },
    },
    {
      field: "createdOn",
      headerName: "CreatedOn",
      type: "date",
      valueFormatter: (params: Date) => {
        return params.toLocaleString();
      },
    },
    {
      field: "lastUpdatedBy",
      headerName: "LastUpdatedBy",
      type: "string",
      valueGetter: (params: string) => {
        return params ? params.split("@")[0] : "User";
      },
    },
    {
      field: "lastUpdatedOn",
      headerName: "LastUpdatedOn",
      type: "date",
      valueFormatter: (params: Date) => {
        return params.toLocaleString();
      },
    },
  ];
  //////////////////////////////////////////
  const {
    updateAlertProps,
    updateIsLoading,
    updateSnackBarProps,
    setAlerts,
    isMobile,
    isLoading,
  } = useMainContext();

  const { user, role } = useLoginContext();
  const navigate = useNavigate();
  //usestate
  let [form, updateForm] = useState<FormResponse[]>();
  let [rows, updateRows] = useState<FormResponse[]>();
  // let [gridFilter, updateGridFilter] = useState<GridFilterModel>({
  //   items: [
  //     {
  //       field: "LastUpdatedBy",
  //       operator:
  //         ,
  //       value: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
  //     },
  //   ],
  // });
  //useeffect
  useEffect(() => {
    getFormDetails();
  }, []);
  const getFormDetails = async () => {
    const filter: BaseFilter = {
      OrderBy: "lastUpdatedOn",
      Query:
        role === "Admin"
          ? "statusName ne Completed"
          : `statusName ne Completed and createdBy eq ${user?.userPrincipalName}`,
      SortBy: "desc",
    };
    const queryParams = new URLSearchParams();
    Object.keys(filter).forEach((key) => {
      queryParams.append(key, filter[key as keyof BaseFilter] as string);
    });

    httpClient
      .getAsync<
        FormResponse[]
      >(`${httpClient.GetForm}?${queryParams.toString()}`, undefined, updateAlertProps, undefined, updateIsLoading)
      .then((response) => {
        if (response) {
          response.map((item) => {
            item.createdOn = new Date(item.createdOn);
            item.lastUpdatedOn = new Date(item.lastUpdatedOn);
          });
          updateForm(response);
          updateRows(response);
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
  let columnsHeadings: GridColDef<FormResponse>[] = DashBoardColumns;
  const getUser = (dot = true) => {
    let userName = user?.userPrincipalName?.split("@")[0] ?? "User";
    if (dot && userName.length > 15) {
      userName = userName.substring(0, 15) + "...";
    }
    return userName;
  };

  const navigateToForm = (formId: string) => {
    navigate(`/form/${formId}`);
  };
  // const onFilterChange = (
  //   model: GridFilterModel,
  //   details: GridCallbackDetails<"filter">,
  // ) => {
  //   updateGridFilter((prev) => {
  //     prev.items = prev.items.filter(
  //       (filter) => !model.items.find((item) => item.field != filter.field),
  //     );
  //     prev.items.push(...model.items);
  //     return prev;
  //   });
  //   if (model.quickFilterValues && model.quickFilterValues.length > 0) {
  //     const filteredRows = rows?.filter((row) => {
  //       return model.quickFilterValues?.some((value) => {
  //         return Object.values(row).some((cellValue) =>
  //           cellValue
  //             .toString()
  //             .toLowerCase()
  //             .includes(value.toString().toLowerCase()),
  //         );
  //         // Validate 'params' in 'valueGetter' to ensure it is a valid date before creating a new Date object.
  //       });
  //     });
  //     updateRows(filteredRows);
  //   }
  // };

  //render
  // columns

  return (
    <>
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"left"}
        justifyContent={"space-between"}
        margin={1}
      >
        <Typography variant="h5" fontWeight={600} color="primary">
          {isMobile ? "DashBoard:" : getUser() + "'s DashBoard"}
        </Typography>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          marginRight={1}
        >
          {/* <Button size="small" variant="outlined">
            <Typography sx={isMobile ? { fontSize: "14px" } : {}}>
              {"Save Filters"}
            </Typography>
          </Button> 
          <Button size="small" variant="outlined">
            <Typography sx={isMobile ? { fontSize: "14px" } : {}}>
              {"Reset Filters"}
            </Typography>
          </Button> */}
        </Stack>
      </Stack>
      {form && (
        <DataGrid
          density="compact"
          sx={isMobile ? { fontSize: "12px" } : {}}
          columns={columnsHeadings}
          rows={rows ?? []}
          autosizeOnMount
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: true,
                typeName: false,
                statusName: true,
                processName: true,
                customerName: true,
                customerAddress: false,
                phoneNumber1: true,
                phoneNumber2: false,
                locationName: false,
                createdBy: true,
                createdOn: true,
                lastUpdatedBy: false,
                lastUpdatedOn: true,
              },
            },
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: {
              sortModel: [{ field: "lastUpdatedOn", sort: "desc" }],
            },
          }}
          showToolbar
        ></DataGrid>
      )}
    </>
  );
}

export default DashBoard;
