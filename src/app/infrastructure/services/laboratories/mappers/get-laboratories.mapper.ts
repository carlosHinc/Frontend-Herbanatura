import { Laboratory } from '@domain/laboratories/laboratories.entity';
import { HttpLaboratoryData } from '../http-laboratories.response';

export class LaboratoryMapper {
  static fromHttp(httpLaboratoryData: HttpLaboratoryData): Laboratory {
    return {
      id: httpLaboratoryData.id,
      name: httpLaboratoryData.name,
    };
  }
}
