import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'
import { SupplierItemDialogComponent } from './supplier-item-dialog/supplier-item-dialog.component'

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.css'],
})
export class SupplierManagementComponent implements OnInit {
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'name', 'isDisplay', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  isShowTable = false

  constructor(private sweetAlertService: SweetAlertService, public dialog: MatDialog, private productEndpoint: ProductEndpoint) {}

  ngOnInit(): void {
    this.productEndpoint
      ._getAllSupplier()
      .toPromise()
      .then((res: any) => (this.dataSource.data = res))
  }

  setTableContent(data) {
    this.ELEMENT_DATA = []
    data.map((value: any, index: number) => {
      this.ELEMENT_DATA.push({
        position: index + 1,
        email: value.Email,
        handle: {
          position: index + 1,
          emailId: value.EmailId,
          email: value.Email,
        },
      })
    })
    this.dataSource.data = this.ELEMENT_DATA
  }

  openDialog(element?) {
    console.log(element)
    const dialogRef = this.dialog.open(SupplierItemDialogComponent, {
      data: element ? element : '',
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        const postData = {
          supplierName: result.name,
          display: result.isDisplay,
        }
        if (!element) {
          this.productEndpoint._newSupplier(postData).subscribe((_) => {
            this.sweetAlertService.successAlert('Add success！')
            this.productEndpoint
              ._getAllSupplier()
              .toPromise()
              .then((res: any) => (this.dataSource.data = res))
          })
        } else {
          this.productEndpoint._updateSupplier(element.SupplierId, postData).subscribe((_) => {
            this.sweetAlertService.successAlert('Modify success！')
            this.productEndpoint
              ._getAllSupplier()
              .toPromise()
              .then((res: any) => (this.dataSource.data = res))
          })
        }
      }
    })
  }
}
