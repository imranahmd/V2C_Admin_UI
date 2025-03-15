import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadViewComponent } from './download-view.component';

describe('DownloadViewComponent', () => {
  let component: DownloadViewComponent;
  let fixture: ComponentFixture<DownloadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
