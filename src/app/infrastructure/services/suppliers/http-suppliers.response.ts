export interface HttpSupplierData {
  id: number;
  name: string;
  cellphone?: string | null;
  address?: string | null;
  comments?: string | null;
}

export interface HttpCreateSupplierResponse {
  data: HttpSupplierData;
}
