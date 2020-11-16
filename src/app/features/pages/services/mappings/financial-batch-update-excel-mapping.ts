export class FinancialBatchUpdateExcelMapping {
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
      orderNo: '',
    }
    Object.keys(row).forEach((column) => {
      this.columnMapper(row, column)
    })
    this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '订单号') {
      this.newRow['orderNo'] = row[column].toString()
      return
    }
    if (column === '价格') {
      this.newRow['orderPrice'] = row[column]
      return
    }
    if (column === '备注') {
      this.newRow['comment3'] = row[column].toString()
      return
    }
    return
  }
}

interface InterfaceRow {
  orderNo: string
  orderPrice?: number
  comment3?: string
}
