import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeListViewComponent } from './recharge-list-view.component';

describe('RechargeListViewComponent', () => {
  let component: RechargeListViewComponent;
  let fixture: ComponentFixture<RechargeListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
