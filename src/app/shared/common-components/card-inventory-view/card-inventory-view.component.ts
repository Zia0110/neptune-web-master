import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-card-inventory-view',
  templateUrl: './card-inventory-view.component.html',
  styleUrls: ['./card-inventory-view.component.css'],
})
export class CardInventoryViewComponent implements OnInit {
  @Input() data: any
  @Input() name = 'Warehouse Name'

  constructor() {}

  ngOnInit(): void {}
}
