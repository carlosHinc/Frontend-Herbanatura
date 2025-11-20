import { inject, Injectable } from '@angular/core';
import { CreateOrderUseCase } from '@application/use-cases/orders/create-order.usecase';
import { CreateOrder } from '@domain/orders/orders.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateOrderViewModel {
  private useCase = inject(CreateOrderUseCase);

  async execute(orderData: CreateOrder) {
    await this.createOrder(orderData);
  }

  async createOrder(orderData: CreateOrder) {
    return lastValueFrom(this.useCase.execute(orderData));
  }
}
