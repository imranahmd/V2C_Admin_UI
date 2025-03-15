import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMappingComponent } from './bank-mapping.component';

describe('BankMappingComponent', () => {
  let component: BankMappingComponent;
  let fixture: ComponentFixture<BankMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
