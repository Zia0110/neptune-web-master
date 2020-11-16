import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { BusinessTransferRow } from '../businessTransferRow'
import { FormControl } from '@angular/forms'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { ShowImagesComponent } from '../../../../../../shared/common-components/show-images/show-images.component'
import { NewTicketImageComponent } from '../../../order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import Swal from 'sweetalert2'
import { from } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'

@Component({
  selector: 'app-business-transfer-change',
  templateUrl: './business-transfer-change.component.html',
  styleUrls: ['./business-transfer-change.component.css'],
})
export class BusinessTransferChangeComponent implements OnInit {
  public rowObject: BusinessTransferRow
  public fromCustomerId: number
  public productControl = new FormControl('')
  public newProductId: number
  public isWarehouse: boolean
  public newDetailDataFromBackEnd: any

  public currentDataSource: any
  public currentDataForTable: any[] = []

  public currentColumns: string[] = ['产品', '已选择仓库/数量', '已选择产品总数', '可选择仓库转库/数量', 'stockQuantity', '产品总数(新)']
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  public shareQuantity: number
  @ViewChild('newProductTable') newProductTable
  showImgUrls = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public row,
    private inventoryService: InventoryEndpoint,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<BusinessTransferChangeComponent>
  ) {}

  ngOnInit(): void {
    this.initData()
    console.log(this.rowObject)
    this.buildCurrentTable()
  }

  private initData(): void {
    this.rowObject = this.row
    this.fromCustomerId = this.rowObject.FromCustomerId
  }

  private buildCurrentTable(): void {
    this.setCurrentDetailsForTable()
    this.setFutureDetalsForTable()
    this.currentDataSource = new MatTableDataSource<BusinessTransferRow>(this.currentDataForTable)
    this.currentDataSource.paginator = this.paginator
  }

  // set existing data, product, picked product with warehouse and quantity
  // and we create rowForTable here
  private setCurrentDetailsForTable(): void {
    this.currentDataForTable.length = 0
    let temArray: any[] = []
    let detailsArray: any[] = []
    for (let stock of this.rowObject.WarehouseList) {
      detailsArray.push(stock)
    }
    for (let transport of this.rowObject.TransportList) {
      detailsArray.push(transport)
    }
    const source = from(detailsArray)
    source
      .pipe(
        groupBy((stock) => stock['BaseProductId']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        temArray.push(val)
      })

    for (let details of temArray) {
      let rowForTable = {
        ProductName: '',
        TotalQuantity: 0, // picked quantity
        newTotalQuantity: 0, // repicked quantity, increasing until equals to TotalQuantity
        CurrentDetails: [],
        BaseProductId: 0,
        WarehouseList: [],
        WarehouseControl: new FormControl(),
        TransportList: [],
      }
      for (let detail of details) {
        rowForTable.ProductName = detail.ProductName
        rowForTable.BaseProductId = detail.BaseProductId
        rowForTable.TotalQuantity += detail.Quantity
        let temObject = {
          WarehouseId: detail.WarehouseId,
          WarehouseName: detail.WarehouseName,
          TransportNo: detail.TransportNo,
          Quantity: detail.Quantity,
        }
        rowForTable.CurrentDetails.push(temObject)
        rowForTable.WarehouseControl = new FormControl()
      }
      this.currentDataForTable.push(rowForTable)
    }
  }

  //call api to grap what user can be able to pick (same with new product)
  private setFutureDetalsForTable(): void {
    console.log(this.currentDataForTable)
    for (let row of this.currentDataForTable) {
      this.inventoryService.getTransferDataByProductIdAndOutCustomerId(row.BaseProductId, this.fromCustomerId).subscribe((value) => {
        for (let stock of value['Stock']) {
          stock['transferQuantity'] = 0
          row['WarehouseList'].push(stock)
        }
        for (let transport of value['Transports']) {
          transport['transferQuantity'] = 0
          row['TransportList'].push(transport)
        }
      })
    }
    console.log(this.currentDataForTable)
  }

  public getNewQuantity(row, detail, newQuantity): void {
    detail.transferQuantity = newQuantity
    let temTotal: number = 0
    temTotal = this.getTemTotalNumber(row)
    if (temTotal > row.TotalQuantity) {
      this.sweetAlert.showSweetAlert('number of new configurations exceeds original number, please reselect!')
      return
    }
    row.newTotalQuantity = temTotal
    this.currentDataSource._updateChangeSubscription()
  }

  private getTemTotalNumber(row): number {
    let res: number = 0
    for (let stock of row.WarehouseList) {
      res += stock.transferQuantity
    }
    for (let tran of row.TransportList) {
      res += tran.transferQuantity
    }
    return res
  }

  public confirmChange(): void {
    // console.log(this.currentDataForTable)
    // console.log(this.rowObject.AttachedImages)
    let temRes: boolean = this.checkNumbersMatch()
    if (temRes) {
      this.convertToObjectForPosting()
    }
  }

  //to check that new number must be equal to totalQuantity
  private checkNumbersMatch(): boolean {
    for (let transferProductRow of this.currentDataForTable) {
      let temTotal: number = 0
      if (transferProductRow.pickedStockQuantity) {
        temTotal += transferProductRow.pickedStockQuantity
      }

      if (transferProductRow.pickedTransportQuantity) {
        temTotal += transferProductRow.pickedTransportQuantity
      }

      if (temTotal != transferProductRow.TotalQuantity) {
        this.sweetAlert.showSweetAlert('new configuration number is inconsistent with original one, please choose again!')
        return false
      }
    }
    return true
  }

  // we need to loop those datas and grab what we need to PUT
  private convertToObjectForPosting(): void {
    console.log(this.currentDataForTable)
    const imgs = []
    this.rowObject.AttachedImages.map((row) => {
      if (row.includes('aliyuncs')) {
        const rowId = row.match(/aliyuncs\.com\/(\S*)\?Expires=/)[1]
        if (!imgs.includes(rowId)) {
          imgs.push(rowId)
        }
      } else {
        if (!imgs.includes(row)) {
          imgs.push(row)
        }
      }
    })
    let objectToPost = {
      applicationId: this.rowObject.ApplicationId,
      urls: imgs,
      transferApplicationDetails: [],
    }

    for (let transferProductRow of this.currentDataForTable) {
      if (transferProductRow.WarehouseControl.value) {
        let detail = {
          baseProductId: transferProductRow.BaseProductId,
          warehouseId: transferProductRow.WarehouseControl.value.WarehouseId,
          transportId: transferProductRow.WarehouseControl.value.TransportId,
          quantity: transferProductRow.pickedStockQuantity,
        }
        objectToPost['transferApplicationDetails'].push(detail)
      }

      // if (transferProductRow.pickedTransport) {
      //   let detail = {
      //     baseProductId: transferProductRow.BaseProductId,
      //     warehouseId: transferProductRow.pickedTransport.WarehouseId,
      //     transportId: transferProductRow.pickedTransport.TransportId,
      //     quantity: transferProductRow.pickedTransportQuantity,
      //   }
      //   objectToPost['transferApplicationDetails'].push(detail)
      // }
    }

    if (objectToPost['transferApplicationDetails'].length == 0) {
      this.sweetAlert.showSweetAlert('Please select at least one product for inventory transfer！')
    } else {
      console.log(objectToPost)
      this.updataToAPI(objectToPost)
    }
  }

  private updataToAPI(objectToPost): void {
    this.inventoryService.updateTransferApplication(objectToPost).subscribe((res) => {
      console.log(res)
      this.sweetAlert.showSuccessMessage('Successfully modified ！')
      this.dialogRef.close()
    })
  }

  public changeImages(): void {
    let urls = this.rowObject.AttachedImages
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
        for (let url of result) {
          this.rowObject.AttachedImages.push(url)
        }
        // this.dataSource._updateChangeSubscription()
        // need refresh the table
      }
      console.log(this.rowObject)
    })
  }

  public newImages(): void {
    const dialogRef = this.dialog.open(NewTicketImageComponent, {
      disableClose: true,
      width: '1200px',
      height: '80%',
    })

    let temArray: string[] = []
    for (let url of this.rowObject.AttachedImages) {
      temArray.push(url)
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        for (let url of result) {
          temArray.push(url.FileNameForStorage)
          this.showImgUrls.push(url)
        }
        this.rowObject.AttachedImages = temArray
        // this.dataSource._updateChangeSubscription()
      }
      console.log(this.rowObject)
    })
  }

  public getOutputDataForStock(element, stock): void {
    console.log(element)
    console.log(stock)
    element['pickedStock'] = stock
  }

  public getOutputDataForTransport(element, transport): void {
    console.log(element)
    console.log(transport)
    element['pickedTransport'] = transport
  }

  public getWarehouseQuantity(element, event): void {
    console.log(element)
    console.log(event)
    element['pickedStockQuantity'] = event

    // detail.transferQuantity = newQuantity
    let temTotal: number = event

    if (temTotal > element.TotalQuantity) {
      this.sweetAlert.showSweetAlert('number of new configurations exceeds original number, please reselect!')
    } else {
      element.newTotalQuantity = temTotal
      this.currentDataSource._updateChangeSubscription()
    }
  }

  public getTransportQuantity(element, event): void {
    console.log(element)
    console.log(event)
    element['pickedTransportQuantity'] = event

    let temTotal: number = element['newTotalQuantity'] + event
    if (temTotal > element.TotalQuantity) {
      this.sweetAlert.showSweetAlert('number of new configurations exceeds original number, please reselect!')
    } else {
      element.newTotalQuantity = temTotal
      this.currentDataSource._updateChangeSubscription()
    }
  }

  public test(): void {
    console.log(this.currentDataForTable)
  }
}

