import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UpdateSupplierUseCase } from '@application/use-cases/suppliers/update-supplier.usecase';
import { GetSuppliersUseCase } from '@application/use-cases/suppliers/get-suppliers.usecase';
import { UpdateSupplierGateway } from '@domain/suppliers/update-supplier.gateway';
import { GetSuppliersGateway } from '@domain/suppliers/get-suppliers.gateway';
import { HttpUpdateSupplierService } from '@infrastructure/services/suppliers/http-update-supplier.service';
import { HttpGetSuppliersService } from '@infrastructure/services/suppliers/http-get-suppliers.service';
import { UpdateSupplierViewModel } from '@presentation/view-models/suppliers/update-supplier.view-model';
import { GetSuppliersViewModel } from '@presentation/view-models/suppliers/get-suppliers.view-model';
import { UpdateSupplier } from '@domain/suppliers/suppliers.entity';

@Component({
  standalone: true,
  selector: 'app-update-supplier',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    UpdateSupplierViewModel,
    UpdateSupplierUseCase,
    {
      provide: UpdateSupplierGateway,
      useClass: HttpUpdateSupplierService,
    },
    GetSuppliersViewModel,
    GetSuppliersUseCase,
    {
      provide: GetSuppliersGateway,
      useClass: HttpGetSuppliersService,
    },
  ],
  templateUrl: './update-supplier.component.html',
  styleUrl: './update-supplier.component.scss',
})
export class UpdateSupplierComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly updateSupplierVM = inject(UpdateSupplierViewModel);
  protected readonly getSuppliersVM = inject(GetSuppliersViewModel);

  protected readonly loading = signal(false);
  protected readonly loadingSupplier = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly supplierId = signal<number | null>(null);

  // Signal para controlar si ya se llenó el formulario
  private readonly formInitialized = signal(false);

  // Toast signals
  protected readonly showToast = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error' | 'info'>(
    'success',
  );

  protected readonly supplierForm: FormGroup = this.fb.group({
    name: ['', [Validators.maxLength(255)]],
    cellphone: ['', [Validators.maxLength(50)]],
    address: ['', [Validators.maxLength(255)]],
    comments: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    // Effect optimizado para llenar el formulario cuando el proveedor se carga
    effect(() => {
      const suppliersState = this.getSuppliersVM.state();
      const supplierId = this.supplierId();

      // Solo ejecutar si:
      // 1. No está cargando
      // 2. Hay proveedores cargados
      // 3. El proveedor actual no ha sido inicializado
      if (
        !suppliersState.loading &&
        suppliersState.suppliers &&
        suppliersState.suppliers.length > 0 &&
        supplierId &&
        !this.formInitialized()
      ) {
        const supplier = suppliersState.suppliers.find(
          (s) => s.id === supplierId,
        );

        if (supplier) {
          this.supplierForm.patchValue({
            name: supplier.name,
            cellphone: supplier.cellphone || '',
            address: supplier.address || '',
            comments: supplier.comments || '',
          });

          // Marcar como inicializado para evitar re-ejecuciones
          this.formInitialized.set(true);
          this.loadingSupplier.set(false);
        }
      }

      // Manejar errores
      if (
        !suppliersState.loading &&
        suppliersState.error &&
        !this.formInitialized()
      ) {
        this.error.set(suppliersState.error);
        this.loadingSupplier.set(false);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(parseInt(id))) {
      this.showToastNotification('ID de proveedor inválido', 'error');
      this.router.navigate(['/inventario/productos']);
      return;
    }

    this.supplierId.set(parseInt(id));
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.loadingSupplier.set(true);

      // Cargar proveedores
      await this.getSuppliersVM.getSuppliers();

      // El effect se encargará del resto
    } catch (error: any) {
      console.error('Error al cargar datos iniciales:', error);
      this.error.set('Error al cargar la información del proveedor');
      this.loadingSupplier.set(false);
    }
  }

  private loadSupplier(): void {
    const id = this.supplierId();
    if (!id) return;

    // Resetear el flag de inicialización por si se recarga
    this.formInitialized.set(false);
    this.getSuppliersVM.getSuppliers();
  }

  async onSubmit(): Promise<void> {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const id = this.supplierId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const formValue = this.supplierForm.value;

      const supplierData: UpdateSupplier = {};

      // Solo incluir campos que tengan valores
      if (formValue.name && String(formValue.name).trim() !== '') {
        supplierData.name = String(formValue.name).trim();
      }

      if (formValue.cellphone && String(formValue.cellphone).trim() !== '') {
        supplierData.cellphone = String(formValue.cellphone).trim();
      } else if (formValue.cellphone === '') {
        supplierData.cellphone = null;
      }

      if (formValue.address && String(formValue.address).trim() !== '') {
        supplierData.address = String(formValue.address).trim();
      } else if (formValue.address === '') {
        supplierData.address = null;
      }

      if (formValue.comments && String(formValue.comments).trim() !== '') {
        supplierData.comments = String(formValue.comments).trim();
      } else if (formValue.comments === '') {
        supplierData.comments = null;
      }

      await this.updateSupplierVM.execute(id, supplierData);

      this.showToastNotification(
        'Proveedor actualizado exitosamente',
        'success',
      );

      // Redirigir después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/inventario/productos']);
      }, 1500);
    } catch (error: any) {
      console.error('Error al actualizar proveedor:', error);
      this.error.set(
        error.message ||
          'Error al actualizar el proveedor. Por favor, intenta de nuevo.',
      );
      this.showToastNotification(
        error.message || 'Error al actualizar el proveedor',
        'error',
      );
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventario/productos']);
  }

  onRetryLoadSupplier(): void {
    this.loadSupplier();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return '';
  }

  private showToastNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);

    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
