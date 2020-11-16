import * as moment from 'moment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

export class Cin7ExcelExportMapping {
  newRow: any
  newDataTable = []
  _stockCustomerMappings: any
  _currency: any
  _project: any

  constructor() {
    //   private appConfigStore
    // this._stockCustomerMappings = appConfigStore.appSettings.Mapping.StockCustomerMappings
    // this._currency = appConfigStore.configOrderMapping.Currency
    // this._project = appConfigStore.configOrderMapping.Project
  }

  //   currencyIdMap(data) {
  //     const ret = this._currency.find((e) => e.CurrencyId == data)
  //     return ret ? ret.CurrencyName : null
  //   }

  //   projectIdMap(data) {
  //     const ret = this._project.find((e) => e.ProjectId == data)
  //     return ret ? ret.ProjectName : null
  //   }

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    // let newData = this.excelExportNames()
    if (data && data.length) {
      for (let x of data) {
        let newData = this.excelExportNames()

        newData['Order Ref'] = x.Ref
        newData.Company = x.Company
        newData['Project Name'] = x.ProjectName
        newData['CIN 7 inter code'] = x.Cin7InterCode
        newData['Item Price'] = x.ItemPrice
        newData['Item Qty'] = x.ItemQty
        newData['Notes'] = x.Notes

        this.newDataTable.push(newData)
      }
    } else {
      let newData = this.excelExportNames()
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  excelExportNames() {
    let columns = {
      'Order Ref': null,
      Company: null,
      'Project Name': null,
      'CIN 7 inter code': null,
      Branch: 'Goods not sent',
      'Item Price': null,
      'Item Qty': null,
      Notes: null,
    }
    return columns
  }
}
