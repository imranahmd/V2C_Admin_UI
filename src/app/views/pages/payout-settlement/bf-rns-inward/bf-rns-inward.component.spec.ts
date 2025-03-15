import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BfRnsInwardComponent } from './bf-rns-inward.component';

describe('BfRnsInwardComponent', () => {
  let component: BfRnsInwardComponent;
  let fixture: ComponentFixture<BfRnsInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BfRnsInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BfRnsInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
