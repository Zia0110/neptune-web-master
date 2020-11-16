import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-invoice-update-item-dialog',
  templateUrl: './invoice-update-item-dialog.component.html',
  styleUrls: ['./invoice-update-item-dialog.component.css'],
})
export class InvoiceUpdateItemDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  userTable: FormGroup
  control: FormArray

  constructor(
    public dialogRef: MatDialogRef<InvoiceUpdateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    private financeEndpoint: FinanceEndpoint,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    if (this.data) {
      this.data.Configures.map((row: any) => {
        this.addRow({
          ProductId: row.BaseProductId,
          ProductOriginalId: row.BaseProductId,
          WarehouseOriginalId: row.WarehouseId,
          ProductName: row.ProductName,
          WarehouseName: row.TransportId ? row.TransportNo : row.WarehouseName,
          Status: row.Status,
          Quantity: row.Quantity,
          ConfirmedQty: row.ConfirmedQty,
          WarehouseId: {
            WarehouseId: row.WarehouseId,
            TransportId: row.TransportId,
          },
        })
      })
    }
    this.control = this.userTable.get('tableRows') as FormArray
  }

  initiateForm(item): FormGroup {
    return this.fb.group({
      ProductId: [item.ProductId, Validators.required],
      ProductOriginalId: [item.ProductOriginalId],
      WarehouseOriginalId: [item.WarehouseOriginalId],
      ProductName: [item.ProductName],
      WarehouseName: [item.WarehouseName],
      Status: [item.Status],
      Quantity: [item.Quantity, [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      ConfirmedQty: [item.ConfirmedQty, [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      WarehouseId: [item.WarehouseId, Validators.required],
    })
  }

  addRow(item?) {
    const control = this.userTable.get('tableRows') as FormArray
    if (item) {
      control.push(this.initiateForm(item))
    } else {
      control.push(
        this.initiateForm({
          ProductId: null,
          ProductOriginalId: null,
          WarehouseOriginalId: null,
          ProductName: '',
          WarehouseName: '',
          Status: '',
          Quantity: null,
          ConfirmedQty: null,
          WarehouseId: {
            WarehouseId: null,
            TransportId: null,
          },
        })
      )
    }
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

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Are you sure to save？')
      if (!saveAlert.value) {
        return
      }
      const updateArray = []
      this.getFormControls.value.map((row: any) => {
        updateArray.push({
          warehouseId: row.WarehouseId.WarehouseId,
          baseProductId: row.ProductId,
          quantity: row.Quantity,
          confirmedQty: row.WarehouseId.TransportId ? 0 : row.ConfirmedQty,
          transportId: row.WarehouseId.TransportId,
        })
      })
      const requestData = {
        orderId: this.data.OrderId,
        updateConfigInfos: updateArray,
      }
      this.financeEndpoint._PutInfiniteUpdateWholeSaleOrder(requestData).subscribe((_) => {
        this.sweetAlertService.successAlert('Saved successfully！')
        this.dialogRef.close()
        this.outputData.emit(true)
      })
    }
  }
}
