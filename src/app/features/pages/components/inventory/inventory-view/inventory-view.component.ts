import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.css'],
})
export class InventoryViewComponent implements OnInit {
  // 是否展示map
  isShowMap = true
  // 各城市data
  wuhanData: any
  shanghaiData: any
  shanghai2Data: any
  guangzhouData: any
  hkData: any
  auData: any
  au2Data: any
  chongqingData: any
  aklData: any
  // 所有数据
  data: any
  // FormControl
  customerFromControl = new FormControl('')
  productFromControl = new FormControl('')

  constructor(private inventoryEndpoint: InventoryEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    // this.customerFromControl.setValue(446)
    // this.productFromControl.setValue(2)
    // this.getData()
  }

  reset() {
    this.data = ''
    this.wuhanData = ''
    this.shanghaiData = ''
    this.shanghai2Data = ''
    this.guangzhouData = ''
    this.hkData = ''
    this.auData = ''
    this.au2Data = ''
    this.chongqingData = ''
    this.aklData = ''
    this.isShowMap = false
  }

  getData() {
    if (!this.customerFromControl.value || !this.productFromControl.value || !this.productFromControl.valid || !this.customerFromControl.valid) {
      this.sweetAlertService.showSweetAlert('Please select customers and products before searching！')
      return
    }
    // 重设
    this.reset()
    // 请求api
    this.inventoryEndpoint
      .GetCustomerStocks(this.customerFromControl.value, this.productFromControl.value)
      .toPromise()
      .then((res: any) => {
        this.data = res
        res.WarehouseStocks.map((warehouseData: any) => {
          this.sweetAlertService.successAlert('Data extraction succeeded！')
          switch (warehouseData.WarehouseName) {
            case '新西兰FLYWAY仓':
              this.aklData = warehouseData
              break
            case '澳洲DPS仓':
              this.auData = warehouseData
              break
            case '澳洲KIM AN仓':
              this.au2Data = warehouseData
              break
            case '武汉汇海源仓':
              this.wuhanData = warehouseData
              break
            case '上海心嘉仓':
              this.shanghaiData = warehouseData
              break
            case '上海汇海源仓':
              this.shanghai2Data = warehouseData
              break
            case '中创':
              this.guangzhouData = warehouseData
              break
            case '香港建耀婴儿仓':
              this.hkData = warehouseData
              break
            case '重庆慧眼购仓':
              this.chongqingData = warehouseData
              break
          }
        })
        if (!res.InprocessRetailOrder && !res.TransportStocks.length && !res.WarehouseStocks.length) {
          this.sweetAlertService.successAlert('No Data！')
        }
        this.isShowMap = true
      })
  }
}
