// This mappping service returns (newNormalDataTable, newAbnormalDataTable, dropedRowCounter)
export class OrderConsumerExcelMapping {
  newRow: NewRow
  newNormalDataTable = []
  newAbnormalDataTable = []
  dropedRowCounter = 0
  _stockCustomerMappings: any[]
  _currency: any[]
  _project: any[]
  constructor(appConfigStore) {
    this._stockCustomerMappings = appConfigStore.appSettings.Mapping.StockCustomerMappings
    this._currency = appConfigStore.configOrderMapping.Currency
    this._project = appConfigStore.configOrderMapping.Project
    console.log(this._stockCustomerMappings)
  }
  init() {
    this.newNormalDataTable = []
    this.newAbnormalDataTable = []
    this.dropedRowCounter = 0
  }
  // for the conversion of the very werid excel date
  excelDateConvertor(excelDate) {
    return new Date((excelDate - (25567 + 2)) * 86400 * 1000)
  }

  // map by each row
  mapData(dataList): object {
    this.init()
    for (let row of dataList) {
      let newob = this.rowMapper(row)
    }
    return {
      newNormalDataTable: this.newNormalDataTable,
      newAbnormalDataTable: this.newAbnormalDataTable,
      dropedRowCounter: this.dropedRowCounter,
    }
  }

  private mapingProjectToId(name) {
    const ret = this._project.find((e) => e.ProjectName == name)
    return ret ? ret.ProjectId : -1
  }

  private mapingCurrencyToId(name) {
    const ret = this._currency.find((e) => e.CurrencyName == name)
    return ret ? ret.CurrencyId : -1
  }

  private mapingStockCustermToId(name) {
    name = name.replace(/\s/g, '')
    name = name.toUpperCase()
    const ret = this._stockCustomerMappings.find((e) => e.StockCustomerInfo.trim() == name)
    return ret ? ret.CustomerId : -1
  }

  rowMapper(row) {
    this.newRow = {
      OrderNo: null,
      Sender: null,
      SenderPhone: null,
      SenderAddr: null,
      Recipient: null,
      RecipientPhone: null,
      RecipientAddr: null,
      RecipientIDNo: null,
      ProductCode: null,
      ProductString: null,
      EnterDate: null,
      BillingDate: null,
      CustomerString: null,
      Nzd: null,
      // currencyId: '',
      Comment1: null,
      // projectId: '',
      Comment2: null,
      Comment3: null,
      StockCustomerInfo: null,
      StockCustomerId: null,
      error: null,
    }

    for (let column in row) {
      this.columnMapper(row, column)
    }

    this.rowValidation(this.newRow)
  }

  rowValidation(row): boolean {
    // If orderNo & productString is null, we will drop this row
    if (!row.OrderNo && !row.ProductString) {
      this.dropedRowCounter += 1
      return
    }
    // If any orderNo & productString & recipient & customerString this row will be an error array
    if (this.getError(this.newRow)) {
      this.newAbnormalDataTable.push(this.newRow)
      return
    }
    // else all good
    else {
      this.newNormalDataTable.push(this.newRow)
    }
  }

