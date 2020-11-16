import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { NameManagementDialogComponent } from '../../../../common-views/name-management-table/name-management-dialog/name-management-dialog.component'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'

@Component({
  selector: 'app-product-name-management',
  templateUrl: './product-name-management.component.html',
  styleUrls: ['./product-name-management.component.css'],
})
export class ProductNameManagementComponent implements OnInit {
  tableData = []
  isShowTable = false

  constructor(private productEndpoint: ProductEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getProductData()
  }

  getProductData() {
    this.tableData = []
    this.isShowTable = false
    this.productEndpoint
      ._GetProductNameMapping()
      .toPromise()
      .then((res: any) => {
        res.map((value: any) => {
          this.tableData.push({
            MappingId: value.MappingId,
            Id: value.ProductId,
            Name: value.ProductCode ? value.ProductName + ' -- ' + value.ProductCode : value.ProductName,
            NameString: value.NameString,
            TimeStamp: value.TimeStamp,
            CreatedAt: value.CreatedAt,
          })
        })
        this.sweetAlertService.successAlert('Data extracted successfully！')
        this.isShowTable = true
      })
  }

  openNameDialog() {
    const dialogRef = this.dialog.open(NameManagementDialogComponent, {
      data: '新建产品',
      autoFocus: false,
    })
    dialogRef.componentInstance.outputDataMapping.subscribe((result) => {
      if (result) {
        this.productEndpoint._PostNewProductNameMapping([result]).subscribe((_) => {
          this.sweetAlertService.successAlert('Successfully created! Check to re-extract data.')
        })
      }
    })
  }
}
