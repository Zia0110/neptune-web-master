import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-wholesale-order-dialog',
  templateUrl: './wholesale-order-dialog.component.html',
  styleUrls: ['./wholesale-order-dialog.component.css'],
})
export class WholesaleOrderDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'summaryInfo', 'date', 'wholeSaleDetail']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetWholeSaleOrderWithTransport(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              summaryInfo: {
                CustomerId: value.CustomerId,
                CustomerCode: `（${value.CustomerCode}）${value.CustomerName}`,
                InclGst: value.InclGst,
                StatusName: value.StatusName,
                PaidUserName: value.PaidUserName,
                Comment: value.Comment,
                CreatedUserName: value.CreatedUserName,
                CanceledUserName: value.CanceledUserName,
              },
              date: {
                CreatedAt: value.CreatedAt,
                PaidAt: value.PaidAt,
              },
              wholeSaleDetail: value.WholeSaleDetail,
            })
          })
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator
        })
    }
  }

  getCardProductName(code, name) {
    return `（${code}）${name}`
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }
}
