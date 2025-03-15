import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUpdateViewComponent } from './status-update-view.component';

describe('StatusUpdateViewComponent', () => {
  let component: StatusUpdateViewComponent;
  let fixture: ComponentFixture<StatusUpdateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusUpdateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusUpdateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
