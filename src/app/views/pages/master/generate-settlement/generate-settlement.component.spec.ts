import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSettlementComponent } from './generate-settlement.component';

describe('GenerateSettlementComponent', () => {
  let component: GenerateSettlementComponent;
  let fixture: ComponentFixture<GenerateSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
