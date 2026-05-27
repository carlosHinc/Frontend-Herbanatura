import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, computed, effect } from '@angular/core';

import { GetProductsExpiredUseCase } from '@application/use-cases/products/get-products-expired.usecase';
import { ExpireInventoryBatchesUseCase } from '@application/use-cases/products/expire-inventory-batches.usecase';
import { GetProductsExpiredGateway } from '@domain/products/get-products-expired.gateway';
import { ExpireInventoryBatchesGateway } from '@domain/products/expire-inventory-batches.gateway';
import { HttpGetProductsExpiredService } from '@infrastructure/services/products/http-get-products-expired.service';
import { HttpExpireInventoryBatchesService } from '@infrastructure/services/products/http-expire-inventory-batches.service';
import { GetProductsExpiredViewModel } from '@presentation/view-models/products/get-products-expired.view-model';
import { ExpireInventoryBatchesViewModel } from '@presentation/view-models/products/expire-inventory-batches.view-model';
import { HeaderComponent } from '@presentation/shared/components/molecules/header/header.component';
import { EXPIRED_PRODUCTS_CONFIG } from './expired-products-ui.config';

@Component({
  selector: 'app-expired-products',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  providers: [
    GetProductsExpiredViewModel,
    GetProductsExpiredUseCase,
    ExpireInventoryBatchesViewModel,
    ExpireInventoryBatchesUseCase,
    {
      provide: GetProductsExpiredGateway,
      useClass: HttpGetProductsExpiredService,
    },
    {
      provide: ExpireInventoryBatchesGateway,
      useClass: HttpExpireInventoryBatchesService,
    },
  ],
  templateUrl: './expired-products.component.html',
  styleUrls: ['./expired-products.component.scss'],
})
export class ExpiredProductsComponent implements OnInit {
  readonly configUI = EXPIRED_PRODUCTS_CONFIG;

  protected readonly productsExpiredVM = inject(GetProductsExpiredViewModel);
  protected readonly expireVM = inject(ExpireInventoryBatchesViewModel);

  constructor() {
    effect(() => {
      if (this.expireVM.state().success) {
        console.log('Lotes expirados con éxito');
        this.productsExpiredVM.getProductsExpired();
      }
    });
  }

  protected readonly hasProducts = computed(
    () =>
      !this.productsExpiredVM.state().loading &&
      !this.productsExpiredVM.state().error &&
      this.productsExpiredVM.state().products.length > 0,
  );

  protected readonly isEmpty = computed(
    () =>
      !this.productsExpiredVM.state().loading &&
      !this.productsExpiredVM.state().error &&
      this.productsExpiredVM.state().products.length === 0,
  );

  protected readonly totalProducts = computed(
    () => this.productsExpiredVM.state().products.length,
  );

  protected readonly totalStock = computed(() =>
    this.productsExpiredVM
      .state()
      .products.reduce((sum, item) => sum + item.product.stock, 0),
  );

  protected readonly totalBatches = computed(() =>
    this.productsExpiredVM
      .state()
      .products.reduce((sum, item) => sum + item.inventory.length, 0),
  );

  protected readonly hasInventoryBatches = computed(() =>
    this.productsExpiredVM
      .state()
      .products.some((item) =>
        item.inventory.some((batch) => batch.isInInventory === true),
      ),
  );

  protected readonly headerConfig = computed(() => ({
    ...this.configUI.header,
    showButton: this.hasInventoryBatches(),
  }));

  ngOnInit(): void {
    this.productsExpiredVM.getProductsExpired();
  }

  retry(): void {
    this.productsExpiredVM.getProductsExpired();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  getDaysSinceExpiration(daysToExpire: number): number {
    return Math.abs(daysToExpire);
  }

  discountInventoryProducts(): void {
    const batchIds = this.getBatchIds();
    this.expireVM.expireBatches(batchIds);
  }

  getBatchIds(): number[] {
    return this.productsExpiredVM
      .state()
      .products.flatMap((item) =>
        item.inventory
          .filter((batch) => batch.isInInventory === true)
          .map((batch) => batch.batchId),
      );
  }
}
