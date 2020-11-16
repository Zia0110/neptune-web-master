import { Component, OnInit, Input, OnChanges, Output } from '@angular/core'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import {
  FormFieldConfigInterface,
  FormSelectOptionInterface,
} from '../../../../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { EventEmitter } from 'events'
import { Observable } from 'rxjs'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'

@Component({
  selector: 'app-order-present',
  templateUrl: './order-present.component.html',
  styleUrls: ['./order-present.component.css'],
})
export class OrderPresentComponent implements OnInit, OnChanges {
  @Input() orderNo
  @Input() editMode
  @Output() loaded = new EventEmitter()

  orderID
  currency: FormSelectOptionInterface[] = []
  customerGroup: FormSelectOptionInterface[] = []
  project: FormSelectOptionInterface[] = []
  status: FormSelectOptionInterface[] = []
  // readOnly = true;
  formConfig: FormFieldConfigInterface[] = []
  constructor(private orderService: OrderEndpoint, private appConfigStore: AppConfigStore) {}

  ngOnInit(): void {
    // console.log(this.appConfigStore);
    this.getAppConfig(this.appConfigStore)
  }
  ngOnChanges() {
    if (this.orderNo != null) {
      console.log(this.editMode)
      if (!this.editMode) {
        this.getOrderByOrderNo(this.orderNo, !this.editMode)
      } else {
        this.getOrderByOrderNo(this.orderNo, !this.editMode)
      }
      // console.log(this.formConfig)
    }
  }

  getOrderByOrderNo(orderNo, readOnly) {
    this.orderService._orderSearchByOrderNo(orderNo).subscribe((res) => {
      console.log(res[0])
      if (res[0] != null) {
        this.createForm(res[0], readOnly)
        this.orderID = res[0].OrderId
      }
      // this.loaded.emit();
    })
  }

  submitUpdates(formValue) {
    formValue['OrderId'] = this.orderID
    console.log(formValue)
    this.orderService._orderUpdateByOrderNo(this.orderNo, formValue).subscribe((res) => console.log(res))
  }

  getAppConfig(config) {
    //get options for CustomerGroup1
    for (let i of config.customerGroup1) {
      let x: FormSelectOptionInterface = {
        value: i.CutomerGroupId1,
        view: i.CustomerGroupName,
      }
      this.customerGroup.push(x)
    }

    //get options for Currency
    for (let i of config.configOrderMapping.Currency) {
      let x: FormSelectOptionInterface = {
        value: i.CurrencyId,
        view: i.CurrencyName,
      }
      this.currency.push(x)
    }

    //get options for Project
    for (let i of config.configOrderMapping.Project) {
      let x: FormSelectOptionInterface = {
        value: i.ProjectId,
        view: i.ProjectName,
      }
      this.project.push(x)
    }

    //get options for Project
    for (let i of config.configOrderMapping.RetailOrderStatus) {
      let x: FormSelectOptionInterface = {
        value: i.Status,
        view: i.StatusName,
      }
      this.status.push(x)
    }
  }

