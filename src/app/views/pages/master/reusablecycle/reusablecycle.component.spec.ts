import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablecycleComponent } from './reusablecycle.component';

describe('ReusablecycleComponent', () => {
  let component: ReusablecycleComponent;
  let fixture: ComponentFixture<ReusablecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusablecycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusablecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
