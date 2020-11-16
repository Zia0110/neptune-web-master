import { Component, OnInit, Input } from '@angular/core'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-business-transfer-warehouse-list',
  templateUrl: './business-transfer-warehouse-list.component.html',
  styleUrls: ['./business-transfer-warehouse-list.component.css'],
})
export class BusinessTransferWarehouseListComponent implements OnInit {
  @Input() row
  @Input() isWarehouse: boolean
  constructor(private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // console.log(this.row)
    // console.log(this.isWarehouse)
  }

  public getStockQuantity(stock, quantity): void {
    let numberQuantity = +quantity // to number
    if (numberQuantity > stock.AvaliableStock) {
      this.sweetAlert.showSweetAlert('transferred quantity is greater than current warehouse inventory, please reselect！')
    } else {
      stock.transferQuantity = numberQuantity
    }
  }

  public getTransportQuantity(transport, quantity): void {
    let numberQuantity = +quantity // to number
    if (numberQuantity > transport.Quantity) {
      this.sweetAlert.showSweetAlert('transferred quantity is greater than current transport inventory, please reselect！')
    } else {
      transport.transferQuantity = numberQuantity
    }
  }
}
