import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnsTransactionComponent } from './rns-transaction.component';

describe('RnsTransactionComponent', () => {
  let component: RnsTransactionComponent;
  let fixture: ComponentFixture<RnsTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnsTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RnsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
