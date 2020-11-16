import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-warehouse-inventory-transfer',
  templateUrl: './warehouse-inventory-transfer.component.html',
  styleUrls: ['./warehouse-inventory-transfer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseInventoryTransferComponent implements OnInit {
  batchDatas = []
  tabSelected = new FormControl(0)
  orderTypeIsConfirm = null
  endDate: ''
  startDate: ''

  constructor(private warehouseEndpoint: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {}

  // 通知单
  getApiData() {
    this.batchDatas = []
    this.orderTypeIsConfirm = 0
    this.warehouseEndpoint._getWarehouseInventoryTransferNotices().subscribe((res) => {
      this.prepTableData(res)
    })
  }

  // 确认单
  getApiData2() {
    this.batchDatas = []
    this.orderTypeIsConfirm = 1
    this.warehouseEndpoint._getWarehouseInventoryTransferConfirms().subscribe((res) => {
      this.prepTableData(res)
    })
  }

  prepTableData(datas) {
    if (datas.length) {
      this.batchDatas.push.apply(this.batchDatas, datas)
    } else {
      this.sweetAlertService.showSuccessMessage('现在没有 转移单')
    }
    console.log(this.batchDatas)
  }

  confirmTransfer(data) {
    console.log(data)
    this.updateApi(data.OrderId)
  }

  updateApi(id) {
    this.warehouseEndpoint._updateWarehouseInventoryTransfersAsRead(id).subscribe((res) => {
      console.log(res), this.sweetAlertService.showSuccessMessage('确认完成')
      if (this.orderTypeIsConfirm == 0) this.getApiData()
      else if (this.orderTypeIsConfirm == 1) this.getApiData2()
    })
  }
}
