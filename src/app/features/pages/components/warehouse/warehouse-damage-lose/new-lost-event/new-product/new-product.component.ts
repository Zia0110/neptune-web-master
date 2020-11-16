import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { FormArray, FormGroup, FormBuilder } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { NewTicketImageComponent } from '../../../../order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { ShowImagesComponent } from '../../../../../../../shared/common-components/show-images/show-images.component'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../../../../services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  @Input() tableData: any
  @Input() pickedWarehouseId
  @Input() pickedStockCustomerId
  public displayedColumns: string[] = ['productName', '实际库存', 'quantityOfProduct', 'images', 'actions']
  public dataSource: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  public productsForms = new FormArray([])
  public temImagesUrls: string[] = []
  public temQuantityForShowing: number
  public showImgUrls: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private inventoryService: InventoryEndpoint
  ) {}

  ngOnInit(): void {
    this.prepTable()
  }

  ngOnChanges(): void {
    console.log(this.pickedWarehouseId)
    console.log(this.pickedStockCustomerId)
    // this.prepTable()
  }

  private prepTable(): void {
    for (let data of this.tableData) {
      this.initFormRows(data)
    }
    console.log(this.productsForms.controls)
    this.dataSource = new MatTableDataSource(this.productsForms.controls)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  private initFormRows(data?): void {
    this.productsForms.push(this.formControlInit(data))
  }

  private formControlInit(data?): FormGroup {
    return this.formBuilder.group({
      productId: [{ value: data.ProductId }],
      productName: [{ value: data.ProductName, disabled: true }],
      quantityOfProduct: [{ value: data.QuantityOfProduct }],
      imagesUrl: [{ value: data.urls }],
      quantityForShowingOnly: 0,
    })
  }

  public addNewFormRow() {
    let newForm = this.formControlInit({})
    this.productsForms.push(newForm)
    this.dataSource._updateChangeSubscription()
  }

  public removeRow(element) {
    this.productsForms.removeAt(this.productsForms.controls.findIndex((form) => form == element))
    this.dataSource._updateChangeSubscription()
  }

  //when having a quantity, needs to assign it the formControl value
  public getQuantity(element, quantity): void {
    let numberQuantity = +quantity
    element.value.quantityOfProduct.value = numberQuantity
  }

  public addImages(element): void {
    const dialogRef = this.dialog.open(NewTicketImageComponent, {
      disableClose: true, // disable clicking to close the dialog coz it would not upload the pic
      width: '1200px',
      height: '80%',
    })
    // needs to add the url one by one to a tem array
    // then assign the tem array to control

    if (element.value.imagesUrl.value == undefined) {
      element.value.imagesUrl.value = []
    }
    let temArray: string[] = []
    for (let url of element.value.imagesUrl.value) {
      temArray.push(url)
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        for (let url of result) {
          temArray.push(url.FileNameForStorage)
          this.showImgUrls.push(url)
        }
        element.value.imagesUrl.value = temArray
      }
    })
  }

  public showImages(element): void {
    let urls = element.value.imagesUrl.value
    console.log(urls)
    if (urls == undefined) {
      this.sweetAlert.showSweetAlert('No Images!')
    } else {
      const dialogRef = this.dialog.open(ShowImagesComponent, {
        width: '1200px',
        height: '80%',
        data: {
          urlsArray: this.showImgUrls,
          deleteAllowed: true,
        },
      })

      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          let returnedUrlsArray: string[] = []
          for (let url of result) {
            returnedUrlsArray.push(url)
          }
          element.value.imagesUrl.value = returnedUrlsArray
        }
      })
    }
  }

  public getProduct(element): void {
    console.log(element)
    //value here is the picked productId
    element.controls.productId.valueChanges.subscribe((value) => {
      setTimeout(() => {
        if (value) {
          this.getDataForWarehouse(element, value)
        }
      })
    })
  }

  private getDataForWarehouse(element, productId): void {
    console.log(productId)
    console.log(this.pickedWarehouseId)
    console.log(this.pickedStockCustomerId)

    if (this.pickedStockCustomerId == '' || this.pickedWarehouseId == '') {
      this.sweetAlert.showSweetAlert('Please select warehouse and stock customer!')
    } else {
      this.inventoryService.getTransferDataByProductIdAndOutCustomerId(productId, this.pickedStockCustomerId).subscribe((value) => {
        console.log(value)
        // let temQuantityForShowing: number = 0;
        // if (value["Stock"].length == 0){
        //   return temQuantityForShowing
        // }else{
        //   for (let stock of value["Stock"]){
        //     if (stock.WarehouseId == this.pickedWarehouseId){
        //       temQuantityForShowing = stock.Quantity;
        //       console.log(temQuantityForShowing)
        //       return temQuantityForShowing;
        //     }
        //   }
        // }
        this.temQuantityForShowing = 0
        for (let stock of value['Stock']) {
          if (stock.WarehouseId == this.pickedWarehouseId) {
            this.temQuantityForShowing = stock.Quantity
            console.log(this.temQuantityForShowing)
            element.value.quantityForShowingOnly = this.temQuantityForShowing
            break
          }
        }
      })
    }
  }

  public test1(): void {
    console.log(this.productsForms.controls)
  }
}

/*
These two are the formarray example:
transport-plan-new.component.html
transport-product-table.component.html





*/
