import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BfRnsOutwardComponent } from './bf-rns-outward.component';

describe('BfRnsOutwardComponent', () => {
  let component: BfRnsOutwardComponent;
  let fixture: ComponentFixture<BfRnsOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BfRnsOutwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BfRnsOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
