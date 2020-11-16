export class SpecialPriceUploadMapping {
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
      CustomerCode: '',
      ProductCode: '',
      Price: null,
      EffectiveDate: '',
      ExpiryDate: '',
    }
    Object.keys(row).forEach((column) => {
      this.columnMapper(row, column)
    })
    this.newDataTable.push(this.newRow)
  }

  columnMapper(row, column) {
    if (column === '客户') {
      this.newRow['CustomerCode'] = row[column].toString()
      return
    }
    if (column === '产品') {
      this.newRow['ProductCode'] = row[column].toString()
      return
    }
    if (column === '价格') {
      this.newRow['Price'] = row[column]
      return
    }
    if (column === '生效日期') {
      const rw = row[column]
      if (rw.toString().includes('-')) {
        this.newRow['EffectiveDate'] = rw.toString()
      } else {
        const temDate = this.ExcelDateToJSDate(rw)
        const yy = temDate.getFullYear()
        const mm = temDate.getMonth() + 1
        const dd = temDate.getDate()
        this.newRow['EffectiveDate'] = yy + '-' + mm + '-' + dd
      }
      return
    }
    if (column === '过期日期') {
      const rw = row[column]
      if (rw.toString().includes('-')) {
        this.newRow['ExpiryDate'] = rw.toString()
      } else {
        const temDate = this.ExcelDateToJSDate(rw)
        const yy = temDate.getFullYear()
        const mm = temDate.getMonth() + 1
        const dd = temDate.getDate()
        this.newRow['ExpiryDate'] = yy + '-' + mm + '-' + dd
      }
      return
    }
    return
  }

  ExcelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    const fractional_day = serial - Math.floor(serial) + 0.0000001
    let total_seconds = Math.floor(86400 * fractional_day)
    const seconds = total_seconds % 60
    total_seconds -= seconds
    const hours = Math.floor(total_seconds / (60 * 60))
    const minutes = Math.floor(total_seconds / 60) % 60
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)
  }
}

interface InterfaceRow {
  CustomerCode: string
  ProductCode: string
  Price: number
  EffectiveDate: string
  ExpiryDate: string
}
