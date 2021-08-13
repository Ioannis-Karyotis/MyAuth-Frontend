import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalFaceAuthComponent } from './external-face-auth.component';

describe('ExternalFaceAuthComponent', () => {
  let component: ExternalFaceAuthComponent;
  let fixture: ComponentFixture<ExternalFaceAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalFaceAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalFaceAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
