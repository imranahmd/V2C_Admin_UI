import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeBackProcessingComponent } from './charge-back-processing.component';

describe('ChargeBackProcessingComponent', () => {
  let component: ChargeBackProcessingComponent;
  let fixture: ComponentFixture<ChargeBackProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeBackProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeBackProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
