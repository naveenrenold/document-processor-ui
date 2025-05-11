import { severity } from "../CommonTypes";

export interface AlertProps {
  show: boolean;
  severity: severity;
  message: string;
}
