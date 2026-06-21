import { User } from './auth.entity';

export enum SystemActionsCode {
  VIEW_PRODUCTS = 'View_Products',
  EDIT_PRODUCT = 'Edit_Product',
  CREATE_PRODUCT = 'Create_Product',
  CREATE_PURCHASE_ORDER = 'Create_Purchase_Order',
  VIEW_PRODUCTS_NEARING_EXPIRATION = 'View_Products_Nearing_Expiration',
  VIEW_PRODUCTS_EXPIRED = 'View_Products_Expired',
  SALES_REGISTER = 'Sales_Register',
  VIEW_PURCHASE_ORDERS = 'View_Purchase_Orders',
  VIEW_SALES = 'View_Sales',
  REGISTER_SUPPLIER = 'Register_Supplier',
  VIEW_SUPPLIERS = 'View_Suppliers',
  EDIT_SUPPLIER = 'Edit_Supplier',
}

export interface UserPermissions {
  action: string;
  code: SystemActionsCode;
}

export interface LoginResponse {
  token: string;
  user: User;
  permissions: UserPermissions[];
}

export interface RegisterResponse {
  user: User;
}
