export interface FormDetails {
  typeId: number;
  processId: number;
  customerName: string;
  customerAddress?: string;
  phoneNumber: string;
  phoneNumber2?: string;
  location: string;
  lastUpdatedBy: string;
}

export interface FormResponse {
  id: number;
  typeName: number;
  statusName: number;
  processName: number;
  customerName: string;
  customerAddress: string;
  phoneNumber: string;
  phoneNumber2?: string;
  locationName: string;
  createdBy: string;
  createdOn: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
}

export interface Process {
  processId: number;
  processName: string;
}
export interface Attachment {
  filename?: string;
  filepath?: string;
  fileInBytes?: ArrayBuffer;
  fileSizeInKb?: number;
  fileType?: string;
}
export interface Activity {
  activityTypeId: number;
  comments?: number;
}

export interface FormRequest {
  form: FormDetails;
  Attachments?: Attachment[];
}

export interface Filters {
  target: string;
  operator: "eq" | "ne" | "lt" | "gt" | "le" | "ge" | "in" | "ni" | "lk" | "bt";
  value: string | number | boolean;
}
