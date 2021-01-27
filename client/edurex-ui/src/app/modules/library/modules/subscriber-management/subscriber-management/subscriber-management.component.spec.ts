import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberManagementComponent } from './subscriber-management.component';

describe('SubscriberManagementComponent', () => {
  let component: SubscriberManagementComponent;
  let fixture: ComponentFixture<SubscriberManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
