import { Component, OnInit, Input } from '@angular/core'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-business-transfer-change-warehouse-list',
  templateUrl: './business-transfer-change-warehouse-list.component.html',
  styleUrls: ['./business-transfer-change-warehouse-list.component.css'],
})
export class BusinessTransferChangeWarehouseListComponent implements OnInit {
  @Input() row
  @Input() isWarehouse: boolean
  constructor(private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // console.log(this.row)
    // console.log(this.isWarehouse)
  }

  public getNewQuantity(detail, newQuantity): void {
    detail.transferQuantity = newQuantity
    let temTotal: number = 0
    temTotal = this.getTemTotalNumber(this.row)
    if (temTotal > this.row.TotalQuantity) {
      this.sweetAlert.showSweetAlert('number of new configurations exceeds original number, please reselect!')
    } else {
      this.row.newTotalQuantity = temTotal
      // this.currentDataSource._updateChangeSubscription()
    }
  }

  private getTemTotalNumber(row): number {
    let res: number = 0
    for (let stock of row.WarehouseList) {
      res += stock.transferQuantity
    }
    for (let tran of row.TransportList) {
      res += tran.transferQuantity
    }
    return res
  }
}
