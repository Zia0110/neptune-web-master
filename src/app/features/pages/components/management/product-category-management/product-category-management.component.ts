import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'
import { CustomerGroupNameDialogComponent } from '../customer-group-management/customer-group-name-dialog/customer-group-name-dialog.component'

@Component({
  selector: 'app-product-category-management',
  templateUrl: './product-category-management.component.html',
  styleUrls: ['./product-category-management.component.css'],
})
export class ProductCategoryManagementComponent implements OnInit {
  selectedType: any
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'name', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  group1Data: any
  group2Data: any
  group3Data: any

  constructor(public dialog: MatDialog, private productEndpoint: ProductEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.productEndpoint
      ._GetProductCategory1()
      .toPromise()
      .then((res) => (this.group1Data = res))
    this.productEndpoint
      ._GetProductCategory2()
      .toPromise()
      .then((res) => (this.group2Data = res))
    this.productEndpoint
      ._GetProductCategory3()
      .toPromise()
      .then((res) => (this.group3Data = res))
  }

  changeTable(type) {
    switch (type) {
      case 'group1':
        this.selectedType = type
        this.dataSource.data = this.group1Data
        break
      case 'group2':
        this.selectedType = type
        this.dataSource.data = this.group2Data
        break
      case 'group3':
        this.selectedType = type
        this.dataSource.data = this.group3Data
        break
    }
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(CustomerGroupNameDialogComponent, {})
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          switch (this.selectedType) {
            case 'group1':
              this.productEndpoint
                ._NewProductCategory1({
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Add success!')
                  this.productEndpoint
                    ._GetProductCategory1()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
            case 'group2':
              this.productEndpoint
                ._NewProductCategory2({
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Add success！')
                  this.productEndpoint
                    ._GetProductCategory2()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
            case 'group3':
              this.productEndpoint
                ._NewProductCategory3({
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Add success！')
                  this.productEndpoint
                    ._GetProductCategory3()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
          }
        } else {
          switch (this.selectedType) {
            case 'group1':
              this.productEndpoint
                ._UpdateProductCategory1(element.CategoryId1, {
                  CategoryId1: element.CategoryId1,
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Successfully modified ！')
                  this.productEndpoint
                    ._GetProductCategory1()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
            case 'group2':
              this.productEndpoint
                ._UpdateProductCategory2(element.CategoryId2, {
                  CategoryId2: element.CategoryId2,
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Successfully modified ！')
                  this.productEndpoint
                    ._GetProductCategory2()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
            case 'group3':
              this.productEndpoint
                ._UpdateProductCategory3(element.CategoryId3, {
                  CategoryId3: element.CategoryId3,
                  CategoryName: result,
                })
                .subscribe((_) => {
                  this.sweetAlertService.successAlert('Successfully modified ！')
                  this.productEndpoint
                    ._GetProductCategory3()
                    .toPromise()
                    .then((res: any) => (this.dataSource.data = res))
                })
              break
          }
        }
      }
    })
  }
}
