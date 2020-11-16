export class LogisticInvoiceExcelExportMapping {
  newRow: any
  newDataTable = []

  constructor() {}

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    if (data && data.length) {
      for (const item of data) {
        const newData = this.excelExportNames()
        newData['Invoice Id'] = item.InvoiceId
        newData['Invoice No'] = item.InvoiceNo
        newData['User Name'] = item.UserName
        newData['Created At'] = this.handleDate(item.CreateAt)
        const type =
          (item.WholeSaleInvoiceInfo && 'Wholesale unpaid freight') ||
          (item.SelfGoodsDetail && 'Customers buy') ||
          (item.LostEventInfo && 'Local sales or loss reporting') ||
          (item.FreightDetail && 'Air to sea transport') ||
          ''
        newData['Type'] = type
        let strInfo = ''
        switch (type) {
          case 'Wholesale unpaid freight':
            const wsii = item.WholeSaleInvoiceInfo
            newData['Customer Code'] = wsii.CustomerCode
            newData['Customer Name'] = wsii.CustomerName
            strInfo +=
              'Status: ' +
              wsii.Status +
              '\n' +
              'Total Price: ' +
              wsii.TotalPrice +
              ' (' +
              (wsii.InclGst ? '' : '不 ') +
              '包含GST)' +
              '\n' +
              'Comment: ' +
              (wsii.WholeSaleOrderComment || '') +
              '\n\n' +
              'Product Details: ' +
              '\n'
            if (wsii.WholeSaleInvoiceDetails && wsii.WholeSaleInvoiceDetails.length) {
              wsii.WholeSaleInvoiceDetails.map((row) => {
                strInfo += row.ProductName + ' Quantity: ' + row.Quantity + ' (' + (row.InclFreight ? '' : 'No ') + 'Include Freight)' + '\n'
              })
            }
            newData['Invoice Info'] = strInfo
            break
          case 'Customers buy':
            const cb = item.SelfGoodsDetail
            newData['Customer Code'] = cb.CustomerCode
            newData['Customer Name'] = cb.CustomerName
            strInfo +=
              'Product Code: ' +
              cb.BaseProductCode +
              '\n' +
              'Product Name: ' +
              cb.BaseProductName +
              '\n' +
              'Quantity: ' +
              cb.Quantity +
              '\n' +
              'Comment: ' +
              (cb.Comment || '') +
              '\n'
            newData['Invoice Info'] = strInfo
            break
          case 'Local sales or loss reporting':
            const ls = item.LostEventInfo
            newData['Customer Code'] = ls.CustomerCode
            newData['Customer Name'] = ls.CustomerName
            strInfo += 'Lost Type: ' + ls.LostType + '\n' + 'Comment: ' + (ls.Comment || '') + '\n\n' + 'Product Details: ' + '\n'
            if (ls.LostEventDetails && ls.LostEventDetails.length) {
              ls.LostEventDetails.map((row) => {
                strInfo += row.BaseProductName + ' Quantity: ' + row.Qty + '\n'
              })
            }
            newData['Invoice Info'] = strInfo
            break
          case 'Air to sea transport':
            const fd = item.FreightDetail
            newData['Customer Code'] = fd.CustomerCode
            newData['Customer Name'] = fd.CustomerName
            strInfo +=
              'Product Code: ' +
              fd.BaseProductCode +
              '\n' +
              'Product Name: ' +
              fd.BaseProductName +
              '\n' +
              'Quantity/Per package: ' +
              fd.QuantityPerPackage +
              '\n' +
              'Quantity of package: ' +
              fd.QuantityPackage +
              '\n' +
              'Unit Weight: ' +
              fd.GrossWeightOfUnit +
              '\n' +
              'Weight: ' +
              fd.GrossWeight +
              '\n' +
              'Net Weight: ' +
              fd.NetWeight +
              '\n' +
              'Place of Origin: ' +
              (fd.PlaceOfOriginName || '') +
              '\n'
            newData['Invoice Info'] = strInfo
            break
          default:
            break
        }
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
      'Invoice Id': null,
      'Invoice No': null,
      'User Name': null,
      'Customer Code': null,
      'Customer Name': null,
      Type: null,
      'Created At': null,
      'Invoice Info': null,
    }
  }
}
