import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconviewComponent } from './reconview.component';

describe('ReconviewComponent', () => {
  let component: ReconviewComponent;
  let fixture: ComponentFixture<ReconviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
