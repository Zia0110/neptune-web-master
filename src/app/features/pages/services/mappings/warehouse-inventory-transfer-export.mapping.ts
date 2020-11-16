import * as moment from 'moment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

export class WarehouseInventoryTransferExportMapping {
  newRow: any
  newDataTable = []
  _products: any

  constructor(private appConfigStore) {
    // this._stockCustomerMappings = appConfigStore.appSettings.Mapping.StockCustomerMappings
    // this._currency = appConfigStore.configOrderMapping.Currency
    this._products = appConfigStore.appSettings.ProductInfo.Products
  }

  productMap(data) {
    const ret = this._products.find((e) => e.ProductId == data)
    return ret ? ret.ProductName : null
  }

  mapping(datas) {
    this.newDataTable = []
    console.log(datas)
    // let newData = this.excelExportNames()
    if (datas) {
      // for (let data of datas) {
      for (let x of datas) {
        let newData = this.excelExportNames()

        newData['转货路径'] = '从 ' + x.FromCustomerCode + ' 转货到客户 ' + x.ToCustomerCode
        newData['简称'] = x.ProductCode
        newData['品种'] = this.productMap(x.ProductId)
        newData['数量'] = x.Quantity

        this.newDataTable.push(newData)
      }
      // }
    } else {
      let newData = this.excelExportNames()
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  excelExportNames() {
    let columns = {
      转货路径: null,
      简称: null,
      品种: null,
      数量: null,
    }
    return columns
  }
}
