import { BehaviorSubject } from 'rxjs'

export class PagesRepository {
  orderSearchQueryParams: { orderNums: [] }

  public orderNoFromInventoryInquiry = new BehaviorSubject(null)
  constructor() {}
}
