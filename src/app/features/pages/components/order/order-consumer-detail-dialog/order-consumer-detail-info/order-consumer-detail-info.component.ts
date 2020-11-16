import { Component, OnInit, Input, OnChanges, Output, ViewChild } from '@angular/core'
import { EventEmitter } from 'events'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-order-consumer-detail-info',
  templateUrl: './order-consumer-detail-info.component.html',
  styleUrls: ['./order-consumer-detail-info.component.css'],
})
export class OrderConsumerDetailInfoComponent implements OnInit {
  @Input() orderNo
  @Input() orderData
  @Output() loaded = new EventEmitter()

  constructor(private appConfigStore: AppConfigStore) {}

  ngOnInit(): void {
    console.log(this.orderData)
  }

  getLocateDateString(date) {
    return new Date(date.replace('T', ' ') + ' UTC')
  }
}
