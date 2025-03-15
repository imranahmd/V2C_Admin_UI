import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPasswordResetComponent } from './merchant-password-reset.component';

describe('MerchantPasswordResetComponent', () => {
  let component: MerchantPasswordResetComponent;
  let fixture: ComponentFixture<MerchantPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantPasswordResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
