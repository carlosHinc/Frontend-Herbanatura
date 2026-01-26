import { StoreInventoryUi } from './store-inventory-ui.interface';

export const STORE_INVENTORY_CONFIG: StoreInventoryUi = {
  header: {
    h1: {
      text: 'Inventario de Productos',
      color: 'black',
    },
    button: {
      text: '+ Agregar Producto',
      color: 'green',
    },
  },
  itemsPerPage: 5,
  placeholderInputSearch: 'Buscar por nombre, laboratorio o descripción...',
  textLoading: 'Cargando productos...',
  buttonServiceError: {
    color: 'red',
    text: 'Reintentar',
  },
};
