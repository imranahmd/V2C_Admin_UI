import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkSettlementComponent } from './mark-settlement.component';

describe('MarkSettlementComponent', () => {
  let component: MarkSettlementComponent;
  let fixture: ComponentFixture<MarkSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
