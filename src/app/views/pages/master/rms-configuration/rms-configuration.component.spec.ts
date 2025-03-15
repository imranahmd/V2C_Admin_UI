import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmsConfigurationComponent } from './rms-configuration.component';

describe('RmsConfigurationComponent', () => {
  let component: RmsConfigurationComponent;
  let fixture: ComponentFixture<RmsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmsConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
