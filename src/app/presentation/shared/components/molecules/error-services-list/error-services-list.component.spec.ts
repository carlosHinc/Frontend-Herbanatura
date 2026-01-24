import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorServicesListComponent } from './error-services-list.component';

describe('ErrorServicesListComponent', () => {
  let component: ErrorServicesListComponent;
  let fixture: ComponentFixture<ErrorServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorServicesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
