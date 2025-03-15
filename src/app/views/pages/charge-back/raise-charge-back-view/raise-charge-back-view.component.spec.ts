import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseChargeBackViewComponent } from './raise-charge-back-view.component';

describe('RaiseChargeBackViewComponent', () => {
  let component: RaiseChargeBackViewComponent;
  let fixture: ComponentFixture<RaiseChargeBackViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseChargeBackViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseChargeBackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
