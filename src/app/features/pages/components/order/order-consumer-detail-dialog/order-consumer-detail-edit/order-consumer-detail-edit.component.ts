import { Component, OnInit, Input, OnChanges, Output, ViewChild, EventEmitter } from '@angular/core'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'
import {
  FormFieldConfigInterface,
  FormSelectOptionInterface,
} from '../../../../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { FormControl, FormGroup, FormBuilder, Form } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { MatDialog } from '@angular/material/dialog'
import { ChangeCustomerDialogComponent } from './change-customer-dialog/change-customer-dialog.component'

@Component({
  selector: 'app-order-consumer-detail-edit',
  templateUrl: './order-consumer-detail-edit.component.html',
  styleUrls: ['./order-consumer-detail-edit.component.css'],
})
export class OrderConsumerDetailEditComponent implements OnInit, OnChanges {
  editModeOn = false
  dataLoaded = false

  @Input() orderNo
  @Input() editMode
  @Input() orderData
  @Output() loaded = new EventEmitter()
  @Output() editedNewData = new EventEmitter()
  @ViewChild('dynamicForm') dynamicForm
  @ViewChild('billingCustomer') billingCustomer
  @ViewChild('orderChange') orderForm

  orderID
  userId
  currency: FormSelectOptionInterface[] = []
  customerGroup: FormSelectOptionInterface[] = []
  project: FormSelectOptionInterface[] = []
  status: FormSelectOptionInterface[] = []
  stockCustomer: FormSelectOptionInterface[] = []
  // billingCustomer: FormSelectOptionInterface[] = []
  warehouse: FormSelectOptionInterface[] = []

  formConfig: FormFieldConfigInterface[] = []
  customerForm: FormGroup
  productForm: FormGroup

  stockCustomerFormControl = new FormControl('')

  prodect_name: FormFieldConfigInterface
  isChangedCustomer = false
  billingCustomerId = null
  stockCustomerId = null

  constructor(
    public dialog: MatDialog,
    private orderService: OrderEndpoint,
    private appConfigStore: AppConfigStore,
    private alert: SweetAlertService,
    private fb: FormBuilder
  ) {
    this.userId = this.appConfigStore.userID
    this.editMode = true
  }

  ngOnInit(): void {
    console.log(this.appConfigStore)

    this.getAppConfig(this.appConfigStore)
  }
  ngOnChanges() {
    console.log(this.orderData)
    this.createForm(this.orderData, !this.editMode)
  }

