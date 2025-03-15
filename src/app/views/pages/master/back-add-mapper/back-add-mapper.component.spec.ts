import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackAddMapperComponent } from './back-add-mapper.component';

describe('BackAddMapperComponent', () => {
  let component: BackAddMapperComponent;
  let fixture: ComponentFixture<BackAddMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackAddMapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackAddMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
