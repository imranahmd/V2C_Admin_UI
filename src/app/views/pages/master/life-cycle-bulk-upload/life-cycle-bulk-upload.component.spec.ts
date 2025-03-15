import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCycleBulkUploadComponent } from './life-cycle-bulk-upload.component';

describe('LifeCycleBulkUploadComponent', () => {
  let component: LifeCycleBulkUploadComponent;
  let fixture: ComponentFixture<LifeCycleBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeCycleBulkUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCycleBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
