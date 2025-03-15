import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicateMerchantMDRComponent } from './replicate-merchant-mdr.component';

describe('ReplicateMerchantMDRComponent', () => {
  let component: ReplicateMerchantMDRComponent;
  let fixture: ComponentFixture<ReplicateMerchantMDRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplicateMerchantMDRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicateMerchantMDRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
