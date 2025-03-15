import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePayoutTwoComponent } from './generate-payout-two.component';

describe('GeneratePayoutTwoComponent', () => {
  let component: GeneratePayoutTwoComponent;
  let fixture: ComponentFixture<GeneratePayoutTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePayoutTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePayoutTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
