import { TestBed } from '@angular/core/testing';

import { InstituteManagementService } from './institute-management.service';

describe('InstituteManagementService', () => {
  let service: InstituteManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
