import { inject, Injectable } from '@angular/core';
import { GetProductsGateway } from '../../../domain/products/get-products.gateway';
import { Observable } from 'rxjs';
import { GetProductsResponse } from '../../../domain/products/products.response';

@Injectable()
export class GetProductsUseCase {
  private readonly gateway = inject(GetProductsGateway);

  execute(): Observable<GetProductsResponse> {
    return this.gateway.execute();
  }
}
