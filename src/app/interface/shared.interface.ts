import { FormGroup } from "@angular/forms";

export interface IDialogData {
  isUpdate?: boolean;
  title?: string;
  data: any;
  show: boolean;
  component: string | any | null;
  form?: FormGroup;
}