// export class BusinessTransferChangeComponent implements OnInit {
//   public rowObject: BusinessTransferRow
//   public fromCustomerId: number
//   public productControl = new FormControl('')
//   public newProductId: number
//   public isWarehouse: boolean
//   public newDetailDataFromBackEnd: any

//   public currentDataSource: any
//   public currentDataForTable: any[] = []

//   public currentColumns: string[] = ['产品', '已选择仓库/数量', '已选择产品总数', '可选择仓库转库/数量', 'stockQuantity', '可选择运输转库/数量', 'transportQuantity', '产品总数(新)']
//   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
//   public shareQuantity: number
//   @ViewChild('newProductTable') newProductTable

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public row,
//     private inventoryService: InventoryEndpoint,
//     private sweetAlert: SweetAlertService,
//     public dialog: MatDialog,
//     private dialogRef: MatDialogRef<BusinessTransferChangeComponent>
//   ) {}

//   ngOnInit(): void {
//     this.initData()
//     console.log(this.rowObject)
//     this.buildCurrentTable()
//   }

//   private initData(): void {
//     this.rowObject = this.row
//     this.fromCustomerId = this.rowObject.FromCustomerId
//   }

//   private buildCurrentTable(): void {
//     this.setCurrentDetailsForTable()
//     this.setFutureDetalsForTable()
//     this.currentDataSource = new MatTableDataSource<BusinessTransferRow>(this.currentDataForTable)
//     this.currentDataSource.paginator = this.paginator
//   }

