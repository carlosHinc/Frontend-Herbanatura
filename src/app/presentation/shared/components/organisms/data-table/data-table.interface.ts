export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  customClass?: string;
  render?: (row: T) => string | number;
  renderHtml?: (row: T) => string;
}

export interface DataTableAction<T> {
  label: string;
  icon: string;
  handler: (row: T) => void;
  class?: string;
  title?: string;
}

export interface DataTableConfig<T> {
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  data: T[];
  emptyMessage?: string;
  trackBy?: (index: number, item: T) => any;
}

export type SortOrder = 'asc' | 'desc' | null;

export interface SortEvent {
  column: string;
  order: SortOrder;
}
