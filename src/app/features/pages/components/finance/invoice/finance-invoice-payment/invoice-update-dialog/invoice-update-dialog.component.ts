import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-invoice-update-dialog',
  templateUrl: './invoice-update-dialog.component.html',
  styleUrls: ['./invoice-update-dialog.component.css'],
})
export class InvoiceUpdateDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  userTable: FormGroup
  control: FormArray

  constructor(
    public dialogRef: MatDialogRef<InvoiceUpdateDialogComponent>,
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
      this.data.WholeSaleInvoiceDeitals.map((row: any) => {
        this.addRow({
          ProductId: row.BaseProductId,
          ProductOriginalId: row.BaseProductId,
          WarehouseOriginalId: row.WarehouseId,
          ProductName: row.ProductName,
          WarehouseName: row.TransportId ? row.TransportNo : row.WarehouseName,
          Quantity: row.Quantity,
          UnitPrice: row.UnitPrice,
          InclFright: row.InclFright,
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
      Quantity: [item.Quantity, [Validators.required, Validators.pattern('^-?[0-9]+$')]],
      UnitPrice: [item.UnitPrice, [Validators.required]],
      InclFright: [item.InclFright, [Validators.required]],
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
          Quantity: null,
          UnitPrice: null,
          InclFright: null,
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
          transportId: row.WarehouseId.TransportId,
          price: row.UnitPrice,
          inclFreight: row.InclFright,
        })
      })
      const requestData = {
        customerId: this.data.CustomerId,
        inclGst: this.data.InclGst,
        wholeSaleDetailDtos: updateArray,
      }
      this.financeEndpoint._UpdateWholeSaleOrderBeforePaid(this.data.OrderId, requestData).subscribe((_) => {
        this.sweetAlertService.successAlert('Saved successfully！')
        this.dialogRef.close()
        this.outputData.emit(true)
      })
    }
  }
}
