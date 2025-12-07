import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateProduct } from '@domain/products/products.entity';
import { UpdateProductGateway } from '@domain/products/update-product.gateway';
import { UpdateProductResponse } from '@domain/products/products.response';

@Injectable()
export class UpdateProductUseCase {
  private readonly gateway = inject(UpdateProductGateway);

  execute(
    idProduct: number,
    dataProduct: UpdateProduct
  ): Observable<UpdateProductResponse> {
    return this.gateway.execute(idProduct, dataProduct);
  }
}
