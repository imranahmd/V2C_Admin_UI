import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFontComponent } from './web-font.component';

describe('WebFontComponent', () => {
  let component: WebFontComponent;
  let fixture: ComponentFixture<WebFontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebFontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebFontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
