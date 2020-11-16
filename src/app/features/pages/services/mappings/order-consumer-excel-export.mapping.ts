import * as moment from 'moment'
import { AppConfigStore } from '../../../../core/services/app-config.store'

export class OrderConsumerExcelExportMapping {
  newRow: any
  newDataTable = []
  _stockCustomerMappings: any
  _currency: any
  _project: any

  constructor(private appConfigStore) {
    this._stockCustomerMappings = appConfigStore.appSettings.Mapping.StockCustomerMappings
    this._currency = appConfigStore.configOrderMapping.Currency
    this._project = appConfigStore.configOrderMapping.Project
  }

  currencyIdMap(data) {
    const ret = this._currency.find((e) => e.CurrencyId == data)
    return ret ? ret.CurrencyName : null
  }

  projectIdMap(data) {
    const ret = this._project.find((e) => e.ProjectId == data)
    return ret ? ret.ProjectName : null
  }

  stockCustomerMap(data) {
    const ret = this._stockCustomerMappings.find((e) => e.CustomerId == data)
    return ret ? ret.StockCustomerInfo : null
  }

  mapping(data) {
    console.log(data)
    this.newDataTable = []
    // let newData = this.excelExportNames()
    if (data && data.length) {
      for (let x of data) {
        let newData = this.excelExportNames()

        newData.订单号 = x.OrderNo
        newData.订单Reference = x.Reference
        newData.Cin7InvoiceNo = x.Cin7InvoiceNo
        newData.寄件人 = x.Sender
        newData.寄件人电话 = x.SenderPhone
        newData.寄件人地址 = x.SenderAddr
        newData.收件人 = x.Recipient
        newData.收件人电话 = x.RecipientPhone
        newData.收件人地址 = x.RecipientAddr
        newData.收件证照号 = x.RecipientIDNo
        newData.品名备注 = x.ProductString
        newData.品名代码 = x.ProductCode
        newData.品名中文 = x.ProductName
        newData.Repository_Note = x.DispatchComment
        newData.录入日期 = x.EnterDate.substring(0, 10)

        newData.财务日期 = x.BillingDate.substring(0, 10)
        newData.财务备注 = x.Comment3
        newData.客户名称 = x.CustomerString
        newData.纽币金额 = x.Nzd
        newData.支付方式 = this.currencyIdMap(x.CurrencyId)
        newData.库存客户 = x.StockCustomerId == -1 ? x.StockCustomerInfo : this.stockCustomerMap(x.StockCustomerId)
        newData.Cin7InterCode = x.Cin7InterCode
        newData.备注 = x.Comment1
        newData.特殊情况 = x.Comment2
        newData.订单状态 = x.StatusName
        newData.Project_Name = this.projectIdMap(x.ProjectId)
        if (x.OrderPrice) newData.订单金额 = x.OrderPrice

        this.newDataTable.push(newData)
      }
    } else {
      let newData = this.excelExportNames()
      this.newDataTable.push(newData)
    }
    return this.newDataTable
  }

  excelExportNames() {
    let columns = {
      订单号: null,
      订单Reference: null,
      Cin7InvoiceNo: null,
      Cin7InterCode: null,
      寄件人: null,
      寄件人电话: null,
      寄件人地址: null,
      收件人: null,
      收件人电话: null,
      收件人地址: null,
      收件证照号: null,
      品名备注: null,
      品名代码: null,
      品名中文: null,
      Repository_Note: null,
      录入日期: null,
      财务日期: null,
      财务备注: null,
      客户名称: null,
      纽币金额: null,
      支付方式: null,
      库存客户: null,
      订单状态: null,
      特殊情况: null,
      备注: null,
      Project_Name: null,
      订单金额: null,
    }
    return columns
  }
}
