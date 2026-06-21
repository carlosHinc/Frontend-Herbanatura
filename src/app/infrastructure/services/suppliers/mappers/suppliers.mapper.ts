import { Supplier } from '@domain/suppliers/suppliers.entity';
import { HttpSupplierData } from '../http-suppliers.response';

export class SupplierMapper {
  static fromHttp(http: HttpSupplierData): Supplier {
    return {
      id: http.id,
      name: http.name,
      cellphone: http.cellphone ?? null,
      address: http.address ?? null,
      comments: http.comments ?? null,
    };
  }
}
