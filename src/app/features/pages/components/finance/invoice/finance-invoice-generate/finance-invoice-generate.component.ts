import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import set = Reflect.set

@Component({
  selector: 'app-finance-invoice-generate',
  templateUrl: './finance-invoice-generate.component.html',
  styleUrls: ['./finance-invoice-generate.component.css'],
})
export class FinanceInvoiceGenerateComponent implements OnInit {
  userTable: FormGroup
  stockCustomerFormControl = new FormControl('')
  gstFormControl = new FormControl(0)
  IsOutFormControl = new FormControl(false)
  CreateAtControl = new FormControl('')
  control: FormArray
  touchedRows: FormGroup[] = []
  customerId: number
  customerName: string
  customerTel: string
  customerEmail: string
  customerContactPerson: string
  customerAddr: string
  isSaved = false
  isShowInfo = false
  warehouseComment: any
  isShowCustomer = true

  constructor(private fb: FormBuilder, private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    // this.addRow()
    this.control = this.userTable.get('tableRows') as FormArray
    this.stockCustomerFormControl.valueChanges.subscribe((res) => {
      this.isShowInfo = true
      if (res) {
        this.financeEndpoint
          ._invoiceGenerateGetCustomerInfo(res)
          .toPromise()
          .then((response: any) => {
            this.customerId = response.CustomerId
            this.customerName = response.CustomerName
            this.customerTel = response.Phone
            this.customerEmail = response.Email
            this.customerContactPerson = response.ContactPerson
            this.customerAddr = response.BillingAddress
            this.isSaved = false
          })
      } else {
        this.customerId = null
        this.customerName = ''
        this.customerTel = ''
        this.customerEmail = ''
        this.customerContactPerson = ''
        this.customerAddr = ''
      }
    })
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      count: ['', [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      warehouse: [
        {
          WarehouseId: 13,
          TransportId: null,
        },
      ],
      isFreight: ['1', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]*)?$')]],
    })
  }

  addRow() {
    const control = this.userTable.get('tableRows') as FormArray
    control.push(this.initiateForm())
  }

  async deleteRow(index: number) {
    const saveAlert = await this.sweetAlertService.saveAlert('You are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    const control = this.userTable.get('tableRows') as FormArray
    control.removeAt(index)
  }

  get getFormControls() {
    return this.userTable.get('tableRows') as FormArray
  }

  async submitForm() {
    const control = this.userTable.get('tableRows') as FormArray
    this.touchedRows = control.controls.filter((row) => row.touched).map((row) => row.value)
    const wholeSaleDetailDtosArray = []
    this.touchedRows.map((value: any) => {
      wholeSaleDetailDtosArray.push({
        WarehouseId: value.warehouse.WarehouseId,
        BaseProductId: value.product,
        Quantity: value.count,
        TransportId: value.warehouse.TransportId,
        Price: value.price,
        InclFreight: parseFloat(value.isFreight),
      })
    })
    const postData = {
      CustomerId: this.stockCustomerFormControl.value,
      Comment: this.warehouseComment,
      InclGst: this.gstFormControl.value ? parseInt(this.gstFormControl.value, 10) : 0,
      isStockCustomerSale: this.IsOutFormControl.value === '1',
      CreatedAt: this.CreateAtControl.value,
      WholeSaleDetailDtos: wholeSaleDetailDtosArray,
    }
    if (!postData.WholeSaleDetailDtos.length) {
      this.sweetAlertService.showSweetAlert('Fill in the billing content and save it, thank you!')
      return
    }
    const saveAlert = await this.sweetAlertService.saveAlert('You are about to submit and save data！')
    if (!saveAlert.value) {
      return
    }
    this.financeEndpoint._invoiceGeneratePost(postData).subscribe(
      (_) => {
        this.isSaved = true
        this.isShowCustomer = false
        this.stockCustomerFormControl.reset('', {
          onlySelf: true,
          emitEvent: true,
        })
        setTimeout(() => {
          this.isShowCustomer = true
        })
        this.getFormControls.clear()
        this.warehouseComment = ''
        this.gstFormControl.setValue(0)
        this.IsOutFormControl.setValue(false)
        this.CreateAtControl.setValue('')
        this.sweetAlertService.successAlert('Invoiced created successfully！')
      },
      (_) => {}
    )
  }
}
