import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconConfigComponent } from './recon-config.component';

describe('ReconConfigComponent', () => {
  let component: ReconConfigComponent;
  let fixture: ComponentFixture<ReconConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
