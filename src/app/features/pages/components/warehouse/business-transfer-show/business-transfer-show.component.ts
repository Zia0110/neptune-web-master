import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { BusinessTransferGenerateComponent } from '../business-transfer-generate/business-transfer-generate.component'
import { FormControl } from '@angular/forms'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { BusinessTransferRow } from './businessTransferRow'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { ShowImagesComponent } from '../../../../../shared/common-components/show-images/show-images.component'
import { NewTicketImageComponent } from '../../order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { BusinessTransferChangeComponent } from './business-transfer-change/business-transfer-change.component'
import * as moment from 'moment'

@Component({
  selector: 'app-business-transfer-show',
  templateUrl: './business-transfer-show.component.html',
  styleUrls: ['./business-transfer-show.component.css'],
})
export class BusinessTransferShowComponent implements OnInit {
  public customersDropDown: any[] = []
  public customersDetails: any
  public pickedFromCustomerId: number = 0
  public pickedToCustomerId: number = 0
  public pickedStartDate = moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD')
  public pickedEndDate = moment(new Date()).format('YYYY-MM-DD')
  public transferAppFromBackEnd: any
  public transferForTable: BusinessTransferRow[] = []

  public dataSource: any
  public displayedColumns: string[] = ['创建时间', '修改时间', '转出客户', '转入客户', '附件', '仓库库转', '运输库转', '查看详情']
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  public showImgUrls: any[] = []

  constructor(public dialog: MatDialog, private inventoryService: InventoryEndpoint, private sweetAlert: SweetAlertService) {}

  ngOnInit(): void {
    this.getCustomers()
  }

  public searchTransfer(): void {
    if (this.pickedFromCustomerId == this.pickedToCustomerId && this.pickedFromCustomerId != 0) {
      this.sweetAlert.showSweetAlert('transfer-out and transfer-in customers are same, please select again！')
    } else {
      this.inventoryService.getTransferApplication(this.pickedStartDate, this.pickedEndDate).subscribe((value) => {
        console.log(value)
        this.transferAppFromBackEnd = value

        let validSearch: boolean = this.checkValidSearch()
        if (!validSearch) {
          this.sweetAlert.showSweetAlert('No data！')
        } else {
          this.setUpData()
          this.buildTable()
        }
      })
    }
  }

  private checkValidSearch(): boolean {
    if (this.transferAppFromBackEnd.length == 0) {
      return false
    } else if (this.transferAppFromBackEnd.length != 0 && this.pickedFromCustomerId == 0 && this.pickedToCustomerId == 0) {
      return true
    } else {
      return this.checkValidCustomersId()
    }
  }

  private checkValidCustomersId(): boolean {
    let temArray: any[] = []
    if (this.pickedFromCustomerId == 0 && this.pickedToCustomerId != 0) {
      temArray = this.transferAppFromBackEnd.filter((data) => {
        return data.ToCustomerId == this.pickedToCustomerId
      })
    } else if (this.pickedFromCustomerId != 0 && this.pickedToCustomerId == 0) {
      temArray = this.transferAppFromBackEnd.filter((data) => {
        return data.FromCustomerId == this.pickedFromCustomerId
      })
    } else {
      temArray = this.transferAppFromBackEnd.filter((data) => {
        return data.FromCustomerId == this.pickedFromCustomerId && data.ToCustomerId == this.pickedToCustomerId
      })
    }
    return !(temArray.length == 0)
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlert.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.inventoryService.deleteTransferApplication(data).subscribe((_) => {
      this.sweetAlert.successAlert('Delete Successfully!')
      this.searchTransfer()
    })
  }

