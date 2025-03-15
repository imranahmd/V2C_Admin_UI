import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRefundComponent } from './upload-refund.component';

describe('UploadRefundComponent', () => {
  let component: UploadRefundComponent;
  let fixture: ComponentFixture<UploadRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
