export interface FormDetails {
  processId: number;
  customerName: string;
  customerAddress?: string;
  location: string;
  submittedBy: string;
}

export interface Process {
  processId: number;
  processName: string;
}
export interface Attachment {
  filename?: string;
  filepath?: string;
}
export interface Activity {
  activityTypeId: number;
  comments?: number;
}
