import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePayoutOneComponent } from './generate-payout-one.component';

describe('GeneratePayoutOneComponent', () => {
  let component: GeneratePayoutOneComponent;
  let fixture: ComponentFixture<GeneratePayoutOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePayoutOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePayoutOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
