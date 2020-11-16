import { Component, OnInit, ViewChild, Input, IterableDiffers, IterableDiffer } from '@angular/core'
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'
import { TransferProductRow } from './transferProductRow'

@Component({
  selector: 'app-business-transfer-generate-new-product',
  templateUrl: './business-transfer-generate-new-product.component.html',
  styleUrls: ['./business-transfer-generate-new-product.component.css'],
})
export class BusinessTransferGenerateNewProductComponent implements OnInit {
  @Input() outCustomer: any
  public outCustomerId: number
  public displayedColumns: string[] = ['productName', 'warehouseTransfer', 'warehouseQuantity', 'actions']
  public productRowsForTable: TransferProductRow[] = []
  public dataSource: any
  public formValues: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  // public showTransferQuantityInput: boolean = false
  public showTable: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private inventoryService: InventoryEndpoint,
    private iterableDiffers: IterableDiffers
  ) {}

  ngOnInit(): void {
    // this.setProductAndWarehouse()
  }

  ngOnChanges(): void {
    // console.log(this.outCustomer);
    if (this.outCustomer.CustomerId != '') {
      this.showTable = true
      this.outCustomerId = this.outCustomer.CustomerId
      this.setTable()
    }
  }

  private setTable(): void {
    this.dataSource = new MatTableDataSource(this.productRowsForTable)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  // this function gets called automatically when changing happens
  public getProduct(row: TransferProductRow): void {
    row.ProductControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          row.ProductId = value
          // console.log(row.ProductId)
          this.getDataForWarehouseAndTransport(row, value)
          console.log(this.productRowsForTable)
          this.dataSource._updateChangeSubscription()
        } else {
          this.resetWarehouseAndTransport(row)
        }
      })
    })
  }

  private getDataForWarehouseAndTransport(row: TransferProductRow, productId): void {
    if (productId) {
      this.inventoryService.getTransferDataByProductIdAndOutCustomerId(productId, this.outCustomerId).subscribe((value) => {
        this.resetWarehouseAndTransport(row)
        // console.log(value)
        for (let stock of value['Stock']) {
          stock['transferQuantity'] = 0
          row.WarehouseList.push(stock)
        }
        for (let transport of value['Transports']) {
          transport['transferQuantity'] = 0
          row.TransportList.push(transport)
        }
      })
    }
  }

  // the reason we reset two arrays is when we repick the product
  private resetWarehouseAndTransport(row: TransferProductRow): void {
    row.WarehouseList.length = 0
    row.TransportList.length = 0
  }

  public getStockQuantity(wh, quantity): void {
    let numberQuantity = +quantity // to number
    if (numberQuantity > wh.AvaliableStock) {
      this.sweetAlert.showSweetAlert('Transferred quantity is greater than current warehouse inventory, please reselect！')
    } else {
      wh.transferQuantity = numberQuantity
    }
  }

  // public getTransportQuantity(transport, quantity): void {
  //   let numberQuantity = +quantity // to number
  //   if (numberQuantity > transport.Quantity) {
  //     this.sweetAlert.showSweetAlert('transferred quantity is greater than current shipping inventory, please reselect！')
  //   } else {
  //     transport.transferQuantity = numberQuantity
  //   }
  // }

  public newData() {
    let newRow = new TransferProductRow()
    console.log(newRow)
    this.productRowsForTable.push(newRow)
    this.dataSource._updateChangeSubscription()
  }

  public removeRow(element) {
    const toBeRemovedRowIndex = this.productRowsForTable.indexOf(element)
    this.productRowsForTable.splice(toBeRemovedRowIndex, 1)
    this.dataSource._updateChangeSubscription()
  }

  public testChild() {
    console.log(this.productRowsForTable)
  }

  public TEST(): void {
    // finaly we do this productRowsForTable
    console.log(this.productRowsForTable)
  }

  public getWarehouseQuantity(row: TransferProductRow, event): void {
    console.log(event)
    row.stockQuantity = event
    console.log(this.productRowsForTable)
  }

  public getTransportQuantity(row: TransferProductRow, event): void {
    console.log(event)
    row.transportQuantity = event
    console.log(this.productRowsForTable)
  }

  public getOutputDataForStock(row: TransferProductRow, stock): void {
    console.log(stock)
    row.pickedStockWarehouse = stock
  }

  public getOutputDataForTransport(row: TransferProductRow, transport): void {
    console.log(transport)
    row.pickedTransportWarehouse = transport
  }
}
