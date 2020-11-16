import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-wholesale-order-table',
  templateUrl: './wholesale-order-table.component.html',
  styleUrls: ['./wholesale-order-table.component.css'],
})
export class WholesaleOrderTableComponent implements OnInit {
  @Input() data: any[]
  @Input() IsStockCustomerSale = false
  @Output() tableResultEmit: EventEmitter<any> = new EventEmitter()
  userTable: FormGroup
  control: FormArray
  touchedRows: FormGroup[] = []

  constructor(private fb: FormBuilder, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    console.log(this.data)
    this.userTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    if (this.data) {
      this.data.map((row: any) => {
        this.addRow({
          ProductId: row.BaseProductId,
          ProductOriginalId: row.BaseProductId,
          WarehouseOriginalId: row.WarehouseId,
          ProductName: row.ProductName,
          WarehouseName: row.TransportId ? row.TransportNo : row.WarehouseName,
          Quantity: row.Quantity,
          WarehouseId: {
            WarehouseId: row.WarehouseId,
            TransportId: row.TransportId,
          },
        })
      })
    }
    this.control = this.userTable.get('tableRows') as FormArray
  }

  initiateForm(item?: any): FormGroup {
    if (item) {
      return this.fb.group({
        ProductId: [item.ProductId ? item.ProductId : '', Validators.required],
        ProductOriginalId: [item.ProductOriginalId ? item.ProductOriginalId : ''],
        WarehouseOriginalId: [item.WarehouseOriginalId ? item.WarehouseOriginalId : ''],
        ProductName: [item.ProductName ? item.ProductName : ''],
        WarehouseName: [item.WarehouseName ? item.WarehouseName : ''],
        Quantity: [item.Quantity ? item.Quantity : '', [Validators.required, Validators.pattern('^-?[0-9]+$')]],
        WarehouseId: [item.WarehouseId ? item.WarehouseId : '', Validators.required],
        // 是否生成转仓需求单：0 for no, 1 for yes
        IsTransportRequirement: ['0', Validators.required],
      })
    } else {
      return this.fb.group({
        ProductId: ['', Validators.required],
        ProductOriginalId: [''],
        WarehouseOriginalId: [''],
        ProductName: [''],
        WarehouseName: [''],
        Quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        WarehouseId: ['', Validators.required],
        // 是否生成转仓需求单：0 for no, 1 for yes
        IsTransportRequirement: ['0', Validators.required],
      })
    }
  }

  addRow(item?: any) {
    const control = this.userTable.get('tableRows') as FormArray
    if (item) {
      control.push(this.initiateForm(item))
    } else {
      control.push(this.initiateForm())
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

  async submitForm() {
    const control = this.userTable.get('tableRows') as FormArray
    this.touchedRows = control.controls.map((row) => row.value)
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to submit and save data！')
    if (!saveAlert.value) {
      return
    }
    if (this.touchedRows.length) {
      this.tableResultEmit.emit(this.touchedRows)
    } else {
      this.sweetAlertService.showSweetAlert('Please select item and save it, thank you！')
    }
  }
}
