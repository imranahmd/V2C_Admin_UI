import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeBackReportComponent } from './charge-back-report.component';

describe('ChargeBackReportComponent', () => {
  let component: ChargeBackReportComponent;
  let fixture: ComponentFixture<ChargeBackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeBackReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeBackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
