import { ButtonConfigurationInterface } from '@presentation/shared/components/atoms/button/button.interface';
import { DsHeaderConfig } from '@presentation/shared/components/molecules/header/ds-header.interface';

export interface StoreInventoryUi {
  header: DsHeaderConfig;
  itemsPerPage: number;
  placeholderInputSearch: string;
  textLoading: string;
  buttonServiceError: ButtonConfigurationInterface;
}
