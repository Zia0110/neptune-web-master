import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { StockCustomerMappingDialogComponent } from './stock-customer-mapping-dialog/stock-customer-mapping-dialog.component'

@Component({
  selector: 'app-stock-customer-mapping-management',
  templateUrl: './stock-customer-mapping-management.component.html',
  styleUrls: ['./stock-customer-mapping-management.component.css'],
})
export class StockCustomerMappingManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'customer', 'mapping', 'handle']
  dataSource = new MatTableDataSource()

  constructor(public dialog: MatDialog, private clientEndpoint: ClientEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    this.clientEndpoint
      ._getAllStockCustomerMapping()
      .toPromise()
      .then((res: any) => {
        this.dataSource.data = res
      })
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(StockCustomerMappingDialogComponent, {
      autoFocus: false,
      data: element ? element : '',
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          this.clientEndpoint
            ._newStockCustomerMapping([
              {
                stockCustomerInfo: result.stockCustomerInfo,
                customerId: result.customerId,
              },
            ])
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Add succeeded!')
              this.getAllData()
            })
        } else {
          this.clientEndpoint
            ._updateStockCustomerMapping(element.MappingId, {
              stockCustomerInfo: result.stockCustomerInfo,
              customerId: result.customerId,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Modified succeeded！')
              this.getAllData()
            })
        }
      }
    })
  }

  async deleteItem(id) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.clientEndpoint._deleteStockCustomerMapping(id).subscribe((_) => {
      this.sweetAlertService.successAlert('Delete succeeded')
      this.getAllData()
    })
  }
}
