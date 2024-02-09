import { FormGroup } from "@angular/forms";

export interface Category {
  _id?: string,
  category_name: string
}

export interface DialogData {
  category_name: string;
  isUpdate: boolean;
}

export interface Product {
  _id?: string,
  product_name: String;
  description: String,
  category_id: String,
  category_name: String,
  cost_price: Number,
  selling_price: Number,
  quantity_in_stock: Number,
  reorder_point: Number,
  created_at?: Date,
  updated_at?: Date,
}

export interface ProductDialogData {
  category_name: string;
  isUpdate: boolean;
  categories: Category[];
  form: FormGroup;
  data: any;
  component: any;
}