//   // set existing data, product, picked product with warehouse and quantity
//   // and we create rowForTable here
//   private setCurrentDetailsForTable(): void {
//     this.currentDataForTable.length = 0
//     let temArray: any[] = []
//     let detailsArray: any[] = []
//     for (let stock of this.rowObject.WarehouseList) {
//       detailsArray.push(stock)
//     }
//     for (let transport of this.rowObject.TransportList) {
//       detailsArray.push(transport)
//     }
//     const source = from(detailsArray)
//     source
//       .pipe(
//         groupBy((stock) => stock['BaseProductId']),
//         mergeMap((group) => group.pipe(toArray()))
//       )

//       .subscribe((val) => {
//         temArray.push(val)
//       })

//     for (let details of temArray) {
//       let rowForTable = {
//         ProductName: '',
//         TotalQuantity: 0, // picked quantity
//         newTotalQuantity: 0, // repicked quantity, increasing until equals to TotalQuantity
//         CurrentDetails: [],
//         BaseProductId: 0,
//         WarehouseList: [],
//         TransportList: [],
//       }
//       for (let detail of details) {
//         rowForTable.ProductName = detail.ProductName
//         rowForTable.BaseProductId = detail.BaseProductId
//         rowForTable.TotalQuantity += detail.Quantity
//         let temObject = {
//           WarehouseId: detail.WarehouseId,
//           WarehouseName: detail.WarehouseName,
//           Quantity: detail.Quantity,
//         }
//         rowForTable.CurrentDetails.push(temObject)
//       }
//       this.currentDataForTable.push(rowForTable)
//     }
//   }

//   //call api to grap what user can be able to pick (same with new product)
//   private setFutureDetalsForTable(): void {
//     console.log(this.currentDataForTable)
//     for (let row of this.currentDataForTable) {
//       this.inventoryService.getTransferDataByProductIdAndOutCustomerId(row.BaseProductId, this.fromCustomerId).subscribe((value) => {
//         for (let stock of value['Stock']) {
//           stock['transferQuantity'] = 0
//           row['WarehouseList'].push(stock)
//         }
//         for (let transport of value['Transports']) {
//           transport['transferQuantity'] = 0
//           row['TransportList'].push(transport)
//         }
//       })
//     }
//     console.log(this.currentDataForTable)
//   }

//   public getNewQuantity(row, detail, newQuantity): void {
//     detail.transferQuantity = newQuantity
//     let temTotal: number = 0
//     temTotal = this.getTemTotalNumber(row)
//     if (temTotal > row.TotalQuantity) {
//       this.sweetAlert.showSweetAlert('number of new configurations exceeds original number, please reselect!')
//     } else {
//       row.newTotalQuantity = temTotal
//       this.currentDataSource._updateChangeSubscription()
//     }
//   }

//   private getTemTotalNumber(row): number {
//     let res: number = 0
//     for (let stock of row.WarehouseList) {
//       res += stock.transferQuantity
//     }
//     for (let tran of row.TransportList) {
//       res += tran.transferQuantity
//     }
//     return res
//   }

