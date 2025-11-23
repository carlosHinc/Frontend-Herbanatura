import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CreateSaleViewModel } from '@presentation/view-models/sales/create-sale.view-model';
import { CreateSaleGateway } from '@domain/sales/create-sale.gateway';
import { HttpCreateSaleService } from '@infrastructure/services/sales/http-create-sale.service';
import { CreateSaleUseCase } from '@application/use-cases/sales/create-sale.usecase';
import { GetProductsForSaleViewModel } from '@presentation/view-models/products/get-products-for-sale.view-model';
import { GetProductsForSaleUseCase } from '@application/use-cases/products/get-products-for-sale.usecase';
import { GetProductsForSaleGateway } from '@domain/products/get-products-for-sale.gateway';
import { HttpGetProductsForSaleService } from '@infrastructure/services/products/http-get-products-for-sale.service';
import { CreateSale } from '@domain/sales/sales.entity';

@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    CreateSaleViewModel,
    CreateSaleUseCase,
    {
      provide: CreateSaleGateway,
      useClass: HttpCreateSaleService,
    },
    GetProductsForSaleViewModel,
    GetProductsForSaleUseCase,
    {
      provide: GetProductsForSaleGateway,
      useClass: HttpGetProductsForSaleService,
    },
  ],
  templateUrl: './create-sale.component.html',
  styleUrl: './create-sale.component.scss',
})
export class CreateSaleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly vm = inject(CreateSaleViewModel);
  protected readonly productsVM = inject(GetProductsForSaleViewModel);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly saleForm: FormGroup = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(255)]],
    products: this.fb.array([]),
  });

  ngOnInit(): void {
    this.productsVM.getProducts();
    this.addProduct();
  }

  get products(): FormArray {
    return this.saleForm.get('products') as FormArray;
  }

  // Validador personalizado para verificar stock disponible
  stockValidator = (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent;
    if (!group) return null;

    const productId = group.get('idProduct')?.value;
    const requestedStock = control.value;

    if (!productId || !requestedStock) return null;

    const availableStock = this.getAvailableStock(productId);

    if (requestedStock > availableStock) {
      return {
        exceedsStock: {
          available: availableStock,
          requested: requestedStock,
        },
      };
    }

    return null;
  };

  createProductFormGroup(): FormGroup {
    const group = this.fb.group({
      idProduct: ['', [Validators.required]],
      stock: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
    });

    // Agregar validador de stock después de crear el grupo
    group.get('stock')?.addValidators(this.stockValidator);

    // Escuchar cambios en el producto seleccionado para actualizar el precio y revalidar stock
    group.get('idProduct')?.valueChanges.subscribe((productId) => {
      if (productId) {
        const product = this.productsForSale.find(
          (p) => p.id === parseInt(productId)
        );
        if (product && product.salesPrice) {
          group.get('unitPrice')?.setValue(product.salesPrice);
        } else {
          group.get('unitPrice')?.setValue(0);
        }

        // Revalidar el stock cuando cambie el producto
        group.get('stock')?.updateValueAndValidity();
      }
    });

    return group;
  }

  addProduct(): void {
    const productGroup = this.createProductFormGroup();
    this.products.push(productGroup);
  }

  removeProduct(index: number): void {
    if (this.products.length > 1) {
      this.products.removeAt(index);
    }
  }

  // Obtener el stock disponible de un producto
  getAvailableStock(productId: number): number {
    const product = this.productsForSale.find((p) => p.id == productId);
    return product?.stock || 0;
  }

  // Calcular el total de un producto específico
  getProductTotal(index: number): number {
    const product = this.products.at(index);
    const stock = parseInt(product.get('stock')?.value) || 0;
    const unitPrice = parseInt(product.get('unitPrice')?.value) || 0;
    return stock * unitPrice;
  }

  // Calcular el total de toda la venta
  calculateSaleTotal(): number {
    return this.products.controls.reduce((total, product, index) => {
      return total + this.getProductTotal(index);
    }, 0);
  }

  getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  async onSubmit(): Promise<void> {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    if (this.products.length === 0) {
      this.error.set('Debes agregar al menos un producto a la venta');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const saleData: CreateSale = {
        description: this.saleForm.get('description')?.value.trim(),
        products: this.products.controls.map((control) => ({
          idProduct: parseInt(control.get('idProduct')?.value),
          unitPrice: parseInt(control.get('unitPrice')?.value),
          stock: parseInt(control.get('stock')?.value),
        })),
      };

      await this.vm.execute(saleData);

      // Redirigir después de crear la venta
      this.router.navigate(['/store-inventory']);
    } catch (error: any) {
      console.error('Error al crear venta:', error);
      this.error.set(
        error.message || 'Error al crear la venta. Por favor, intenta de nuevo.'
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/store-inventory']);
  }

  // Helpers para validaciones
  isProductFieldInvalid(productIndex: number, fieldName: string): boolean {
    const control = this.products.at(productIndex).get(fieldName);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  isDescriptionInvalid(): boolean {
    const control = this.saleForm.get('description');
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(productIndex: number, fieldName: string): string {
    const control = this.products.at(productIndex).get(fieldName);

    if (!control) return 'Campo inválido';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('min')) {
      return 'El valor debe ser mayor a 0';
    }

    if (control.hasError('exceedsStock')) {
      const error = control.getError('exceedsStock');
      return `Stock insuficiente. Disponible: ${error.available}`;
    }

    if (control.hasError('maxLength')) {
      return 'Has excedido el límite de caracteres';
    }

    return 'Campo inválido';
  }

  getDescriptionErrorMessage(): string {
    const control = this.saleForm.get('description');

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control?.hasError('maxLength')) {
      return 'Has excedido el límite de caracteres';
    }

    return 'Campo inválido';
  }

  getTotalUnits(): number {
    return this.products.controls.reduce((sum, product) => {
      return sum + (parseInt(product.get('stock')?.value) || 0);
    }, 0);
  }

  // Getters para el template
  get productsForSale() {
    return this.productsVM.state().products;
  }

  get productsLoading() {
    return this.productsVM.state().loading;
  }

  get productsError() {
    return this.productsVM.state().error;
  }

  onRetryLoadProducts(): void {
    this.productsVM.getProducts();
  }
}
