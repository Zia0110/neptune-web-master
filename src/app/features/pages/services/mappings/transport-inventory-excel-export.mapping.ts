export class TransportInventoryExcelExportMapping {
  newRow: any
  newDataTable = []

  constructor() {}

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    data.RealTimeStock.map((e) => {
      const newData = this.excelExportNames()
      newData['Transport No'] = data.data.TransportNo
      newData['Departure Date'] = this.handleDate(data.data.DepartureTime)
      newData['Comment'] = data.data.Comment
      newData['Warehouse'] = data.data.WarehouseName
      newData['Customer Code'] = e.CustomerCode
      newData['Product Code'] = e.ProductCode
      newData['Product Name'] = e.ProductName
      newData['Quantity'] = e.Quantity
      this.newDataTable.push(newData)
    })
    return this.newDataTable
  }

  private handleDate(date): string {
    const a_date = new Date(date)
    const mnth = ('0' + (a_date.getMonth() + 1)).slice(-2)
    const day = ('0' + a_date.getDate()).slice(-2)
    return [a_date.getFullYear(), mnth, day].join('-')
  }

  excelExportNames() {
    return {
      'Transport No': null,
      Warehouse: null,
      'Departure Date': null,
      Comment: null,
      'Customer Code': null,
      'Product Code': null,
      'Product Name': null,
      Quantity: 0,
    }
  }
}
