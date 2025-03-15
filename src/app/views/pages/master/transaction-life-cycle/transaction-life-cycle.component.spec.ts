import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLifeCycleComponent } from './transaction-life-cycle.component';

describe('TransactionLifeCycleComponent', () => {
  let component: TransactionLifeCycleComponent;
  let fixture: ComponentFixture<TransactionLifeCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionLifeCycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionLifeCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
