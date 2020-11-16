import * as moment from 'moment'

export class ProductPriceExcelMapping {
  newRow: IproductPriceListRow
  newDataTable = []

  mapping(data) {
    // console.log(data.slice(2))
    // 从第4行开始取数据
    for (const i of data) {
      this.rowMapper(i)
    }
    // console.log(this.newDataTable)
    return this.newDataTable
  }

  rowMapper(row) {
    this.newRow = {
      name: null,
      productCode: null,
      SVIP: null,
      DG: null,
      VIP: null,
      Retail: null,
      unknown: null,
      productEffectiveDate: null,
      productExp: null,
      cinCode: null,
    }
    for (let column in row) {
      this.columnMapper(row, column)
    }
    this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '产品名称') {
      this.newRow['name'] = row[column].toString()
      return
    }
    if (column === 'Product Code') {
      this.newRow['productCode'] = row[column].toString()
      return
    }
    if (column === '零售') {
      this.newRow['Retail'] = row[column] === '停卖' ? 0 : row[column]
      return
    }
    if (column === 'DG') {
      this.newRow['DG'] = row[column] === '停卖' ? 0 : row[column]
      return
    }
    if (column === 'VIP') {
      this.newRow['VIP'] = row[column] === '停卖' ? 0 : row[column]
      return
    }
    if (column === 'SVIP') {
      this.newRow['SVIP'] = row[column] === '停卖' ? 0 : row[column]
      return
    }
    if (column === 'WFTB') {
      this.newRow['unknown'] = row[column] === '停卖' ? 0 : row[column]
      return
    }
    if (column === '有效期') {
      // this.newRow['productEffectiveDate'] = this.excelDateConvertor(row[column])
      this.newRow['productEffectiveDate'] = row[column]
      return
    }
    if (column === '过期日期') {
      // this.newRow['productEffectiveDate'] = this.excelDateConvertor(row[column])
      this.newRow['productExp'] = row[column]
      return
    }
    if (column === 'Cin Code') {
      this.newRow['cinCode'] = row[column]
      return
    }
    return
  }
  excelDateConvertor(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000)
    const formatDate = moment(date).utcOffset(720).format().substr(0, 10)
    return formatDate
  }
}

export interface IproductPriceListRow {
  name: string
  productCode: string
  SVIP: number
  DG: number
  VIP: number
  Retail: number
  unknown: number
  productEffectiveDate: string
  productExp: string
  cinCode: string
}
