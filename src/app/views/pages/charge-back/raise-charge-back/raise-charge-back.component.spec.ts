import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseChargeBackComponent } from './raise-charge-back.component';

describe('RaiseChargeBackComponent', () => {
  let component: RaiseChargeBackComponent;
  let fixture: ComponentFixture<RaiseChargeBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseChargeBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseChargeBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
