import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCategoryMapperViewComponent } from './bank-category-mapper-view.component';

describe('BankCategoryMapperViewComponent', () => {
  let component: BankCategoryMapperViewComponent;
  let fixture: ComponentFixture<BankCategoryMapperViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCategoryMapperViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCategoryMapperViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
