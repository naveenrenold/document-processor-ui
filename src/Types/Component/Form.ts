export interface FormDetails {
  typeId: number;
  processId: number;
  customerName: string;
  customerAddress?: string;
  customerPhone: string;
  customerPhone2?: string;
  location: string;
  lastUpdatedBy: string;
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
