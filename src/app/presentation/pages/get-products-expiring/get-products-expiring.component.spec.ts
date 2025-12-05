import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProductsExpiringComponent } from './get-products-expiring.component';

describe('GetProductsExpiringComponent', () => {
  let component: GetProductsExpiringComponent;
  let fixture: ComponentFixture<GetProductsExpiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetProductsExpiringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetProductsExpiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
