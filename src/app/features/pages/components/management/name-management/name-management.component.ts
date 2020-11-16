import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-name-management',
  templateUrl: './name-management.component.html',
  styleUrls: ['./name-management.component.css'],
})
export class NameManagementComponent implements OnInit {
  selectedValue: string

  options = [
    { value: 'customer', viewValue: 'Client name' },
    { value: 'product', viewValue: 'Product name' },
    { value: 'wholesaleCustomer', viewValue: 'Stock Customer Mapping' },
    { value: 'distributionRule', viewValue: 'Distribution rule' },
  ]

  constructor() {}

  ngOnInit(): void {}
}
