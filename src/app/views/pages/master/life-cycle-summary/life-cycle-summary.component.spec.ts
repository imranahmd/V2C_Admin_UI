import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCycleSummaryComponent } from './life-cycle-summary.component';

describe('LifeCycleSummaryComponent', () => {
  let component: LifeCycleSummaryComponent;
  let fixture: ComponentFixture<LifeCycleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeCycleSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCycleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
