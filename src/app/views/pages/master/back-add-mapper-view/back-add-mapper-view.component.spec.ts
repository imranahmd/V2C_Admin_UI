import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackAddMapperViewComponent } from './back-add-mapper-view.component';

describe('BackAddMapperViewComponent', () => {
  let component: BackAddMapperViewComponent;
  let fixture: ComponentFixture<BackAddMapperViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackAddMapperViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackAddMapperViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
