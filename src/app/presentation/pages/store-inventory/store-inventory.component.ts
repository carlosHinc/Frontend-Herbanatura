import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { GetProductsGateway } from '@domain/products/get-products.gateway';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { HttpGetProductsService } from '@infrastructure/services/products/http-get-products.service';
import { GetProductsViewModel } from '@presentation/view-models/products/get-productos.view-model';

@Component({
  standalone: true,
  selector: 'app-store-inventory',
  imports: [CommonModule, RouterLink],
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
  protected readonly getProductsVM = inject(GetProductsViewModel);
}
