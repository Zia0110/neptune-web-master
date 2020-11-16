import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
// import { MatStepper } from '@angular/material/stepper'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-consumer-orders-paper',
  templateUrl: './consumer-orders-paper.component.html',
  styleUrls: ['./consumer-orders-paper.component.css'],
})
export class ConsumerOrdersPaperComponent implements OnInit {
  etaDate: any
  warehouse: any
  warehouseList = []
  inputSearchData = []
  orderNumInput = new FormControl()

  displayData: any
  normalData: any
  abnormalData: any
  isLinear = false

  // @ViewChild('stepper') private stepper: MatStepper
  filteredValue: null

  constructor(
    public dialog: MatDialog,
    private warehouseEndpoint: WarehouseEndpoint,
    private sweetAlert: SweetAlertService // private matStepper: MatStepper
  ) {}

  ngOnInit() {
    // this.apiGetData(this.data)
    this.getWarehousesApi()
  }

  searchByInput() {
    if (!this.orderNumInput.value) return
    this.resetDatas()
    let x = [this.orderNumInput.value]
    console.log(x)
    this.apiGetData(x)
  }

  txtOutput(ss) {
    this.resetDatas()
    console.log(ss)
    this.apiGetData(ss)
  }

  apiGetData(data) {
    this.warehouseEndpoint._getRetailOrderPaperExpress(data).subscribe((res) => {
      console.log(res), this.prepData(res)
    })
  }

  prepData(res) {
    this.prepNormalData(res.RetailOrderPaperExpressNormalModels)
    this.prepAbnormalData(res.RetailOrderPaperExpressAbNormalModels)
  }

  prepNormalData(data) {
    this.normalData = data
  }

  prepAbnormalData(datas) {
    let newDatas = []
    for (let data of datas) {
      let a = {}
      if (data.RetailOrderDetailInfo) {
        a = data.RetailOrderDetailInfo
      }
      a['error'] = data.Error
      newDatas.push(a)
    }
    this.abnormalData = newDatas
    console.log(this.abnormalData)
  }

  passFilteredValue($event) {
    this.filteredValue = $event
  }

  save() {
    // console.log(this.etaDate)
    // console.log(this.warehouse)
    if (!this.warehouse || !this.etaDate || !this.normalData.length) {
      console.warn('error')
      this.sweetAlert.showSweetAlert(`不能保存，请检查输入数据!`)
      return
    }
    let normalDataOrderNum = []
    for (let data of this.normalData) {
      normalDataOrderNum.push(data.OrderNo)
    }

    let updateData = {
      warehouseId: this.warehouse,
      estimatedArrivalDate: this.etaDate,
      orderNos: normalDataOrderNum,
    }
    console.log(updateData)
    this.updatePaperOrders(updateData)
  }

  updatePaperOrders(data) {
    this.warehouseEndpoint.updateRetailOrderPaperExpress(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('纸单 成功发出'), this.resetDatas()
    })
  }

  resetDatas() {
    this.normalData = []
    this.abnormalData = []
  }

  // Output
  getEtaDate(event) {
    this.etaDate = event
  }

  // Output
  getWarehouse(event) {
    this.warehouse = event
  }

  getWarehousesApi() {
    this.warehouseEndpoint._getWarehousesList().subscribe((res) => {
      console.log(res), this.setWarehouses(res)
    })
  }

  setWarehouses(datas) {
    for (let data of datas) {
      this.warehouseList.push({ view: data['WarehouseName'], value: data['WarehouseId'] })
    }
  }
}
