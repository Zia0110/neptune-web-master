import * as moment from 'moment'

export class Cin7ExcelMapping {
  newRow: any
  newDataTable = []

  mapping(data) {
    console.log(data)
    for (const i of data.RetailOrderGroupBys.slice(0)) {
      this.rowMapper(i)
    }
    return this.newDataTable
  }

  rowMapper(row) {
    this.newRow = {
      orderNo: '',
      productName: '',
      productCode: '',
      customer: '',
      warehouse: '',
      comment: '',
      batch: '',
      date: '',
    }
    for (const column of row) {
      this.columnMapper(row, column)
    }
    this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '订单号') {
      this.newRow['orderNo'] = row[column].toString()
      return
    }
    if (column === '品名') {
      this.newRow['productName'] = row[column].toString()
      return
    }
    if (column === '品名简称') {
      this.newRow['productCode'] = row[column].toString()
      return
    }
    if (column === '客户') {
      this.newRow['customer'] = row[column].toString()
      return
    }
    if (column === '仓库') {
      this.newRow['warehouse'] = row[column].toString()
      return
    }
    if (column === '备注') {
      this.newRow['comment'] = row[column].toString()
      return
    }
    if (column === '批次') {
      this.newRow['batch'] = row[column].toString()
      return
    }
    if (column === '日期') {
      this.newRow['date'] = row[column].toString()
      return
    }
    return
  }

  excelDateConvertor(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000)
    return moment(date).utcOffset(720).format().substr(0, 10)
  }
}
