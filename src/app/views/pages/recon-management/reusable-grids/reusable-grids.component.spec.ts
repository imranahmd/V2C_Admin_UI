import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableGridsComponent } from './reusable-grids.component';

describe('ReusableGridsComponent', () => {
  let component: ReusableGridsComponent;
  let fixture: ComponentFixture<ReusableGridsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusableGridsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusableGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
