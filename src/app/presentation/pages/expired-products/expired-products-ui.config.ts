import { ExpiredProductsUi } from './expired-products-ui.interface';

export const EXPIRED_PRODUCTS_CONFIG: ExpiredProductsUi = {
  header: {
    h1: {
      text: 'Productos Vencidos',
      color: 'black',
    },
    button: {
      text: '- Eliminar Stock de Inventario',
      modifiers: 'btn--red',
    },
    showButton: true,
  },
};
