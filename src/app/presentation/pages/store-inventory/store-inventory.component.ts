import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';
import { ButtonConfigurationInterface } from '@presentation/shared/components/atoms/button/button.interface';
import { H1ConfigurationInterface } from '@presentation/shared/components/atoms/h1/h1.interface';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';

@Component({
  standalone: true,
  selector: 'app-store-inventory',
  imports: [CommonModule, HeaderComponent],
  providers: [
    GetProductsViewModel,
    GetProductsUseCase,
    {
      provide: GetProductsGateway,
      useClass: HttpGetProductsService,
    },
  ],
  templateUrl: './store-inventory.component.html',
  styleUrl: './store-inventory.component.scss',
})
export class StoreInventoryComponent {
  private readonly router = inject(Router);

  protected readonly getProductsVM = inject(GetProductsViewModel);

  addButtonConfig: ButtonConfigurationInterface = {
    text: '+ Agregar Producto',
    color: 'green',
  };

  h1Config: H1ConfigurationInterface = {
    text: 'Inventario de Productos',
    color: 'black',
  };

  goToAddProduct() {
    this.router.navigate(['/inventario/crear-producto']);
  }
}
