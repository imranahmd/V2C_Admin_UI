import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankClaimComponent } from './bank-claim.component';

describe('BankClaimComponent', () => {
  let component: BankClaimComponent;
  let fixture: ComponentFixture<BankClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
