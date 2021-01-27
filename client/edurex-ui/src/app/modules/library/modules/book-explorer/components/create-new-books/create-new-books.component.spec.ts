import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewBooksComponent } from './create-new-books.component';

describe('CreateNewBooksComponent', () => {
  let component: CreateNewBooksComponent;
  let fixture: ComponentFixture<CreateNewBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
