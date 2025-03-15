import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeManagementComponent } from './recharge-management.component';

describe('RechargeManagementComponent', () => {
  let component: RechargeManagementComponent;
  let fixture: ComponentFixture<RechargeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
