import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconUploadTwoComponent } from './recon-upload-two.component';

describe('ReconUploadTwoComponent', () => {
  let component: ReconUploadTwoComponent;
  let fixture: ComponentFixture<ReconUploadTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconUploadTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconUploadTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
