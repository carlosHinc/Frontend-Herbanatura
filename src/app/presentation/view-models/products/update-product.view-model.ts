import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { UpdateProductUseCase } from '@application/use-cases/products/update-product.usecase';
import { UpdateProduct } from '@domain/products/products.entity';

@Injectable()
export class UpdateProductViewModel {
  private readonly useCase = inject(UpdateProductUseCase);

  async execute(idProduct: number, productData: UpdateProduct) {
    return await this.updateProduct(idProduct, productData);
  }

  private async updateProduct(idProduct: number, productData: UpdateProduct) {
    return lastValueFrom(this.useCase.execute(idProduct, productData));
  }
}
