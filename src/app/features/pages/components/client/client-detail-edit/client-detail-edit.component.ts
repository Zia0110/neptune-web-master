import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { FormValidationDirective } from '../../../../../shared/directives/form-validation.directive'
import { DynamicFormComponent } from '../../../../../shared/presentational-components/dynamic-form/dynamic-form.component'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { AddressItemDialogComponent } from '../client-list/address-item-dialog/address-item-dialog.component'
import { SearchSelectionServiceService } from '../../../../../shared/common-components/search-selection/search-selection-service.service'

@Component({
  selector: 'app-client-detail-edit',
  templateUrl: './client-detail-edit.component.html',
  styleUrls: ['./client-detail-edit.component.css'],
})
export class ClientDetailEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent

  formChanges = null
  clientId = null
  regConfig: any
  mappingDatas: any
  addressData: any
  imgSrc: any
  selectedFile: File = null
  imageUploaded: boolean
  imageUrl: string
  isShowForm = true

  constructor(
    private searchSelectionServiceService: SearchSelectionServiceService,
    private formValidations: FormValidationDirective,
    public dialogRef: MatDialogRef<ClientDetailEditComponent>,
    private clientEndpoint: ClientEndpoint,
    private appConfigStore: AppConfigStore,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog,
    public _img: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data?
  ) {}

  ngOnInit() {
    // console.log(this.data.client)
    // We may or may not have original values, if so, we assign this value.
    this.formChanges = this.data.client ? this.data.client : null
    this.clientId = this.data.client ? this.data.client.CustomerId : null
    this.mappingDatas = this.appConfigStore.appSettings
    this.addressData = this.data.addressData
    this.parseFormField()
    // console.log(id.Mapping.CustomerGroup1)
  }

  resetProductAndCustomerData() {
    this.searchSelectionServiceService.products = []
    this.searchSelectionServiceService.customers = []
    this.searchSelectionServiceService.stockCustomers = []
    this.searchSelectionServiceService.warehouses = []
  }

  onFileSelected(event) {
    // 利用event.target.files.length做判断
    this.selectedFile = event.target.files[0]
    // console.log(this.selectedFile)
    // console.log(this.data.response.Image)

    // Determine if there is a  new image
    if (event.target.files.length !== 0) {
      this.imageUploaded = true
      this.imgSrc = window.URL.createObjectURL(this.selectedFile) // thumbnail
      this.sweetAlert.successAlert('Imported！')
      console.log('got image')
    } else {
      this.imageUploaded = false
      console.log('no image')
    }
  }

  valueMapping(datas, x, y) {
    if (x === 'AddressId') {
      const newO = []
      for (const data of datas) {
        newO.push({
          value: data[x],
          view: data['Address'] + '，' + data['City'] + '，' + data['Suburb'] + '，' + data['State'],
        })
      }
      return newO
    }
    // console.log(datas)
    const newOb = []
    for (const data of datas) {
      newOb.push({ value: data[x], view: data[y] })
    }
    // console.warn(newOb)
    return newOb
  }

  // On submit from child component
  async submit(value: any) {
    if (this.imageUploaded) {
      const fd = new FormData()
      fd.append('imageFile', this.selectedFile, this.selectedFile.name)
      await this.clientEndpoint
        ._ImageUpload(fd)
        .toPromise()
        .then((response: any) => {
          console.log(response)
          this.imageUrl = `${response.FileNameForStorage}`
        })
      // console.log("image can send to backend")
    }

    // console.log(this.form.form.value)
    // If clientID is pollulated initialy, then its update, else its add
    if (this.clientId) {
      // console.log(value)
      const newData = { ...this.data.client, ...this.form.form.value }
      if (this.imageUrl) {
        newData.image = this.imageUrl
      }
      console.log(newData)
      this.updateClientDetailsToApi(this.clientId, newData)
    } else {
      if (this.imageUrl) {
        value.image = this.imageUrl
      }
      console.log(value)
      this.newClientDetailsToApi(value)
    }
  }

  // Api call for update
  updateClientDetailsToApi(id, data) {
    // console.log(id)
    // console.log(data)
    this.clientEndpoint._updateClient(id, data).subscribe((res) => {
      this.resetProductAndCustomerData()
      // console.log(res)
      this.sweetAlert.showSuccessMessage('Modified!')
      this.closeDialog('close')
    })
  }

  // Api call for add new
  newClientDetailsToApi(data) {
    // console.log(data)
    this.clientEndpoint._addClient(data).subscribe((res) => {
      this.resetProductAndCustomerData()
      // console.log(res)
      this.sweetAlert.showSuccessMessage('Created!')
      this.closeDialog('close')
    })
  }

  newAddress() {
    const dialogRef = this.dialog.open(AddressItemDialogComponent, {})
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.clientEndpoint._CreateAddress(result).subscribe((_) => {
          this.sweetAlert.successAlert('Added！')
          this.clientEndpoint._GetAllAddress().subscribe((res) => {
            this.addressData = res
            this.isShowForm = false
            setTimeout(() => {
              this.parseFormField()
              this.isShowForm = true
            })
          })
        })
      }
    })
  }

  // 当点击“关闭”按钮时，关闭窗口。
  closeDialog(value?): void {
    this.dialogRef.close(value)
  }

  parseFormField() {
    this.regConfig = [
      {
        type: 'input',
        label: 'Name（Required）',
        inputType: 'text',
        name: 'CustomerName',
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: 'First Name（Required）',
        inputType: 'text',
        name: 'FirstName',
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: this.clientId ? 'select' : 'input',
        label: 'Customer Code（Required）',
        inputType: 'text',
        name: 'CustomerCode',
        disabled: !!this.clientId,
        options: this.clientId
          ? [
              {
                value: this.data.client.CustomerCode,
                view: this.data.client.CustomerCode,
              },
            ]
          : [],
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: 'Reference（Required）',
        inputType: 'text',
        name: 'Reference',
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'input',
        label: 'Niumen Code',
        inputType: 'text',
        name: 'ContactPerson',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: 'Telephone',
        inputType: 'text',
        name: 'Phone',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: 'Email',
        inputType: 'text',
        name: 'Email',
        class: 'w-auto p-2',
        validations: [this.formValidations.email()],
      },
      {
        type: 'input',
        label: 'Fax',
        inputType: 'text',
        name: 'Fax',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: 'Website',
        inputType: 'text',
        name: 'Website',
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: 'Billing Email',
        inputType: 'text',
        name: 'BillingEmail',
        class: 'w-auto p-2',
        validations: [this.formValidations.email()],
      },
      {
        type: 'input',
        label: 'Billing Contact Person',
        inputType: 'text',
        name: 'BillingContactPerson',
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: 'Billing Address',
        name: 'BillingAddressId',
        options: this.valueMapping(this.addressData, 'AddressId', null),
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: 'Delivery Address',
        name: 'DeliveryAddressId',
        options: this.valueMapping(this.addressData, 'AddressId', null),
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: 'Group 1（Required）',
        name: 'CutomerGroupId1',
        // value: null,
        options: this.valueMapping(this.mappingDatas.Mapping.CustomerGroup1, 'CutomerGroupId1', 'CustomerGroupName'),
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'select',
        label: 'Group 2（Required）',
        name: 'CutomerGroupId2',
        // value: null,
        options: this.valueMapping(this.mappingDatas.Mapping.CustomerGroup2.slice(1), 'CutomerGroupId2', 'CustomerGroupName'),
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'select',
        label: 'Group 3',
        name: 'CutomerGroupId3',
        // value: null,
        options: this.valueMapping(this.mappingDatas.Mapping.CustomerGroup3, 'CutomerGroupId3', 'CustomerGroupName'),
        class: 'w-auto p-2',
      },
      {
        type: 'select',
        label: 'Is Active（Required）',
        name: 'IsActive',
        value: 1,
        options: [
          { value: 0, view: 'No' },
          { value: 1, view: 'Yes' },
        ],
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
      },
      {
        type: 'select',
        label: 'Billing Cycle',
        name: 'BillingCycleId',
        // value: null,
        options: this.valueMapping(this.mappingDatas.Mapping.BillingCycle, 'BillingCycleId', 'BillingCycleName'),
        class: 'w-auto p-2',
      },
      {
        type: 'input',
        label: 'Comments',
        inputType: 'textarea',
        name: 'Comments',
        class: 'w-auto p-2',
      },
      { type: 'button', label: 'Save', disabled: false },
    ]
  }
}
