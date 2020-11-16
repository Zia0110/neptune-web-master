import { FinanceInvoiceUpdateComponent } from './../../finance/invoice/finance-invoice-update/finance-invoice-update.component'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { InvoiceUpdateDialogComponent } from '../../finance/invoice/finance-invoice-payment/invoice-update-dialog/invoice-update-dialog.component'
import { MatDialog } from '@angular/material/dialog'
@Component({
  selector: 'app-warehouse-confirmation',
  templateUrl: './warehouse-confirmation.component.html',
  styleUrls: ['./warehouse-confirmation.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WarehouseConfirmationComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  dataToTable = []
  IsStockCustomerSale = false
  dataToPut = {
    OrderId: '',
    CustomerId: '',
    StockConfirmWholeSaleDetailModels: [],
  }
  isShowTable = true
  isInitTable = false
  isClickStep = false
  dataSourceData = []
  dataSource = new MatTableDataSource<any>()
  columnsToDisplay = ['Position', 'CustomerName', 'IsStockCustomer', 'CreatedAt', 'Comment', 'IsComplete', 'IsSelected', 'Operation']
  expandedElement: any
  lastClick: any
  isShowList = 'block'
  isGetData = false
  isInit = true

  constructor(private sweetAlertService: SweetAlertService, public warehouseEndpoint: WarehouseEndpoint, public dialog: MatDialog) {}

  ngOnInit(): void {}

  private reset() {
    this.dataToTable = []
    this.IsStockCustomerSale = false
    this.dataToPut = {
      OrderId: '',
      CustomerId: '',
      StockConfirmWholeSaleDetailModels: [],
    }
    this.isShowTable = true
    this.isInitTable = false
    this.isClickStep = false
    this.dataSourceData = []
    this.dataSource = new MatTableDataSource(this.dataSourceData)
    this.dataSource.paginator = this.paginator
  }

  getData() {
    this.reset()
    this.isShowList = 'none'
    this.isInit = false
    this.warehouseEndpoint._confirmationGet().subscribe(
      (value: any) => {
        this.dataSourceData = value
        this.dataSourceData.map((row: any, index: number) => {
          row.Position = index + 1
          row.IsComplete = 'mat-icon-inactive'
          row.IsSelected = false
          row.isNotSubmit = true
        })
        this.isInitTable = true
        this.dataSource = new MatTableDataSource(this.dataSourceData)
        this.dataSource.paginator = this.paginator
        if (this.dataSourceData.length) {
          this.handleExpandedElement(this.dataSourceData[0])
        }
        this.isGetData = true
        this.isShowList = 'block'
        this.isInit = true
      },
      (_) => (this.isInit = true)
    )
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  handleExpandedElement(element: any) {
    const data: any = this.dataSourceData[element.Position - 1]
    if (this.lastClick && this.lastClick === element) {
      return
    }
    if (this.lastClick && this.dataSourceData[this.lastClick.Position - 1]) {
      this.dataSourceData[this.lastClick.Position - 1].IsSelected = false
    }
    data.IsSelected = true
    this.isClickStep = true
    this.dataToTable = data.WarehouseConfirmWholeSaleOrderDetailModel
    this.IsStockCustomerSale = data.IsStockCustomerSale == null || data.IsStockCustomerSale
    this.dataToPut = {
      OrderId: data.OrderId,
      CustomerId: data.CustomerId,
      StockConfirmWholeSaleDetailModels: [],
    }
    this.isShowTable = false
    setTimeout(() => {
      this.isShowTable = true
    })
    this.lastClick = element
  }
  modifyOrder(order) {
    console.log(order)
    //patch for reuse InvoiceUpdateDialogComponent
    order.WholeSaleInvoiceDeitals = order.WarehouseConfirmWholeSaleOrderDetailModel
    const dialogRef = this.dialog.open(InvoiceUpdateDialogComponent, {
      width: '100%',
      height: '97%',
      data: order,
      autoFocus: false,
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.getData()
      }
    })
  }
  getTableResultEmit(value: any) {
    this.dataToPut.StockConfirmWholeSaleDetailModels = []
    value.map((item: any) => {
      this.dataToPut.StockConfirmWholeSaleDetailModels.push({
        WarehouseId: item.WarehouseId.WarehouseId,
        BaseProductId: item.ProductId,
        Quantity: item.Quantity,
        TransportId: item.WarehouseId.TransportId,
        IsTransportRequirement: item.WarehouseId.TransportId ? 0 : parseFloat(item.IsTransportRequirement),
      })
    })
    this.warehouseEndpoint._confirmationPut(this.dataToPut).subscribe(
      (_) => {
        this.sweetAlertService.successAlert('Saved successfully！')
        this.lastClick.IsComplete = 'mat-icon-active'
        this.lastClick.isNotSubmit = false
      },
      (_) => {}
    )
  }
}
