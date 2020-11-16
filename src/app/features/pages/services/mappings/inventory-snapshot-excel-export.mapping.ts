export class InventorySnapshotExcelExportMapping {
  newRow: any
  newDataTable = []

  constructor() {}

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    if (data && data.length) {
      for (const x of data) {
        const newData = this.excelExportNames()
        newData['Product Code'] = x.ProductCode
        newData['Product Name'] = x.ProductName
        newData['Warehouse'] = x.WarehouseName
        newData.Quantity = x.Quantity
        this.newDataTable.push(newData)
      }
    } else {
      const newData = this.excelExportNames()
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  excelExportNames() {
    const columns = {
      'Product Code': null,
      'Product Name': null,
      Warehouse: null,
      Quantity: null,
    }
    return columns
  }
}
