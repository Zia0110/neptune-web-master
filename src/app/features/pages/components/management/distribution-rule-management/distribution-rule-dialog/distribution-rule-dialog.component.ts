import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-distribution-rule-dialog',
  templateUrl: './distribution-rule-dialog.component.html',
  styleUrls: ['./distribution-rule-dialog.component.css'],
})
export class DistributionRuleDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  warehouseFormControl = new FormControl('')
  warehousePlaceHolder: string
  ruleType: number
  ruleName: string

  constructor(
    public dialogRef: MatDialogRef<DistributionRuleDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.warehouseFormControl.setValue('')
    this.warehousePlaceHolder = this.data ? this.data.WarehouseName : ''
    this.ruleType = this.data ? this.data.RuleType : null
    this.ruleName = this.data ? this.data.RuleName : ''
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Confirm to save？')
      if (!saveAlert.value) {
        return
      }
      if (this.ruleType <= 0) {
        this.sweetAlertService.showSweetAlert('Rule Type should be positive integer!')
        return
      }
      if (!this.ruleType || !this.ruleName) {
        this.sweetAlertService.showSweetAlert('Please complete the form before saving！')
        return
      }
      const requestData = {
        WarehouseId: this.warehouseFormControl.value || null,
        RuleType: this.ruleType,
        RuleName: this.ruleName,
      }
      this.outputData.emit(requestData)
      this.dialogRef.close()
    }
  }
}
