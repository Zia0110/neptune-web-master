import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-transfer-application-dialog',
  templateUrl: './transfer-application-dialog.component.html',
  styleUrls: ['./transfer-application-dialog.component.css'],
})
export class TransferApplicationDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'summaryInfo', 'detailInfo']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetTransferApplicationByApplicationId(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              summaryInfo: {
                FromCustomerId: value.FromCustomerId,
                FromCustomerName: value.FromCustomerName,
                FromCustomerCode: value.FromCustomerCode,
                ToCustomerId: value.ToCustomerId,
                ToCustomerName: value.ToCustomerName,
                ToCustomerCode: value.ToCustomerCode,
                CreatedAt: value.CreatedAt,
                CreatedUserName: value.CreatedUserName,
                CanceledUserName: value.CanceledUserName,
              },
              detailInfo: {
                Details: value.Details,
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
