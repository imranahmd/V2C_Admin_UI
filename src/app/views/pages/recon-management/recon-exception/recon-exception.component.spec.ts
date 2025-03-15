import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconExceptionComponent } from './recon-exception.component';

describe('ReconExceptionComponent', () => {
  let component: ReconExceptionComponent;
  let fixture: ComponentFixture<ReconExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconExceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
