import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import * as moment from 'moment'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { WarehouseInventoryTransferExportMapping } from '../../../services/mappings/warehouse-inventory-transfer-export.mapping'

@Component({
  selector: 'app-warehouse-inventory-transfer-notice',
  templateUrl: './warehouse-inventory-transfer-notice.component.html',
  styleUrls: ['./warehouse-inventory-transfer-notice.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WarehouseInventoryTransferNoticeComponent implements OnInit {
  tableData: any
  startDate = moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD')
  endDate = moment(new Date()).format('YYYY-MM-DD')

  selected = new FormControl(0)

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild('excelExporter') excelExporter

  excelExportMapping: any
  excelExportValue: any

  constructor(private appConfigStore: AppConfigStore, private warehouseEndpoint: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {
    this.getApiData()
    this.excelExportMapping = new WarehouseInventoryTransferExportMapping(this.appConfigStore)
  }

  dateRangePickerOutput($event) {
    console.log($event)
    this.startDate = this.getUTCdate($event.begin)
    this.endDate = this.getUTCdate($event.end)
    this.getApiData()
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  getApiData() {
    const qp = 'beginDate=' + this.startDate + '&endDate=' + this.endDate
    this.warehouseEndpoint._getWarehouseInventoryTransferNotification(qp).subscribe((res) => {
      console.log(res)
      if (!res['length']) {
        this.sweetAlertService.showSweetAlert('No data!')
      } else {
        this.prepData(res)
      }
    })
  }

  prepData(datas) {
    const group = datas.reduce((res, obj) => {
      res[obj.WarehouseName] = [...(res[obj.WarehouseName] || []), obj]
      return res
    }, {})

    // console.log(group)
    this.tableData = group
    console.log(this.tableData)
  }

  exportToExcel(data) {
    console.log(data)
    // let data = this.tableData
    const dataExport = this.excelExportMapping.mapping(data)
    this.excelExportValue = dataExport

    setTimeout(() => {
      this.excelExporter.exportAsXLSX('库转通知单 - ' + data[0].WarehouseName + '仓')
    }, 400)
  }

  removeTab(key) {
    // this.tableData.splice(index, 1)
    delete this.tableData[key]
  }
  async updateRow(key, table) {
    const saveAlert = await this.sweetAlertService.saveAlert('Do you want to clear this notice?')
    if (!saveAlert.value) {
      return
    }
    const param = this.formatPara(table)
    this.warehouseEndpoint._updateWarehouseInventoryTransferNotification(param).subscribe((res) => {
      this.removeTab(key)
    })

    console.log(table)
  }
  private formatPara(table) {
    let para = { transferNotifIds: [], wholeSaleNotifIds: [] }
    table.forEach((element) => {
      if (element.WholeSaleNotifId) para.wholeSaleNotifIds.push(element.WholeSaleNotifId)
      else if (element.TransferNotifId) para.transferNotifIds.push(element.TransferNotifId)
    })
    return para
  }
}
