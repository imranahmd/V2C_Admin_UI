import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfRnsInwardComponent } from './af-rns-inward.component';

describe('AfRnsInwardComponent', () => {
  let component: AfRnsInwardComponent;
  let fixture: ComponentFixture<AfRnsInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfRnsInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfRnsInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
