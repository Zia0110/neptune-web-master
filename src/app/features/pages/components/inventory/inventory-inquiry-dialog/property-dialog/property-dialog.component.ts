import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { ShowImagesComponent } from '../../../../../../shared/common-components/show-images/show-images.component'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-property-dialog',
  templateUrl: './property-dialog.component.html',
  styleUrls: ['./property-dialog.component.css'],
})
export class PropertyDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'summaryInfo', 'date', 'product']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint, public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetLostEventByPropertyId(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              summaryInfo: {
                WarehouseName: value.WarehouseName,
                LostTypeName: value.LostTypeName,
                Comments: value.Comments,
                CreatedUserName: value.CreatedUserName,
                CanceledUserName: value.CanceledUserName,
              },
              date: {
                CreatedAt: value.CreatedAt,
              },
              product: {
                ProductId: value.ProductId,
                ProductName: value.ProductName,
                ProductCode: `（${value.ProductCode}）${value.ProductName}`,
                Qty: value.Qty,
                LostPropertyImage: value.LostPropertyImage,
              },
            })
          })
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator
        })
    }
  }

  public showImages(property): void {
    if (!property.LostPropertyImage.length) {
      return
    } else {
      console.log(property)
      const urlArray: string[] = []
      for (const url of property.LostPropertyImage) {
        urlArray.push(url.Url)
      }
      this.dialog.open(ShowImagesComponent, {
        width: '95%',
        height: '90%',
        data: {
          urlsArray: urlArray,
          deleteAllowed: false,
          ProductName: property.ProductName,
          Qty: property.Qty,
        },
      })
    }
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }
}
