export interface PaginatorConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
  showInfo?: boolean;
  infoTemplate?: string; // Template string: "{start}-{end} de {total}"
}

export interface PageChangeEvent {
  page: number;
  itemsPerPage: number;
}