  public setUpData(): void {
    this.resetTransferForTable()
    for (let transferApp of this.transferAppFromBackEnd) {
      let new_row = new BusinessTransferRow()
      new_row.ApplicationId = transferApp.ApplicationId
      new_row.CreatedAt = transferApp.CreatedAt
      new_row.UpdatedAt = transferApp.UpdatedAt
      new_row.FromCustomerId = transferApp.FromCustomerId
      new_row.FromCuctomerName = transferApp.FromCuctomerName
      new_row.FromCuctomerCode = transferApp.FromCuctomerCode
      new_row.ToCustomerId = transferApp.ToCustomerId
      new_row.ToCuctomerName = transferApp.ToCuctomerName
      new_row.ToCuctomerCode = transferApp.ToCuctomerCode
      for (let url of transferApp.AttachedImages) {
        new_row.AttachedImages.push(url)
      }

      for (let detail of transferApp.ApplicationDetails) {
        if (detail.TransportId == null) {
          let a_obj = {
            BaseProductId: detail.BaseProductId,
            ProductName: detail.ProductName,
            ProductCode: detail.ProductCode,
            Quantity: detail.Quantity,
            WarehouseId: detail.WarehouseId,
            WarehouseName: detail.WarehouseName,
          }
          new_row.WarehouseList.push(a_obj)
        } else {
          let a_obj = {
            BaseProductId: detail.BaseProductId,
            ProductName: detail.ProductName,
            ProductCode: detail.ProductCode,
            Quantity: detail.Quantity,
            WarehouseId: detail.WarehouseId,
            WarehouseName: detail.WarehouseName,
            TransportId: detail.TransportId,
            TransportNo: detail.TransportNo,
            TransportStatus: detail.TransportStatus,
            TransportStatusName: detail.TransportStatusName,
          }
          new_row.TransportList.push(a_obj)
        }
      }
      this.transferForTable.push(new_row)
    }
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  public buildTable(): void {
    //needs to filter the two customer Ids for table
    this.filterTable()
    this.dataSource = new MatTableDataSource(this.transferForTable)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  private filterTable(): void {
    if (this.pickedFromCustomerId == 0 && this.pickedToCustomerId != 0) {
      this.transferForTable = this.transferForTable.filter((data) => {
        return data.ToCustomerId == this.pickedToCustomerId
      })
    } else if (this.pickedFromCustomerId != 0 && this.pickedToCustomerId == 0) {
      this.transferForTable = this.transferForTable.filter((data) => {
        return data.FromCustomerId == this.pickedFromCustomerId
      })
    } else if (this.pickedFromCustomerId != 0 && this.pickedToCustomerId != 0) {
      this.transferForTable = this.transferForTable.filter((data) => {
        return data.FromCustomerId == this.pickedFromCustomerId && data.ToCustomerId == this.pickedToCustomerId
      })
    }
  }

  public newTransfer(): void {
    const dialogRef = this.dialog.open(BusinessTransferGenerateComponent, {
      width: '95%',
      height: '90%',
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.searchTransfer()
    })
  }

  public getFromCustomer(fromCustomerId): void {
    this.pickedFromCustomerId = fromCustomerId
  }

  public getStartDate(startDate): void {
    this.pickedStartDate = startDate
  }

  public getEndDate(endDate): void {
    this.pickedEndDate = endDate
  }

  public getToCustomer(toCustomerId): void {
    this.pickedToCustomerId = toCustomerId
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

  private resetTransferForTable(): void {
    this.transferForTable.length = 0
  }

  public showImages(row: BusinessTransferRow): void {
    // const dataToShowImgs = this.showImgUrls.filter((item) => row.AttachedImages.includes(item.FileNameForStorage))
    const dialogRef = this.dialog.open(ShowImagesComponent, {
      width: '1200px',
      height: '80%',
      data: {
        urlsArray: row.AttachedImages,
        deleteAllowed: false,
      },
    })
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  public addImages(row: BusinessTransferRow, urlArray): void {
    const dialogRef = this.dialog.open(NewTicketImageComponent, {
      disableClose: true, // disable clicking to close the dialog coz it would not upload the pic
      width: '1200px',
      height: '80%',
    })
    // needs to add the url one by one to a tem array
    // then assign the tem array to control

    let temArray: string[] = []
    for (let url of urlArray) {
      temArray.push(url)
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        for (let url of result) {
          temArray.push(url.FileNameForStorage)
          this.showImgUrls.push(url)
        }
        row.AttachedImages = temArray
        this.dataSource._updateChangeSubscription()
      }
    })
  }

  public checkDetail(row: BusinessTransferRow): void {
    const dialogRef = this.dialog.open(BusinessTransferChangeComponent, {
      width: '1400px',
      height: '80%',
      data: row,
    })

    dialogRef.afterClosed().subscribe((result) => {
      this.searchTransfer()
    })
  }

  test() {
    // console.log(this.pickedFromCustomerId)
    // console.log(this.pickedToCustomerId)
    // console.log(this.pickedStartDate)
    // console.log(this.pickedEndDate)
    console.log(this.transferForTable)
  }
}
