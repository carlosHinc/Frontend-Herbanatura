import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { CreateLaboratoryViewModel } from '@presentation/view-models/laboratories/create-laboratory.view-model';
import { CreateLaboratoryUseCase } from '@application/use-cases/laboratories/creat-laboratory.usecase';
import { CreateLaboratoryGateway } from '@domain/laboratories/create-laboratory.gateway';
import { HttpCreateLaboratoryService } from '@infrastructure/services/laboratories/http-create-laboratory.service';

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
    CreateLaboratoryViewModel,
    CreateLaboratoryUseCase,
    {
      provide: CreateLaboratoryGateway,
      useClass: HttpCreateLaboratoryService,
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
  protected readonly createLaboratoryVM = inject(CreateLaboratoryViewModel);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showBatchFields = signal(false);
  protected readonly totalPurchasePrice = signal(0);

  // Nuevos signals para el modal de crear laboratorio
  protected readonly showLaboratoryModal = signal(false);
  protected readonly loadingLaboratory = signal(false);
  protected readonly laboratoryError = signal<string | null>(null);
  protected readonly newLaboratoryName = signal('');

  // Agregar este signal junto con los otros signals
  protected readonly showToast = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error' | 'info'>(
    'success'
  );

  protected readonly showLaboratoryDropdown = signal(false);
  protected readonly laboratorySearchTerm = signal('');
  protected readonly selectedLaboratoryName = signal('');

  protected readonly filteredLaboratories = computed(() => {
    const searchTerm = this.laboratorySearchTerm().toLowerCase();
    const laboratories = this.laboratoriesVM.state().laboratories;

    if (!searchTerm) {
      return laboratories;
    }

    return laboratories.filter((lab) =>
      lab.name.toLowerCase().includes(searchTerm)
    );
  });

  // Método para mostrar toast
  private showToastNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  protected readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    idLaboratory: ['', [Validators.required]],
    description: ['', [Validators.maxLength(500)]],
    salesPrice: ['', [Validators.min(0)]],
    batchNumber: [''],
    expirationDate: [''],
    stock: [0],
    unitPurchasePrice: [0],
  });

  ngOnInit(): void {
    this.laboratoriesVM.getLaboratories();

    this.productForm.get('stock')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.productForm.get('unitPurchasePrice')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select')) {
        this.showLaboratoryDropdown.set(false);
      }
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
      batchNumberControl?.setValidators([Validators.required]);
      expirationDateControl?.setValidators([Validators.required]);
      stockControl?.setValidators([Validators.required, Validators.min(1)]);
      unitPurchasePriceControl?.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    } else {
      batchNumberControl?.clearValidators();
      expirationDateControl?.clearValidators();
      stockControl?.clearValidators();
      unitPurchasePriceControl?.clearValidators();

      this.productForm.patchValue({
        batchNumber: '',
        expirationDate: '',
        stock: 0,
        unitPurchasePrice: 0,
      });

      this.totalPurchasePrice.set(0);
    }

    batchNumberControl?.updateValueAndValidity();
    expirationDateControl?.updateValueAndValidity();
    stockControl?.updateValueAndValidity();
    unitPurchasePriceControl?.updateValueAndValidity();
  }

  // Métodos para el modal de crear laboratorio
  openLaboratoryModal(): void {
    this.showLaboratoryModal.set(true);
    this.laboratoryError.set(null);
    this.newLaboratoryName.set('');
  }

  closeLaboratoryModal(): void {
    this.showLaboratoryModal.set(false);
    this.newLaboratoryName.set('');
    this.laboratoryError.set(null);
  }

  async createLaboratory(): Promise<void> {
    const name = this.newLaboratoryName().trim();

    if (!name) {
      this.laboratoryError.set('El nombre del laboratorio es obligatorio');
      return;
    }

    this.loadingLaboratory.set(true);
    this.laboratoryError.set(null);

    try {
      const result = await this.createLaboratoryVM.execute({ name });

      // Recargar la lista de laboratorios
      await this.laboratoriesVM.getLaboratories();

      // Seleccionar automáticamente el laboratorio recién creado
      this.productForm.patchValue({
        idLaboratory: result.id,
      });

      // Mostrar toast de éxito
      this.showToastNotification(
        `Laboratorio "${name}" creado exitosamente`,
        'success'
      );

      // Cerrar el modal
      this.closeLaboratoryModal();
    } catch (error: any) {
      console.error('Error al crear laboratorio:', error);
      this.laboratoryError.set(
        error.message ||
          'Error al crear el laboratorio. Por favor, intenta de nuevo.'
      );
    } finally {
      this.loadingLaboratory.set(false);
    }
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

      const productData: any = {
        name: formValue.name.trim(),
        idLaboratory: parseInt(formValue.idLaboratory),
        description: formValue.description?.trim() || undefined,
        salesPrice: formValue.salesPrice
          ? parseInt(formValue.salesPrice)
          : undefined,
      };

      if (this.showBatchFields() && formValue.batchNumber) {
        productData.batchNumber = formValue.batchNumber.trim();
        productData.expirationDate = formValue.expirationDate;
        productData.stock = parseInt(formValue.stock) || 0;
        productData.unitPurchasePrice =
          parseInt(formValue.unitPurchasePrice) || 0;
      }

      await this.vm.execute(productData);

      this.router.navigate(['/inventario/productos']);
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
    this.router.navigate(['/inventario/productos']);
  }

  onRetryLoadLaboratories(): void {
    this.laboratoriesVM.getLaboratories();
  }

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

  getFormattedTotalPrice(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.totalPurchasePrice());
  }

  toggleLaboratoryDropdown(): void {
    this.showLaboratoryDropdown.update((value) => !value);
    if (!this.showLaboratoryDropdown()) {
      this.laboratorySearchTerm.set('');
    }
  }

  selectLaboratory(labId: number, labName: string): void {
    this.productForm.patchValue({
      idLaboratory: labId,
    });
    this.selectedLaboratoryName.set(labName);
    this.showLaboratoryDropdown.set(false);
    this.laboratorySearchTerm.set('');
  }

  clearLaboratorySelection(): void {
    this.productForm.patchValue({
      idLaboratory: '',
    });
    this.selectedLaboratoryName.set('');
    this.laboratorySearchTerm.set('');
  }
}
