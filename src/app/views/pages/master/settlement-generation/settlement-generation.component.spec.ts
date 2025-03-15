import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementGenerationComponent } from './settlement-generation.component';

describe('SettlementGenerationComponent', () => {
  let component: SettlementGenerationComponent;
  let fixture: ComponentFixture<SettlementGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
