import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'
import { CustomerGroupNameDialogComponent } from '../customer-group-management/customer-group-name-dialog/customer-group-name-dialog.component'

@Component({
  selector: 'app-place-of-orgin-management',
  templateUrl: './place-of-orgin-management.component.html',
  styleUrls: ['./place-of-orgin-management.component.css'],
})
export class PlaceOfOrginManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'handle']
  dataSource = new MatTableDataSource()

  constructor(public dialog: MatDialog, private productEndpoint: ProductEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    this.productEndpoint
      ._getAllPlaceOfOrigin()
      .toPromise()
      .then((res: any) => {
        this.dataSource.data = res
      })
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(CustomerGroupNameDialogComponent, {})
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          this.productEndpoint
            ._newPlaceOfOrigin({
              placeOfOrigin1: result,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Add succeeded!')
              this.getAllData()
            })
        } else {
          this.productEndpoint
            ._updatePlaceOfOrigin(element.PlaceOfOriginId, {
              PlaceOfOriginId: element.PlaceOfOriginId,
              placeOfOrigin1: result,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Modified succeeded！')
              this.getAllData()
            })
        }
      }
    })
  }
}
