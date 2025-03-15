import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconConfigMasterComponent } from './recon-config-master.component';

describe('ReconConfigMasterComponent', () => {
  let component: ReconConfigMasterComponent;
  let fixture: ComponentFixture<ReconConfigMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconConfigMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconConfigMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
