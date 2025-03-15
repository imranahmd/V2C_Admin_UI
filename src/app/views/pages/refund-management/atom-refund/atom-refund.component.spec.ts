import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomRefundComponent } from './atom-refund.component';

describe('AtomRefundComponent', () => {
  let component: AtomRefundComponent;
  let fixture: ComponentFixture<AtomRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtomRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
