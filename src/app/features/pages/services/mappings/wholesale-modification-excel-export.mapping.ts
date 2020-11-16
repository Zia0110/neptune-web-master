export class WholesaleModificationExcelExportMapping {
  newRow: any
  newDataTable = []

  constructor() {}

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    if (data && data.length) {
      for (const item of data) {
        const newData = this.excelExportNames()
        newData['Order Id'] = item.OrderId
        newData['Comment'] = item.Comment
        newData['Customer Code'] = item.CustomerCode
        newData['Customer Name'] = item.CustomerName
        newData['Include Gst'] = item.InclGst ? 'Yes' : 'No'
        newData['Is To Customer Inventory'] = item.IsStockCustomerSale ? 'Yes' : 'No'
        newData['Created At'] = this.handleDate(item.CreatedAt)
        newData['Paid At'] = this.handleDate(item.PaidAt)
        let strInfo = ''
        const conf = item.Configures
        if (conf && conf.length) {
          conf.map((row) => {
            strInfo += row.WarehouseName + ' ' + row.ProductName + ' Quantity: ' + row.Quantity + ' Confirmed Quantity: ' + row.ConfirmedQty + '\n'
          })
        }
        newData['Configures'] = strInfo
        this.newDataTable.push(newData)
      }
    } else {
      const newData = this.excelExportNames()
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  handleDate(data): string {
    const date = new Date(new Date(data.replace('T', ' ') + ' UTC'))
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  excelExportNames() {
    return {
      'Order Id': null,
      Comment: null,
      'Customer Code': null,
      'Customer Name': null,
      'Include Gst': null,
      'Is To Customer Inventory': null,
      'Created At': null,
      'Paid At': null,
      Configures: null,
    }
  }
}
