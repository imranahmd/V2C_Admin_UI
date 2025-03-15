import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfRnsOutwardComponent } from './af-rns-outward.component';

describe('AfRnsOutwardComponent', () => {
  let component: AfRnsOutwardComponent;
  let fixture: ComponentFixture<AfRnsOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfRnsOutwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfRnsOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
