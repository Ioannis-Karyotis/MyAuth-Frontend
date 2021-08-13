import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureExternalLoginComponent } from './failure-external-login.component';

describe('FailureExternalLoginComponent', () => {
  let component: FailureExternalLoginComponent;
  let fixture: ComponentFixture<FailureExternalLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureExternalLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureExternalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
