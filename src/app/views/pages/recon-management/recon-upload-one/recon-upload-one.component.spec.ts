import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconUploadOneComponent } from './recon-upload-one.component';

describe('ReconUploadOneComponent', () => {
  let component: ReconUploadOneComponent;
  let fixture: ComponentFixture<ReconUploadOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconUploadOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconUploadOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
