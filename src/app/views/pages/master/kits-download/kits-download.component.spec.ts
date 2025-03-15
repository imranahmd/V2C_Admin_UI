import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitsDownloadComponent } from './kits-download.component';

describe('KitsDownloadComponent', () => {
  let component: KitsDownloadComponent;
  let fixture: ComponentFixture<KitsDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KitsDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KitsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
