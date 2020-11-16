import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-transport-dialog',
  templateUrl: './transport-dialog.component.html',
  styleUrls: ['./transport-dialog.component.css'],
})
export class TransportDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'summaryInfo', 'date', 'freightInfo']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(@Inject(MAT_DIALOG_DATA) public data, private inventoryService: InventoryEndpoint) {}

  ngOnInit(): void {
    if (this.data.length) {
      this.inventoryService
        .GetTransportById(this.data)
        .toPromise()
        .then((res: any) => {
          res.map((value: any, index: number) => {
            this.ELEMENT_DATA.push({
              position: index + 1,
              summaryInfo: {
                TransportNo: value.TransportNo,
                WarehouseName: value.WarehouseName,
                WarehouseId: value.WarehouseId,
                TransportTypeName: value.TransportTypeName,
                StatusName: value.StatusName,
                UserName: value.ComfirmUserName,
              },
              date: {
                CreatedAt: value.CreatedAt,
                DepartureTime: value.DepartureTime,
                EstimatedArrivalTime: value.EstimatedArrivalTime,
                ArrivalTime: value.ArrivalTime,
              },
              freightInfo: value.FreightInfo,
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
