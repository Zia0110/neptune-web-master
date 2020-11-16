import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { CommentDialogComponent } from '../../../../../shared/common-components/comment-dialog/comment-dialog.component'
import { FinanceOrderDialogComponent } from '../../finance/orders/finance-order-dialog/finance-order-dialog.component'
import { MatTableDataSource } from '@angular/material/table'
import { TransportInventoryExcelExportMapping } from '../../../services/mappings/transport-inventory-excel-export.mapping'

@Component({
  selector: 'app-transport-stock-realtime-dialog',
  templateUrl: './transport-stock-realtime-dialog.component.html',
  styleUrls: ['./transport-stock-realtime-dialog.component.css'],
})
export class TransportStockRealtimeDialogComponent implements OnInit {
  displayedColumns1: string[] = ['customer', 'product', 'QuantityPackage', 'QuantityOfProduct']
  displayedColumns2: string[] = ['customer', 'product', 'quantity']
  excelExportValue: any
  excelExportMapping: any
  tableData: any
  // dataSource: MatTableDataSource<any>
  realtimeData: MatTableDataSource<any>
  originData: MatTableDataSource<any>
  dataToExcel: any
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FinanceOrderDialogComponent>,
    private transportEndpoint: TransportEndpoint,
    private sweetAlert: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  closeDialog() {
    this.dialogRef.close()
  }

  ngOnInit() {
    this.dataToExcel = {}
    this.excelExportMapping = new TransportInventoryExcelExportMapping()
    this.dataToExcel.data = this.data
    this.getApiData(this.data.TransportId)
  }

  getApiData(id) {
    this.transportEndpoint._getTransportRealtimeStock(id).subscribe((res) => {
      console.log(res)
      // this.tableData = res
      this.originData = new MatTableDataSource(res['TransportFreight'])
      this.realtimeData = new MatTableDataSource(res['RealTimeStock'])
      this.dataToExcel.TransportFreight = res['TransportFreight']
      this.dataToExcel.RealTimeStock = res['RealTimeStock']
      this.excelExportValue = this.excelExportMapping.mapping(this.dataToExcel)
    })
  }
}
