import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBankComponent } from './service-bank.component';

describe('ServiceBankComponent', () => {
  let component: ServiceBankComponent;
  let fixture: ComponentFixture<ServiceBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
