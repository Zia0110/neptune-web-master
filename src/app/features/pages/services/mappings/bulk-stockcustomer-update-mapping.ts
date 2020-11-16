export class BulkStockCustomerUpdateMapping {
  newRow: InterfaceRow
  newDataTable = []

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    for (const i of data) {
      this.rowMapper(i)
    }
    return this.newDataTable
  }

  rowMapper(row) {
    this.newRow = {
      OrderNo: '',
      StockCustomerCode: '',
    }
    Object.keys(row).forEach((column) => {
      this.columnMapper(row, column)
    })
    if (this.newRow.OrderNo != '' && this.newRow.StockCustomerCode != '') this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '订单号') {
      this.newRow['OrderNo'] = row[column].toString()
      return
    }
    if (column === '库存客户') {
      this.newRow['StockCustomerCode'] = row[column]
      return
    }
    return
  }
}

interface InterfaceRow {
  OrderNo: string
  StockCustomerCode: string
}
