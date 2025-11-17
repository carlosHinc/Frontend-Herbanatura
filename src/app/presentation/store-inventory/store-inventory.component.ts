import { Component, inject } from '@angular/core';
import { GetProductsUseCase } from '../../application/use-cases/products/get-products.usecase';
import { GetProductsGateway } from '../../domain/products/get-products.gateway';
import { HttpGetProductsService } from '../../infrastructure/services/products/http-get-products.service';
import { CommonModule } from '@angular/common';
import { GetProductsViewModel } from '../view-models/products/get-productos.view-model';

@Component({
  standalone: true,
  selector: 'app-store-inventory',
  imports: [CommonModule],
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
