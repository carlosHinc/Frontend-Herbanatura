import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateSupplierViewModel } from '@presentation/view-models/suppliers/create-supplier.view-model';
import { CreateSupplierGateway } from '@domain/suppliers/create-supplier.gateway';
import { HttpCreateSupplierService } from '@infrastructure/services/suppliers/http-create-supplier.service';
import { CreateSupplierUseCase } from '@application/use-cases/suppliers/create-supplier.usecase';
import { CreateSupplier } from '@domain/suppliers/suppliers.entity';

@Component({
  standalone: true,
  selector: 'app-create-supplier',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    CreateSupplierViewModel,
    CreateSupplierUseCase,
    {
      provide: CreateSupplierGateway,
      useClass: HttpCreateSupplierService,
    },
  ],
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss'],
})
export class CreateSupplierComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly vm = inject(CreateSupplierViewModel);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    cellphone: ['', [Validators.maxLength(50)]],
    address: ['', [Validators.maxLength(255)]],
    comments: ['', [Validators.maxLength(500)]],
  });

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  // Toast state
  protected readonly showToast = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastType = signal<'success' | 'error' | 'info'>(
    'success',
  );

  onCancel(): void {
    this.router.navigate(['inventario/productos']);
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.touched && control.invalid);
  }

  protected getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['maxlength']) return 'Valor demasiado largo';
    return 'Valor inválido';
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const raw = this.form.value as {
        name?: string | null;
        cellphone?: string | null;
        address?: string | null;
        comments?: string | null;
      };

      const payload: CreateSupplier = {
        name: raw.name ? String(raw.name).trim() : undefined,
        cellphone: raw.cellphone ? String(raw.cellphone).trim() : undefined,
        address: raw.address ? String(raw.address).trim() : undefined,
        comments: raw.comments ? String(raw.comments).trim() : undefined,
      };

      const result = await this.vm.execute(payload);

      // Show success toast then navigate back
      this.toastMessage.set(`Proveedor "${result.name}" creado exitosamente`);
      this.toastType.set('success');
      this.showToast.set(true);

      setTimeout(() => {
        this.showToast.set(false);
        this.router.navigate(['inventario/productos']);
      }, 900);
    } catch (err: any) {
      console.error(err);
      const message = err?.message || 'Error al crear el proveedor';
      this.error.set(message);
      this.toastMessage.set(message);
      this.toastType.set('error');
      this.showToast.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
