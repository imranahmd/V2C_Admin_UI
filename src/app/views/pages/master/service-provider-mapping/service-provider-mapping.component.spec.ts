import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderMappingComponent } from './service-provider-mapping.component';

describe('ServiceProviderMappingComponent', () => {
  let component: ServiceProviderMappingComponent;
  let fixture: ComponentFixture<ServiceProviderMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceProviderMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
