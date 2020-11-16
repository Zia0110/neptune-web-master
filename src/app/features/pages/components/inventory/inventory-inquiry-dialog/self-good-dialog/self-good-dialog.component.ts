import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-self-good-dialog',
  templateUrl: './self-good-dialog.component.html',
  styleUrls: ['./self-good-dialog.component.css'],
})
export class SelfGoodDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'customer', 'product', 'other', 'image']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetSelfGoodsByIds(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              customer: {
                CustomerId: value.CustomerId,
                CustomerName: value.CustomerName,
                CustomerCode: value.CustomerCode,
                FirstName: value.FirstName,
              },
              product: {
                ProductId: value.ProductId,
                ProductName: value.ProductName,
                ProductCode: value.ProductCode,
                Quantity: value.Quantity,
              },
              other: {
                Warehouse: value.WarehouseName,
                Comment: value.Comment,
                CreatedAt: value.CreatedAt,
                CreatedUserName: value.CreatedUserName,
                CanceledUserName: value.CanceledUserName,
              },
              image: value.SelfGoodsImage,
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
