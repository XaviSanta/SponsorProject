import { TestBed } from '@angular/core/testing';

import { TiktokService } from './tiktok.service';

describe('TiktokService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiktokService = TestBed.get(TiktokService);
    expect(service).toBeTruthy();
  });
});
