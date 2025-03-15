import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconComponent } from './recon.component';

describe('ReconComponent', () => {
  let component: ReconComponent;
  let fixture: ComponentFixture<ReconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
