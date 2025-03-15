import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadChargeBackDocsComponent } from './download-charge-back-docs.component';

describe('DownloadChargeBackDocsComponent', () => {
  let component: DownloadChargeBackDocsComponent;
  let fixture: ComponentFixture<DownloadChargeBackDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadChargeBackDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadChargeBackDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
