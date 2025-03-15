import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconConfigViewComponent } from './recon-config-view.component';

describe('ReconConfigViewComponent', () => {
  let component: ReconConfigViewComponent;
  let fixture: ComponentFixture<ReconConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconConfigViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
