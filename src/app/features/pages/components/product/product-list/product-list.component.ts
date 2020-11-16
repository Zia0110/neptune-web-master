import { AfterViewInit, Component, NgModule, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { MockData } from '../../../../../shared/mock-data'
import { ProductList } from '../../../../../types/product-list.interface'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'
import { PriceViewDialogComponent } from '../../finance/products/price-view-dialog/price-view-dialog.component'
import { ProductDetailEditComponent } from '../product-detail-edit/product-detail-edit.component'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  dataSourceBase = new MatTableDataSource()
  displayedColumnsBase: string[] = ['productName', 'category', 'placeOfOrigin', 'image', 'buttons']
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = [
    // 'productId',
    'productName',
    // 'productCode',
    // 'category',
    // 'placeOfOrigin',
    'productType',
    'uom',
    'image',
    'buttons',
  ]
  editDialog = false
  // 内容选择
  selected = 'base'

  // this component will init the product table
  constructor(public dialog: MatDialog, private productEndpoint: ProductEndpoint, private sweetAlertService: SweetAlertService) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  getProductDetails: any
  getCategory1: any
  getCategory2: any
  getCategory3: any
  getPlaceOfOrigin: any
  getSupplier: any
  getProductType: any

  ngOnInit() {
    this.getSelect()
    this.getBaseProductsDataApi()
    this.getProductsDataApi()
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort
    this.dataSourceBase.paginator = this.paginator
  }

  changeTable(type) {
    if (this.selected === type) {
      return
    }
    this.selected = this.selected === 'base' ? 'detail' : 'base'
    setTimeout(() => {
      type === 'base' ? (this.dataSourceBase.paginator = this.paginator) : (this.dataSource.paginator = this.paginator)
      if (type === 'base') {
        this.dataSource.filter = ''
      } else {
        this.dataSourceBase.filter = ''
      }
    })
  }

  // get all data from API
  getProductsDataApi() {
    this.productEndpoint._getProductsList().subscribe((response: any) => {
      // console.log(response)
      this.dataSource.data = response
      // console.log(response)
    })
  }

  // get all base data from API
  getBaseProductsDataApi() {
    this.productEndpoint._getBaseProductsList().subscribe((response: any) => {
      this.dataSourceBase.data = response
    })
  }

  // this function is used to open a modal and add new data of product
  addNewData_dialog(boolean) {
    this.selected === 'base'
      ? this.dialog
          .open(ProductDetailEditComponent, {
            width: '100%',
            data: {
              alldata: this.dataSourceBase.data,
              category1: this.getCategory1,
              category2: this.getCategory2,
              category3: this.getCategory3,
              placeOfOrigin: this.getPlaceOfOrigin,
              supplier: this.getSupplier,
              boolean,
              type: 'base',
            },
          })
          .afterClosed()
          .subscribe((res) => this.ngOnInit())
      : this.dialog
          .open(ProductDetailEditComponent, {
            width: '100%',
            data: {
              alldata: this.dataSource.data,
              category1: this.getCategory1,
              category2: this.getCategory2,
              category3: this.getCategory3,
              placeOfOrigin: this.getPlaceOfOrigin,
              supplier: this.getSupplier,
              productType: this.getProductType,
              boolean,
              type: 'detail',
            },
          })
          .afterClosed()
          .subscribe((res) => {
            this.ngOnInit()
          })
  }

  // get data of select box from API
  getSelect() {
    this.productEndpoint._getCategory1().subscribe((response) => {
      this.getCategory1 = response
    })
    this.productEndpoint._getCategory2().subscribe((response) => {
      this.getCategory2 = response
    })
    this.productEndpoint._getCategory3().subscribe((response) => {
      this.getCategory3 = response
    })
    this.productEndpoint._getPlaceOfOrigin().subscribe((response) => {
      this.getPlaceOfOrigin = response
    })
    this.productEndpoint._getSupplier().subscribe((response) => {
      this.getSupplier = response
    })
    this.getProductType = this.productEndpoint.appConfigStore.appSettings.Mapping.ProductType
  }

  // this function is used to open a modal and show all data of product or edit data of product
  getRowData_dialog(RowData, boolean) {
    this.selected === 'base'
      ? // this.productEndpoint._getBaseProductDetails(RowData.BaseProductId)
        //   .subscribe((response) => {})
        this.dialog
          .open(ProductDetailEditComponent, {
            width: '100%',
            data: {
              response: RowData,
              category1: this.getCategory1,
              category2: this.getCategory2,
              category3: this.getCategory3,
              placeOfOrigin: this.getPlaceOfOrigin,
              supplier: this.getSupplier,
              boolean,
              type: 'base',
            },
          })
          .afterClosed()
          .subscribe((res) => this.getBaseProductsDataApi())
      : this.productEndpoint._getProductDetails(RowData.ProductId).subscribe((response) => {
          this.dialog
            .open(ProductDetailEditComponent, {
              width: '100%',
              data: {
                response,
                productType: this.getProductType,
                boolean,
                type: 'detail',
              },
            })
            .afterClosed()
            .subscribe((res) => this.getProductsDataApi())
        })
  }

  deleteProduct() {}

  public doFilter = (value: string) => {
    if (this.selected === 'base') {
      this.dataSourceBase.filter = value.trim().toLocaleLowerCase()
      this.dataSource.filter = ''
    } else {
      this.dataSource.filter = value.trim().toLocaleLowerCase()
      this.dataSourceBase.filter = ''
    }
  }

  openPriceView(element) {
    this.dialog.open(PriceViewDialogComponent, {
      width: '100%',
      height: '97%',
      autoFocus: false,
      data: {
        id: element.ProductId,
        name: element.ProductCode + ' -- ' + element.ProductName,
      },
    })
  }
}
