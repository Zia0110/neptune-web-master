import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MockData } from '../../../../../shared/mock-data'

@Component({
  selector: 'app-business-transfer-setting',
  templateUrl: './business-transfer-setting.component.html',
  styleUrls: ['./business-transfer-setting.component.css'],
})
export class BusinessTransferSettingComponent implements OnInit {
  // dataSource: MatTableDataSource<unknown>
  // transferSettingsForm = new FormArray([])
  // transferApplicationForm: FormGroup
  // displayedColumns: string[] = ['transferCustomerName', 'trnasferProdName', 'transferQuantity', 'transferDescription']
  // transferSettings: {
  //   transferCustomerName: string
  //   trnasferProdName: string
  //   transferQuantity: number
  //   transferDescription: string
  // }[]

  constructor() {} // private fb: FormBuilder, public mockDataAPIService: MockData

  ngOnInit() {
    // this.getApiData()
    // this.dataSource = new MatTableDataSource(this.transferSettingsForm.controls)
    // this.transferApplicationForm = this.fb.group({
    //   transferApplicationNo: [''],
    //   transferApplicationContent: [''],
    //   transferApplicationDescription: [''],
    // })
  }

  // getApiData() {
  //   this.transferSettings = this.mockDataAPIService.getTansferSettings()
  //   this.getElement(this.transferSettings)
  //   //   console.log('transferSettings:', this.transferSettings);
  // }

  // getElement(data) {
  //   data.forEach((element) => {
  //     // console.log(element);
  //     this.transferSettingsForm.push(this.transferSettingsFormControl(element))
  //   })
  //   console.log('TransferForm:', this.transferSettingsForm)
  // }

  // transferSettingsFormControl(formData): FormGroup {
  //   return this.fb.group({
  //     transferCustomerName: { value: formData.transferCustomerName, disabled: false },
  //     trnasferProdName: { value: formData.trnasferProdName, disabled: false },
  //     transferQuantity: { value: formData.transferQuantity, disabled: false },
  //     transferDescription: { value: formData.transferDescription, disabled: false },
  //   })
  // }

  // newData() {
  //   this.addRow()
  //   this.dataSource.data = this.transferSettingsForm.controls
  // }

  // addRow() {
  //   this.transferSettingsForm.controls.push(
  //     this.fb.group({
  //       transferCustomerName: { value: '', disabled: false },
  //       trnasferProdName: { value: '', disabled: false },
  //       transferQuantity: { value: '', disabled: false },
  //       transferDescription: { value: '', disabled: false },
  //     })
  //   )
  // }
}