  getError(row) {
    let error = ''
    if (!row.OrderNo) error = error + ' 无订单号  '
    if (!row.ProductString) error = error + ' 无产品描述  '
    if (!row.Recipient) error = error + ' 无收件人'
    if (!row.CustomerString) error = error + ' 无客户信息  '
    if (row.StockCustomerId == -1 || !row.StockCustomerId) error = error + ' 无库存客户信息 '
    // if (!row.ProjectId) error = error + ' Project非法  '
    if (row.CurrencyId == -1) error = error + '支付方式非法  '
    if (!row.EnterDate) error = error + ' 无输入日期'
    if (!row.BillingDate) error = error + '无财务日期 '
    if (error) {
      row.error = error
      return true
    }
    return false
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  columnMapper(row, column) {
    if (column == '订单号') {
      this.newRow['OrderNo'] = row[column].toString()
      return
    }
    if (column == '寄件人') {
      this.newRow['Sender'] = row[column]
      return
    }
    if (column == '寄件人电话') {
      this.newRow['SenderPhone'] = row[column].toString()
      return
      ''
    }
    if (column == '寄件人地址') {
      this.newRow['SenderAddr'] = row[column]
      return
    }
    if (column == '收件人') {
      this.newRow['Recipient'] = row[column]
      return
    }
    if (column == '收件人电话') {
      this.newRow['RecipientPhone'] = row[column].toString()
      return
    }
    if (column == '收件人地址') {
      this.newRow['RecipientAddr'] = row[column]
      return
    }
    if (column == '收件证照号') {
      this.newRow['RecipientIDNo'] = row[column].toString()
      return
    }
    if (column.includes('品名') && column.includes('备注')) {
      this.newRow['ProductString'] = row[column]
      return
    }
    if (column.includes('品名代码')) {
      this.newRow['ProductCode'] = row[column]
      return
    }
    if (column.includes('录入日期')) {
      if (typeof row[column] == 'string') this.newRow['EnterDate'] = row[column]
      else this.newRow['EnterDate'] = this.getUTCdate(this.excelDateConvertor(row[column]))
      return
    }
    if (column.includes('财务日期')) {
      if (typeof row[column] == 'string') this.newRow['BillingDate'] = row[column]
      else this.newRow['BillingDate'] = this.getUTCdate(this.excelDateConvertor(row[column]))
      return
    }
    if (column == '客户名称') {
      this.newRow['CustomerString'] = row[column]
      return
    }
    if (column.includes('纽币金额')) {
      this.newRow['Nzd'] = row[column]
      return
    }
    if (column.includes('支付方式') && row[column] && row[column] !== '') {
      // if (row[column] == "纽币") {
      //     this.newRow['currencyId'] = 1
      // }
      // if (row[column] == "人民币") {
      //     this.newRow['currencyId'] = 2
      // }
      // else {
      //     this.newRow['currencyId'] = null
      // }
      this.newRow['CurrencyId'] = this.mapingCurrencyToId(row[column])
      return
    }

    if (column == '备注') {
      this.newRow['Comment1'] = row[column].toString()
      return
    }
    if (column == 'Project Name' && row[column] && row[column] !== '') {
      // if (row[column] == "电子单") {
      //     this.newRow['projectId'] = 1
      //     return ;
      // }
      // if (row[column] == "纸单") {
      //     this.newRow['projectId'] = 2
      //     return ;
      // }
      // if (row[column] == "外卖单") {
      //     this.newRow['projectId'] = 3
      // }
      this.newRow['ProjectId'] = this.mapingProjectToId(row[column])
      return
    }
    if (column == '特殊情况') {
      this.newRow['Comment2'] = row[column].toString()
      return
    }
    if (column == '财务备注') {
      this.newRow['Comment3'] = row[column].toString()
      return
    }
    if (column == '库存客户') {
      this.newRow['StockCustomerInfo'] = row[column].toString()
      this.newRow['StockCustomerId'] = this.mapingStockCustermToId(row[column])
      return
    }
    // Add stock customer / if ( StockCustomerInfo == StockCustomerInfo ) { StockCustomerId == CustomerId } (See StockCustomerMappings)
    // this.newRow['stockCustomerId'] = 225
    return
  }
}

// 订单号 orderNo   非空
// 寄件人 sender
// 寄件人电话 senderPhone
// 寄件人地址 senderAddr
// 收件人  recipient 非空
// 收件人电话 recipientPhone
// 收件人地址 recipientAddr
// 收件证照号 recipientIDNo
// 备注（品名） productString 非空
// 滴单专用  不用
// 录入日期（格式Time） enterDate 必须日期
// 财务日期 billingDate  必须日期
// 客户名称 customerString  非空
// 纽币金额 nzd  数字
// 支付方式 currencyId 对应currency表逆翻译
// 备注  comment1
// Project Name  projectId 对应project表逆翻译
// 特殊情况  comment2

export interface NewRow {
  OrderNo: string
  Sender: string
  SenderPhone: string
  SenderAddr: string
  Recipient: string
  RecipientPhone: string
  RecipientAddr: string
  RecipientIDNo: string
  ProductString: string
  ProductCode: string
  EnterDate: any
  BillingDate: any
  CustomerString: string
  Nzd: string
  CurrencyId?: number
  Comment1: string
  ProjectId?: number
  Comment2: string
  Comment3: string
  StockCustomerInfo: string
  StockCustomerId: number
  error: string
}
