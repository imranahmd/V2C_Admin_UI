import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentMasterComponent } from './instrument-master.component';

describe('InstrumentMasterComponent', () => {
  let component: InstrumentMasterComponent;
  let fixture: ComponentFixture<InstrumentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
