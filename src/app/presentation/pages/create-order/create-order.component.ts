import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CreateOrderViewModel } from '@presentation/view-models/orders/create-order.view-model';
import { CreateOrderGateway } from '@domain/orders/create-order.gateway';
import { HttpCreateOrderService } from '@infrastructure/services/orders/http-create-order.service';
import { CreateOrderUseCase } from '@application/use-cases/orders/create-order.usecase';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { CreateOrder } from '@domain/orders/orders.entity';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    CreateOrderViewModel,
    CreateOrderUseCase,
    {
      provide: CreateOrderGateway,
      useClass: HttpCreateOrderService,
    },
    GetProductsViewModel,
    GetProductsUseCase,
    {
      provide: GetProductsGateway,
      useClass: HttpGetProductsService,
    },
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss',
})
export class CreateOrderComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly vm = inject(CreateOrderViewModel);
  protected readonly productsVM = inject(GetProductsViewModel);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly orderForm: FormGroup = this.fb.group({
    batches: this.fb.array([]),
  });

  ngOnInit(): void {
    // Los productos se cargan automáticamente con el ViewModel reactivo
    // Agregar un lote inicial vacío
    this.addBatch();
  }

  get batches(): FormArray {
    return this.orderForm.get('batches') as FormArray;
  }

  createBatchFormGroup(): FormGroup {
    return this.fb.group({
      idProduct: ['', [Validators.required]],
      batchName: ['', [Validators.required, Validators.maxLength(100)]],
      expirationDate: ['', [Validators.required]],
      stock: [1, [Validators.required, Validators.min(1)]],
      unitPurchasePrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addBatch(): void {
    const batchGroup = this.createBatchFormGroup();
    this.batches.push(batchGroup);
  }

  removeBatch(index: number): void {
    if (this.batches.length > 1) {
      this.batches.removeAt(index);
    }
  }

  // Calcular el precio total de un lote específico
  getBatchTotalPrice(index: number): number {
    const batch = this.batches.at(index);
    const stock = parseInt(batch.get('stock')?.value) || 0;
    const unitPrice = parseInt(batch.get('unitPurchasePrice')?.value) || 0;
    return stock * unitPrice;
  }

  // Calcular el total de toda la orden
  calculateOrderTotal(): number {
    return this.batches.controls.reduce((total, batch, index) => {
      return total + this.getBatchTotalPrice(index);
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
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    if (this.batches.length === 0) {
      this.error.set('Debes agregar al menos un lote de productos');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const orderData: CreateOrder = {
        batches: this.batches.controls.map((control) => ({
          idProduct: parseInt(control.get('idProduct')?.value),
          batchName: control.get('batchName')?.value.trim(),
          expirationDate: control.get('expirationDate')?.value,
          stock: parseInt(control.get('stock')?.value),
          unitPurchasePrice: parseInt(control.get('unitPurchasePrice')?.value),
        })),
      };

      await this.vm.execute(orderData);

      // Redirigir después de crear la orden
      this.router.navigate(['/inventario/productos']);
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      this.error.set(
        error.message || 'Error al crear la orden. Por favor, intenta de nuevo.'
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventario/productos']);
  }

  // Helpers para validaciones
  isBatchFieldInvalid(batchIndex: number, fieldName: string): boolean {
    const control = this.batches.at(batchIndex).get(fieldName);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(fieldName: string): string {
    if (fieldName === 'required') {
      return 'Este campo es obligatorio';
    }

    if (fieldName === 'min') {
      return 'El valor debe ser mayor a 0';
    }

    if (fieldName === 'maxLength') {
      return 'Has excedido el límite de caracteres';
    }

    return 'Campo inválido';
  }

  onRetryLoadProducts(): void {
    this.productsVM.retry();
  }
}
