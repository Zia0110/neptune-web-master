import { Component } from '@angular/core'

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss'],
})
export class TransferListComponent {
  constructor() {}
  displayedColumns: string[] = ['order_id', 'customer_origin', 'customer_dest', 'location_start', 'location_dest', 'method', 'status']
  dataSource = ELEMENT_DATA
}
export interface PeriodicElement {
  customer_origin: string
  order_id: number
  customer_dest: string
  location_start: string
  location_dest: string
  method: string
  status: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { order_id: 1, customer_origin: 'Elise', customer_dest: ' Amy', location_start: 'Auckland', method: 'Air ', status: ' ', location_dest: 'Wuhan' },
  { order_id: 2, customer_origin: 'ELise', customer_dest: 'Elsa', location_start: 'Auckland', method: 'Sea', status: ' ', location_dest: 'Sydney' },
  {
    order_id: 3,
    customer_origin: 'Shuan',
    customer_dest: ' John ',
    location_start: 'Auckland',
    method: 'Land',
    status: ' ',
    location_dest: 'Wellington',
  },
]
