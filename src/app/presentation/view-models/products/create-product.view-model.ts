import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { CreateProductUseCase } from '@application/use-cases/products/create-product.usecase';
import { CreateProduct } from '@domain/products/products.entity';

@Injectable()
export class CreateProductViewModel {
  private readonly useCase = inject(CreateProductUseCase);

  async execute(productData: CreateProduct) {
    return await this.createProduct(productData);
  }

  private async createProduct(productData: CreateProduct) {
    return lastValueFrom(this.useCase.execute(productData));
  }
}
