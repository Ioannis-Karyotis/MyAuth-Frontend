import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedAppsComponent } from './connected-apps.component';

describe('ConnectedAppsComponent', () => {
  let component: ConnectedAppsComponent;
  let fixture: ComponentFixture<ConnectedAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectedAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
