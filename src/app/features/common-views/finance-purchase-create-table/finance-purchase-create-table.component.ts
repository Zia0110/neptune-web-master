import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-finance-purchase-create-table',
  templateUrl: './finance-purchase-create-table.component.html',
  styleUrls: ['./finance-purchase-create-table.component.css'],
})
export class FinancePurchaseCreateTableComponent implements OnInit {
  @Output() tableResultEmit: EventEmitter<any> = new EventEmitter()
  userTable: FormGroup
  control: FormArray
  touchedRows: FormGroup[] = []

  constructor(private fb: FormBuilder, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    this.addRow()
    this.control = this.userTable.get('tableRows') as FormArray
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      BaseProductId: ['', Validators.required],
      Quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      UnitPrice: [0, [Validators.required, Validators.pattern('^[0-9]*.?[0-9]*$')]],
      TotalPrice: [0],
      ProductExp: [''],
      Comments: [''],
    })
  }

  addRow() {
    const control = this.userTable.get('tableRows') as FormArray
    control.push(this.initiateForm())
  }

  async deleteRow(index: number) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
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
    if (!this.touchedRows.length) {
      this.sweetAlertService.showSweetAlert('Please select the item and save it, thank you！')
    }
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to submit and save data！')
    if (!saveAlert.value) {
      return
    }
    if (this.touchedRows.length) {
      console.log(this.touchedRows)
      this.tableResultEmit.emit(this.touchedRows)
    }
  }

  // 计算出TotalPrice的值
  getTotalPrice(data: any) {
    data.TotalPrice = (data.UnitPrice * data.Quantity).toFixed(3)
    return data.TotalPrice
  }
}
