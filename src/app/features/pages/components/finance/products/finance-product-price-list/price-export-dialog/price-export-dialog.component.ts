import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-price-export-dialog',
  templateUrl: './price-export-dialog.component.html',
  styleUrls: ['./price-export-dialog.component.css'],
})
export class PriceExportDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  groupFormControl = new FormControl('')
  groupSelected: any
  excelExportValue = []

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<PriceExportDialogComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.groupFormControl.valueChanges.subscribe((res) => {
      switch (res) {
        case 'all':
          this.excelExport(this.data, true, true, true, true, true)
          break
        case '0':
          this.excelExport(this.data, false, false, false, true, false)
          break
        case '1':
          this.excelExport(this.data, false, true, false, false, false)
          break
        case '2':
          this.excelExport(this.data, false, false, true, false, false)
          break
        case '3':
          this.excelExport(this.data, true, false, false, false, false)
          break
        case '4':
          this.excelExport(this.data, false, false, false, false, true)
          break
      }
    })
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      if (!this.groupSelected) {
        this.sweetAlertService.showSweetAlert('Please select  level before submitting！')
        return
      }
      this.dialogRef.close()
    }
  }

  excelExport(exportData, isRetial, isDg, isVip, isSvip, isUnknown) {
    for (const i of exportData) {
      delete i.date
      delete i.productId
      i['产品名称'] = i['name']
      delete i['name']
      i['Product Code'] = i['productCode']
      delete i['productCode']
      i['Cin Code'] = i['cinCode']
      delete i['cinCode']
      if (isRetial) {
        i['零售'] = i['retail']
      }
      delete i['retail']
      if (isDg) {
        i['DG'] = i['dg']
      }
      delete i['dg']
      if (isVip) {
        i['VIP'] = i['vip']
      }
      delete i['vip']
      if (isSvip) {
        i['SVIP'] = i['svip']
      }
      delete i['svip']
      if (isUnknown) {
        i['WFTB'] = i['unknown']
      }
      delete i['unknown']
      i['有效期'] = i['productEffectiveDate']
      delete i['productEffectiveDate']
    }
    this.excelExportValue = exportData
    console.log(this.excelExportValue)
  }
}
