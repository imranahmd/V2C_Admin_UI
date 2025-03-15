import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementFileOneComponent } from './settlement-file-one.component';

describe('SettlementFileOneComponent', () => {
  let component: SettlementFileOneComponent;
  let fixture: ComponentFixture<SettlementFileOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementFileOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementFileOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
