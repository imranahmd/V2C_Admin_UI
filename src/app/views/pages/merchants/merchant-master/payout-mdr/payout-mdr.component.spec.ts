import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutMdrComponent } from './payout-mdr.component';

describe('PayoutMdrComponent', () => {
  let component: PayoutMdrComponent;
  let fixture: ComponentFixture<PayoutMdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutMdrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutMdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
