import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementFileTwoComponent } from './settlement-file-two.component';

describe('SettlementFileTwoComponent', () => {
  let component: SettlementFileTwoComponent;
  let fixture: ComponentFixture<SettlementFileTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementFileTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementFileTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
