import { TestBed } from '@angular/core/testing'

import { SearchSelectionServiceService } from './search-selection-service.service'

describe('SearchSelectionServiceService', () => {
  let service: SearchSelectionServiceService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SearchSelectionServiceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
