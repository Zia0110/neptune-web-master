import { Product } from './../../../../shared/common-components/search-selection/product'
export class NewTransportationExcelMapping {
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
      Product: '',
      Customer: '',
      ProductExp: null,
      QuantityOfProduct: 0,
    }
    Object.keys(row).forEach((column) => {
      this.columnMapper(row, column)
    })
    if (this.newRow.Product != '' || this.newRow.Customer != '' || this.newRow.QuantityOfProduct != 0 || this.newRow.ProductExp != null)
      this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '物品名称') {
      this.newRow['Product'] = row[column].toString()
      return
    }
    if (column === '总箱数') {
      this.newRow['QuantityPackage'] = row[column]
      return
    }
    if (column === '包装(商品数量/箱)') {
      this.newRow['QuantityPerPackage'] = row[column]
      return
    }
    if (column === '商品数量/罐') {
      this.newRow['QuantityOfProduct'] = row[column]
      return
    }
    if (column === '客户') {
      this.newRow['Customer'] = row[column].toString()
      return
    }
    if (column === '批次号') {
      const dateStr = row[column].toString()
      let f = new Date(dateStr.substring(0, 4), dateStr.substring(4, 6), dateStr.substring(6, 8))
      this.newRow['ProductExp'] = f
      return
    }
    if (column === '单位毛重KG') {
      this.newRow['GrossWeightOfUnit'] = row[column]
      return
    }
    if (column === '总毛重KG') {
      this.newRow['GrossWeight'] = row[column]
      return
    }
    if (column === '规格') {
      this.newRow['NetWeight'] = row[column]
      return
    }
    return
  }
}

interface InterfaceRow {
  Product: string
  Customer: string
  ProductExp?: Date
  GrossWeight?: number
  GrossWeightOfUnit?: number
  NetWeight?: number
  QuantityOfProduct: number
  QuantityPackage?: number
  QuantityPerPackage?: number
  ProductCode?: string
  BaseProductId?: number
  CustomerCode?: string
  CustomerId?: number
  CustomerName?: number
}
