import { TestBed, inject } from '@angular/core/testing';

import { UserCreateService } from './user-create.service';

describe('UserCreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCreateService]
    });
  });

  it('should ...', inject([UserCreateService], (service: UserCreateService) => {
    expect(service).toBeTruthy();
  }));
});
