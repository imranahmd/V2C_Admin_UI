import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadManualRefundComponent } from './download-manual-refund.component';

describe('DownloadManualRefundComponent', () => {
  let component: DownloadManualRefundComponent;
  let fixture: ComponentFixture<DownloadManualRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadManualRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadManualRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
