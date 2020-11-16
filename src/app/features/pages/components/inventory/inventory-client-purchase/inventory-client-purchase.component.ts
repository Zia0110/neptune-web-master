import { Component, OnInit } from '@angular/core'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import * as moment from 'moment'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { InventoryClientPurchaseCreateDialogComponent } from '../inventory-client-purchase-create-dialog/inventory-client-purchase-create-dialog.component'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-inventory-client-purchase',
  templateUrl: './inventory-client-purchase.component.html',
  styleUrls: ['./inventory-client-purchase.component.css'],
})
export class InventoryClientPurchaseComponent implements OnInit {
  datas: any
  beginDate = moment(new Date()).subtract(4, 'months').format('YYYY-MM-DD')
  endDate = moment(new Date()).format('YYYY-MM-DD')
  clientId = new FormControl(0)

  constructor(private inventoryEndpoint: InventoryEndpoint, public dialog: MatDialog, public sweetAlertService: SweetAlertService) {}

  ngOnInit() {
    this.getInventoryApiData()
    this.clientId.valueChanges.subscribe((res) => {
      this.getInventoryApiData()
    })
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  dateRangePickerOutput($event) {
    this.beginDate = this.getUTCdate($event.begin)
    this.endDate = this.getUTCdate($event.end)
    this.getInventoryApiData()
  }

  getInventoryApiData() {
    let qp = 'beginDate=' + this.beginDate + '&endDate=' + this.endDate
    if (this.clientId.value) {
      qp = 'beginDate=' + this.beginDate + '&endDate=' + this.endDate + '&customerId=' + this.clientId.value
    }
    this.inventoryEndpoint.getClientInventorySelfPurchaseDatas(qp).subscribe((res) => {
      console.log(res)
      this.datas = res
    })
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.inventoryEndpoint.deleteSelfBuy(data).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete Successfully!')
      this.getInventoryApiData()
    })
  }

  addNew() {
    this.dialog
      .open(InventoryClientPurchaseCreateDialogComponent, {
        width: '1050px',
        height: '80%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getInventoryApiData()
      })
  }
}
