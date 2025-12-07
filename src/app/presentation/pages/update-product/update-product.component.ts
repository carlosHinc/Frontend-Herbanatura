import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GetLaboratoriesUseCase } from '@application/use-cases/laboratories/get-laboratories.usecase';
import { GetProductUseCase } from '@application/use-cases/products/get-product.usecase';
import { UpdateProductUseCase } from '@application/use-cases/products/update-product.usecase';
import { GetLaboratoriesGateway } from '@domain/laboratories/get-laboratories.gateway';
import { GetProductGateway } from '@domain/products/get-product.gateway';
import { UpdateProductGateway } from '@domain/products/update-product.gateway';
import { HttpGetLaboratoriesService } from '@infrastructure/services/laboratories/http-get-laboratories.service';
import { HttpGetProductService } from '@infrastructure/services/products/http-get-product.service';
import { HttpUpdateProductService } from '@infrastructure/services/products/http-update-product.service';
import { GetLaboratoriesViewModel } from '@presentation/view-models/laboratories/get-laboratories.view-model';
import { GetProductViewModel } from '@presentation/view-models/products/get-product.view-model';
import { UpdateProductViewModel } from '@presentation/view-models/products/update-product.view-model';

@Component({
  selector: 'app-update-product',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    UpdateProductViewModel,
    UpdateProductUseCase,
    {
      provide: UpdateProductGateway,
      useClass: HttpUpdateProductService,
    },
    GetLaboratoriesViewModel,
    GetLaboratoriesUseCase,
    {
      provide: GetLaboratoriesGateway,
      useClass: HttpGetLaboratoriesService,
    },
    GetProductViewModel,
    GetProductUseCase,
    {
      provide: GetProductGateway,
      useClass: HttpGetProductService,
    },
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly updateProductVM = inject(UpdateProductViewModel);
  protected readonly getProductVM = inject(GetProductViewModel);
  protected readonly laboratoriesVM = inject(GetLaboratoriesViewModel);

  protected readonly loading = signal(false);
  protected readonly loadingProduct = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly productId = signal<number | null>(null);

  // Signal para controlar si ya se llenó el formulario
  private readonly formInitialized = signal(false);

  // Toast signals
  protected readonly showToast = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error' | 'info'>(
    'success'
  );

  protected readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    idLaboratory: ['', [Validators.required]],
    description: ['', [Validators.maxLength(500)]],
    salesPrice: ['', [Validators.min(0)]],
  });

  constructor() {
    // Effect optimizado para llenar el formulario cuando el producto se carga
    effect(() => {
      const productState = this.getProductVM.state();

      // Solo ejecutar si:
      // 1. No está cargando
      // 2. Hay un producto con ID
      // 3. El formulario NO ha sido inicializado aún
      if (
        !productState.loading &&
        productState.product?.id &&
        !this.formInitialized()
      ) {
        const product = productState.product;

        console.log('product', product);

        this.productForm.patchValue({
          name: product.name,
          idLaboratory: product.idLaboratory,
          description: product.description || '',
          salesPrice: product.salesPrice || '',
        });

        // Marcar como inicializado para evitar re-ejecuciones
        this.formInitialized.set(true);
        this.loadingProduct.set(false);
      }

      // Manejar errores
      if (
        !productState.loading &&
        productState.error &&
        !this.formInitialized()
      ) {
        this.error.set(productState.error);
        this.loadingProduct.set(false);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(parseInt(id))) {
      this.showToastNotification('ID de producto inválido', 'error');
      this.router.navigate(['/inventario/productos']);
      return;
    }

    this.productId.set(parseInt(id));
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.loadingProduct.set(true);

      // Cargar laboratorios
      await this.laboratoriesVM.getLaboratories();

      // Iniciar carga del producto (el effect se encargará del resto)
      this.loadProduct();
    } catch (error: any) {
      console.error('Error al cargar datos iniciales:', error);
      this.error.set('Error al cargar los datos del producto');
      this.loadingProduct.set(false);
    }
  }

  private loadProduct(): void {
    const id = this.productId();
    if (!id) return;

    // Resetear el flag de inicialización por si se recarga
    this.formInitialized.set(false);
    this.getProductVM.getProduct(id);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const id = this.productId();
    if (!id) return;

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

      await this.updateProductVM.execute(id, productData);

      this.showToastNotification(
        'Producto actualizado exitosamente',
        'success'
      );

      // Redirigir después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/inventario/productos']);
      }, 1500);
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      this.error.set(
        error.message ||
          'Error al actualizar el producto. Por favor, intenta de nuevo.'
      );
      this.showToastNotification(
        error.message || 'Error al actualizar el producto',
        'error'
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

  onRetryLoadProduct(): void {
    this.loadProduct();
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

  private showToastNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);

    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