  openCustomerChangeDialog() {
    const dialogRef = this.dialog.open(ChangeCustomerDialogComponent, {
      data: {
        billingCustomer: {
          id: this.orderData.BillingCustomerId,
          name: this.orderData.BillingCustomerCode,
        },
        stockCustomer: {
          id: this.orderData.StockCustomerId,
          name: this.orderData.StockCustomerCode,
        },
      },
      autoFocus: false,
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        console.log(result)
        this.isChangedCustomer = true
        this.billingCustomerId = result.billingCustomerId
        this.stockCustomerId = result.stockCustomerId
      }
    })
  }

  ngAfterViewInit() {
    console.log('df', this.dynamicForm)
    console.log('bill', this.billingCustomer)
    console.log('ord', this.orderForm)
    // this.billingCustomer.searchBox.valueChanges.subscribe((res) => {
    //   console.log(res)
    //   let customerInfo = this.getCustomInfo(res.CustomerId)
    //   this.updateCustomerForm(customerInfo)
    // })
  }

  submitChanges() {
    let data = this.dynamicForm.form
    console.log(data)

    this.submitUpdates(data.value)
  }

  getCustomInfo(id) {
    for (let i of this.appConfigStore.appSettings.CustomerInfo.Customers) {
      if (i.CustomerId == id) {
        return i
      }
    }
  }

  updateCustomerForm(data) {
    this.customerForm.controls['BillingCustomerId'].setValue(data.CustomerId)
    this.customerForm.controls['CustomerString'].setValue(data.CustomerName)
    this.customerForm.controls['FirstName'].setValue(data.FirstName)
    this.customerForm.controls['BillingCustomerCode'].setValue(data.CustomerCode)
  }

  submitUpdates(formValue) {
    // formValue['OrderId'] = this.orderID
    this.orderData = { ...this.orderData, ...formValue }
    if (this.isChangedCustomer) {
      this.orderData.BillingCustomerId = this.billingCustomerId
      this.orderData.StockCustomerId = this.stockCustomerId
    }
    // delete newData.Ticket
    // delete newData.Images
    // console.log(newData)
    this.orderService._orderUpdateByOrderNo(this.userId, this.orderData).subscribe((res) => {
      console.log(res)
      this.editedNewData.emit(this.orderData)
      this.alert.showSuccessMessage('Successfully modified ')
    })
  }

  // _submitUpdates() {
  //   let subData = {
  //     dyn: this.dynamicForm.form.value,
  //     form: this.customerForm.value + this.customerForm.value,
  //   }
  //   console.log(subData)
  // }

  getAppConfig(config) {
    console.log(this.userId)
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

    //get options for Status
    for (let i of config.configOrderMapping.RetailOrderStatus) {
      let x: FormSelectOptionInterface = {
        value: i.Status,
        view: i.StatusName,
      }
      this.status.push(x)
    }

    //get options for stockCustomer
    for (let i of config.appSettings.Mapping.StockCustomerMappings) {
      let x: FormSelectOptionInterface = {
        value: i.StockCustomerInfo,
        view: i.StockCustomerInfo,
      }
      this.stockCustomer.push(x)
    }

    //get options for Warehouse
    for (let i of config.appSettings.Mapping.Warehouse) {
      let x: FormSelectOptionInterface = {
        value: i.WarehouseId,
        view: i.WarehouseName,
      }
      this.warehouse.push(x)
    }
  }

  createForm(orderInfo, readonly) {
    this.customerForm = this.fb.group({
      OrderNo: [orderInfo.OrderNo],
      BillingCustomerId: [orderInfo.BillingCustomerId],
      BillingCustomerCode: [orderInfo.BillingCustomerCode],
      CustomerString: [orderInfo.CustomerString],
      CustomerGroupName: [orderInfo.CustomerGroupName],
      FirstName: [orderInfo.FirstName],
    })
    this.productForm = this.fb.group({
      CurrencyName: [orderInfo.CurrencyName],
      UnitPrice: [orderInfo.UnitPrice],
      Uom: [orderInfo.Uom],
      TotalPrice: [orderInfo.TotalPrice],
      Nzd: [orderInfo.Nzd],
    })
    this.formConfig = [
      // { type: 'input', name: 'OrderNo', class: 'p-1 w-auto row', label: '订单号', value: orderInfo.OrderNo, disabled: true },
      { type: 'input', name: 'Sender', class: 'p-1 w-auto ', label: 'Sender', value: orderInfo.Sender, disabled: readonly },
      { type: 'input', name: 'SenderPhone', class: 'p-1 w-auto ', label: 'Sender Phone', value: orderInfo.SenderPhone, disabled: readonly },
      {
        type: 'input',
        name: 'SenderAddr',
        inputType: 'textarea',
        class: 'p-1',
        label: 'Sender Address',
        value: orderInfo.SenderAddr,
        disabled: readonly,
      },
      { type: 'input', name: 'Recipient', class: 'p-1 w-auto ', label: 'Recipient', value: orderInfo.Recipient, disabled: readonly },
      { type: 'input', name: 'RecipientPhone', class: 'p-1 w-auto ', label: 'Recipient Phone', value: orderInfo.RecipientPhone, disabled: readonly },
      { type: 'input', name: 'RecipientId', class: 'p-1 w-auto ', label: 'Recipient Id Number', value: orderInfo.RecipientIdno, disabled: readonly },
      {
        type: 'input',
        name: 'RecipientAddr',
        inputType: 'textarea',
        class: 'p-1',
        label: 'Recipient Address',
        value: orderInfo.RecipientAddr,
        disabled: readonly,
      },
      {
        type: 'input',
        name: 'CustomerString',
        class: 'p-1 w-50 ',
        label: 'Original Customer Info',
        value: orderInfo.CustomerString,
        disabled: readonly,
      },
      {
        type: 'input',
        name: 'ProductString',
        class: 'p-1 w-50 ',
        label: 'Original Product Info',
        value: orderInfo.ProductString,
        disabled: readonly,
      },
      { type: 'input', name: 'Comment1', inputType: 'textarea', class: 'p-1 w-50', label: 'Comment1', value: orderInfo.Comment1, disabled: readonly },
      {
        type: 'input',
        name: 'Comment2',
        inputType: 'textarea',
        class: 'p-1 w-50',
        label: 'Comment2',
        value: orderInfo.Comment2,
        disabled: readonly,
      },
      { type: 'input', name: 'Cin7InvoiceNo', class: 'p-1 w-50 ', label: 'Invoice No', value: orderInfo.Cin7InvoiceNo, disabled: readonly },
      { type: 'input', name: 'Reference', class: 'p-1 w-50 ', label: 'Reference', value: orderInfo.Reference, disabled: readonly },
    ]
  }
}
