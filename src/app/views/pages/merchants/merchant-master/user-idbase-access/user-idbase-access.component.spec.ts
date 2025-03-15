import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIDBaseAccessComponent } from './user-idbase-access.component';

describe('UserIDBaseAccessComponent', () => {
  let component: UserIDBaseAccessComponent;
  let fixture: ComponentFixture<UserIDBaseAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserIDBaseAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIDBaseAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
