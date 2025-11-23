import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CreateProductViewModel } from '@presentation/view-models/products/create-product.view-model';
import { CreateProductGateway } from '@domain/products/create-product.gateway';
import { HttpCreateProductService } from '@infrastructure/services/products/http-create-product.service';
import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { GetLaboratoriesViewModel } from '@presentation/view-models/laboratories/get-laboratories.view-model';
import { GetLaboratoriesUseCase } from '@application/use-cases/laboratories/get-laboratories.usecase';
import { GetLaboratoriesGateway } from '@domain/laboratories/get-laboratories.gateway';
import { HttpGetLaboratoriesService } from '@infrastructure/services/laboratories/http-get-laboratories.service';

@Component({
  selector: 'app-create-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    CreateProductViewModel,
    CreateProductUseCase,
    {
      provide: CreateProductGateway,
      useClass: HttpCreateProductService,
    },
    GetLaboratoriesViewModel,
    GetLaboratoriesUseCase,
    {
      provide: GetLaboratoriesGateway,
      useClass: HttpGetLaboratoriesService,
    },
  ],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss',
})
export class CreateProductsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly vm = inject(CreateProductViewModel);
  protected readonly laboratoriesVM = inject(GetLaboratoriesViewModel);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showBatchFields = signal(false);
  protected readonly totalPurchasePrice = signal(0);

  protected readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    idLaboratory: ['', [Validators.required]],
    description: ['', [Validators.maxLength(500)]],
    salesPrice: ['', [Validators.min(0)]],
    // Campos opcionales del lote - SIN validaciones iniciales
    batchNumber: [''],
    expirationDate: [''],
    stock: [0],
    unitPurchasePrice: [0],
  });

  ngOnInit(): void {
    // Cargar laboratorios al iniciar el componente
    this.laboratoriesVM.getLaboratories();

    // Escuchar cambios en stock y precio unitario para recalcular el total
    this.productForm.get('stock')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.productForm.get('unitPurchasePrice')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  private calculateTotalPrice(): void {
    const stock = parseInt(this.productForm.get('stock')?.value) || 0;
    const unitPrice =
      parseInt(this.productForm.get('unitPurchasePrice')?.value) || 0;
    this.totalPurchasePrice.set(stock * unitPrice);
  }

  toggleBatchFields(): void {
    this.showBatchFields.update((value) => !value);

    const batchNumberControl = this.productForm.get('batchNumber');
    const expirationDateControl = this.productForm.get('expirationDate');
    const stockControl = this.productForm.get('stock');
    const unitPurchasePriceControl = this.productForm.get('unitPurchasePrice');

    if (this.showBatchFields()) {
      // Agregar validaciones cuando se activa el checkbox
      batchNumberControl?.setValidators([Validators.required]);
      expirationDateControl?.setValidators([Validators.required]);
      stockControl?.setValidators([Validators.required, Validators.min(1)]);
      unitPurchasePriceControl?.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    } else {
      // Remover validaciones cuando se desactiva el checkbox
      batchNumberControl?.clearValidators();
      expirationDateControl?.clearValidators();
      stockControl?.clearValidators();
      unitPurchasePriceControl?.clearValidators();

      // Limpiar campos del lote
      this.productForm.patchValue({
        batchNumber: '',
        expirationDate: '',
        stock: 0,
        unitPurchasePrice: 0,
      });

      // Resetear el precio total
      this.totalPurchasePrice.set(0);
    }

    // Actualizar el estado de validación de los controles
    batchNumberControl?.updateValueAndValidity();
    expirationDateControl?.updateValueAndValidity();
    stockControl?.updateValueAndValidity();
    unitPurchasePriceControl?.updateValueAndValidity();
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const formValue = this.productForm.value;

      // Preparar datos del producto
      const productData: any = {
        name: formValue.name.trim(),
        idLaboratory: parseInt(formValue.idLaboratory),
        description: formValue.description?.trim() || undefined,
        salesPrice: formValue.salesPrice
          ? parseInt(formValue.salesPrice)
          : undefined,
      };

      // Agregar datos del lote solo si se proporcionan
      if (this.showBatchFields() && formValue.batchNumber) {
        productData.batchNumber = formValue.batchNumber.trim();
        productData.expirationDate = formValue.expirationDate;
        productData.stock = parseInt(formValue.stock) || 0;
        productData.unitPurchasePrice =
          parseInt(formValue.unitPurchasePrice) || 0;
      }

      await this.vm.execute(productData);

      // Redirigir al inventario después de crear
      this.router.navigate(['/store-inventory']);
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      this.error.set(
        error.message ||
          'Error al crear el producto. Por favor, intenta de nuevo.'
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/store-inventory']);
  }

  onRetryLoadLaboratories(): void {
    this.laboratoriesVM.getLaboratories();
  }

  // Helpers para validaciones
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (field?.hasError('maxLength')) {
      const maxLength = field.errors?.['maxLength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    if (field?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }

    return '';
  }

  // Formatear el precio total para mostrar
  getFormattedTotalPrice(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.totalPurchasePrice());
  }
}
