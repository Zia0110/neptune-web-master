export class TrackingInfoBatchUpdateExcelMapping {
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
      trackingNo: '',
      trackingComments: '',
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
    if (column === '物流单号') {
      this.newRow['trackingNo'] = row[column]
      return
    }
    if (column === '备注') {
      this.newRow['trackingComments'] = row[column].toString()
      return
    }
    return
  }
}

interface InterfaceRow {
  orderNo: string
  trackingNo: string
  trackingComments: string
}
