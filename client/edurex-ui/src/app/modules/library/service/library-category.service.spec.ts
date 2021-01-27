import { TestBed } from '@angular/core/testing';

import { LibraryCategoryService } from './library-category.service';

describe('LibraryCategoryService', () => {
  let service: LibraryCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
