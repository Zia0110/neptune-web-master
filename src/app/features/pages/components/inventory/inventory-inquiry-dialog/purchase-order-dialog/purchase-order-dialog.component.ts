import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-purchase-order-dialog',
  templateUrl: './purchase-order-dialog.component.html',
  styleUrls: ['./purchase-order-dialog.component.css'],
})
export class PurchaseOrderDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'summaryInfo', 'priceInfo']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetPurchaseOrderByOrderNo(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              summaryInfo: {
                OrderNo: value.OrderNo,
                SupplierName: value.SupplierName,
                ApplyComments: value.ApplyComments,
                ApplyUserName: value.ApplyUserName,
                CanceledUserName: value.CanceledUserName,
              },
              priceInfo: {
                PurchaseOrderDetail: value.PurchaseOrderDetail,
                PurchaseOrderPrice: value.PurchaseOrderPrice,
              },
            })
          })
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator
        })
    }
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }
}