//   public confirmChange(): void {
//     // console.log(this.currentDataForTable)
//     // console.log(this.rowObject.AttachedImages)
//     let temRes: boolean = this.checkNumbersMatch()
//     if (temRes) {
//       this.convertToObjectForPosting()
//     }
//   }

//   //to check that new number must be equal to totalQuantity
//   private checkNumbersMatch(): boolean {
//     for (let transferProductRow of this.currentDataForTable) {
//       let temTotal: number = 0
//       for (let warehouseTransfer of transferProductRow.WarehouseList) {
//         if (warehouseTransfer.transferQuantity != 0) {
//           temTotal += warehouseTransfer.transferQuantity
//         }
//       }

//       for (let transportTransfer of transferProductRow.TransportList) {
//         if (transportTransfer.transferQuantity != 0) {
//           temTotal += transportTransfer.transferQuantity
//         }
//       }

//       if (temTotal != transferProductRow.TotalQuantity) {
//         this.sweetAlert.showSweetAlert('new configuration number is inconsistent with original one, please choose again!')
//         return false
//       }
//     }
//     return true
//   }

//   // we need to loop those datas and grab what we need to PUT
//   private convertToObjectForPosting(): void {
//     console.log(this.currentDataForTable)

//     let objectToPost = {
//       applicationId: this.rowObject.ApplicationId,
//       urls: this.rowObject.AttachedImages,
//       transferApplicationDetails: [],
//     }

//     for (let transferProductRow of this.currentDataForTable) {
//       for (let warehouseTransfer of transferProductRow.WarehouseList) {
//         if (warehouseTransfer.transferQuantity != 0) {
//           let detail = {
//             productId: transferProductRow.ProductId,
//             warehouseId: warehouseTransfer.WarehouseId,
//             transportId: null,
//             quantity: warehouseTransfer.transferQuantity,
//           }
//           objectToPost['transferApplicationDetails'].push(detail)
//         }
//       }

//       for (let transportTransfer of transferProductRow.TransportList) {
//         if (transportTransfer.transferQuantity != 0) {
//           let detail = {
//             productId: transferProductRow.ProductId,
//             warehouseId: transportTransfer.WarehouseId,
//             transportId: transportTransfer.TransportId,
//             quantity: transportTransfer.transferQuantity,
//           }
//           objectToPost['transferApplicationDetails'].push(detail)
//         }
//       }
//     }

//     if (objectToPost['transferApplicationDetails'].length == 0) {
//       this.sweetAlert.showSweetAlert('Please select at least one product for inventory transfer！')
//     } else {
//       console.log(objectToPost)
//       this.updataToAPI(objectToPost)
//     }
//   }

//   private updataToAPI(objectToPost): void {
//     this.inventoryService.updateTransferApplication(objectToPost).subscribe((res) => {
//       console.log(res)
//       this.sweetAlert.showSuccessMessage('Successfully modified ！')
//       this.dialogRef.close()
//     })
//   }

//   public changeImages(): void {
//     let urls = this.rowObject.AttachedImages
//     const dialogRef = this.dialog.open(ShowImagesComponent, {
//       width: '1200px',
//       height: '80%',
//       data: {
//         urlsArray: urls,
//         deleteAllowed: true,
//       },
//     })

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result != undefined) {
//         for (let url of result) {
//           this.rowObject.AttachedImages.push(url)
//         }
//         // this.dataSource._updateChangeSubscription()
//         // need refresh the table
//       }
//     })
//   }

//   public newImages(): void {
//     const dialogRef = this.dialog.open(NewTicketImageComponent, {
//       disableClose: true,
//       width: '1200px',
//       height: '80%',
//     })

//     let temArray: string[] = []
//     for (let url of this.rowObject.AttachedImages) {
//       temArray.push(url)
//     }

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result != undefined) {
//         for (let url of result) {
//           temArray.push(url)
//         }
//         this.rowObject.AttachedImages = temArray
//         // this.dataSource._updateChangeSubscription()
//       }
//     })
//   }

//   public getOutputDataForStock(element, stock): void {
//     console.log(element)
//     console.log(stock)
//     element["pickedStock"] = stock;
//   }

//   public getOutputDataForTransport(element, transport): void {
//     console.log(element)
//     console.log(transport)
//     element["pickedTransport"] = transport;
//   }

//   public getWarehouseQuantity(element, event): void {
//     console.log(element)
//     console.log(event)
//     element["pickedStockQuantity"] = event;
//     // row.stockQuantity = event;
//   }

//   public getTransportQuantity(element, event): void {
//     console.log(element)
//     console.log(event)
//     element["pickedTransportQuantity"] = event;
//     // row.transportQuantity = event;
//   }

//   public test(): void {
//     console.log(this.currentDataForTable);
//   }
// }