  createForm(orderInfo, readonly) {
    this.formConfig = [
      { type: 'input', name: 'OrderNo', class: 'p-1 w-auto ', label: '订单号', value: orderInfo.OrderNo, disabled: true },
      { type: 'input', name: 'Sender', class: 'p-1 w-auto ', label: '寄件人', value: orderInfo.Sender, disabled: readonly },
      { type: 'input', name: 'SenderPhone', class: 'p-1 w-auto ', label: '寄件人电话', value: orderInfo.SenderPhone, disabled: readonly },
      { type: 'input', name: 'SenderAddr', class: 'p-1', label: '寄件人地址', value: orderInfo.SenderAddr, disabled: readonly },
      { type: 'input', name: 'Recipient', class: 'p-1 w-auto ', label: '收件人', value: orderInfo.Recipient, disabled: readonly },
      { type: 'input', name: 'RecipientPhone', class: 'p-1 w-auto ', label: '收件人电话', value: orderInfo.RecipientPhone, disabled: readonly },
      { type: 'input', name: 'RecipientId', class: 'p-1 w-auto ', label: '收件人证件号', value: orderInfo.RecipientIdno, disabled: readonly },
      { type: 'input', name: 'RecipientAddr', class: 'p-1', label: '收件人地址', value: orderInfo.RecipientAddr, disabled: readonly },
      {
        type: 'input',
        name: 'ProductString',
        class: 'p-1',
        style: { width: '1000px' },
        label: '备注品名',
        value: orderInfo.ProductString,
        disabled: readonly,
      },
      {
        type: 'input',
        name: 'ProductName',
        class: 'p-1',
        style: { width: '300px' },
        label: '标准品名',
        value: orderInfo.ProductName,
        disabled: readonly,
      },
      { type: 'input', name: 'CustomerString', class: 'p-1 w-auto ', label: '客户名称', value: orderInfo.CustomerString, disabled: readonly },
      { type: 'input', name: 'StockCustomerInfo', class: 'p-1 w-auto ', label: '客户信息', value: orderInfo.StockCustomerInfo, disabled: readonly },
      {
        type: 'input',
        name: 'StockCustomerFirstName',
        class: 'p-1 w-auto ',
        label: '客户昵称',
        value: orderInfo.StockCustomerFirstName,
        disabled: readonly,
      },
      { type: 'input', name: 'Nzd', class: 'p-1 w-auto ', label: '纽币金额', value: orderInfo.Nzd, disabled: readonly },
      {
        type: 'select',
        name: 'CurrencyId',
        class: 'p-1 w-auto ',
        label: '支付方式',
        value: orderInfo.CurrencyId,
        disabled: readonly,
        options: this.currency,
      },
      {
        type: 'select',
        name: 'ProjectId',
        class: 'p-1 w-auto ',
        label: '订单形式',
        value: orderInfo.ProjectId,
        disabled: readonly,
        options: this.project,
      },
      { type: 'input', name: 'Comment1', class: 'p-1', style: { width: '1000px' }, label: '备注', value: orderInfo.Comment1, disabled: readonly },
      { type: 'input', name: 'Cin7InterCode', class: 'p-1 w-auto ', label: 'Cin7InterCode', value: orderInfo.Cin7InterCode, disabled: readonly },
      { type: 'input', name: 'Reference', class: 'p-1 w-auto ', label: '批次号', value: orderInfo.Reference, disabled: readonly },
      {
        type: 'select',
        name: 'CutomerGroupId1',
        class: 'p-1 w-auto ',
        label: '客户等级',
        value: orderInfo.CutomerGroupId1,
        disabled: readonly,
        options: this.customerGroup,
      },
      { type: 'input', name: 'UnitPrice', class: 'p-1 w-auto ', label: '单价', value: orderInfo.UnitPrice, disabled: readonly },
      { type: 'input', name: 'TotalPrice', class: 'p-1 w-auto ', label: '总价', value: orderInfo.TotalPrice, disabled: readonly },
      { type: 'date', name: 'EnterDate', class: 'p-1 w-auto ', label: '录入日期', value: orderInfo.EnterDate, disabled: true },
      { type: 'date', name: 'BillingDate', class: 'p-1 w-auto ', label: '财务日期', value: orderInfo.BillingDate, disabled: true },
      { type: 'select', name: 'Status', class: 'p-1 w-auto ', label: '订单状态', value: orderInfo.Status, disabled: readonly, options: this.status },
      { type: 'input', name: 'OrderPrice', class: 'p-1 w-auto ', label: '实际价格', value: orderInfo.OrderPrice, disabled: readonly },
      { type: 'button', label: '提交修改', class: 'p-1 mr-auto', disabled: readonly },
    ]
  }
}
