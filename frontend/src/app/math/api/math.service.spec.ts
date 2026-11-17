import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { MathService } from './math.service';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('MathService', () => {

  let service: MathService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MathService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MathService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load categories', async () => {

    let result = firstValueFrom(service.getCategories());

    const request = httpMock.expectOne('/api/categories');

    expect(request.request.method).toBe('GET');

    request.flush([
      {
        id: 1,
        name: 'Logika'
      }
    ]);

    expect(await result).toEqual([
      {
        id: 1,
        name: 'Logika'
      }
    ]);

  });

});