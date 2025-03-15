import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCategoryMapperComponent } from './bank-category-mapper.component';

describe('BankCategoryMapperComponent', () => {
  let component: BankCategoryMapperComponent;
  let fixture: ComponentFixture<BankCategoryMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCategoryMapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCategoryMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
