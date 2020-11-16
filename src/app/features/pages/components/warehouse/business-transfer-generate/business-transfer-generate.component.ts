import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MockData } from '../../../../../shared/mock-data'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { NewTicketImageComponent } from '../../order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { ShowImagesComponent } from '../../../../../shared/common-components/show-images/show-images.component'
import { TransferProductRow } from './business-transfer-generate-new-product/transferProductRow'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'

import { AppConfigStore } from '../../../../../core/services/app-config.store'

@Component({
  selector: 'app-business-transfer-generate',
  templateUrl: './business-transfer-generate.component.html',
  styleUrls: ['./business-transfer-generate.component.css'],
})
export class BusinessTransferGenerateComponent implements OnInit {
  warehosueFC = new FormControl()
  // public initTableData = [{}]
  public customersDropDown: any[] = []
  public customersDetails: any
  public outCustomer: any = {
    CustomerId: '',
    CustomerName: '',
    Phone: '',
    Email: '',
  }
  public inCustomer: any = {
    CustomerId: '',
    CustomerName: '',
    Phone: '',
    Email: '',
  }
  public showOutCustomer: boolean = false
  public showInCustomer: boolean = false
  public temUrlsArray: any[] = []
  public showImgUrls: any[] = []
  @ViewChild('newProductTable') newProductTable
  // @Output() childEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryEndpoint,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog,
    public warehouseService: WarehouseEndpoint,
    private dialogRef: MatDialogRef<BusinessTransferGenerateComponent>,
    private appConfigStore: AppConfigStore
  ) {}

  ngOnInit() {
    this.getCustomers()
  }

  private getCustomers(): void {
    this.inventoryService.getCustomersList().subscribe((value) => {
      this.customersDetails = value
      this.convertToCustomerDropDown(this.customersDetails)
    })
  }

  private convertToCustomerDropDown(jsonOb: any): void {
    for (let customer of jsonOb) {
      this.customersDropDown.push({
        view: customer['CustomerName'] + ' --- ' + customer['CustomerCode'],
        value: customer['CustomerId'],
      })
    }
  }

  public getOutputCustomer(outCustomerId): void {
    // console.log(outCustomerId)
    this.outCustomer = this.convertObjectForHTML(outCustomerId)
    this.showOutCustomer = true
    this.checkSameCustomer()
  }

  public getInputCustomer(inputCustomerId): void {
    // console.log(inputCustomerId)
    this.inCustomer = this.convertObjectForHTML(inputCustomerId)
    this.showInCustomer = true
    this.checkSameCustomer()
  }

  private convertObjectForHTML(customerId: number): any {
    let resArray: any[] = this.customersDetails.filter((customer) => customer['CustomerId'] == customerId)
    let resObject = {
      CustomerId: resArray[0]['CustomerId'],
      CustomerName: resArray[0]['CustomerName'],
      Phone: resArray[0]['Phone'],
      Email: resArray[0]['Email'],
    }
    return resObject
  }

  private checkSameCustomer(): void {
    if (this.outCustomer['CustomerId'] == this.inCustomer['CustomerId']) {
      this.sweetAlert.showSweetAlert('Transfer-out and transfer-in cannot be the same customer！')
    }
  }

  public addImages(): void {
    const dialogRef = this.dialog.open(NewTicketImageComponent, {
      disableClose: true, // disable clicking to close the dialog coz it would not upload the pic
      width: '800px',
      height: '60%',
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        for (let url of result) {
          this.temUrlsArray.push(url.FileNameForStorage)
          this.showImgUrls.push(url)
        }
      }
    })
  }

  public showImages(): void {
    if (this.temUrlsArray.length == 0) {
      this.sweetAlert.showSweetAlert('No photos uploaded yet！')
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
          this.temUrlsArray = returnedUrlsArray
        }
      })
    }
  }

  public confirmTransfer(): void {
    let noError = true
    if (this.outCustomer.CustomerId == '' || this.inCustomer.CustomerId == '') {
      this.sweetAlert.showSweetAlert('Please fill in transfer-out and transfer-in customers！')
      noError = false
    } else {
      if (this.temUrlsArray.length == 0) {
        this.sweetAlert.showSweetAlert('Please upload attachment！')
        noError = false
      } else {
        let res = this.checkDuplicateProducts()
        if (res) {
          this.sweetAlert.showSweetAlert('There are duplicate products, please reselect！')
          noError = false
        }
      }
    }

    if (noError) {
      console.log('gogogo')
      this.convertToApiObject()
    }
  }

  private checkDuplicateProducts(): boolean {
    let productIdArray: any[] = []
    productIdArray = this.newProductTable.productRowsForTable.map((product) => {
      return product.ProductControl.value
    })
    for (let id of productIdArray) {
      let temArray: number[] = []
      // id == '' when no product selected
      temArray = productIdArray.filter((product) => product == id && id != '')
      console.log(id)
      if (temArray.length > 1) {
        return true
      }
    }
    return false
  }

  private convertToApiObject(): void {
    let jsonObjectToAPI = {
      FromCustomerId: this.outCustomer.CustomerId,
      ToCustomerId: this.inCustomer.CustomerId,
      Urls: this.temUrlsArray,
      transferApplicationDetails: [],
    }
    console.log(this.newProductTable.productRowsForTable)
    for (let transferProductRow of this.newProductTable.productRowsForTable) {
      if (transferProductRow.WarehouseControl.value) {
        let detail = {
          baseProductId: transferProductRow.ProductControl.value,
          warehouseId: transferProductRow.WarehouseControl.value.WarehouseId,
          transportId: transferProductRow.WarehouseControl.value.TransportId,
          quantity: transferProductRow.stockQuantity,
        }
        jsonObjectToAPI['transferApplicationDetails'].push(detail)
      }

      // if (transferProductRow.pickedTransportWarehouse) {
      //   let detail = {
      //     baseProductId: transferProductRow.ProductControl.value,
      //     warehouseId: transferProductRow.pickedTransportWarehouse.WarehouseId,
      //     transportId: transferProductRow.pickedTransportWarehouse.TransportId,
      //     quantity: transferProductRow.transportQuantity,
      //   }
      //   jsonObjectToAPI['transferApplicationDetails'].push(detail)
      // }
    }

    if (jsonObjectToAPI['transferApplicationDetails'].length == 0) {
      this.sweetAlert.showSweetAlert('Please select at least one product for inventory transfer！')
    } else {
      console.log(jsonObjectToAPI)
      this.postToApi(jsonObjectToAPI)
    }
  }

  private postToApi(jsonObjectToAPI): void {
    let userId = this.appConfigStore.userID
    console.log(userId)
    this.warehouseService.createTransferApplication(userId, jsonObjectToAPI).subscribe((value) => {
      this.sweetAlert.showSuccessMessage('Customer inventory transfer was successfully created！')
      this.dialogRef.close()
    })
  }
}

