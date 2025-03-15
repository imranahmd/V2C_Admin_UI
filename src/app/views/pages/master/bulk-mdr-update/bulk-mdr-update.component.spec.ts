import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMdrUpdateComponent } from './bulk-mdr-update.component';

describe('BulkMdrUpdateComponent', () => {
  let component: BulkMdrUpdateComponent;
  let fixture: ComponentFixture<BulkMdrUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkMdrUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMdrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
