# Componentes Reutilizables - Atomic Design

Este documento explica cómo usar los componentes reutilizables creados siguiendo la metodología Atomic Design.

## 📊 DataTable (Organismo)

El componente `DataTableComponent` es una tabla genérica y reutilizable que permite mostrar datos de forma estructurada con funcionalidades de ordenamiento y acciones.

### Ubicación
`/Frontend/src/app/presentation/shared/components/organisms/data-table/`

### Uso Básico

```typescript
import { DataTableComponent } from '@presentation/shared/components/organisms/data-table/data-table.component';
import { DataTableConfig, SortEvent } from '@presentation/shared/components/organisms/data-table/data-table.interface';

// En tu componente
protected readonly tableConfig = computed<DataTableConfig<YourEntity>>(() => ({
  columns: [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      customClass: 'custom-class',
    },
    {
      key: 'price',
      header: 'Precio',
      render: (item: YourEntity) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(item.price);
      },
    },
    {
      key: 'status',
      header: 'Estado',
      renderHtml: (item: YourEntity) => {
        return `<span class="badge">${item.status}</span>`;
      },
    },
  ],
  actions: [
    {
      label: 'Editar',
      icon: '✏️',
      handler: (item: YourEntity) => this.edit(item),
      class: 'btn-edit',
      title: 'Editar elemento',
    },
  ],
  data: this.items(),
  emptyMessage: 'No hay elementos',
  trackBy: (index: number, item: YourEntity) => item.id,
}));

// Manejo de eventos de ordenamiento
onTableSort(event: SortEvent): void {
  console.log('Columna:', event.column);
  console.log('Orden:', event.order); // 'asc', 'desc', o null
}
```

### En el Template

```html
<ds-data-table 
  [config]="tableConfig()" 
  (sort)="onTableSort($event)" 
/>
```

### Propiedades de Configuración

#### DataTableColumn
- `key`: string - Clave del campo en el objeto de datos
- `header`: string - Texto del encabezado de la columna
- `sortable?`: boolean - Si la columna es ordenable (opcional)
- `customClass?`: string - Clase CSS personalizada para la columna (opcional)
- `render?`: (row: T) => string | number - Función para renderizar el valor (opcional)
- `renderHtml?`: (row: T) => string - Función para renderizar HTML personalizado (opcional)

#### DataTableAction
- `label`: string - Etiqueta descriptiva de la acción
- `icon`: string - Icono o emoji para el botón
- `handler`: (row: T) => void - Función que se ejecuta al hacer clic
- `class?`: string - Clase CSS personalizada para el botón (opcional)
- `title?`: string - Tooltip del botón (opcional)

#### DataTableConfig
- `columns`: DataTableColumn[] - Array de columnas
- `actions?`: DataTableAction[] - Array de acciones (opcional)
- `data`: T[] - Array de datos a mostrar
- `emptyMessage?`: string - Mensaje cuando no hay datos (opcional)
- `trackBy?`: (index: number, item: T) => any - Función trackBy para optimización (opcional)

### Eventos
- `sort`: Emite un evento `SortEvent` cuando se ordena una columna
  - `column`: string - Nombre de la columna
  - `order`: 'asc' | 'desc' | null - Orden de clasificación

---

## 📄 Paginator (Molécula)

El componente `PaginatorComponent` es un paginador genérico y reutilizable para navegar entre páginas de datos.

### Ubicación
`/Frontend/src/app/presentation/shared/components/molecules/paginator/`

### Uso Básico

```typescript
import { PaginatorComponent } from '@presentation/shared/components/molecules/paginator/paginator.component';
import { PaginatorConfig, PageChangeEvent } from '@presentation/shared/components/molecules/paginator/paginator.interface';

// En tu componente
protected readonly paginatorConfig = computed<PaginatorConfig>(() => ({
  currentPage: this.currentPage(),
  totalPages: this.totalPages(),
  totalItems: this.filteredItems().length,
  itemsPerPage: this.itemsPerPage,
  maxVisiblePages: 5,
  showInfo: true,
  infoTemplate: 'Mostrando {start}-{end} de {total} elementos',
}));

// Manejo de cambios de página
onPageChange(event: PageChangeEvent): void {
  this.currentPage.set(event.page);
}
```

### En el Template

```html
<ds-paginator 
  [config]="paginatorConfig()" 
  (pageChange)="onPageChange($event)" 
/>
```

### Propiedades de Configuración

#### PaginatorConfig
- `currentPage`: number - Página actual (1-indexed)
- `totalPages`: number - Total de páginas
- `totalItems`: number - Total de elementos
- `itemsPerPage`: number - Elementos por página
- `maxVisiblePages?`: number - Máximo de botones de página visibles (default: 5)
- `showInfo?`: boolean - Mostrar información de paginación (default: true)
- `infoTemplate?`: string - Template personalizado para info (usa {start}, {end}, {total})

### Eventos
- `pageChange`: Emite un evento `PageChangeEvent` cuando cambia la página
  - `page`: number - Nueva página
  - `itemsPerPage`: number - Elementos por página

---

## 🎨 Estilos Personalizables

Ambos componentes incluyen clases CSS que pueden ser personalizadas:

### DataTable
- `.product-name`, `.laboratory`, `.description`, `.price` - Clases para celdas específicas
- `.stock-badge`, `.low-stock` - Clases para badges de stock
- `.btn-edit`, `.btn-delete` - Clases para botones de acción

### Paginator
- Todos los estilos están encapsulados y pueden ser sobrescritos mediante selectores específicos

---

## 📝 Ejemplo Completo

Ver el componente `store-inventory` para un ejemplo completo de implementación:
- `/Frontend/src/app/presentation/pages/store-inventory/store-inventory.component.ts`
- `/Frontend/src/app/presentation/pages/store-inventory/store-inventory.component.html`

---

## ✨ Ventajas

1. **Reutilizabilidad**: Usa los mismos componentes en múltiples páginas
2. **Consistencia**: UI consistente en toda la aplicación
3. **Mantenibilidad**: Cambios centralizados afectan a todas las instancias
4. **Type-Safe**: Fuerte tipado con TypeScript y Generics
5. **Flexible**: Altamente configurable para diferentes casos de uso
6. **Performance**: Uso de signals y computed para reactividad optimizada
