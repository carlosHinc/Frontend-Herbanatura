export interface HttpLaboratoryData {
  id: number;
  name: string;
  created_at: string;
}

export interface HttpGetLaboratoriesResponse {
  data: HttpLaboratoryData[];
}
