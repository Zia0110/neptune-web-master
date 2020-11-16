import * as moment from 'moment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

export class ClientDetailSingleViewMapping {
  newRow: any
  newDataTable = []
  _stockCustomerMappings: any
  _currency: any
  _project: any

  constructor() {}

  mapping(data, displayedColumns) {
    // console.log(data)
    // let newData = this.excelExportNames()
    if (data && data.length) {
      for (let x of data) {
        let temData = this.excelExportNames(displayedColumns)
        let newData = {}
        for (let singleData of temData) {
          newData[singleData] = x[singleData]
        }
        // console.log(newData);
        this.newDataTable.push(newData)
      }
    } else {
      let newData = this.excelExportNames(displayedColumns)
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  excelExportNames(displayedColumns) {
    let columns: any[] = []
    for (let column of displayedColumns) {
      columns.push(column)
    }
    // console.log(columns)
    return columns
  }
}
