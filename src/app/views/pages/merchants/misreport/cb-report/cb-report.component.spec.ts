import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbReportComponent } from './cb-report.component';

describe('CbReportComponent', () => {
  let component: CbReportComponent;
  let fixture: ComponentFixture<CbReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
