import { Component, OnInit, ViewChild, Input, IterableDiffers, IterableDiffer, Output, EventEmitter } from '@angular/core'
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-transfer-warehouse-transport',
  templateUrl: './transfer-warehouse-transport.component.html',
  styleUrls: ['./transfer-warehouse-transport.component.css'],
})
export class TransferWarehouseTransportComponent implements OnInit {
  @Input() ProductId
  @Input() isWarehouse: boolean
  @Input() outCustomerId

  public stockArray: string[] = []
  public transportArray: string[] = []

  stockControl = new FormControl()
  transportControl = new FormControl()
  public stockOptions: string[] = []
  public transportOptions: string[] = []

  public pickedObject: any

  @Output() outputData: EventEmitter<any> = new EventEmitter()

  constructor(private sweetAlert: SweetAlertService, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // console.log(this.ProductId)
    // console.log(this.isWarehouse)
    this.stockArray = []
    this.transportArray = []
    if (this.ProductId && this.outCustomerId) {
      // console.log(this.ProductId)
      // console.log(this.outCustomerId)
      this.inventoryService.getTransferDataByProductIdAndOutCustomerId(this.ProductId, this.outCustomerId).subscribe((value) => {
        // console.log(value)
        for (let stock of value['Stock']) {
          this.stockArray.push(stock)
        }
        for (let transport of value['Transports']) {
          this.transportArray.push(transport)
        }
        this.buildAutoComplete()
      })
    }
  }

  private buildAutoComplete(): void {
    //for stock
    if (this.stockArray.length != 0) {
      this.stockOptions = []
      for (let stock of this.stockArray) {
        let temString = ''
        temString += stock['WarehouseName'] + '-' + '库存:' + stock['AvaliableStock']
        this.stockOptions.push(temString)
      }
    } else {
      this.stockOptions = []
      this.stockOptions.push('No stocks for warehouses')
    }

    //for transport
    if (this.transportArray.length != 0) {
      this.transportOptions = []
      for (let stock of this.transportArray) {
        let temString = ''
        temString += stock['WarehouseName'] + '-' + '库存:' + stock['Quantity']
        this.transportOptions.push(temString)
      }
    } else {
      this.transportOptions = []
      this.transportOptions.push('No transpoort stocks')
    }
  }

  public getWarehouseFromStock(): void {
    this.stockControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          this.getPickedObjectByWarehouseNameForStock(value)
        }
      })
    })
  }

  public getWarehouseFromTransport(): void {
    this.transportControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          // console.log(value)
          this.getPickedObjectByWarehouseNameForTransport(value)
        }
      })
    })
  }

  private getPickedObjectByWarehouseNameForStock(value): void {
    let warehouseName: string
    let i = value.indexOf('-')
    warehouseName = value.slice(0, i)
    for (let obj of this.stockArray) {
      // console.log(obj["WarehouseName"])
      if (obj['WarehouseName'] == warehouseName) {
        this.pickedObject = obj
        this.outputData.emit(this.pickedObject)
        break
      }
    }
  }

  private getPickedObjectByWarehouseNameForTransport(value): void {
    let warehouseName: string
    let i = value.indexOf('-')
    warehouseName = value.slice(0, i)
    for (let obj of this.transportArray) {
      if (obj['WarehouseName'] == warehouseName) {
        this.pickedObject = obj
        this.outputData.emit(this.pickedObject)
        break
      }
    }
  }

  public test(): void {
    console.log(this.pickedObject)
  }
}