/*

// private convertToApiObject(): void {
  //   let jsonObjectToAPI = {
  //     FromCustomerId: this.outCustomer.CustomerId,
  //     ToCustomerId: this.inCustomer.CustomerId,
  //     Urls: this.temUrlsArray,
  //     transferApplicationDetails: [],
  //   }

  //   for (let transferProductRow of this.newProductTable.productRowsForTable) {
  //     for (let warehouseTransfer of transferProductRow.WarehouseList) {
  //       if (warehouseTransfer.transferQuantity != 0) {
  //         let detail = {
  //           baseProductId: transferProductRow.ProductControl.value,
  //           warehouseId: warehouseTransfer.WarehouseId,
  //           transportId: null,
  //           quantity: warehouseTransfer.transferQuantity,
  //         }
  //         jsonObjectToAPI['transferApplicationDetails'].push(detail)
  //       }
  //     }

  //     for (let transportTransfer of transferProductRow.TransportList) {
  //       if (transportTransfer.transferQuantity != 0) {
  //         let detail = {
  //           baseProductId: transferProductRow.ProductControl.value,
  //           warehouseId: transportTransfer.WarehouseId,
  //           transportId: transportTransfer.TransportId,
  //           quantity: transportTransfer.transferQuantity,
  //         }
  //         jsonObjectToAPI['transferApplicationDetails'].push(detail)
  //       }
  //     }
  //   }
  //   if (jsonObjectToAPI['transferApplicationDetails'].length == 0) {
  //     this.sweetAlert.showSweetAlert('Please select at least one product for inventory transfer！')
  //   } else {
  //     console.log(jsonObjectToAPI)
  //     this.postToApi(jsonObjectToAPI)
  //   }
  // }

  // private postToApi(jsonObjectToAPI): void {
  //   let userId = this.appConfigStore.userID
  //   console.log(userId)
  //   this.warehouseService.createTransferApplication(userId, jsonObjectToAPI).subscribe((value) => {
  //     this.sweetAlert.showSuccessMessage('Customer inventory transfer was successfully created！')
  //     this.dialogRef.close()
  //   })
  // }

  // public test() {
  //   console.log(this.newProductTable.productRowsForTable)
  // }








else{
        for (let transferProductRow of this.newProductTable.productRowsForTable) {
          let warehouseSum = 0;
          for (let warehouseTransfer of transferProductRow.WarehouseList){
            warehouseSum += warehouseTransfer.transferQuantity;
          }

          let transportSum = 0;
          for (let transportTransfer of transferProductRow.TransportList){
            transportSum += transportTransfer.transferQuantity;
          }
          // if (typeof value.productId != 'number' || value.transferQuantity.value == undefined || typeof value.warehouseId != 'number') {
          //   this.sweetAlert.showSweetAlert('请补全产品信息及数量！')
          //   noError = false
          //   break
          // }
        }
      }


*/
